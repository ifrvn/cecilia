import { Context, Logger, Schema, Session, $, Random, Dict } from 'koishi'

// declare module 'koishi' {
//   interface Tables {
//     test: TestTable
//   }
// }

// export interface TestTable {
//   id: number
//   test1: string[]
// }

export interface Config {}

export default class TestPlugin {
  static using = ['database', 'logger'] as const
  private readonly logger: Logger
  static Config = Schema.object({})

  constructor(private readonly ctx: Context, private readonly config: Config) {
    this.logger = ctx.logger('TestPlugin')
    ctx.i18n.define('zh', require('./locales/zh'))
    ctx.i18n.define('en', require('./locales/en'))

    // ctx.model.extend('test', {
    //   id: 'unsigned',
    //   test1: { type: 'list', initial: ['5', '1', '4'] }
    // }, { autoInc: true })

    ctx.command('test')
      .action(async ({session}) => {
        ctx.database.select('user').orderBy(() => $.random())
        return <>
          Done
        </>
      })
  }
}
