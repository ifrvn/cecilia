import { Context } from '@koishijs/client'
import Page from './drift-bottle.vue'

export default (ctx: Context) => {
  ctx.page({
    name: '丢瓶子',
    path: '/drift-bottle',
    component: Page
  })
}
