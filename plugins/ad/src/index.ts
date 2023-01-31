import { $, Context, Logger, Schema, Session, Time } from 'koishi'

declare module 'koishi' {
  interface Tables {
    ad: Ad
  }
}

export interface Ad {
  id: number
  fromTime: Date
  toTime: Date
  content: string
  prob: number  // 广告出现概率
  count: number  // 广告曝光次数
}

export interface Config {
  frequency: number
  enabledPeriod: Array<{from: string, to: string}>
}

export default class AdPlugin {
  static using = ['database', 'logger'] as const
  private readonly logger: Logger
  static Config = Schema.object({
    frequence: Schema.number().default(0.5)
      .description('广告的投放频率，范围为0~1。默认为0.5，即约有一半的消息会出现广告。'),
    enabledPeriod: Schema.array(Schema.object({
      from: Schema.string().role('time'),
      to: Schema.string().role('time')
    })).default([{from: '00:00:00', to: '23:59:59'}])
      .description('广告投放的时间段（不包括日期，日期会被忽略掉只取时间，所以日期可以随便填）。')
  })

  constructor(private readonly ctx: Context, private readonly config: Config) {
    this.logger = ctx.logger('AdPlugin')

    ctx.model.extend('ad', {
      id: 'unsigned',
      fromTime: 'timestamp',
      toTime: 'timestamp',
      content: 'text',
      count: { type: 'unsigned', initial: 0 }
    },{
      autoInc: true,
    })

    ctx.on('before-send', this.rollAd)

    ctx.command('ad')
      .subcommand('.list', '获取现有广告列表', { authority: 3 })
      .option('detail', '-d')
      .action(async ({options}) => {
        const list = await this.select(new Date())
        const res: string[] = []
        list.forEach(ad => {
          if ((options?.detail) ?? false) {
            res.push(`(${ad.id}): ${ad.content}\n`+
                    `${ad.fromTime.getHours()}:${ad.fromTime.getMinutes()}:${ad.fromTime.getSeconds()}-`+
                    `${ad.toTime.getHours()}:${ad.toTime.getMinutes()}:${ad.toTime.getSeconds()}\n`+
                    `权重：${ad.prob} 已曝光次数：${ad.count}`)
          } else {
            res.push(`(${ad.id}): ${ad.content}`)
          }
        })
        return res.join('\n-----------------\n')
      })

    ctx.command('ad')
      .subcommand('.new <content:text> [from] [to]', '添加一个新广告', { authority: 3 })
      .action(async (_, content, from, to) => {
        await this.create(content, new Date(`1970-01-01T${from ?? '00:00:00'}`), new Date(`1970-01-01T${to ?? '23:59:59'}`))
        return '添加成功'
      })

    ctx.command('ad')
      .subcommand('.remove <id:number>', '删除现有广告', { authority: 3 })
      .action(async (_, id) => {
        try{
          await this.remove(id)
          return '删除成功'
        } catch (err) {
          this.logger.info(err)
          return '删除失败'
        }
      })
  }

  async rollAd(session: Session) {
    const now = new Date()
    const ts = now.getTime()
    const checkTime = this.config.enabledPeriod.some(({from, to}) => {
      const fromTime = Time.parseTime(from)
      const toTime = Time.parseTime(to)
      if (fromTime < toTime)
        return fromTime <= ts && toTime >= ts
      else // 跨天
        return fromTime <= ts || toTime >= ts
    })
    const random = Math.random()
    if (!checkTime || random > this.config.frequency) return

    const ads = await this.select(now)
    for (let i = 1; i < ads.length; i++) {
      ads[i].prob += ads[i-1].prob
    }
    const roll = Math.random() * ads[ads.length - 1].prob
    const ad = this.search(roll, ads)
    if (ad != null) {
      this.attachAdToMessage(session, ad.content)
      await this.ctx.database.set('ad', ad.id, { count: ad.count + 1})
    }
  }

  search(roll: number, list: Ad[]): Ad | undefined {
    let left = 0
    let right = list.length - 1
    while (left <= right) {
      const middle = left + Math.floor((right - left) / 2)
      if (list[middle].prob < roll && list[middle+1].prob < roll) {
        left = middle + 1
      } else if(list[middle].prob > roll && list[middle+1].prob > roll) {
        right = middle - 1
      } else {
        return list[middle + 1]
      }
    }
    if (left === 0)
      return list[0]
  }

  attachAdToMessage (session: Session, content: string)
  {
    session.content += `\n====================\n${content}`
  }

  async select(now: Date) {
    const time = new Date(now.getTime())
    return await this.ctx.database.select('ad', ({fromTime, toTime}) => {
      if (fromTime < toTime)
        return $.and($.lte(fromTime, time), $.gte(toTime, time))
      else
        return $.or($.lte(fromTime, time), $.gte(toTime, time))
    }).execute()
  }

  async create(content: string, from: Date, to: Date) {
    return await this.ctx.database.create('ad', {
      content,
      fromTime: from,
      toTime: to
    })
  }

  async remove(id: number) {
    return await this.ctx.database.remove('ad', id)
  }

}
