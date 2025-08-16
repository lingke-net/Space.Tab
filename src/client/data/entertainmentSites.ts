// 娱乐类网站数据
import { FeaturedSite } from '../utils/featuredSites';

export const entertainmentSites: FeaturedSite[] = [
  {
    id: "bilibili",
    url: "https://www.bilibili.com",
    title: "哔哩哔哩",
    description: "中国领先的视频平台，涵盖动画、游戏、科技等多种内容",
    detailedDescription: "哔哩哔哩（B站）是中国领先的视频平台，最初以ACG（动画、漫画、游戏）内容为主，现已发展为涵盖多元内容的综合性平台。B站特色的弹幕系统让观众可以在视频上方发送评论，创造独特的互动体验。平台拥有丰富的UP主生态，创作者涵盖知识分享、生活记录、娱乐、游戏等多个领域。B站的社区文化浓厚，用户粘性高，形成了独特的次元文化和社区氛围。平台还提供直播、番剧、影视、专栏等多种内容形式。对于年轻用户群体，B站不仅是娱乐平台，也是学习交流和文化社区的重要场所。",
    category: "娱乐",
    tags: ["视频", "弹幕", "社区"],
    rating: 4.8,
    featured: true,
    addedDate: "2025-08-05"
  },
  {
    id: "youtube",
    url: "https://www.youtube.com",
    title: "YouTube",
    description: "全球最大的视频分享平台，内容覆盖几乎所有领域",
    detailedDescription: "YouTube是全球最大的视频分享平台，每月活跃用户超过20亿。平台内容极其丰富，涵盖教育、娱乐、音乐、游戏、科技、生活方式等几乎所有领域。YouTube的创作者生态系统完善，从个人博主到大型媒体公司都在平台上发布内容。它的推荐算法根据用户观看历史和偏好提供个性化内容。YouTube提供多种互动方式，包括评论、点赞、分享和频道订阅。平台还有YouTube Premium订阅服务，提供无广告观看、背景播放和YouTube Music等增值功能。对于内容创作者，YouTube提供了广告分成、频道会员、超级感谢等多种变现途径。作为视频领域的主导平台，YouTube既是娱乐来源，也是学习工具和文化影响力的重要渠道。",
    category: "娱乐",
    tags: ["视频", "创作者", "直播"],
    rating: 4.9,
    featured: true,
    addedDate: "2025-08-05",
    unchina: true
  },
  {
    id: "netflix",
    url: "https://www.netflix.com",
    title: "Netflix",
    description: "全球领先的流媒体服务，提供电影、剧集和原创内容",
    detailedDescription: "Netflix是全球领先的流媒体娱乐服务，提供丰富的电影、电视剧、纪录片和原创内容。平台以订阅制运营，用户支付月费即可无限观看所有内容，无广告干扰。Netflix以其高质量的原创内容著称，如《怪奇物语》、《纸牌屋》和《王冠》等，多次获得艾美奖和奥斯卡提名。平台采用先进的推荐算法，根据用户观看历史提供个性化内容建议。Netflix支持多设备访问，允许下载部分内容供离线观看。它的界面简洁直观，支持多种语言和字幕选项。作为娱乐产业的重要参与者，Netflix不仅改变了人们消费视频内容的方式，也对全球影视制作产生了深远影响。",
    category: "娱乐",
    tags: ["流媒体", "电影", "剧集"],
    rating: 4.8,
    featured: false,
    addedDate: "2025-08-12",
    unchina: true
  },
  {
    id: "spotify",
    url: "https://www.spotify.com",
    title: "Spotify",
    description: "全球最大的音乐流媒体服务，提供数百万首歌曲和播客",
    detailedDescription: "Spotify是全球领先的音乐流媒体服务，拥有超过8000万首歌曲和400万个播客节目。平台提供免费（含广告）和付费订阅两种模式，付费用户可享受无广告、更高音质和离线下载等特权。Spotify的个性化推荐系统是其核心优势，通过'发现周刊'和'每日混音'等功能，根据用户听歌习惯推荐新内容。平台支持创建和分享播放列表，关注艺人和好友的活动。Spotify还大力投资播客领域，成为音频内容的综合平台。它的社交功能允许用户分享正在收听的内容，查看好友的音乐品味。对于音乐爱好者来说，Spotify不仅是听歌工具，也是发现新音乐和连接音乐社区的平台。",
    category: "娱乐",
    tags: ["音乐", "播客", "流媒体"],
    rating: 4.7,
    featured: false,
    addedDate: "2025-08-12",
    unchina: true
  },
  {
    id: "twitch",
    url: "https://www.twitch.tv",
    title: "Twitch",
    description: "领先的直播平台，主要面向游戏、创意和生活内容",
    detailedDescription: "Twitch是全球最大的直播流媒体平台，最初专注于游戏直播，现已扩展到创意艺术、音乐、聊天节目和现实生活内容。平台的互动性极强，观众可以通过聊天室实时与主播和其他观众交流。Twitch的订阅和打赏系统为创作者提供了收入来源，粉丝可以通过订阅频道支持喜爱的主播。平台的特色功能包括Clips（精彩片段）、Extensions（扩展应用）和Raids（主播引导观众访问其他频道）。Twitch社区文化独特，发展出专属的表情符号和术语。对于游戏玩家、内容创作者和寻求互动娱乐体验的观众来说，Twitch提供了一个实时连接和分享热情的平台。",
    category: "娱乐",
    tags: ["直播", "游戏", "社区"],
    rating: 4.6,
    featured: false,
    addedDate: "2025-08-12",
    unchina: true
  },
  {
    id: "douyin",
    url: "https://www.douyin.com",
    title: "抖音",
    description: "中国领先的短视频平台，提供多样化的创意内容",
    detailedDescription: "抖音是中国领先的短视频平台，由字节跳动开发运营，以其算法推荐和创意短视频内容而闻名。平台支持15秒至几分钟不等的视频创作，内容涵盖舞蹈、美食、旅游、教育、搞笑等多个领域。抖音的特色在于强大的视频编辑工具，用户可以添加音乐、特效、滤镜等元素，即使是普通用户也能创作出有趣的内容。平台的"挑战"功能鼓励用户参与特定主题的创作，形成病毒式传播。抖音还整合了直播和电商功能，创作者可以通过带货和打赏获得收入。作为中国最具影响力的社交媒体之一，抖音不仅是娱乐平台，也成为品牌营销和个人表达的重要渠道。",
    category: "娱乐",
    tags: ["短视频", "社交", "创意"],
    rating: 4.7,
    featured: false,
    addedDate: "2025-08-12"
  },
  {
    id: "tiktok",
    url: "https://www.tiktok.com",
    title: "TikTok",
    description: "全球流行的短视频平台，以创意内容和趋势挑战著称",
    detailedDescription: "TikTok是抖音的国际版本，已成为全球最受欢迎的短视频平台之一，在150多个国家拥有超过10亿月活跃用户。平台以15秒至3分钟的短视频为主，内容涵盖舞蹈、挑战、教程、喜剧等多种形式。TikTok的核心是其强大的推荐算法，通过"For You Page"（推荐页）向用户展示个性化内容，使新创作者也有机会获得广泛曝光。平台的音乐库丰富，用户可以轻松使用流行歌曲创建视频。TikTok的趋势和挑战机制促进了内容的病毒式传播，经常影响流行文化和音乐排行榜。对于创作者、品牌和普通用户来说，TikTok提供了一个创意表达和发现新内容的平台，其影响力已超越娱乐领域，延伸到营销、教育和社会议题讨论。",
    category: "娱乐",
    tags: ["短视频", "社交", "趋势"],
    rating: 4.7,
    featured: false,
    addedDate: "2025-08-12",
    unchina: true
  },
  {
    id: "iqiyi",
    url: "https://www.iqiyi.com",
    title: "爱奇艺",
    description: "中国领先的视频平台，提供电影、剧集和综艺节目",
    detailedDescription: "爱奇艺是中国领先的视频平台，提供丰富的电影、电视剧、综艺节目、动漫和纪录片等内容。平台采用免费+会员的商业模式，VIP会员可享受无广告观看、超前点播和高清画质等特权。爱奇艺以自制内容见长，推出了多部热门网剧和综艺节目，如《延禧攻略》、《青春有你》等。平台的技术优势包括高质量的视频编码和智能推荐系统，为用户提供流畅的观看体验和个性化内容。爱奇艺还开发了弹幕、评论等社交功能，增强用户互动。作为中国在线视频市场的主要参与者，爱奇艺不断探索内容创新和商业模式升级，影响着中国数字娱乐产业的发展方向。",
    category: "娱乐",
    tags: ["视频", "电影", "电视剧"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-12"
  },
  {
    id: "steam",
    url: "https://store.steampowered.com",
    title: "Steam",
    description: "全球最大的PC游戏分发平台，提供丰富的游戏内容和社区功能",
    detailedDescription: "Steam是由Valve Corporation开发的全球最大PC游戏分发平台，拥有超过5万款游戏和1.2亿活跃用户。平台不仅是游戏商店，还提供社区功能、游戏更新管理、云存档和好友系统等服务。Steam的特色包括定期举办的大型特卖活动、用户评价系统和愿望单功能，帮助玩家发现和购买游戏。平台支持创意工坊，玩家可以创建、分享和下载游戏模组和自定义内容。Steam还提供直播、截图分享和成就系统等社交功能，增强游戏体验。对于PC游戏玩家来说，Steam已成为必备的游戏平台，不仅提供游戏购买和管理，也是连接游戏社区和获取游戏资讯的重要渠道。",
    category: "娱乐",
    tags: ["游戏", "数字分发", "社区"],
    rating: 4.8,
    featured: false,
    addedDate: "2025-08-12"
  },
  {
    id: "weibo",
    url: "https://weibo.com",
    title: "微博",
    description: "中国领先的社交媒体平台，类似Twitter的信息分享服务",
    detailedDescription: "微博是中国领先的社交媒体平台，由新浪公司开发运营，被称为"中国的Twitter"。平台允许用户发布短文本、图片、视频和直播内容，关注感兴趣的用户和话题。微博的特色是话题标签系统（#话题#），用户可以参与热门话题讨论，实时了解社会热点。平台汇集了大量名人、媒体和官方机构账号，成为信息传播和公共讨论的重要渠道。微博的超级话题和粉丝群功能强化了社区建设，用户可以围绕共同兴趣形成社群。平台还整合了电商、支付等功能，拓展了社交媒体的应用场景。作为中国互联网生态的重要组成部分，微博不仅是社交和娱乐平台，也是新闻传播、舆论形成和社会互动的重要空间。",
    category: "娱乐",
    tags: ["社交媒体", "资讯", "话题"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-12"
  }
];