import { $, Bot, Context } from 'koishi'
import {} from '@koishijs/plugin-help'

export const name = 'waiting-for-venti'
const tableName = 'venti_waiting_list'

declare module 'koishi' {
  interface Tables {
    venti_waiting_list: VentiWaitingList
  }

  interface User {
    onebot: string
  }
}

export interface VentiWaitingList {
  onebot: string
  guildId: string
  joinedAt: Date
  quittedAt: Date
}

export const using = ['database'] as const

export function apply (ctx: Context) {
  ctx.model.extend(
    tableName,
    {
      onebot: 'string',
      guildId: 'string',
      joinedAt: 'timestamp',
      quittedAt: {
        type: 'timestamp',
        nullable: false,
        initial: new Date(0)
      }
    },
    {
      primary: ['onebot', 'guildId']
      // foreign: {
      //   id: ['user', 'id'],
      //   guildId: ['channel', 'id'],
      // },
    }
  )

  // const commands = ['望夫石', '望夫石？', '加入望夫石', '望夫石毕业', '望夫石都有谁']

  /**
   * 望夫石
   *   指令概览
   */
  ctx.command('望夫石').action(async (_) => {
    if (_.session?.channel == null || _.session.channelId == null) {
      return '请在群组内使用该功能'
    }

    const count = await countWaiting(ctx, _.session.channelId)

    await _.session?.send(
      '且听风吟，静待花开！欢迎来到望夫石林~\n' +
        `当前共有${count}座望夫石在此等候他们的风神降临，愿风神护佑你们！\n` +
        '发送 「#望夫石？」 获取帮助信息'
    )
  })

  /**
   * 望夫石.帮助
   * alias: 望夫石？
   */
  ctx
    .command('望夫石')
    .subcommand('.帮助')
    .alias('望夫石？')
    .action(
      (_) =>
        '你好旅行者，愿风神忽悠你！望夫石接待处的口令如下：\n' +
        '「#望夫石」：获取欢迎信息\n' +
        '「#望夫石？」：获取帮助信息（即本条信息）\n' +
        '「#加入望夫石」：成为望夫石的一员，一起等候迎娶巴巴托斯！\n' +
        '「#望夫石毕业」：已经喜提温迪？恭喜毕业！\n' +
        '「#望夫石都有谁」：获取本群当前望夫石林的详细名单'
    )

  /**
   * 望夫石.加入
   * alias: 加入望夫石
   */
  ctx
    .command('望夫石')
    .subcommand('.加入')
    .alias('加入望夫石')
    .action(async (_) => {
      if ((_.session?.channel) == null) return '请在群组内使用该功能'

      const user = await _.session.observeUser(['id', 'onebot'])
      const channel = await _.session.observeChannel(['id', 'guildId'])
      await addToList(ctx, user.onebot, channel.guildId)
      const count = await countWaiting(ctx, channel.guildId)
      return `${_.session.username ?? '你好'}，欢迎加入望夫石林，成为${count}座望夫石中的一员！`
    })

  /**
   * 望夫石.退出
   * alias: 望夫石毕业
   */
  ctx
    .command('望夫石')
    .subcommand('.退出')
    .alias('望夫石毕业')
    .action(async (_) => {
      if ((_.session?.channel) == null) return '请在群组内使用该功能'

      const user = await _.session.observeUser(['id', 'onebot'])
      const channel = await _.session.observeChannel(['id', 'guildId'])
      await setQuitted(ctx, user.onebot, channel.guildId)
      return '毕业快乐，愿风神护佑您！'
    })

  /**
   * 望夫石.名单
   * alias: 望夫石都有谁
   */
  ctx
    .command('望夫石')
    .subcommand('.名单')
    .option('detail', '-d 显示带Q号的名单')
    .alias('望夫石都有谁')
    .action(async (_) => {
      if ((_.session?.channel) == null) return '请在群组内使用该功能'

      const channel = await _.session.observeChannel(['id', 'guildId'])
      const list = await getList(ctx, channel.guildId)
      const members = await _.session.bot.getGuildMemberMap(channel.guildId)

      if (list.length === 0) return '欸嘿，本群的望夫石林居然空无一石！'

      let msg = '以下是群内望夫石：'
      list.forEach((u) => {
        msg +=
          `\n${members[u.onebot] ?? '*已退群'}` +
          (((_.options?.detail) ?? false) ? ` (${u.onebot})` : '')
      })
      return msg
    })

  ctx
    .command('望夫石')
    .subcommand('.清理退群', { authority: 3, hidden: true })
    .action(async (_) => {
      if (_.session?.channel == null || _.session.channelId == null) return '请在群组内使用该功能'

      const removedCount = await removeNotInGroupMembers(
        ctx,
        _.session.bot,
        _.session.channelId
      )
      return `清理成功！已移除不在群内人员${removedCount}人`
    })
}

async function addToList (ctx: Context, onebot: string, guildId: string) {
  return await ctx.database.upsert(tableName, [
    {
      onebot,
      guildId,
      joinedAt: new Date()
      // quittedAt: null,
    }
  ])
}

async function setQuitted (ctx: Context, onebot: string, guildId: string) {
  const user = await ctx.database.get(tableName, {
    $and: [{ onebot }, { guildId }]
  })
  if (
    user.length !== 0 &&
      (user[0].quittedAt.getTime() === 0 ||
        user[0].joinedAt.getTime() > user[0].quittedAt.getTime())
  ) {
    await ctx.database.set(
      tableName,
      { $and: [{ onebot }, { guildId }] },
      { quittedAt: new Date() }
    )
  }
  return true
}

async function getList (ctx: Context, guildId: string) {
  return await ctx.database
    .select(
      tableName,
      (row) =>
        $.and(
          $.or(
            $.eq(row.quittedAt, new Date(0)),
            $.gt(row.joinedAt, row.quittedAt)
          ),
          $.eq(row.guildId, guildId)
        )
    )
    .execute()
}

async function countWaiting (ctx: Context, guildId: string) {
  return await ctx.database
    .select(
      tableName,
      (row) =>
        $.and(
          $.or(
            $.eq(row.quittedAt, new Date(0)),
            $.gt(row.joinedAt, row.quittedAt)
          ),
          $.eq(row.guildId, guildId)
        )
    )
    .execute((row) => $.count(row.onebot))
}

/**
   * 移除已退群人员的记录
   * @param ctx koishi Context
   * @param bot koishi Bot
   * @param guildId 群号
   * @returns 本次清理的人数
   */
async function removeNotInGroupMembers (
  ctx: Context,
  bot: Bot,
  guildId: string
): Promise<number> {
  const list = await getList(ctx, guildId)
  if (list.length === 0) return 0

  const groupMembers = await bot.getGuildMemberMap(guildId)
  const cleanTarget: string[] = []
  list.forEach((u) => {
    if (groupMembers[u.onebot].length === 0) {
      cleanTarget.push(u.onebot)
    }
  })
  await ctx.database.remove(tableName, {
    $and: [
      { guildId },
      {
        onebot: {
          $in: cleanTarget
        }
      }
    ]
  })
  return cleanTarget.length
}
