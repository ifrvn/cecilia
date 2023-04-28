import { Context, Logger, h, Session, Schema } from 'koishi'
import {} from '@koishijs/assets'
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

declare module '@koishijs/plugin-console' {
  interface Events {
    'get-data': (page: number) => Promise<{
      page: number
      totalLines: number
      totalPages: number
      data: DriftBottle[]
    }>
    'search': (s: string, page: number) => Promise<{
      page: number
      totalLines: number
      totalPages: number
      data: DriftBottle[]
    }>
    'switch-ban': (id: number, ban: boolean) => Promise<boolean>
  }
}

export interface DriftBottle {
  id: number
  userId: string
  guildId: string
  content: string
  isPublic: number
  createdAt: Date
  bannedAt: Date | null
}

export interface Config {}

export default class DriftBottlePlugin {
  static using = ['database', 'console', 'logger'] as const
  static Config = Schema.object({})

  private readonly tableName = 'drift_bottle'
  private readonly logger: Logger
  private readonly NUMBER_PER_PAGE = 10

  private readonly service: BottleService

  constructor (
    private readonly ctx: Context,
    private readonly config: Config
  ) {
    ctx.i18n.define('zh', require('./locales/zh'))
    this.logger = ctx.logger('DriftBottlePlugin')
    this.service = new BottleService(ctx)

    ctx.model.extend(
      this.tableName,
      {
        id: 'unsigned',
        userId: 'string',
        guildId: 'string',
        content: 'string',
        isPublic: {
          type: 'unsigned',
          nullable: false,
          initial: 1
        },
        createdAt: {
          type: 'timestamp',
          nullable: false
        },
        bannedAt: {
          type: 'timestamp',
          nullable: true,
          initial: null
        }
      },
      {
        autoInc: true,
        unique: [['content', 'guildId', 'isPublic']]
      }
    )

    this.ctx.command('driftbottle')
      .alias('db', '漂流瓶')

    this.ctx.command('db.fish')
      .alias('捞瓶子')
      .action(async ({session}) => {
        if (session)
          return this.fishBottle(session)
      })

    this.ctx.command('db.send <message:text>')
      .alias('丢个瓶子', '丢瓶子', '扔个瓶子', '扔瓶子')
      .option('private', '-p')
      .action(async ({session, options}, message) => {
        if (session) {
          if (session.guildId == null) return session.text('.not-in-guild')
          return this.addBottle(session, message, !options?.private)
        }
      })

    this.ctx.command('db.blame <message:text>')
      .alias('谁扔的', '谁发的', '谁丢的')
      .action(async ({session}, message) => {
        if (session?.quote?.content){
          if (session.guildId == null) return session.text('.not-in-guild')
          return this.blame(session, message)
        }
      })

    this.ctx.command('db.block <message:text>')
      .alias('炸瓶子')
      .action(async ({session}, message) => {
        if (session?.quote?.content){
          if (session.guildId == null) return session.text('.not-in-guild')
          return this.removeBottle(session, message)
        }
      })

    ctx.console.addListener('get-data', async (page) => {
      const [totalLines, data] = await Promise.all([
        this.service.count(),
        this.service.getAll({
          offset: (page - 1) * this.NUMBER_PER_PAGE,
          limit: this.NUMBER_PER_PAGE
        })
      ])
      return {
        page,
        totalLines,
        totalPages: Math.ceil(totalLines / this.NUMBER_PER_PAGE),
        data
      }
    })

    ctx.console.addListener('search', async (s, page) => {
      return await this.service.search(s, {
        offset: (page - 1) * this.NUMBER_PER_PAGE,
        limit: this.NUMBER_PER_PAGE
      })
    })

    ctx.console.addListener('switch-ban', async (id, ban) => {
      try {
        await this.switchBan(id, ban)
        this.logger.info(`id: ${id}, ban: ${ban.toString()}`)
        return true
      } catch (error) {
        this.logger.warn(error)
        return false
      }
    })

    ctx.console.addEntry({
      dev: resolve(__dirname, '../client/index.ts'),
      prod: resolve(__dirname, '../dist')
    })
  }

  private async messageTypeGuard (session: Session, message: string) {
    this.logger.info(message)
    h.parse(message).forEach((msg) => {
      if (msg.type !== 'text' && msg.type !== 'image') {
        void session.send(
          h.quote(session.messageId).toString() +
            session.text('.illegal-content')
        )
        throw new Error(session.text('.msg-type-not-allowed', [msg.type]))
      }
    })
  }

  async addBottle (session: Session, message: string, isPublic = true) {
    await this.messageTypeGuard(session, message)

    await this.save(message, session.userId!, session.guildId!, isPublic)
    await session.send(
      h.quote(session.messageId).toString() +
        (isPublic ? session.text('.success') : session.text('.success-private'))
    )
  }

  async fishBottle (session: Session) {
    const bottle = await this.service.getOneRandomly(session.guildId!)
    if (bottle == null) return session.text('.no-bottle')
    await session.send(bottle.content)
  }

  async removeBottle (session: Session, content: string) {
    // TODO: 支持其他平台
    if (session.onebot) {
      const member = await session.onebot?.getGroupMemberInfo(
      session.guildId!,
      session.userId!
      )
      if (member?.role !== 'admin') return session.text('.access-denied')
    }

    const bottle = await this.service.find(content)
    if (bottle.length === 0) return session.text('.bottle-not-found')

    await this.switchBan(bottle[0].id)
    await session.send(
      h.quote(session.messageId).toString() + session.text('.success')
    )
  }

  async blame (session: Session, content: string) {
    // TODO: 支持其他平台
    if (session.onebot) {
      const member = await session.onebot?.getGroupMemberInfo(
        session.guildId!,
        session.userId!
      )
      if (member?.role !== 'admin') return session.text('.access-denied')
    }

    const bottle = await this.service.find(content)
    if (bottle.length === 0) return session.text('.bottle-not-found')

    if (bottle[0].guildId === session.guildId) {
      await session.send(
        h.quote(session.messageId).toString() +
          session.text('.result', [h.at(bottle[0].userId)])
      )
    } else {
      await session.send(session.text('.other-guild'))
    }
  }

  private async save (
    content: string,
    userId: string,
    guildId: string,
    isPublic = true
  ) {
    let transContent: string | null = null
    if (this.ctx.assets) {
      try {
        transContent = await this.ctx.assets.transform(content)
      } catch(error) {
        this.logger.warn(error)
      }
    }

    return await this.service.create({
      content: transContent ?? content,
      userId,
      guildId,
      isPublic: isPublic ? 1 : 0,
      createdAt: new Date()
    })
  }

  private async switchBan (id: number, ban = true) {
    return await this.service.update(id, {
      bannedAt: ban ? new Date() : null
    })
  }
}
