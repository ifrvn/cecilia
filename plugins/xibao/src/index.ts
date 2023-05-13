import { readFileSync } from 'fs'
import path from 'path'
import { Context, Schema } from 'koishi'
import {} from 'koishi-plugin-puppeteer'

export const name = 'xibao'
export const using = ['puppeteer'] as const

interface StyleConfig {
  fontFamily: string
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
    fontFamily: Schema.string().default('"Source Han Sans CN", "Helvetica Neue", Helvetica, Arial, sans-serif')
      .description(`字体（参照 CSS 中的 [font-family](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-family) ）<br>
      默认使用[思源黑体](https://github.com/adobe-fonts/source-han-sans/blob/master/README-CN.md)，
      若系统中未安装该字体请[👉点击下载](https://www.aliyundrive.com/s/3vquFYbv2XW)，或自行设置其他字体`),
    maxFontSize: Schema.number().min(1).default(80).description('最大字体大小（px）'),
    minFontSize: Schema.number().min(1).default(38).description('最小字体大小（px）'),
    offsetWidth: Schema.number().min(1).default(900)
      .description('单行最大宽度（px），任意一行文本达到此宽度后会缩小字体以尽可能不超出此宽度，直到字体大小等于`minFontSize`'),
  }).description('喜报配置'),
  beibao: Schema.object({
    fontFamily: Schema.string().default('"Source Han Sans CN", "Helvetica Neue", Helvetica, Arial, sans-serif')
      .description(`字体（参照 CSS 中的 [font-family](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-family) ）<br>
      默认使用[思源黑体](https://github.com/adobe-fonts/source-han-sans/blob/master/README-CN.md)，
      若系统中未安装该字体请[👉点击下载](https://www.aliyundrive.com/s/3vquFYbv2XW)，或自行设置其他字体`),
    maxFontSize: Schema.number().min(1).default(90).description('最大字体大小（px）'),
    minFontSize: Schema.number().min(1).default(38).description('最小字体大小（px）'),
    offsetWidth: Schema.number().min(1).default(900)
      .description('单行最大宽度（px），任意一行文本达到此宽度后会缩小字体以尽可能不超出此宽度，直到字体大小等于`minFontSize`'),
  }).description('悲报配置'),
})

export function apply(ctx: Context, config: Config) {
  ctx.command('喜报 <text:text>', '生成一张喜报')
    .usage('喜报 要在喜报上写的内容，支持换行')
    .example('喜报 这可以喜')
    .action(async (_, text) => {
      if (!text) return '请在指令空格后输入内容，具体使用方式请查看帮助信息'
      const img = readFileSync(path.resolve(__dirname, './xibao.jpg'))
      return await ctx.puppeteer.render(
        html({
          text,
          fontFamily: config.xibao.fontFamily,
          fontColor: '#ff0a0a',
          strokeColor:'#ffde00',
          maxFontSize: config.xibao.maxFontSize,
          minFontSize: config.xibao.minFontSize,
          offsetWidth: config.xibao.offsetWidth,
          img
        })
      )
    })

  ctx.command('悲报 <text:text>', '生成一张悲报')
    .usage('悲报 要在悲报上写的内容，支持换行')
    .example('悲报 这不可以喜')
    .action(async (_, text) => {
      if (!text) return '请在指令空格后输入内容，具体使用方式请查看帮助信息'
      const img = readFileSync(path.resolve(__dirname, './beibao.jpg'))
      return await ctx.puppeteer.render(
        html({
          text,
          fontFamily: config.beibao.fontFamily,
          fontColor: '#000500',
          strokeColor: '#c6c6c6',
          maxFontSize: config.beibao.maxFontSize,
          minFontSize: config.beibao.minFontSize,
          offsetWidth: config.beibao.offsetWidth,
          img
        })
      )
    })
}

function html(params: {
  text: string,
  fontFamily: string,
  fontColor: string,
  strokeColor: string,
  maxFontSize: number,
  minFontSize: number,
  offsetWidth: number,
  img: Buffer
}) {
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
        font-family: ${params.fontFamily};
        color: ${params.fontColor};
        -webkit-text-stroke: 2.5px ${params.strokeColor};
        background-image: url(data:image/png;base64,${params.img.toString('base64')});
        background-repeat: no-repeat;
      }
    </style>
  </head>
  <body>
    <div>${params.text.replaceAll('\n', '</div><div>')}</div>
  </body>
  <script>
    const dom = document.querySelector('body')
    const divs = dom.querySelectorAll('div')
    let fontSize = ${params.maxFontSize}
    dom.style.fontSize = fontSize + 'px'
    divs.forEach(div => {
      while (div.offsetWidth >= ${params.offsetWidth} && fontSize > ${params.minFontSize}) {
        dom.style.fontSize = --fontSize + 'px'
      }
    })
  </script>
</html>`
}
