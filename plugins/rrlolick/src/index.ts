import { readFileSync } from 'fs'
import { Context, Schema, h, sleep } from 'koishi'
import path from 'path'

export const name = 'rrlolick'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  ctx.i18n.define('zh', require('./locales/zh'))
  ctx.i18n.define('en', require('./locales/en'))
  ctx.command('rrlolick')
    .action(async ({session}) => {
      await sleep(3000)
      await session.send(session.text('.loading'))
      await sleep(6000)
      await session.send(session.text('.sit-and-relax'))
      await sleep(9000)
      const img = readFileSync(path.resolve(__dirname, './rrlolick.gif'))
      return h.image(img, 'image/gif')
    })
}
