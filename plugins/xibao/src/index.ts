import { readFileSync } from 'fs'
import path from 'path'
import { Context, Schema } from 'koishi'
import {} from 'koishi-plugin-puppeteer'

export const name = 'xibao'
export const using = ['puppeteer'] as const

interface StyleConfig {
  maxFontSize: number
  minFontSize: number
  offsetWidth: number
}
export interface Config {
  xibao: StyleConfig
  beibao: StyleConfig
}

export const Config: Schema<Config> = Schema.object({
  xibao: Schema.object({
    maxFontSize: Schema.number().min(1).default(100).description('最大字体大小（px）'),
    minFontSize: Schema.number().min(1).default(38).description('最小字体大小（px）'),
    offsetWidth: Schema.number().min(1).default(900)
      .description('单行最大宽度（px），任意一行文本达到此宽度后会缩小字体以尽可能不超出此宽度，直到字体大小等于`minFontSize`'),
  }).description('喜报配置'),
  beibao: Schema.object({
    maxFontSize: Schema.number().min(1).default(100).description('最大字体大小（px）'),
    minFontSize: Schema.number().min(1).default(38).description('最小字体大小（px）'),
    offsetWidth: Schema.number().min(1).default(900)
      .description('单行最大宽度（px），任意一行文本达到此宽度后会缩小字体以尽可能不超出此宽度，直到字体大小等于`minFontSize`'),
  }).description('悲报配置'),
})

export function apply(ctx: Context, config: Config) {
  ctx.command('喜报 <text:text>')
    .action(async (_, text) => {
      const img = readFileSync(path.resolve(__dirname, './xibao.jpg'))
      return await ctx.puppeteer.render(
        html(
          text,
          '#ff0a0a',
          '#ffde00',
          config.xibao.maxFontSize,
          config.xibao.minFontSize,
          config.xibao.offsetWidth,
          img
        )
      )
    })

  ctx.command('悲报 <text:text>')
    .action(async (_, text) => {
      const img = readFileSync(path.resolve(__dirname, './beibao.jpg'))
      return await ctx.puppeteer.render(
        html(
          text,
          '#000500',
          '#daecdc',
          config.beibao.maxFontSize,
          config.beibao.minFontSize,
          config.beibao.offsetWidth,
          img
        )
      )
    })
}

function html(
  text: string,
  fontColor: string,
  strokeColor: string,
  maxFontSize: number,
  minFontSize: number,
  offsetWidth: number,
  img: Buffer
) {
  return `<html>
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
        color: ${fontColor};
        -webkit-text-stroke: 2.5px ${strokeColor};
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
    let fontSize = ${maxFontSize}
    dom.style.fontSize = fontSize + 'px'
    divs.forEach(div => {
      while (div.offsetWidth >= ${offsetWidth} && fontSize > ${minFontSize}) {
        dom.style.fontSize = --fontSize + 'px'
      }
    })
  </script>
</html>`
}
