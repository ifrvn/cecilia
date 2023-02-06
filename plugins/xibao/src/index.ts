import { readFileSync } from 'fs'
import path from 'path'
import { Context, Schema } from 'koishi'
import {} from 'koishi-plugin-puppeteer'

export const name = 'xibao'
export const using = ['puppeteer'] as const

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context, config: Config) {
  const img = readFileSync(path.resolve(__dirname, './background_1024x768.jpg'))
  ctx.command('喜报 <text:text>')
    .action(async (_, text) => {
      const html =
      `<html>
        <head>
          <style>
            body {
              width: 960px;
              height: 768px;
              padding: 0 32;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              text-align: center;
              margin: 0;
              font-weight: 900;
              color: #ff0a0a;
              -webkit-text-stroke: 2.5px #ffde00;
              background-image: url(data:image/png;base64,${img.toString('base64')});
              background-repeat: no-repeat;
            }
          </style>
        </head>
        <body>
          <div>${text.replaceAll('\n', '</div><div>')}</div>
        </body>
        <script>
          const dom = document.querySelector('body')
          const divs = dom.querySelectorAll('div')
          let fontSize = 80
          dom.style.fontSize = fontSize + 'px'
          divs.forEach(div => {
            while (div.offsetWidth >= 900 && fontSize > 38) {
              dom.style.fontSize = --fontSize + 'px'
            }
          })
        </script>
      </html>`
      return await ctx.puppeteer.render(html)
    })
}
