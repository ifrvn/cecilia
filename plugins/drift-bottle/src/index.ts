import { Context, Logger, Universal, Next, segment, Session, Schema } from 'koishi'
import {} from '@koishijs/plugin-console'
import { OneBot } from '@satorijs/adapter-onebot'
import { resolve } from 'path'
import BottleService from './service'

declare module 'koishi' {
  interface Session {
    onebot?: OneBot.Payload & OneBot.Internal
  }
  interface Tables {
    drift_bottle: DriftBottle
  }
}

export interface DriftBottle {
  id: number
  userId: string
  guildId: string
  content: string
  isPublic: number
  createdAt: Date
  bannedAt: Date
}

export interface Config {
  throwBottleKey?: string
  fishBottleKey?: string
  prefix?: string
}

export default class DriftBottlePlugin {
  readonly name = 'drift-bottle'
  readonly using = ['database'] as const
  static Config = Schema.object({
    throwBottleKey: Schema.string().default('丢个瓶子'),
    fishBottleKey: Schema.string().default('捞瓶子'),
    prefix: Schema.string().default('#')
  })

  private readonly tableName = 'drift_bottle'
  private readonly logger: Logger
  private readonly regs = () => {
    return {
      fishBottleReg: new RegExp(
        `^((?:${this.config.prefix ?? ''})${this.config.fishBottleKey ?? '捞瓶子'})\\s*$`
      ),
      throwBottleReg: new RegExp(
        `^\\s*(?:${this.config.prefix ?? ''})${this.config.throwBottleKey ?? '丢个瓶子'}(（|\\()?\\s*((?:.|\\n)*)$`
      )
    }
  }

  private readonly templates = {
    ok: '好啦',
    privateOk: '好啦，群内瓶+1',
    noBottle: '还没有瓶子可捞哦',
    notInGroup: '请在群组内使用该功能',
    messageNotFound:
      '瓶子似乎被可莉炸飞了...请把瓶子内容重新发一遍再尝试扔瓶子吧',
    bottleNotFound: '奇怪，没有找到这个瓶子',
    allowEitherTextOrImage: '只能往瓶子里丢文字和图片，且不能有@好友哦',
    duplicateContent: '已经有一样的瓶子了~',
    removeBottle: '瓶子封印成功！',
    accessDenied: '你有事吗？有事请找我妈~'
  }

  private readonly service: BottleService

  constructor (
    private readonly ctx: Context,
    private readonly config: Config
  ) {
    this.logger = ctx.logger(this.name)
    this.service = new BottleService(ctx)

    this.config = new DriftBottlePlugin.Config(config)

    ctx.model.extend(
      this.tableName,
      {
        id: 'unsigned',
        userId: 'string',
        guildId: 'string',
        content: 'string',
        isPublic: {
          type: 'unsigned',
          initial: 1
        },
        createdAt: {
          type: 'timestamp'
        },
        bannedAt: {
          type: 'timestamp',
          initial: new Date(0)
        }
      },
      {
        autoInc: true,
        unique: [['content', 'guildId', 'isPublic']]
      }
    )

    ctx.using(['console'], (ctx) => {
      ctx.console.addEntry({
        dev: resolve(__dirname, '../client/index.ts'),
        prod: resolve(__dirname, '../dist')
      })
    })

    ctx.middleware(this.callback.bind(this))
  }

  async callback (session: Session, next: Next) {
    if (session.guildId == null) return this.templates.notInGroup

    const message = session.content
    const parsedMsg = segment.parse(message)
    const { fishBottleReg, throwBottleReg } = this.regs()

    try {
      if (fishBottleReg.test(message)) {
        // 捞瓶子
        return await this.fishBottle(session)
      } else if (parsedMsg[0].type === 'text' && throwBottleReg.test(message)) {
        // 扔瓶子
        return await this.addSimpleBottle(session, message)
      } else if ((session.quote != null) && parsedMsg.length > 1) {
        // 处理引用消息
        const content = parsedMsg[parsedMsg.length - 1].attrs.content
        if (content != null) {
          if (throwBottleReg.test(content)) {
          // 扔瓶子（引用）
            return await this.addQuoteBottle(session, message, session.quote)
          } else if (/^\s*(丢掉|删除|回收|删掉)\s*$/.test(content)) {
          // 删除瓶子
            return await this.removeBottle(session, session.quote.content!)
          } else if (/^\s*(谁丢的|谁扔的|谁的瓶子)\s*$/.test(content)) {
          // 查询谁丢的瓶子
            return await this.blame(session, session.quote.content!)
          }
        }
      }
    } catch (error) {
      // "UNIQUE constraint failed: drift_bottle.content, drift_bottle.guildId, drift_bottle.isPublic"
      if (error instanceof Error && error.message.startsWith('UNIQUE constraint failed')) {
        await session.send(
          segment('quote', { id: session.messageId! }).toString() +
            this.templates.duplicateContent
        )
        this.logger.warn(error)
      } else {
        this.logger.error(error)
      }
    }
    return await next()
  }

