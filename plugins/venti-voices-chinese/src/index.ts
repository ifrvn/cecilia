import { Context, Schema, segment } from 'koishi'
import { indexOf, random, shuffle } from 'lodash'
import { join } from 'path'
import { data, Voice } from './assets/ogg'

export const name = 'venti-voice-overs'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

const _keys = new Set<string>()
let lastVoice: Voice

data.forEach((item) => {
  item.keys.forEach((key) => _keys.add(key))
})

export function findKeysInText (text: string) {
  const res: string[] = []
  _keys.forEach((key) => {
    const reg = new RegExp(key, 'i')
    if (reg.test(text)) res.push(key)
  })
  return res
}

export function findVoicesByKeys (keys: string[]) {
  const res: Voice[] = []
  data.forEach((o) => {
    keys.forEach((k) => {
      if (indexOf(o.keys, k) >= 0) res.push(o)
    })
  })
  return res
}

export function getFileUrl (filename: string) {
  return 'file:///' + join(__dirname, 'assets/ogg', filename + '.ogg')
}

export function apply (ctx: Context, config: Config) {
  ctx.middleware(async (session, next) => {
    const message = session.content?.trim()
    if (message == null) return await next()

    const matchVenti = /(温迪)|(巴巴托斯)|(风神)|(吟游诗人)|(吹笛人)|(卖唱的)/
    if (!matchVenti.test(message)) return await next()

    const matchGetText = /(你说啥)|(说的啥)|(听不清)|(翻译)|(文本)/
    if (matchGetText.test(message)) {
      await session.send(lastVoice.details ?? '欸嘿，你什么也没有听见哦')
      return await next()
    }

    const keys = findKeysInText(message)
    const matchedVoices = shuffle(findVoicesByKeys(keys))
    if (matchedVoices.length > 0) {
      const i = random(0, matchedVoices.length - 1, false)
      await session.send(
        segment('audio', { url: getFileUrl(matchedVoices[i].audio) })
      )
      lastVoice = matchedVoices[i]
    }
    return await next()
  })

  ctx.on('guild-member-added', async (session) => {
    const welcomeVoice = findVoicesByKeys(['初次见面'])
    await session.send(segment('audio', { file: getFileUrl(welcomeVoice[0].audio) }))
  })
}
