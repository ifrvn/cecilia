import { Context } from '@koishijs/client'
import {} from '@ifrank/koishi-plugin-drift-bottle/src'
import Page from './drift-bottle.vue'

export default (ctx: Context) => {
  ctx.page({
    name: '漂流瓶',
    path: '/drift-bottle',
    component: Page
  })
}
