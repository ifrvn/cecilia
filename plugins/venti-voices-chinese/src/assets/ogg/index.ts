export interface Voice {
  title: string
  details: string
  keys: string[]
  audio: string
}

export const data: Voice[] = [
  // 聊天语音
  {
    title: '初次见面...',
    details:
      '哈…睡得好香呀。欸，你好呀，旅行者，我们又见面了。嗯？不记得我了？嘿嘿，那就让我再次加入你的旅程吧。你的诗篇，值得被我这个世上最好的吟游诗人传唱！',
    keys: ['初次见面', '见面', '你好'],
    audio: 'VO_ZH_Venti_Hello',
  },
  {
    title: '闲聊・弹琴',
    details: '嗯…想接着听下去的话，送我一个苹果吧。',
    keys: ['闲聊', '弹琴'],
    audio: 'VO_ZH_Venti_Chat_-_Playing_the_Lyre',
  },
  {
    title: '闲聊・苹果酒',
    details: '嗯…好想坐在大树上，手边有喝不完的苹果酒。哎。',
    keys: ['闲聊', '酒', '苹果酒'],
    audio: 'VO_ZH_Venti_Chat_-_Apple_Cider',
  },
  {
    title: '闲聊・诗篇',
    details: '动身吧，旅行者。佚失的诗篇，还在等着我们呢。',
    keys: ['闲聊', '诗篇'],
    audio: 'VO_ZH_Venti_Chat_-_Ballads',
  },
  {
    title: '下雨的时候…',
    details: '来踩小水坑吧！看看谁溅出来的水花更大！',
    keys: ['水坑', '下雨'],
    audio: 'VO_ZH_Venti_When_It_Rains',
  },
  {
    title: '雨过天晴…',
    details: '欸~这就天晴了？我还想多玩一会儿呢。',
    keys: ['天晴'],
    audio: 'VO_ZH_Venti_After_the_Rain',
  },
  {
    title: '下雪的时候…',
    details: '等雪积起来…我们来打雪仗吧！',
    keys: ['雪'],
    audio: 'VO_ZH_Venti_When_It_Snows',
  },
  {
    title: '刮大风了…',
    details: '难得呀，要不要去飞一飞？',
    keys: ['大风', '刮风', '起风'],
    audio: 'VO_ZH_Venti_When_the_Wind_Is_Blowing',
  },
  {
    title: '早上好…',
    details: '早，准备开始新的冒险了么？',
    keys: ['早'],
    audio: 'VO_ZH_Venti_Good_Morning',
  },
  {
    title: '中午好…',
    details:
      '咕…肚子饿了，又不敢再去晨曦酒庄蹭饭…啊，是你呀！欸嘿，要出门么？带我一个呗。',
    keys: ['午', '饿', '蹭饭'],
    audio: 'VO_ZH_Venti_Good_Afternoon',
  },
  {
    title: '晚上好…',
    details: '我还不困哦。要我陪你走走么？',
    keys: ['晚上', '困了'],
    audio: 'VO_ZH_Venti_Good_Evening',
  },
  {
    title: '晚安…',
    details: '欸？要休息了吗？嘿嘿，晚安。',
    keys: ['晚安', '睡了'],
    audio: 'VO_ZH_Venti_Good_Night',
  },
  {
    title: '关于温迪自己…',
    details: '练习？哼哼，我当然不需要啦，在这提瓦特就没有我不会唱的歌。',
    keys: ['练习', '唱歌'],
    audio: 'VO_ZH_Venti_About_Venti',
  },
  {
    title: '关于我们・新歌',
    details:
      '我想把你写进新歌里！欸，怎么露出这种表情呀，担心付不起稿费吗？哈哈，摩拉就不要了，不如…跟我再讲讲你的故事吧！',
    keys: ['新歌'],
    audio: 'VO_ZH_Venti_About_Us_-_New_Songs',
  },
  {
    title: '关于我们・勇者（空）',
    details:
      '唔…嗯！嘿嘿，等到勇者救出了公主，我会第一时间让全大陆传唱这首歌谣。',
    keys: ['勇者', '公主', '空'],
    audio: 'VO_ZH_Venti_About_Us_-_Heroes_(Aether_Version)',
  },
  {
    title: '关于我们・勇者（荧）',
    details:
      '唔…嗯！嘿嘿，等到勇者救出了王子，我会第一时间让全大陆传唱这首歌谣。',
    keys: ['勇者', '王子', '荧'],
    audio: 'VO_ZH_Venti_About_Us_-_Heroes_(Lumine_Version)',
  },
  {
    title: '关于我们・使徒',
    details:
      '夜风凉爽，是适合成为神的使徒的天气！那么事不宜迟，快来向我献上供奉吧？',
    keys: ['使徒', '供奉'],
    audio: 'VO_ZH_Venti_About_Us_-_Apostles',
  },
  {
    title: '关于我们・请求',
    details:
      '欸，要风神我更加努力一点？那你是不是也要展示点诚意呢。比如虔诚、热爱，或者说…',
    keys: ['请求', '努力', '加油', '风神'],
    audio: 'VO_ZH_Venti_About_Us_-_Requests',
  },
  {
    title: '关于「神之眼」…',
    details:
      '欸？好奇我的「神之眼」？喔…喏，给你。喜欢的话…要我给你做一个一样的么？嘿嘿嘿。',
    keys: ['神之眼'],
    audio: 'VO_ZH_Venti_About_the_Vision',
  },
  {
    title: '有什么想要分享…',
    details:
      'Olah！嘿嘿，这是丘丘人打招呼用的话哦。问我学这个干嘛？哎呀，为了创作，知识面当然越广越好啊。唔，好像，我还没尝试过用丘丘语写歌呢…',
    keys: ['分享', 'Olah', '你好', '丘丘语', '丘丘人'],
    audio: 'VO_ZH_Venti_Something_to_Share',
  },
  {
    title: '感兴趣的见闻…',
    details:
      '旅行者，你见过塞西莉亚花么？那是一种只在安静的山崖顶上默默绽放的白色野花。在我心里，它就是全提瓦特最美的花。',
    keys: ['见闻', '塞西莉亚', '花'],
    audio: 'VO_ZH_Venti_Interesting_Things',
  },
  {
    title: '关于琴…',
    details:
      '骑士团代理团长大人…你觉得她是个怎样的人？嘿嘿，跟我想得一样。认真，勇敢，也不乏温柔。和我一个朋友有点像呢…',
    keys: ['琴', '团长'],
    audio: 'VO_ZH_Venti_About_Jean',
  },
  {
    title: '关于迪卢克…',
    details:
      '去跟迪卢克老爷处好关系吧？你想，他家可是有好~多~珍藏的酒啊！嘿嘿嘿，嘿嘿嘿嘿…咦，无论如何不准喝酒么？那…就去闻一闻吧，闻一闻！只是闻的话，你也可以喔。',
    keys: ['迪卢克', '酒庄'],
    audio: 'VO_ZH_Venti_About_Diluc',
  },
  {
    title: '关于芭芭拉…',
    details:
      '唱歌很好听的牧师女孩儿，你认识么、你认识么？…唔，偶像？…啊，握手会？…嗯，专场live？…这样啊，音乐还真是深奥呐。',
    keys: ['芭芭拉'],
    audio: 'VO_ZH_Venti_About_Barbara',
  },
  {
    title: '关于雷泽…',
    details:
      '那个奔狼领的白发少年，哦哦，是吗，是被狼养大的啊…怪不得呢，他身上的气息，令人怀念…',
    keys: ['雷泽', '奔狼领'],
    audio: 'VO_ZH_Venti_About_Razor',
  },
  {
    title: '关于莫娜…',
    details:
      '啊，那位占星术士吗？这么说吧，占卜和我的诗歌一样，都是让人穷到酒钱都凑不齐的没用技术呢！欸？你说占星至少是一项文化传统，所以不是没用的？呜，真失礼啊，那诗歌也一样有用啊！',
    keys: ['莫娜', '占星', '占卜'],
    audio: 'VO_ZH_Venti_About_Mona',
  },
  {
    title: '关于迪奥娜…',
    details:
      '远近闻名的猫尾酒馆特调酒。可是…呜，会，打，打喷嚏。要不，你帮我讨一杯酒来吧。我肯定会好好感激你的，一言为定。',
    keys: ['迪奥娜', '猫尾酒馆', '打喷嚏'],
    audio: 'VO_ZH_Venti_About_Diona',
  },
  {
    title: '关于阿贝多…',
    details:
      '黑土与白垩、宇宙与地层，无垢之土创生原初之人…特征实在太明显了，难以忽视呀。这么危险的古老技术，万一在城里失控——嗨，算了，就让蒙德人自己解决蒙德的问题吧。',
    keys: ['阿贝多'],
    audio: 'VO_ZH_Venti_About_Albedo',
  },
  {
    title: '关于摩拉克斯…',
    details:
      '你见过那位老爷子了？他近来还好吗？欸，变成名叫「钟离」的普通人了？对他那个死脑筋而言，这应该是不小的改变啊。啊，陪我去见见他吧，带上这瓶埋在风起地的陈年好酒当作慰问品。啊对了，他现在还强不强，实力还剩几成啊？我这样过去，应该不会被打飞吧？',
    keys: ['摩拉克斯', '钟离', '岩神', '死脑筋'],
    audio: 'VO_ZH_Venti_About_Morax',
  },
  {
    title: '关于优菈…',
    details:
      '优菈对酒的品位可是很不错的。无论夏天、冬天都要喝冰的这一点，在现在的蒙德人里也算难得啦。感觉能和她成为不错的酒友。嗯？你说我编排的劳伦斯家的歌…早已经传到了她的耳朵里？哈，那有什么关系嘛？说不定，我们还能一起唱呢。',
    keys: ['优菈', '劳伦斯', '贵族'],
    audio: 'VO_ZH_Venti_About_Eula',
  },
  {
    title: '关于巴尔…',
    details:
      '听说，你把那位不可一世的雷电将军也击败了？啊…想当年她作为影武者的时候，就在追求极致的武技了。如今，也一定会借用各种各样的理由叫你做陪练吧。嗯嗯，偷偷告诉你她的弱点吧，耳朵凑过来——是「甜点心」哦！',
    keys: ['雷神', '巴尔', '雷电将军'],
    audio: 'VO_ZH_Venti_About_Baal',
  },
  {
    title: '想要了解温迪・其一',
    details: '来得正好，旅行者。我想听听，你的愿望是什么？',
    keys: ['了解', '愿望'],
    audio: 'VO_ZH_Venti_More_About_Venti_-_01',
  },
  {
    title: '想要了解温迪・其二',
    details:
      '跟你一起旅行真是件有趣的事，要说美中不足就是你身边的那只小不点了吧。那么能吃，你们的伙食费很了不得吧？哈哈。',
    keys: ['了解', '应急食品', '派蒙', '小不点'],
    audio: 'VO_ZH_Venti_More_About_Venti_-_02',
  },
  {
    title: '想要了解温迪・其三',
    details:
      '火之神是个横行霸道的战斗狂，岩之神是个不懂人心的死脑筋。问我怎么会知道这些？欸嘿，叙事诗里都写得一清二楚嘛，他们的故事。那个年代的故事。',
    keys: ['了解', '故事', '火神', '战斗狂', '岩神', '死脑筋'],
    audio: 'VO_ZH_Venti_More_About_Venti_-_03',
  },
  {
    title: '想要了解温迪・其四',
    details:
      '天空岛啊。连我也不一定飞得到那里呢。而且在那里，没有甜的水，也长不出什么好吃的果子。就更不会有好酒咯？嘿嘿，所以请我去我都不想去哦。',
    keys: ['了解', '天空岛'],
    audio: 'VO_ZH_Venti_More_About_Venti_-_04',
  },
  {
    title: '想要了解温迪・其五',
    details:
      '我的愿望？嗯。以前，我想着要游历整个世界。现在也一样，不过嘛，加上了一份限定条件，那就是跟你一起。有你在，才是完整的。记叙者果然要和冒险者在一起才行嘛，嘿嘿！',
    keys: ['了解', '愿望'],
    audio: 'VO_ZH_Venti_More_About_Venti_-_05',
  },
  {
    title: '温迪的爱好…',
    details: '我喜欢酒！还有风！唔，如果能有用风酿的酒就好了。',
    keys: ['爱好', '酒', '风'],
    audio: 'VO_ZH_Venti_Hobbies',
  },
  {
    title: '温迪的烦恼…',
    details:
      '其实，只要有猫在附近，我就忍不住会打喷嚏…啊-啊-阿嚏！唔…哎呀…就连想一想也不行么…欸，你知不知道该怎么治好这个毛病呀？',
    keys: ['猫', '过敏', '喷嚏', '阿嚏', '喵'],
    audio: 'VO_ZH_Venti_Troubles',
  },
  {
    title: '喜欢的食物…',
    details:
      '你也来一个苹果吗，刚摘的。啊呜，啊…又脆又甜，苹果才是神的馈赠吧！',
    keys: ['苹果', '喜欢'],
    audio: 'VO_ZH_Venti_Favorite_Food',
  },
  {
    title: '讨厌的食物…',
    details:
      '哎，你在做什么好吃的吗？欸？热奶酪饼！这个…这个不行，热热的黏糊糊的，唔…对我来说，太腻了…',
    keys: ['奶酪', '讨厌'],
    audio: 'VO_ZH_Venti_Least_Favorite_Food',
  },
  {
    title: '生日…',
    details:
      '我以前听朋友说生日是要吃蛋糕的…喏，苹果蛋糕，给，勺子。烤出来的时候有点塌了，所以看上去像是苹果派。欸嘿，甜点还真是复杂呀。',
    keys: ['生日'],
    audio: 'VO_ZH_Venti_Birthday',
  },
  {
    title: '突破的感受・起',
    details: '欸！刚刚发生了什么！',
    keys: ['突破', '刚刚'],
    audio: 'VO_ZH_Venti_Feelings_About_Ascension_-_01',
  },
  {
    title: '突破的感受・承',
    details: '辛苦啦。想要来点音乐放松一下吗？随想曲，还是小夜曲？',
    keys: ['突破', '音乐', '随想曲', '小夜曲'],
    audio: 'VO_ZH_Venti_Feelings_About_Ascension_-_02',
  },
  {
    title: '突破的感受・转',
    details: '来，坐这边。我写了一首新诗哦，就叫它「旅行者之风」吧。',
    keys: ['突破', '新诗', '旅行者之风'],
    audio: 'VO_ZH_Venti_Feelings_About_Ascension_-_03',
  },
  {
    title: '突破的感受・合',
    details:
      '唔…明明这些风景早就看过很多遍了，有你在身边，却像是呈现出了不同的样子。你该不会…还藏着一大堆奇奇怪怪的能力吧？…唔，那倒也不错。说明，我看人的眼光很准呀，欸嘿。',
    keys: ['突破', '风景', '欸嘿'],
    audio: 'VO_ZH_Venti_Feelings_About_Ascension_-_04',
  },
  // 战斗语音
  {
    title: '元素战技',
    details: '哟呼——',
    keys: ['元素战技', '哟呼'],
    audio: 'VO_ZH_Venti_Elemental_Skill_1_01',
  },
  {
    title: '元素战技',
    details: '在这哟。',
    keys: ['元素战技', '在这哟'],
    audio: 'VO_ZH_Venti_Elemental_Skill_1_02',
  },
  {
    title: '元素战技',
    details: '留意脚下。',
    keys: ['元素战技', '留意脚下'],
    audio: 'VO_ZH_Venti_Elemental_Skill_1_03',
  },
  {
    title: '元素战技',
    details: '一起来玩吧。',
    keys: ['元素战技', '一起来玩吧'],
    audio: 'VO_ZH_Venti_Elemental_Skill_1_04',
  },
  {
    title: '元素战技',
    details: '',
    keys: ['元素战技'],
    audio: 'VO_ZH_Venti_Elemental_Skill_2_01',
  },
  {
    title: '元素战技',
    details: '',
    keys: ['元素战技'],
    audio: 'VO_ZH_Venti_Elemental_Skill_2_02',
  },
  {
    title: '元素爆发',
    details: '别想逃开喔？',
    keys: ['元素爆发', '逃', '投胎'],
    audio: 'VO_ZH_Venti_Elemental_Burst_01',
  },
  {
    title: '元素爆发',
    details: '起风咯~',
    keys: ['元素爆发', '起风'],
    audio: 'VO_ZH_Venti_Elemental_Burst_02',
  },
  {
    title: '冲刺开始',
    details: '飞，比跑快吧？',
    keys: ['冲', '飞', '跑'],
    audio: 'VO_ZH_Venti_Sprint_Start_01',
  },
  {
    title: '冲刺开始',
    details: '飞，比跑快吧？',
    keys: ['冲'],
    audio: 'VO_ZH_Venti_Sprint_Start_02',
  },
  {
    title: '冲刺开始',
    details: '飞，比跑快吧？',
    keys: ['冲'],
    audio: 'VO_ZH_Venti_Sprint_Start_03',
  },
  {
    title: '冲刺开始',
    details: '飞，比跑快吧？',
    keys: ['冲'],
    audio: 'VO_ZH_Venti_Sprint_Start_04',
  },
  {
    title: '打开风之翼',
    details: '呀嘿~',
    keys: ['风之翼', '飞'],
    audio: 'VO_ZH_Venti_Deploying_Wind_Glider_01',
  },
  {
    title: '打开风之翼',
    details: '',
    keys: ['风之翼', '飞'],
    audio: 'VO_ZH_Venti_Deploying_Wind_Glider_02',
  },
  {
    title: '打开风之翼',
    details: '',
    keys: ['风之翼', '飞'],
    audio: 'VO_ZH_Venti_Deploying_Wind_Glider_03',
  },
  {
    title: '打开风之翼',
    details: '',
    keys: ['风之翼', '飞'],
    audio: 'VO_ZH_Venti_Deploying_Wind_Glider_04',
  },
  {
    title: '收起风之翼',
    details: '',
    keys: ['收起风之翼'],
    audio: 'VO_ZH_Venti_Deploying_Wind_Glider_01',
  },
  {
    title: '收起风之翼',
    details: '',
    keys: ['收起风之翼'],
    audio: 'VO_ZH_Venti_Deploying_Wind_Glider_02',
  },
  {
    title: '收起风之翼',
    details: '',
    keys: ['收起风之翼'],
    audio: 'VO_ZH_Venti_Deploying_Wind_Glider_03',
  },
  {
    title: '打开宝箱',
    details: '咳咳，请听一首，「宝箱之歌」！',
    keys: ['宝箱'],
    audio: 'VO_ZH_Venti_Opening_Treasure_Chest_01',
  },
  {
    title: '打开宝箱',
    details: '嘿嘿，要不要感谢「风神的眷顾」呀？',
    keys: ['宝箱'],
    audio: 'VO_ZH_Venti_Opening_Treasure_Chest_02',
  },
  {
    title: '打开宝箱',
    details: '收获不少，可以拿去换几瓶好酒啦。',
    keys: ['宝箱'],
    audio: 'VO_ZH_Venti_Opening_Treasure_Chest_03',
  },
  {
    title: '生命值低',
    details: '等等，这可不好玩！',
    keys: ['生命值低', '等等'],
    audio: 'VO_ZH_Venti_Low_HP_01',
  },
  {
    title: '生命值低',
    details: '哎呀，别盯着我打呀。',
    keys: ['生命值低', '盯着'],
    audio: 'VO_ZH_Venti_Low_HP_02',
  },
  {
    title: '生命值低',
    details: '好过分呐。',
    keys: ['生命值低', '过分'],
    audio: 'VO_ZH_Venti_Low_HP_03',
  },
  {
    title: '倒下',
    details: '稍微睡一下吧…',
    keys: ['倒下', '睡一下'],
    audio: 'VO_ZH_Venti_Fallen_01',
  },
  {
    title: '倒下',
    details: '啊呀，弦断了…',
    keys: ['倒下', '弦断了'],
    audio: 'VO_ZH_Venti_Fallen_02',
  },
  {
    title: '倒下',
    details: '扑通。',
    keys: ['倒下', '扑通'],
    audio: 'VO_ZH_Venti_Fallen_03',
  },
  {
    title: '倒下',
    details: '',
    keys: ['倒下'],
    audio: 'VO_ZH_Venti_Fallen_04',
  },
  {
    title: '普通受击',
    details: '哎呀…',
    keys: ['受击', '普通受击', '哎呀'],
    audio: 'VO_ZH_Venti_Light_Hit_Taken_01',
  },
  {
    title: '普通受击',
    details: '',
    keys: ['受击', '普通受击'],
    audio: 'VO_ZH_Venti_Light_Hit_Taken_02',
  },
  {
    title: '普通受击',
    details: '',
    keys: ['受击', '普通受击'],
    audio: 'VO_ZH_Venti_Light_Hit_Taken_03',
  },
  {
    title: '普通受击',
    details: '',
    keys: ['受击', '普通受击'],
    audio: 'VO_ZH_Venti_Light_Hit_Taken_03',
  },
  {
    title: '普通受击',
    details: '',
    keys: ['受击', '普通受击'],
    audio: 'VO_ZH_Venti_Light_Hit_Taken_04',
  },
  {
    title: '普通受击',
    details: '',
    keys: ['受击', '普通受击'],
    audio: 'VO_ZH_Venti_Light_Hit_Taken_05',
  },
  {
    title: '普通受击',
    details: '',
    keys: ['受击', '普通受击'],
    audio: 'VO_ZH_Venti_Light_Hit_Taken_06',
  },
  {
    title: '重受击',
    details: '好粗鲁哦。',
    keys: ['受击', '重受击', '受重击', '粗鲁'],
    audio: 'VO_ZH_Venti_Heavy_Hit_Taken_01',
  },
  {
    title: '重受击',
    details: '',
    keys: ['受击', '重受击', '受重击'],
    audio: 'VO_ZH_Venti_Heavy_Hit_Taken_02',
  },
  {
    title: '重受击',
    details: '',
    keys: ['受击', '重受击', '受重击'],
    audio: 'VO_ZH_Venti_Heavy_Hit_Taken_03',
  },
  {
    title: '重受击',
    details: '',
    keys: ['受击', '重受击', '受重击'],
    audio: 'VO_ZH_Venti_Heavy_Hit_Taken_04',
  },
  {
    title: '重受击',
    details: '',
    keys: ['受击', '重受击', '受重击'],
    audio: 'VO_ZH_Venti_Heavy_Hit_Taken_05',
  },
  {
    title: '重受击',
    details: '',
    keys: ['受击', '重受击', '受重击'],
    audio: 'VO_ZH_Venti_Heavy_Hit_Taken_06',
  },
  {
    title: '加入队伍',
    details: '调音完成。',
    keys: ['加入队伍', '调音'],
    audio: 'VO_ZH_Venti_Joining_Party_01',
  },
  {
    title: '加入队伍',
    details: '让你久等了哦？',
    keys: ['加入队伍', '久等'],
    audio: 'VO_ZH_Venti_Joining_Party_02',
  },
  {
    title: '加入队伍',
    details: '是要做热身运动吗。',
    keys: ['加入队伍', '热身'],
    audio: 'VO_ZH_Venti_Joining_Party_03',
  },
  {
    title: '轻攻击',
    details: '',
    keys: ['轻攻击', '攻击'],
    audio: 'VO_ZH_Venti_Light_Attack_01',
  },
  {
    title: '轻攻击',
    details: '',
    keys: ['轻攻击', '攻击'],
    audio: 'VO_ZH_Venti_Light_Attack_02',
  },
  {
    title: '轻攻击',
    details: '',
    keys: ['轻攻击', '攻击'],
    audio: 'VO_ZH_Venti_Light_Attack_03',
  },
  {
    title: '轻攻击',
    details: '',
    keys: ['轻攻击', '攻击'],
    audio: 'VO_ZH_Venti_Light_Attack_04',
  },
  {
    title: '轻攻击',
    details: '',
    keys: ['轻攻击', '攻击'],
    audio: 'VO_ZH_Venti_Light_Attack_05',
  },
  {
    title: '轻攻击',
    details: '',
    keys: ['轻攻击', '攻击'],
    audio: 'VO_ZH_Venti_Light_Attack_06',
  },
  {
    title: '中攻击',
    details: '',
    keys: ['中攻击', '攻击'],
    audio: 'VO_ZH_Venti_Mid_Attack_01',
  },
  {
    title: '中攻击',
    details: '',
    keys: ['中攻击', '攻击'],
    audio: 'VO_ZH_Venti_Mid_Attack_02',
  },
  {
    title: '重攻击',
    details: '',
    keys: ['重攻击', '攻击'],
    audio: 'VO_ZH_Venti_Heavy_Attack_01',
  },
  {
    title: '重攻击',
    details: '',
    keys: ['重攻击', '攻击'],
    audio: 'VO_ZH_Venti_Heavy_Attack_02',
  },
  {
    title: '攀爬',
    details: '',
    keys: ['攀爬', '爬'],
    audio: 'VO_ZH_Venti_Climbing_01',
  },
  {
    title: '攀爬',
    details: '',
    keys: ['攀爬', '爬'],
    audio: 'VO_ZH_Venti_Climbing_02',
  },
  {
    title: '攀爬',
    details: '',
    keys: ['攀爬', '爬'],
    audio: 'VO_ZH_Venti_Climbing_03',
  },
  {
    title: '攀爬',
    details: '',
    keys: ['攀爬', '爬'],
    audio: 'VO_ZH_Venti_Climbing_04',
  },
  {
    title: '攀爬',
    details: '',
    keys: ['攀爬', '爬'],
    audio: 'VO_ZH_Venti_Climbing_05',
  },
  {
    title: '跳跃',
    details: '',
    keys: ['跳跃', '跳'],
    audio: 'VO_ZH_Venti_Jumping_01',
  },
  {
    title: '跳跃',
    details: '',
    keys: ['跳跃', '跳'],
    audio: 'VO_ZH_Venti_Jumping_02',
  },
  {
    title: '跳跃',
    details: '',
    keys: ['跳跃', '跳'],
    audio: 'VO_ZH_Venti_Jumping_03',
  },
  {
    title: '跳跃',
    details: '',
    keys: ['跳跃', '跳'],
    audio: 'VO_ZH_Venti_Jumping_04',
  },
  {
    title: '跳跃',
    details: '',
    keys: ['跳跃', '跳'],
    audio: 'VO_ZH_Venti_Jumping_05',
  },
  // TODO: 尘歌壶入驻对话
  // {
  //   title: '',
  //   details: '',
  //   keys: [''],
  //   audio: '',
  // },
]