  private async getMessage (session: Session, messageId: string) {
    try {
      const msg = await session.bot.getMessage(session.guildId!, messageId)
      return msg
    } catch (error) {
      await session.send(
        segment('quote', { id: session.messageId! }).toString() +
          this.templates.messageNotFound
      )
      throw error
    }
  }

  private async messageTypeGuard (session: Session, message: string) {
    segment.parse(message).forEach((msg) => {
      if (msg.type !== 'text' && msg.type !== 'image') {
        void session.send(
          segment('quote', { id: session.messageId! }).toString() +
            this.templates.allowEitherTextOrImage
        )
        throw new Error(`Message type ${msg.type} is not allowed!`)
      }
    })
  }

  async addSimpleBottle (session: Session, message: string) {
    const { throwBottleReg } = this.regs()

    const regexpSearchRes = throwBottleReg.exec(message)
    const isPublic = regexpSearchRes![1] == null
    const content = regexpSearchRes![2]

    if (content.length === 0) return

    await this.messageTypeGuard(session, content)

    await this.save(content, session.userId!, session.guildId!, isPublic)
    await session.send(
      segment('quote', { id: session.messageId! }).toString() +
        (isPublic ? this.templates.ok : this.templates.privateOk)
    )
  }

  async addQuoteBottle (session: Session, message: string, quote: Universal.Message) {
    const parsedMsg = segment.parse(message)
    const { throwBottleReg } = this.regs()

    const regexpSearchRes = throwBottleReg.exec(parsedMsg[parsedMsg.length - 1].attrs.content!)
    const isPublic = regexpSearchRes![1] == null

    await this.messageTypeGuard(session, quote.content!)

    await this.save(
      quote.content!,
      session.userId!,
      session.guildId!,
      isPublic
    )
    await session.send(
      segment('quote', { id: session.messageId! }).toString() +
        (isPublic ? this.templates.ok : this.templates.privateOk)
    )
  }

  async fishBottle (session: Session) {
    const bottle = await this.service.getOneRandomly(session.guildId!)
    if (bottle == null) return this.templates.noBottle
    await session.send(bottle.content)
  }

  async removeBottle (session: Session, content: string) {
    const member = await session.onebot?.getGroupMemberInfo(
      session.guildId!,
      session.userId!
    )
    if (member?.role !== 'admin') return this.templates.accessDenied

    const bottle = await this.service.find(content)
    if (bottle.length === 0) return this.templates.bottleNotFound

    await this.ban(bottle[0].id)
    await session.send(
      segment('quote', { id: session.messageId! }).toString() + this.templates.removeBottle
    )
  }

  async blame (session: Session, content: string) {
    const member = await session.onebot?.getGroupMemberInfo(
      session.guildId!,
      session.userId!
    )
    if (member?.role !== 'admin') return this.templates.accessDenied

    const bottle = await this.service.find(content)
    if (bottle.length === 0) return this.templates.bottleNotFound

    if (bottle[0].guildId === session.guildId) {
      await session.send(
        segment('quote', { id: session.messageId! }).toString() +
          '我知道，是' +
          segment('at', { id: bottle[0].userId }).toString() +
          '丢的！'
      )
    } else {
      await session.send('是其他群丢的哦')
    }
  }

  private async save (
    content: string,
    userId: string,
    guildId: string,
    isPublic = true
  ) {
    return await this.service.create({
      content,
      userId,
      guildId,
      isPublic: isPublic ? 1 : 0,
      createdAt: new Date()
    })
  }

  private async ban (id: number) {
    return await this.service.update(id, {
      bannedAt: new Date()
    })
  }
}
