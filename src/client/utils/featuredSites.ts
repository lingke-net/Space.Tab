// 精选网站数据模型
export interface FeaturedSite {
  id: string;          // 唯一标识符
  url: string;         // 网站URL
  title: string;       // 网站标题
  description: string; // 网站描述
  icon?: string;       // 网站图标URL（可选，优先使用Favicon.im）
  category: string;    // 分类
  tags: string[];      // 标签
  rating: number;      // 评分 (1-5)
  featured: boolean;   // 是否为特别推荐
  addedDate: string;   // 添加日期
  screenshots?: string[]; // 网站截图
  detailedDescription?: string; // 详细描述
  unchina?: boolean;   // 是否可能无法在中国大陆使用
}

// 工具函数：从URL生成Favicon.im图标URL
export function getFaviconUrl(url: string, larger: boolean = false): string {
  try {
    const domain = new URL(url).hostname
    return `https://favicon.im/${domain}${larger ? '?larger=true' : ''}`
  } catch (error) {
    // 如果URL解析失败，返回默认图标
    return 'https://favicon.im/example.com'
  }
}

// 工具函数：获取网站的图标URL（优先使用Favicon.im）
export function getSiteIcon(site: FeaturedSite, larger: boolean = false): string {
  // 如果网站有自定义图标，优先使用
  if (site.icon) {
    return site.icon
  }
  // 否则使用Favicon.im服务
  return getFaviconUrl(site.url, larger)
}

// 网站分类常量
export const CATEGORIES = {
  ALL: "全部",
  SEARCH: "搜索",
  ENTERTAINMENT: "娱乐", 
  AI: "AI",
  REVIEW: "评价",
  TOOLS: "工具",
  DEVELOPMENT: "开发"
} as const;

// 精选网站数据
export const featuredSites: FeaturedSite[] = [
  // 工具类网站
  {
    id: "figma",
    url: "https://www.figma.com",
    title: "Figma",
    description: "基于浏览器的协作式界面设计工具",
    detailedDescription: "Figma是一个基于浏览器的协作式设计工具，专门用于UI/UX设计。它支持实时协作，多个设计师可以同时编辑同一个设计文件，大大提高了团队协作效率。Figma提供强大的设计系统功能，支持组件库、样式管理和设计规范。它的原型功能允许设计师创建交互式原型，进行用户测试和演示。Figma还提供丰富的插件生态系统，扩展了工具的功能。对于设计团队来说，Figma已经成为行业标准，特别是在远程协作和设计系统管理方面表现出色。",
    category: "工具",
    tags: ["设计", "协作", "UI/UX"],
    rating: 5,
    featured: true,
    addedDate: "2025-08-05"
  },
  {
    id: "notion",
    url: "https://www.notion.so",
    title: "Notion",
    description: "全能的工作空间，集笔记、数据库、项目管理于一体",
    detailedDescription: "Notion是一个全能的工作空间平台，将笔记、数据库、项目管理、知识库等功能整合在一个应用中。它采用块级编辑系统，用户可以自由组合各种内容块，创建个性化的页面和数据库。Notion支持团队协作，多人可以同时编辑和评论。它提供丰富的模板库，涵盖个人管理、团队协作、项目管理等各种场景。Notion的数据库功能强大，支持多种视图和关联关系，可以构建复杂的信息管理系统。对于个人用户和团队来说，Notion是一个灵活且强大的生产力工具。",
    category: "工具",
    tags: ["笔记", "协作", "生产力"],
    rating: 4.5,
    featured: true,
    addedDate: "2025-08-05"
  },
  {
    id: "airtable",
    url: "https://airtable.com",
    title: "Airtable",
    description: "灵活的数据库和电子表格混合工具，适合团队协作",
    detailedDescription: "Airtable是一个结合了数据库功能和电子表格界面的协作平台，让用户可以轻松创建和共享关系型数据库。它提供直观的界面，无需编程知识即可构建复杂的数据模型。Airtable支持多种视图模式，包括网格视图、看板视图、日历视图等，满足不同场景的需求。它的自动化功能可以设置触发器和操作，减少重复工作。Airtable还提供丰富的集成选项，可以与Slack、Google Drive等工具连接。对于项目管理、内容规划、客户关系管理等场景，Airtable提供了灵活且强大的解决方案。",
    category: "工具",
    tags: ["数据库", "协作", "项目管理"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-12"
  },
  {
    id: "miro",
    url: "https://miro.com",
    title: "Miro",
    description: "在线协作白板平台，适合远程团队头脑风暴和规划",
    detailedDescription: "Miro是一个无限画布的在线协作白板平台，为远程团队提供视觉协作空间。它支持实时多人协作，团队成员可以同时在白板上添加内容、评论和互动。Miro提供丰富的模板，涵盖头脑风暴、用户故事地图、敏捷规划等多种场景。它的集成功能强大，可以与Jira、Asana、Slack等工具无缝连接。Miro支持多种内容类型，包括便签、图形、文本、图片、PDF等，满足不同的表达需求。对于分布式团队和远程工作者来说，Miro是进行创意思考、项目规划和视觉协作的理想平台。",
    category: "工具",
    tags: ["白板", "协作", "远程工作"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-12"
  },
  {
    id: "linear",
    url: "https://linear.app",
    title: "Linear",
    description: "现代化的项目管理工具，专为软件开发团队设计",
    detailedDescription: "Linear是一个为软件开发团队设计的现代化项目管理工具，以其简洁的界面和高效的工作流程著称。它提供直观的问题跟踪系统，支持敏捷开发方法，包括冲刺规划、迭代周期和团队目标。Linear的性能极为出色，操作流畅快速，支持键盘快捷键，提高工作效率。它的路线图功能允许团队规划长期项目和目标。Linear与GitHub、Figma等工具集成，实现开发流程的无缝衔接。对于追求效率和简洁的软件开发团队来说，Linear提供了专注于核心功能的项目管理解决方案。",
    category: "工具",
    tags: ["项目管理", "软件开发", "敏捷"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-12"
  },
  {
    id: "obsidian",
    url: "https://obsidian.md",
    title: "Obsidian",
    description: "基于本地Markdown文件的知识库工具，支持双向链接",
    detailedDescription: "Obsidian是一个强大的知识管理工具，基于本地存储的Markdown文件，确保数据隐私和所有权。它的核心特性是双向链接，允许用户在笔记之间创建连接，形成知识网络。Obsidian支持图形视图，可视化笔记之间的关系，帮助发现新的联系。它提供丰富的插件系统，用户可以扩展功能，如日历、看板、模板等。Obsidian的工作区概念允许用户为不同项目创建独立的环境。对于研究人员、作家、学生和知识工作者来说，Obsidian是构建个人知识库和思考工具的理想选择。",
    category: "工具",
    tags: ["笔记", "知识管理", "Markdown"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-12"
  },
  {
    id: "framer",
    url: "https://www.framer.com",
    title: "Framer",
    description: "高级原型设计和网站构建工具，无需编码",
    detailedDescription: "Framer是一个结合了设计和开发功能的工具，允许设计师创建高保真交互原型和功能性网站。它提供直观的可视化界面，同时支持代码自定义，满足不同技能水平的用户需求。Framer的智能组件系统让设计师可以创建响应式设计，适应不同屏幕尺寸。它的动画工具非常强大，可以创建流畅的过渡和微交互。Framer还提供网站托管服务，用户可以直接发布设计作品。对于UI/UX设计师和希望快速构建网站原型的团队来说，Framer提供了从概念到实现的完整解决方案。",
    category: "工具",
    tags: ["设计", "原型", "网站构建"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-12"
  },
  {
    id: "webflow",
    url: "https://webflow.com",
    title: "Webflow",
    description: "可视化网站设计和开发平台，无需编码",
    detailedDescription: "Webflow是一个可视化网站设计和开发平台，让设计师可以在不编写代码的情况下创建专业级网站。它提供直观的拖放界面，同时生成干净的HTML、CSS和JavaScript代码。Webflow的CMS功能强大，支持动态内容和数据库集合，适合构建博客、电子商务和内容网站。它的响应式设计工具让用户可以为不同设备优化网站布局。Webflow还提供托管服务，包括CDN、SSL证书和表单处理。对于设计师、自由职业者和小型团队来说，Webflow是一个从设计到发布的完整网站解决方案。",
    category: "工具",
    tags: ["网站设计", "CMS", "无代码"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-12"
  },
  {
    id: "loom",
    url: "https://www.loom.com",
    title: "Loom",
    description: "屏幕录制和视频消息工具，简化远程沟通",
    detailedDescription: "Loom是一个屏幕录制和视频消息工具，让用户可以快速录制屏幕、摄像头或两者结合的视频，并立即分享链接。它特别适合异步沟通，用户可以在自己方便的时间录制和观看视频。Loom提供浏览器扩展和桌面应用，使录制过程简单快捷。它的视频管理系统允许组织和分类录像，创建团队工作空间。Loom还提供互动功能，如评论、表情反应和时间戳。对于远程团队、教育工作者和客户支持人员来说，Loom是传达复杂信息和演示的有效工具，减少了会议需求和沟通障碍。",
    category: "工具",
    tags: ["视频", "远程工作", "沟通"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-12"
  },
  {
    id: "coda",
    url: "https://coda.io",
    title: "Coda",
    description: "集文档、电子表格和应用于一体的协作平台",
    detailedDescription: "Coda是一个创新的文档平台，将文字处理、电子表格和数据库功能融为一体。它允许用户在一个文档中创建动态表格、自动化工作流程和交互式应用。Coda的公式系统强大而灵活，可以构建复杂的逻辑和计算。它支持团队协作，多人可以同时编辑和评论。Coda提供丰富的模板和构建块，帮助用户快速启动项目。它还支持与Slack、GitHub等工具的集成，实现工作流程的自动化。对于希望减少工具切换、统一信息管理的团队来说，Coda提供了一个灵活且强大的协作平台。",
    category: "工具",
    tags: ["文档", "协作", "工作流程"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-12"
  },
  
  // AI类网站
  {
    id: "chatgpt",
    url: "https://chat.openai.com",
    title: "ChatGPT",
    description: "OpenAI开发的对话式AI助手，可回答问题和提供帮助",
    detailedDescription: "ChatGPT是由OpenAI开发的先进对话式AI助手，基于GPT（生成式预训练变换器）模型。它能够理解和生成自然语言，回答问题，提供解释，创作内容，辅助编程等。ChatGPT可以记住对话上下文，进行连贯的交流，适应用户的需求和风格。它在教育、创意写作、编程辅助、信息查询等方面有广泛应用。ChatGPT不断通过更新迭代提升能力，如GPT-4模型带来了更强的理解力和创造力。对于需要智能对话助手的个人和专业用户来说，ChatGPT提供了强大而灵活的AI支持。",
    category: "AI",
    tags: ["AI助手", "对话", "GPT"],
    rating: 5,
    featured: true,
    addedDate: "2025-08-05"
  },
  {
    id: "midjourney",
    url: "https://www.midjourney.com",
    title: "Midjourney",
    description: "AI图像生成工具，通过文本描述创建艺术作品",
    detailedDescription: "Midjourney是一个强大的AI图像生成工具，允许用户通过文本提示创建高质量的艺术作品。它使用深度学习技术将文字描述转化为视觉图像，风格多样，从写实到抽象都能呈现。Midjourney的操作基于Discord平台，用户通过简单的命令与AI交互。它支持参数调整，用户可以控制图像的风格、比例、细节程度等。Midjourney定期更新模型，不断提升图像质量和多样性。对于设计师、艺术家、创意工作者和内容创作者来说，Midjourney是一个激发创意、辅助设计的强大工具。",
    category: "AI",
    tags: ["图像生成", "艺术", "创意"],
    rating: 4.8,
    featured: true,
    addedDate: "2025-08-05"
  },
  {
    id: "claude",
    url: "https://claude.ai",
    title: "Claude",
    description: "Anthropic开发的AI助手，专注于有用、无害和诚实的对话",
    detailedDescription: "Claude是由Anthropic开发的AI助手，以其自然的对话能力和负责任的回应而著称。它被设计为有用、无害和诚实，能够理解复杂指令并提供深思熟虑的回答。Claude擅长长文本处理，可以分析和总结大量内容，适合文档审阅和研究辅助。它支持多种语言，并能理解上下文，进行连贯的对话。Claude特别注重安全性和减少有害输出，适合需要可靠AI助手的专业环境。对于寻求高质量对话体验和内容创作支持的用户来说，Claude提供了平衡的智能和责任感。",
    category: "AI",
    tags: ["AI助手", "对话", "内容创作"],
    rating: 4.7,
    featured: false,
    addedDate: "2025-08-12"
  },
  {
    id: "perplexity",
    url: "https://www.perplexity.ai",
    title: "Perplexity AI",
    description: "AI驱动的搜索引擎，提供有来源的答案和实时信息",
    detailedDescription: "Perplexity AI是一个创新的AI搜索引擎，结合了大语言模型和网络搜索功能，为用户提供有来源依据的答案。它不仅回答问题，还提供相关信息的链接和引用，增强可信度和透明度。Perplexity支持实时信息查询，能够获取最新的新闻和数据。它的对话式界面允许用户进行后续提问和澄清，实现连贯的信息探索体验。Perplexity还提供专业模式，针对学术研究和深度分析提供更详细的回答。对于需要快速获取可靠信息和深入研究特定主题的用户来说，Perplexity AI是传统搜索引擎的强大替代品。",
    category: "AI",
    tags: ["搜索", "信息", "研究"],
    rating: 4.6,
    featured: false,
    addedDate: "2025-08-12"
  },
  {
    id: "huggingface",
    url: "https://huggingface.co",
    title: "Hugging Face",
    description: "AI社区和模型库，提供开源机器学习工具和资源",
    detailedDescription: "Hugging Face是机器学习和人工智能领域的中心平台，提供开源模型、数据集和工具。它的模型中心包含数万个预训练模型，涵盖自然语言处理、计算机视觉、音频处理等多个领域。Hugging Face的Transformers库是NLP领域的标准工具，支持多种深度学习框架。平台提供Spaces功能，允许用户部署和分享AI应用演示。它还有活跃的社区和论坛，促进知识分享和协作。对于AI研究人员、开发者和学习者来说，Hugging Face是获取资源、分享成果和学习最新技术的重要平台。",
    category: "AI",
    tags: ["机器学习", "开源", "模型"],
    rating: 4.8,
    featured: false,
    addedDate: "2025-08-12"
  },
  {
    id: "stability",
    url: "https://stability.ai",
    title: "Stability AI",
    description: "开源AI图像生成技术的领导者，Stable Diffusion的创建者",
    detailedDescription: "Stability AI是开源人工智能的领导者，以开发Stable Diffusion模型而闻名，这是一个强大的文本到图像生成系统。公司致力于推动AI民主化，将先进技术提供给广大开发者和创作者。Stability AI的产品包括DreamStudio（用户友好的图像生成平台）和各种专业API服务。他们的模型支持多种创意应用，从艺术创作到产品设计。Stability AI积极与研究机构合作，推动AI技术的边界。对于希望利用最新图像生成技术的创意专业人士和开发者来说，Stability AI提供了强大而灵活的工具和资源。",
    category: "AI",
    tags: ["图像生成", "开源", "创意"],
    rating: 4.7,
    featured: false,
    addedDate: "2025-08-12"
  },
  {
    id: "runway",
    url: "https://runwayml.com",
    title: "Runway",
    description: "创意AI工具套件，用于视频编辑、生成和特效",
    detailedDescription: "Runway是一个面向创意专业人士的AI平台，提供视频编辑、生成和特效工具。它的Gen-2模型可以从文本或图像生成视频，创造前所未有的视觉内容。Runway的Magic Tools套件包括背景移除、物体擦除、画面扩展等功能，简化了复杂的视频编辑任务。它支持协作工作流程，团队成员可以共享项目和资源。Runway定期更新其AI模型，不断提升生成内容的质量和多样性。对于电影制作者、视频编辑、动画师和数字艺术家来说，Runway提供了革命性的创意工具，大幅提高工作效率和创作可能性。",
    category: "AI",
    tags: ["视频", "创意", "编辑"],
    rating: 4.6,
    featured: false,
    addedDate: "2025-08-12"
  },
  {
    id: "synthesia",
    url: "https://www.synthesia.io",
    title: "Synthesia",
    description: "AI视频生成平台，通过文本创建专业视频和虚拟人物",
    detailedDescription: "Synthesia是一个AI视频生成平台，允许用户通过简单的文本输入创建专业质量的视频内容。它提供多种虚拟人物（AI演示者），能够用自然的语音和表情传达信息。Synthesia支持多种语言和口音，使内容本地化变得简单。平台提供模板库和场景定制，用户可以根据需求调整视频风格和布局。Synthesia的企业版支持品牌定制和高级编辑功能。对于培训视频、营销内容、产品演示和教育材料的创作者来说，Synthesia大大降低了视频制作的成本和复杂度，同时保持专业质量。",
    category: "AI",
    tags: ["视频生成", "虚拟人物", "内容创作"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-12"
  },
  {
    id: "elevenlabs",
    url: "https://elevenlabs.io",
    title: "ElevenLabs",
    description: "AI语音生成和克隆平台，创建自然逼真的语音内容",
    detailedDescription: "ElevenLabs是一个先进的AI语音技术平台，提供超逼真的文本转语音和语音克隆功能。它的语音合成技术能够生成带有自然情感和语调变化的语音，几乎无法与人类语音区分。ElevenLabs支持多种语言和口音，适合全球内容创作。平台提供语音库，用户可以选择不同风格和特点的预设声音。它的语音克隆功能允许用户从短音频样本创建个性化语音模型。ElevenLabs适用于有声读物、播客、视频配音、游戏角色和虚拟助手等多种应用场景。对于需要高质量语音内容的创作者和企业来说，ElevenLabs提供了突破性的AI语音解决方案。",
    category: "AI",
    tags: ["语音", "配音", "文本转语音"],
    rating: 4.7,
    featured: false,
    addedDate: "2025-08-12"
  },
  {
    id: "anthropic",
    url: "https://www.anthropic.com",
    title: "Anthropic",
    description: "开发Claude AI助手的公司，专注于AI安全和研究",
    detailedDescription: "Anthropic是一家AI研究公司，致力于开发可靠、可解释和可控的AI系统。公司由前OpenAI研究人员创立，专注于AI安全和负责任的AI发展。Anthropic的旗舰产品是Claude AI助手，以其自然对话能力和安全性能而著称。公司采用'宪法AI'方法，通过人类反馈和明确的价值观指导AI行为。Anthropic积极参与AI安全研究，发表关于AI风险评估和缓解的学术论文。对于关注AI发展方向和寻求负责任AI解决方案的组织和个人来说，Anthropic代表了以安全和人类价值为中心的AI创新方向。",
    category: "AI",
    tags: ["AI研究", "安全", "对话系统"],
    rating: 4.6,
    featured: false,
    addedDate: "2025-08-12"
  },
  
  // 开发类网站
  {
    id: "github",
    url: "https://github.com",
    title: "GitHub",
    description: "全球最大的代码托管平台，支持Git版本控制和协作开发",
    detailedDescription: "GitHub是全球最大的代码托管和协作开发平台，为超过8300万开发者提供服务。它基于Git版本控制系统，提供代码仓库托管、分支管理、代码审查和项目管理功能。GitHub的核心特性包括Issues（问题跟踪）、Pull Requests（代码审查和合并）、Actions（自动化工作流）和Pages（静态网站托管）。平台支持开源社区发展，同时为企业提供私有仓库和团队协作工具。GitHub已成为现代软件开发的中心枢纽，不仅用于代码管理，还用于文档共享、项目规划和社区建设。对于开发者来说，GitHub既是技术工具，也是展示作品和参与开源项目的社交平台。",
    category: "开发",
    tags: ["代码托管", "Git", "协作"],
    rating: 5,
    featured: true,
    addedDate: "2025-08-05"
  },
  {
    id: "stackoverflow",
    url: "https://stackoverflow.com",
    title: "Stack Overflow",
    description: "程序员问答社区，解决编程问题的最大资源库",
    detailedDescription: "Stack Overflow是全球最大的程序员问答社区，每月有超过1亿访问者。平台采用问答形式，用户可以提问、回答问题，并通过投票系统突出最有价值的内容。Stack Overflow的声誉系统鼓励高质量的贡献，用户通过有用的回答和问题获得声誉点数和徽章。网站涵盖几乎所有编程语言、框架和技术问题，成为开发者解决技术难题的首选资源。除了技术问答，Stack Overflow还提供开发者调查、工作板块和团队协作版本。对于从初学者到专业开发者的所有技术人员来说，Stack Overflow是学习、解决问题和分享知识的重要平台。",
    category: "开发",
    tags: ["问答", "社区", "编程"],
    rating: 4.9,
    featured: true,
    addedDate: "2025-08-05"
  },
  {
    id: "vercel",
    url: "https://vercel.com",
    title: "Vercel",
    description: "前端开发和部署平台，专为现代Web应用优化",
    detailedDescription: "Vercel是一个为前端开发者设计的云平台，专注于提供无缝的开发、预览和部署体验。它为Next.js、React、Vue等现代框架提供优化的托管环境，自动处理构建过程和全球CDN分发。Vercel的预览部署功能为每个Git提交自动生成唯一URL，便于团队审查和测试变更。平台提供无服务器函数支持，允许开发者创建API端点而无需管理服务器。Vercel的分析工具提供性能监控和用户体验数据。对于追求高性能、现代化开发流程的前端团队来说，Vercel提供了从开发到部署的完整解决方案，大大简化了工作流程。",
    category: "开发",
    tags: ["前端", "部署", "托管"],
    rating: 4.8,
    featured: false,
    addedDate: "2025-08-12"
  },
  {
    id: "netlify",
    url: "https://www.netlify.com",
    title: "Netlify",
    description: "现代网站开发和托管平台，自动化部署流程",
    detailedDescription: "Netlify是一个面向现代web项目的开发和托管平台，提供从本地开发到全球部署的完整工作流。它与Git仓库直接集成，实现持续部署，每次代码推送后自动构建和发布网站。Netlify的边缘网络确保全球快速加载，内置CDN和自动HTTPS加密保障性能和安全。平台提供丰富的功能，包括表单处理、身份验证、无服务器函数和大型媒体优化。Netlify还支持分支部署和预览URL，便于团队协作和测试。对于静态网站、JAMstack应用和前端项目，Netlify提供了简单而强大的托管解决方案，使开发者能够专注于代码而非基础设施。",
    category: "开发",
    tags: ["托管", "静态网站", "JAMstack"],
    rating: 4.7,
    featured: false,
    addedDate: "2025-08-12"
  },
  {
    id: "codepen",
    url: "https://codepen.io",
    title: "CodePen",
    description: "在线代码编辑器和社区，专注于前端开发",
    detailedDescription: "CodePen是一个面向前端开发者的在线代码编辑器和社交开发环境。它允许用户在浏览器中编写HTML、CSS和JavaScript代码，并实时预览结果。CodePen的核心功能是Pen（代码片段），用户可以创建、保存和分享自己的前端作品。平台支持预处理器（如Sass、LESS、TypeScript）和流行框架（如React、Vue、Angular）。CodePen的社区功能丰富，用户可以关注他人、收藏作品、参与挑战和探索精选内容。对于前端开发者来说，CodePen既是学习和实验的工具，也是展示创意和寻找灵感的平台，特别适合原型设计、概念验证和技术分享。",
    category: "开发",
    tags: ["编辑器", "前端", "社区"],
    rating: 4.7,
    featured: false,
    addedDate: "2025-08-12"
  },
  {
    id: "replit",
    url: "https://replit.com",
    title: "Replit",
    description: "在线IDE和协作编码平台，支持多种编程语言",
    detailedDescription: "Replit是一个功能强大的在线集成开发环境(IDE)，支持超过50种编程语言，从Python、JavaScript到C++、Java等。它提供完整的开发环境，包括代码编辑器、文件系统、终端和版本控制，全部在浏览器中运行，无需本地安装。Replit的实时协作功能允许多人同时编辑同一个项目，类似Google Docs的体验。平台内置了部署功能，用户可以一键托管web应用和API。Replit还提供教育工具，支持课堂管理和作业分发。对于学生、教师、远程团队和希望快速原型开发的程序员来说，Replit提供了便捷、强大且无需配置的编码环境。",
    category: "开发",
    tags: ["IDE", "协作", "云开发"],
    rating: 4.6,
    featured: false,
    addedDate: "2025-08-12"
  },
  {
    id: "devto",
    url: "https://dev.to",
    title: "DEV Community",
    description: "开发者社区平台，分享文章、讨论和最佳实践",
    detailedDescription: "DEV Community (dev.to) 是一个开放、包容的开发者社区平台，专注于技术内容分享和讨论。它采用博客风格，允许开发者发布文章、教程、经验分享和职业建议。平台支持Markdown编写，集成了代码高亮和嵌入功能。DEV的互动功能包括评论、点赞、收藏和关注，促进社区参与。它的标签系统帮助用户发现特定技术领域的内容，如JavaScript、Python、Web开发等。DEV强调积极、支持性的社区文化，欢迎各级开发者参与。对于希望分享知识、学习新技术或与同行交流的开发者来说，DEV提供了一个友好、专业的在线社区空间。",
    category: "开发",
    tags: ["社区", "博客", "技术文章"],
    rating: 4.6,
    featured: false,
    addedDate: "2025-08-12"
  },
  {
    id: "digitalocean",
    url: "https://www.digitalocean.com",
    title: "DigitalOcean",
    description: "简单易用的云服务平台，专为开发者设计",
    detailedDescription: "DigitalOcean是一个面向开发者的云计算平台，以其简单性和可预测的定价而著称。它提供虚拟服务器（Droplets）、托管Kubernetes、托管数据库、对象存储和负载均衡器等核心云服务。DigitalOcean的控制面板直观易用，新用户可以在几分钟内启动服务器和部署应用。平台的文档和教程库（Community）是业内最全面的技术资源之一，涵盖各种开发和系统管理主题。DigitalOcean特别适合中小型企业、初创公司和个人开发者，提供了AWS和Azure等大型云服务的简化替代方案。对于需要可靠、易于管理且价格透明的云基础设施的开发团队来说，DigitalOcean是一个理想的选择。",
    category: "开发",
    tags: ["云服务", "服务器", "基础设施"],
    rating: 4.7,
    featured: false,
    addedDate: "2025-08-12"
  },
  {
    id: "hashnode",
    url: "https://hashnode.com",
    title: "Hashnode",
    description: "开发者博客平台，支持个人技术博客和社区互动",
    detailedDescription: "Hashnode是一个为开发者设计的现代博客平台，允许用户创建个人技术博客，同时保持对内容的完全所有权。它支持自定义域名，博客内容可以映射到用户自己的域名下，而不是子域名。Hashnode的编辑器支持Markdown、代码高亮和嵌入媒体，提供流畅的写作体验。平台内置了开发者社区，文章可以在个人博客和社区feed中同时展示，增加曝光度。Hashnode的货币化功能允许作者通过赞助和会员订阅获得收入。它还提供分析工具，帮助博主了解读者行为和文章表现。对于希望建立个人品牌、分享技术知识并与同行交流的开发者来说，Hashnode提供了一个专业、无广告的博客解决方案。",
    category: "开发",
    tags: ["博客", "写作", "社区"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-12"
  },
  {
    id: "glitch",
    url: "https://glitch.com",
    title: "Glitch",
    description: "创意应用开发和托管平台，强调简单性和协作",
    detailedDescription: "Glitch是一个创新的web应用开发和托管平台，专注于简化创建过程和促进协作。它提供浏览器内编码环境，支持HTML、CSS、JavaScript和Node.js等技术。Glitch的特色是即时部署，代码更改会立即生效并在线可访问，无需手动部署步骤。平台支持实时协作，多人可以同时编辑项目，类似Google Docs的体验。Glitch鼓励代码重用和学习，用户可以查看、复制和修改公开项目。它还提供简单的数据库集成、环境变量管理和HTTPS支持。对于原型开发、教学演示、API实验和小型web应用，Glitch提供了一个低门槛、高效率的开发环境，特别适合初学者和快速创意实现。",
    category: "开发",
    tags: ["web开发", "协作", "托管"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-12"
  },
  
  // 娱乐类网站
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
    detailedDescription: "抖音是中国领先的短视频平台，由字节跳动开发运营，以其算法推荐和创意短视频内容而闻名。平台支持15秒至几分钟不等的视频创作，内容涵盖舞蹈、美食、旅游、教育、搞笑等多个领域。抖音的特色在于强大的视频编辑工具，用户可以添加音乐、特效、滤镜等元素，即使是普通用户也能创作出有趣的内容。平台的'挑战'功能鼓励用户参与特定主题的创作，形成病毒式传播。抖音还整合了直播和电商功能，创作者可以通过带货和打赏获得收入。作为中国最具影响力的社交媒体之一，抖音不仅是娱乐平台，也成为品牌营销和个人表达的重要渠道。",
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
    detailedDescription: "TikTok是抖音的国际版本，已成为全球最受欢迎的短视频平台之一，在150多个国家拥有超过10亿月活跃用户。平台以15秒至3分钟的短视频为主，内容涵盖舞蹈、挑战、教程、喜剧等多种形式。TikTok的核心是其强大的推荐算法，通过'For You Page'（推荐页）向用户展示个性化内容，使新创作者也有机会获得广泛曝光。平台的音乐库丰富，用户可以轻松使用流行歌曲创建视频。TikTok的趋势和挑战机制促进了内容的病毒式传播，经常影响流行文化和音乐排行榜。对于创作者、品牌和普通用户来说，TikTok提供了一个创意表达和发现新内容的平台，其影响力已超越娱乐领域，延伸到营销、教育和社会议题讨论。",
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
    detailedDescription: "微博是中国领先的社交媒体平台，由新浪公司开发运营，被称为'中国的Twitter'。平台允许用户发布短文本、图片、视频和直播内容，关注感兴趣的用户和话题。微博的特色是话题标签系统（#话题#），用户可以参与热门话题讨论，实时了解社会热点。平台汇集了大量名人、媒体和官方机构账号，成为信息传播和公共讨论的重要渠道。微博的超级话题和粉丝群功能强化了社区建设，用户可以围绕共同兴趣形成社群。平台还整合了电商、支付等功能，拓展了社交媒体的应用场景。作为中国互联网生态的重要组成部分，微博不仅是社交和娱乐平台，也是新闻传播、舆论形成和社会互动的重要空间。",
    category: "娱乐",
    tags: ["社交媒体", "资讯", "话题"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-12"
  },
  
  // 搜索类网站
  {
    id: "google",
    url: "https://www.google.com",
    title: "Google",
    description: "全球最大的搜索引擎，提供网页、图片、视频等多种搜索服务",
    detailedDescription: "Google是全球最受欢迎的搜索引擎，拥有超过90%的市场份额。它提供智能搜索算法，能够理解用户意图并提供最相关的搜索结果。除了基本的网页搜索，Google还提供图片搜索、视频搜索、新闻搜索、学术搜索等多种专业搜索服务。Google搜索具有强大的AI能力，支持语音搜索、图像识别搜索等先进功能。其搜索结果的准确性和相关性在业界处于领先地位，是互联网用户获取信息的主要入口。",
    category: "搜索",
    tags: ["搜索", "工具", "必备"],
    rating: 5,
    featured: true,
    addedDate: "2025-08-01",
    unchina: true
  },
  {
    id: "bing",
    url: "https://www.bing.com",
    title: "Bing",
    description: "微软推出的搜索引擎，提供网页、图片、视频搜索",
    detailedDescription: "Bing是微软开发的搜索引擎，是Google搜索的主要竞争对手。Bing以其独特的视觉设计和丰富的功能著称，包括每日更新的精美背景图片。在图片搜索方面，Bing表现尤为出色，提供高质量的图片搜索结果和智能图片识别功能。Bing还集成了Microsoft的AI技术，提供智能搜索建议和个性化搜索结果。对于Microsoft生态系统用户来说，Bing与Windows、Office等产品深度集成，提供无缝的搜索体验。",
    category: "搜索",
    tags: ["搜索", "微软", "图片"],
    rating: 4,
    featured: false,
    addedDate: "2025-08-01"
  },
  {
    id: "duckduckgo",
    url: "https://duckduckgo.com",
    title: "DuckDuckGo",
    description: "注重隐私保护的搜索引擎，不追踪用户数据",
    detailedDescription: "DuckDuckGo是一个以隐私保护为核心的搜索引擎，承诺不收集、不存储、不分享用户的个人信息。它不会追踪用户的搜索历史，不会创建用户档案，也不会根据个人数据提供个性化搜索结果。DuckDuckGo通过聚合多个搜索引擎的结果来提供搜索服务，同时保持用户隐私。它支持即时答案、图片搜索、视频搜索等功能，界面简洁易用。对于重视隐私的用户来说，DuckDuckGo是一个理想的选择，它证明了搜索引擎可以在保护用户隐私的同时提供高质量的搜索服务。",
    category: "搜索",
    tags: ["搜索", "隐私", "安全"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-01"
  },
  {
    id: "yandex",
    url: "https://yandex.com",
    title: "Yandex",
    description: "俄罗斯最大的搜索引擎，提供多语言搜索服务",
    detailedDescription: "Yandex是俄罗斯最大的搜索引擎，在俄语市场占据主导地位。它提供强大的俄语搜索能力，对俄语语法和语义有深入理解。Yandex不仅是一个搜索引擎，还是一个综合性的互联网服务平台，提供地图、翻译、新闻、邮箱等多种服务。在机器学习和技术创新方面，Yandex投入巨大，开发了先进的搜索算法和AI技术。对于需要俄语内容搜索或了解俄罗斯互联网生态的用户来说，Yandex是不可或缺的工具。",
    category: "搜索",
    tags: ["搜索", "俄语", "国际"],
    rating: 4,
    featured: false,
    addedDate: "2025-08-01"
  },
  {
    id: "searx",
    url: "https://searx.org",
    title: "SearX",
    description: "开源的元搜索引擎，聚合多个搜索引擎结果",
    detailedDescription: "SearX是一个开源的元搜索引擎，它聚合了来自Google、Bing、DuckDuckGo等多个搜索引擎的结果，为用户提供更全面的搜索结果。SearX注重隐私保护，不会追踪用户行为，也不会存储个人数据。用户可以自定义搜索源，选择特定的搜索引擎进行查询。SearX支持多种搜索类型，包括网页、图片、新闻、文件等。由于其开源特性，用户可以自己部署SearX实例，完全控制搜索环境和隐私保护级别。对于技术爱好者和隐私意识强的用户来说，SearX是一个理想的选择。",
    category: "搜索",
    tags: ["搜索", "开源", "隐私"],
    rating: 4,
    featured: false,
    addedDate: "2025-08-01"
  },

  // 娱乐类网站
  {
    id: "bilibili",
    url: "https://www.bilibili.com",
    title: "哔哩哔哩",
    description: "中国年轻人喜爱的视频弹幕网站，提供动画、游戏、音乐等内容",
    detailedDescription: "哔哩哔哩（B站）是中国领先的视频平台，以弹幕文化著称。它最初以动漫内容起家，现已发展成为涵盖游戏、音乐、科技、生活、教育等多元内容的综合性视频平台。B站的弹幕系统让观众可以实时互动，创造了独特的观看体验。平台拥有大量优质UP主，生产高质量的内容，涵盖从娱乐到教育的各个领域。B站还提供直播、会员服务、电商等多种功能，形成了完整的生态系统。对于中国年轻一代来说，B站不仅是娱乐平台，更是文化社区和学习平台。",
    category: "娱乐",
    tags: ["视频", "弹幕", "二次元"],
    rating: 4.5,
    featured: true,
    addedDate: "2025-08-02"
  },
  {
    id: "youtube",
    url: "https://www.youtube.com",
    title: "YouTube",
    description: "全球最大的视频分享平台，用户可以上传、观看和分享视频",
    detailedDescription: "YouTube是全球最大的视频分享平台，拥有超过20亿月活跃用户。它允许任何人上传、观看和分享视频内容，从个人vlog到专业制作的内容应有尽有。YouTube的推荐算法非常强大，能够根据用户兴趣提供个性化内容推荐。平台支持多种视频格式，包括4K、HDR等高质量内容。YouTube还提供YouTube Premium订阅服务，去除广告并提供离线观看功能。对于内容创作者来说，YouTube提供了完善的创作工具和盈利机制，是全球最重要的内容创作平台之一。",
    category: "娱乐",
    tags: ["视频", "分享", "全球"],
    rating: 5,
    featured: true,
    addedDate: "2025-08-02",
    unchina: true
  },
  {
    id: "netflix",
    url: "https://www.netflix.com",
    title: "Netflix",
    description: "全球领先的流媒体服务平台，提供电影、电视剧等内容",
    detailedDescription: "Netflix是全球领先的流媒体服务平台，彻底改变了人们观看电影和电视剧的方式。它提供大量原创内容和授权内容，涵盖各种类型和语言。Netflix的推荐系统基于用户观看历史和偏好，提供个性化的内容推荐。平台支持多种设备，包括智能电视、手机、平板等，并提供离线下载功能。Netflix的原创内容制作精良，包括《纸牌屋》、《怪奇物语》等热门剧集，在影视行业产生了重大影响。对于追求高质量娱乐内容的用户来说，Netflix是不可或缺的选择。",
    category: "娱乐",
    tags: ["流媒体", "电影", "电视剧"],
    rating: 4.5,
    featured: true,
    addedDate: "2025-08-02",
    unchina: true
  },
  {
    id: "spotify",
    url: "https://www.spotify.com",
    title: "Spotify",
    description: "全球最大的音乐流媒体平台，提供海量音乐资源",
    detailedDescription: "Spotify是全球最大的音乐流媒体平台，拥有超过8000万首歌曲和播客内容。它提供免费和付费两种服务模式，付费用户享受无广告、离线下载、高音质等特权。Spotify的推荐算法非常精准，能够根据用户听歌习惯推荐相似音乐。平台支持创建和分享播放列表，用户可以发现新的音乐和艺术家。Spotify还提供播客服务，涵盖各种主题和内容。对于音乐爱好者来说，Spotify提供了便捷的音乐发现和聆听体验，是数字音乐时代的代表性平台。",
    category: "娱乐",
    tags: ["音乐", "流媒体", "播放列表"],
    rating: 4.5,
    featured: true,
    addedDate: "2025-08-02",
    unchina: true
  },
  {
    id: "twitch",
    url: "https://www.twitch.tv",
    title: "Twitch",
    description: "全球最大的游戏直播平台，观看和直播游戏内容",
    detailedDescription: "Twitch是全球最大的游戏直播平台，专注于游戏内容的直播和观看。它允许游戏玩家实时直播他们的游戏过程，观众可以观看、聊天和互动。Twitch不仅限于游戏，还涵盖创意内容、音乐、聊天等多元化内容。平台提供强大的互动功能，包括实时聊天、表情符号、订阅、捐赠等。Twitch的合作伙伴计划为优秀主播提供收入分成和额外功能。对于游戏玩家和内容创作者来说，Twitch是展示技能、建立社区、获得收入的重要平台。它已经成为游戏文化的重要组成部分，推动了电子竞技和游戏直播行业的发展。",
    category: "娱乐",
    tags: ["直播", "游戏", "互动"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-02",
    unchina: true
  },
  {
    id: "tiktok",
    url: "https://www.tiktok.com",
    title: "TikTok",
    description: "短视频社交平台，用户可以创作和分享短视频内容",
    detailedDescription: "TikTok是全球最受欢迎的短视频社交平台，专注于15秒到3分钟的短视频内容。它提供丰富的音乐库、滤镜、特效和编辑工具，让用户可以轻松创作有趣的短视频。TikTok的推荐算法非常精准，能够根据用户兴趣推送相关内容。平台涵盖各种内容类型，包括娱乐、教育、美食、旅行、舞蹈等。TikTok的挑战和趋势功能让内容更容易传播，用户可以参与热门话题和挑战。对于内容创作者来说，TikTok提供了快速获得关注和粉丝的机会。它已经成为年轻一代表达创意、分享生活、发现新内容的重要平台。",
    category: "娱乐",
    tags: ["短视频", "社交", "创作"],
    rating: 4,
    featured: false,
    addedDate: "2025-08-02",
    unchina: true
  },
  {
    id: "douyin",
    url: "https://www.douyin.com",
    title: "抖音",
    description: "中国最受欢迎的短视频平台，提供丰富的短视频内容",
    category: "娱乐",
    tags: ["短视频", "中国", "娱乐"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-02"
  },
  {
    id: "iqiyi",
    url: "https://www.iqiyi.com",
    title: "爱奇艺",
    description: "中国领先的在线视频平台，提供电影、电视剧、综艺等内容",
    
    category: "娱乐",
    tags: ["视频", "中国", "影视"],
    rating: 4,
    featured: false,
    addedDate: "2025-08-02"
  },
  {
    id: "youku",
    url: "https://www.youku.com",
    title: "优酷",
    description: "中国知名视频网站，提供电影、电视剧、动漫等视频内容",
    
    category: "娱乐",
    tags: ["视频", "中国", "综合"],
    rating: 4,
    featured: false,
    addedDate: "2025-08-02"
  },
  {
    id: "steam",
    url: "https://store.steampowered.com",
    title: "Steam",
    description: "全球最大的PC游戏数字发行平台",
    detailedDescription: "Steam是Valve公司开发的全球最大PC游戏数字发行平台，拥有超过3万款游戏。它提供游戏购买、下载、更新、社交等一站式服务。Steam的社区功能强大，用户可以评价游戏、分享截图、参与讨论。平台经常举办大型促销活动，如夏季特卖、冬季特卖等，提供大幅折扣。Steam还支持云存档、成就系统、好友系统等功能，为玩家提供完整的游戏体验。对于PC游戏玩家来说，Steam是购买和管理游戏的主要平台，几乎涵盖了所有主流PC游戏。",
    category: "娱乐",
    tags: ["游戏", "PC", "数字发行"],
    rating: 5,
    featured: true,
    addedDate: "2025-08-02"
  },

  // AI类网站
  {
    id: "chatgpt",
    url: "https://chat.openai.com",
    title: "ChatGPT",
    description: "OpenAI开发的AI聊天机器人，能够进行自然语言对话",
    detailedDescription: "ChatGPT是由OpenAI开发的大型语言模型，基于GPT（生成式预训练变换器）技术。它能够进行自然语言对话，回答各种问题，协助写作、编程、分析等任务。ChatGPT具有强大的语言理解能力，能够处理复杂的对话上下文，提供连贯和有意义的回答。它支持多种语言，可以用于学习、工作、创作等多种场景。ChatGPT的免费版本已经足够强大，而付费的Plus版本提供更快的响应速度和更高级的功能。作为AI领域的代表性产品，ChatGPT推动了AI技术的普及和应用。",
    category: "AI",
    tags: ["AI", "聊天", "OpenAI"],
    rating: 5,
    featured: true,
    addedDate: "2025-08-03",
    unchina: true
  },
  {
    id: "claude",
    url: "https://claude.ai",
    title: "Claude",
    description: "Anthropic开发的AI助手，擅长对话和文本处理",
    detailedDescription: "Claude是由Anthropic开发的AI助手，基于Constitutional AI技术，注重安全性和有用性。Claude在文本处理、分析、写作等方面表现出色，能够处理长文档和复杂任务。它特别擅长学术写作、代码分析、文档总结等专业任务。Claude的设计理念强调AI的安全性，通过宪法训练确保AI行为符合人类价值观。它提供免费和付费版本，付费版本支持更长的对话和更高级的功能。对于需要高质量文本处理和分析的用户来说，Claude是一个可靠的选择。",
    category: "AI",
    tags: ["AI", "助手", "Anthropic"],
    rating: 4.5,
    featured: true,
    addedDate: "2025-08-03",
    unchina: true
  },
  {
    id: "midjourney",
    url: "https://www.midjourney.com",
    title: "Midjourney",
    description: "AI图像生成工具，通过文本描述生成艺术作品",
    detailedDescription: "Midjourney是一个基于AI的图像生成工具，通过文本描述创建高质量的艺术作品。它使用先进的扩散模型技术，能够生成具有艺术感的图像，特别擅长艺术风格、概念设计和创意表达。Midjourney通过Discord机器人提供服务，用户可以在Discord频道中与机器人交互来生成图像。它支持多种艺术风格，从写实到抽象，从古典到现代。Midjourney在艺术创作、设计、概念可视化等领域广受欢迎，为创作者提供了强大的视觉表达工具。",
    category: "AI",
    tags: ["AI", "图像生成", "艺术"],
    rating: 4.5,
    featured: true,
    addedDate: "2025-08-03",
    unchina: true
  },
  {
    id: "stable-diffusion",
    url: "https://stability.ai",
    title: "Stable Diffusion",
    description: "开源的AI图像生成模型，可以根据文本生成图像",
    detailedDescription: "Stable Diffusion是一个开源的AI图像生成模型，由Stability AI开发。它使用扩散模型技术，能够根据文本描述生成高质量的图像。Stable Diffusion的独特之处在于其开源特性，任何人都可以下载、修改和部署自己的版本。它支持多种图像生成模式，包括文本到图像、图像到图像、图像修复等。Stable Diffusion在艺术创作、设计、概念可视化等领域广受欢迎。由于其开源性质，社区开发了大量插件和工具，扩展了其功能。对于开发者、艺术家和研究人员来说，Stable Diffusion提供了探索AI图像生成技术的理想平台。",
    category: "AI",
    tags: ["AI", "图像生成", "开源"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-03",
    unchina: true
  },
  {
    id: "copilot",
    url: "https://copilot.microsoft.com",
    title: "Microsoft Copilot",
    description: "微软的AI助手，集成在多个微软产品中",
    
    category: "AI",
    tags: ["AI", "微软", "助手"],
    rating: 4,
    featured: false,
    addedDate: "2025-08-03"
  },
  {
    id: "bard",
    url: "https://bard.google.com",
    title: "Google Bard",
    description: "Google开发的AI聊天机器人，基于LaMDA技术",
    
    category: "AI",
    tags: ["AI", "Google", "聊天"],
    rating: 4,
    featured: false,
    addedDate: "2025-08-03",
    unchina: true
  },
  {
    id: "huggingface",
    url: "https://huggingface.co",
    title: "Hugging Face",
    description: "AI模型和数据集的开源社区平台",
    
    category: "AI",
    tags: ["AI", "开源", "模型"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-03",
    unchina: true
  },
  {
    id: "runway",
    url: "https://runwayml.com",
    title: "Runway",
    description: "AI视频和图像编辑工具，提供多种创意AI功能",
    
    category: "AI",
    tags: ["AI", "视频编辑", "创意"],
    rating: 4,
    featured: false,
    addedDate: "2025-08-03",
    unchina: true
  },
  {
    id: "character-ai",
    url: "https://character.ai",
    title: "Character.AI",
    description: "与AI角色对话的平台，可以创建和聊天各种AI角色",
    
    category: "AI",
    tags: ["AI", "角色", "对话"],
    rating: 4,
    featured: false,
    addedDate: "2025-08-03",
    unchina: true
  },
  {
    id: "perplexity",
    url: "https://www.perplexity.ai",
    title: "Perplexity",
    description: "AI搜索引擎，提供准确的答案和引用来源",
    
    category: "AI",
    tags: ["AI", "搜索", "问答"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-03",
    unchina: true
  },

  // 评价类网站
  {
    id: "douban",
    url: "https://www.douban.com",
    title: "豆瓣",
    description: "中国最大的文化社区网站，提供图书、电影、音乐等评论和推荐",
    detailedDescription: "豆瓣是中国最大的文化社区网站，专注于图书、电影、音乐等文化内容的评价和推荐。它采用用户评分和评论系统，为每个作品提供详细的用户反馈。豆瓣的推荐算法基于用户兴趣和评分历史，能够提供个性化的内容推荐。平台还提供丰富的文化资讯、书单、影单等内容，帮助用户发现新的文化作品。豆瓣的社区功能强大，用户可以加入各种兴趣小组，参与文化讨论。对于中国文化爱好者来说，豆瓣是发现和评价文化作品的重要平台，拥有高质量的用户群体和内容。",
    category: "评价",
    tags: ["评论", "文化", "社区"],
    rating: 4.5,
    featured: true,
    addedDate: "2025-08-03"
  },
  {
    id: "imdb",
    url: "https://www.imdb.com",
    title: "IMDb",
    description: "全球最大的电影数据库，提供电影评分和详细信息",
    detailedDescription: "IMDb（Internet Movie Database）是全球最大的电影数据库，拥有超过800万部电影、电视剧和视频游戏的详细信息。它提供演员、导演、编剧等电影从业者的完整资料，以及电影的制作信息、票房数据、获奖记录等。IMDb的用户评分系统非常权威，被广泛用作电影质量的参考标准。平台还提供电影新闻、预告片、用户评论等内容。IMDb的搜索和筛选功能强大，用户可以按类型、年份、评分等条件查找电影。对于电影爱好者来说，IMDb是了解电影信息、发现新作品、参与电影讨论的重要平台。",
    category: "评价",
    tags: ["电影", "评分", "数据库"],
    rating: 5,
    featured: true,
    addedDate: "2025-08-04",
    unchina: true
  },
  {
    id: "rottentomatoes",
    url: "https://www.rottentomatoes.com",
    title: "Rotten Tomatoes",
    description: "知名电影评论聚合网站，提供专业和观众评分",
    
    category: "评价",
    tags: ["电影", "评论", "评分"],
    rating: 4,
    featured: false,
    addedDate: "2025-08-04",
    unchina: true
  },
  {
    id: "metacritic",
    url: "https://www.metacritic.com",
    title: "Metacritic",
    description: "综合评分网站，涵盖电影、游戏、音乐等多个领域",
    
    category: "评价",
    tags: ["评分", "综合", "媒体"],
    rating: 4,
    featured: false,
    addedDate: "2025-08-04",
    unchina: true
  },
  {
    id: "goodreads",
    url: "https://www.goodreads.com",
    title: "Goodreads",
    description: "全球最大的图书社区，用户可以评价和推荐图书",
    
    category: "评价",
    tags: ["图书", "阅读", "社区"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-04",
    unchina: true
  },
  {
    id: "yelp",
    url: "https://www.yelp.com",
    title: "Yelp",
    description: "本地商家评价平台，用户可以查看和发布商家评论",
    
    category: "评价",
    tags: ["商家", "本地", "评论"],
    rating: 4,
    featured: false,
    addedDate: "2025-08-04",
    unchina: true
  },
  {
    id: "dianping",
    url: "https://www.dianping.com",
    title: "大众点评",
    description: "中国领先的本地生活信息及交易平台",
    
    category: "评价",
    tags: ["本地", "生活", "评价"],
    rating: 4,
    featured: false,
    addedDate: "2025-08-04"
  },
  {
    id: "tripadvisor",
    url: "https://www.tripadvisor.com",
    title: "TripAdvisor",
    description: "全球最大的旅游评价网站，提供酒店、景点等评价",
    
    category: "评价",
    tags: ["旅游", "酒店", "评价"],
    rating: 4,
    featured: false,
    addedDate: "2025-08-04"
  },
  {
    id: "glassdoor",
    url: "https://www.glassdoor.com",
    title: "Glassdoor",
    description: "职场评价网站，员工可以匿名评价公司和薪资",
    
    category: "评价",
    tags: ["职场", "公司", "薪资"],
    rating: 4,
    featured: false,
    addedDate: "2025-08-04"
  },
  {
    id: "zhipin",
    url: "https://www.zhipin.com",
    title: "BOSS直聘",
    description: "中国知名招聘网站，提供职位信息和公司评价",
    
    category: "评价",
    tags: ["招聘", "职场", "中国"],
    rating: 4,
    featured: false,
    addedDate: "2025-08-04"
  },

  // 工具类网站
  {
    id: "notion",
    url: "https://www.notion.so",
    title: "Notion",
    description: "全能的工作空间，集笔记、数据库、项目管理于一体",
    detailedDescription: "Notion是一个全能的工作空间平台，将笔记、数据库、项目管理、知识库等功能整合在一个应用中。它采用块级编辑系统，用户可以自由组合各种内容块，创建个性化的页面和数据库。Notion支持团队协作，多人可以同时编辑和评论。它提供丰富的模板库，涵盖个人管理、团队协作、项目管理等各种场景。Notion的数据库功能强大，支持多种视图和关联关系，可以构建复杂的信息管理系统。对于个人用户和团队来说，Notion是一个灵活且强大的生产力工具。",
    category: "工具",
    tags: ["笔记", "协作", "生产力"],
    rating: 4.5,
    featured: true,
    addedDate: "2025-08-05"
  },
  {
    id: "figma",
    url: "https://www.figma.com",
    title: "Figma",
    description: "基于浏览器的协作式界面设计工具",
    detailedDescription: "Figma是一个基于浏览器的协作式设计工具，专门用于UI/UX设计。它支持实时协作，多个设计师可以同时编辑同一个设计文件，大大提高了团队协作效率。Figma提供强大的设计系统功能，支持组件库、样式管理和设计规范。它的原型功能允许设计师创建交互式原型，进行用户测试和演示。Figma还提供丰富的插件生态系统，扩展了工具的功能。对于设计团队来说，Figma已经成为行业标准，特别是在远程协作和设计系统管理方面表现出色。",
    category: "工具",
    tags: ["设计", "协作", "UI/UX"],
    rating: 5,
    featured: true,
    addedDate: "2025-08-05"
  },
  {
    id: "canva",
    url: "https://www.canva.com",
    title: "Canva",
    description: "在线图形设计平台，提供丰富的设计模板",
    detailedDescription: "Canva是一个在线图形设计平台，让任何人都能轻松创建专业级的设计作品。它提供数万个精美的模板，涵盖社交媒体、海报、名片、演示文稿等各种设计需求。Canva的拖拽式编辑器非常直观，即使没有设计经验的用户也能快速上手。它支持团队协作，多人可以共同编辑设计项目。Canva还提供丰富的素材库，包括图片、图标、字体等。对于小型企业、营销人员和内容创作者来说，Canva是一个经济实惠且功能强大的设计工具。",
    category: "工具",
    tags: ["设计", "模板", "图形"],
    rating: 4.5,
    featured: true,
    addedDate: "2025-08-05"
  },
  {
    id: "photopea",
    url: "https://www.photopea.com",
    title: "Photopea",
    description: "免费的在线图像编辑器，支持PSD等多种格式",
    detailedDescription: "Photopea是一个功能强大的免费在线图像编辑器，界面和功能与Adobe Photoshop非常相似。它支持多种文件格式，包括PSD、AI、XD、Sketch等专业设计文件格式，让用户可以在浏览器中直接编辑这些文件。Photopea提供图层、蒙版、滤镜、调整等专业图像编辑功能，支持智能对象、矢量图形等高级特性。它完全免费使用，无需注册，所有功能都可以直接使用。对于需要专业图像编辑功能但不想购买昂贵软件的用户来说，Photopea是一个理想的选择。",
    category: "工具",
    tags: ["图像编辑", "免费", "在线"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-05"
  },
  {
    id: "remove-bg",
    url: "https://www.remove.bg",
    title: "Remove.bg",
    description: "AI驱动的背景移除工具，一键去除图片背景",
    detailedDescription: "Remove.bg是一个基于AI技术的在线背景移除工具，能够自动识别前景对象并移除背景。它使用先进的机器学习算法，可以处理各种复杂的图像，包括人物、产品、动物等。Remove.bg的操作非常简单，用户只需上传图片，AI就会自动处理并生成透明背景的图片。它支持多种输出格式，包括PNG、JPG等。免费版本有一些限制，付费版本提供更高分辨率和批量处理功能。对于电商、设计师、摄影师等需要处理产品图片的用户来说，Remove.bg大大提高了工作效率。",
    category: "工具",
    tags: ["图像处理", "AI", "背景移除"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-05"
  },
  {
    id: "tinypng",
    url: "https://tinypng.com",
    title: "TinyPNG",
    description: "在线图片压缩工具，减小文件大小同时保持质量",
    detailedDescription: "TinyPNG是一个专业的在线图片压缩工具，专门用于压缩PNG和JPEG格式的图片。它使用智能的压缩算法，能够显著减小图片文件大小，同时保持视觉质量。TinyPNG支持批量上传，一次可以处理多张图片，大大提高了工作效率。它提供拖拽上传功能，界面简洁易用。TinyPNG的压缩是无损的，不会影响图片的透明度和其他重要特性。对于网站开发者、设计师和内容创作者来说，TinyPNG是优化网站性能、减少加载时间的重要工具。它特别适合需要大量图片处理的场景。",
    category: "工具",
    tags: ["图片压缩", "优化", "在线"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-05"
  },
  {
    id: "convertio",
    url: "https://convertio.co",
    title: "Convertio",
    description: "在线文件转换工具，支持300多种文件格式",
    
    category: "工具",
    tags: ["文件转换", "格式", "在线"],
    rating: 4,
    featured: false,
    addedDate: "2025-08-05"
  },
  {
    id: "wetransfer",
    url: "https://wetransfer.com",
    title: "WeTransfer",
    description: "简单易用的大文件传输服务",
    
    category: "工具",
    tags: ["文件传输", "分享", "大文件"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-05"
  },
  {
    id: "speedtest",
    url: "https://www.speedtest.net",
    title: "Speedtest",
    description: "测试网络速度的权威工具",
    
    category: "工具",
    tags: ["网速测试", "网络", "诊断"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-05"
  },
  {
    id: "downdetector",
    url: "https://downdetector.com",
    title: "Downdetector",
    description: "实时监控网站和服务的运行状态",
    
    category: "工具",
    tags: ["监控", "状态", "服务"],
    rating: 4,
    featured: false,
    addedDate: "2025-08-05"
  },
  {
    id: "qrcode-generator",
    url: "https://www.qr-code-generator.com",
    title: "QR Code Generator",
    description: "免费的二维码生成工具",
    
    category: "工具",
    tags: ["二维码", "生成", "免费"],
    rating: 4,
    featured: false,
    addedDate: "2025-08-05"
  },
  {
    id: "temp-mail",
    url: "https://temp-mail.org",
    title: "Temp Mail",
    description: "临时邮箱服务，保护隐私的一次性邮箱",
    
    category: "工具",
    tags: ["临时邮箱", "隐私", "一次性"],
    rating: 4,
    featured: false,
    addedDate: "2025-08-05"
  },
  {
    id: "have-i-been-pwned",
    url: "https://haveibeenpwned.com",
    title: "Have I Been Pwned",
    description: "检查邮箱是否在数据泄露事件中被泄露",
    
    category: "工具",
    tags: ["安全", "数据泄露", "检查"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-05"
  },
  {
    id: "password-generator",
    url: "https://passwordsgenerator.net",
    title: "Password Generator",
    description: "生成强密码的在线工具",
    
    category: "工具",
    tags: ["密码", "生成", "安全"],
    rating: 4,
    featured: false,
    addedDate: "2025-08-05"
  },
  {
    id: "regex101",
    url: "https://regex101.com",
    title: "Regex101",
    description: "在线正则表达式测试和调试工具",
    
    category: "工具",
    tags: ["正则表达式", "测试", "调试"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-05"
  },
  {
    id: "json-formatter",
    url: "https://jsonformatter.curiousconcept.com",
    title: "JSON Formatter",
    description: "在线JSON格式化和验证工具",
    
    category: "工具",
    tags: ["JSON", "格式化", "验证"],
    rating: 4,
    featured: false,
    addedDate: "2025-08-05"
  },
  {
    id: "codebeautify",
    url: "https://codebeautify.org",
    title: "Code Beautify",
    description: "代码格式化和各种在线工具集合",
    
    category: "工具",
    tags: ["代码格式化", "工具集", "开发"],
    rating: 4,
    featured: false,
    addedDate: "2025-08-05"
  },
  {
    id: "carbon",
    url: "https://carbon.now.sh",
    title: "Carbon",
    description: "创建美观的代码截图分享工具",
    detailedDescription: "Carbon是一个专门用于创建美观代码截图的在线工具，让开发者可以轻松制作专业的代码分享图片。它支持多种编程语言的语法高亮，提供丰富的主题和自定义选项。用户可以调整背景、字体、边距、阴影等视觉效果，创建个性化的代码截图。Carbon支持多种导出格式，包括PNG、SVG等，也可以直接分享链接。它提供拖拽上传功能，支持从文件或URL导入代码。对于开发者、技术博主和文档编写者来说，Carbon是创建高质量代码展示图片的理想工具，特别适合社交媒体分享和技术文档。",
    category: "工具",
    tags: ["代码截图", "分享", "美化"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-05"
  },
  {
    id: "excalidraw",
    url: "https://excalidraw.com",
    title: "Excalidraw",
    description: "开源的手绘风格图表绘制工具",
    detailedDescription: "Excalidraw是一个开源的在线绘图工具，采用手绘风格的设计，让图表看起来更加自然和友好。它支持多种图表类型，包括流程图、思维导图、线框图、架构图等。Excalidraw提供实时协作功能，多人可以同时编辑同一个图表。它支持导出为PNG、SVG等格式，也可以嵌入到其他应用中。Excalidraw的界面简洁直观，提供丰富的绘图工具和模板。由于其开源特性，用户可以自己部署或修改。对于产品经理、设计师、开发者和教育工作者来说，Excalidraw是创建和分享图表的理想工具。",
    category: "工具",
    tags: ["绘图", "图表", "手绘风格"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-05"
  },
  {
    id: "draw-io",
    url: "https://app.diagrams.net",
    title: "Draw.io",
    description: "免费的在线图表绘制工具",
    
    category: "工具",
    tags: ["图表", "流程图", "免费"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-05"
  },

  // 开发类网站
  {
    id: "github",
    url: "https://github.com",
    title: "GitHub",
    description: "全球最大的代码托管平台，为开发者提供Git仓库托管服务",
    detailedDescription: "GitHub是全球最大的代码托管平台，拥有超过1亿个代码仓库。它基于Git版本控制系统，为开发者提供代码托管、协作开发、项目管理等服务。GitHub支持公开和私有仓库，免费用户可以使用无限量的公开仓库。平台提供强大的协作功能，包括Pull Request、Issue跟踪、代码审查等。GitHub还集成了CI/CD、代码扫描、依赖管理等开发工具。对于开源项目，GitHub提供了完整的项目管理解决方案，包括Wiki、Projects、Discussions等。GitHub已经成为开发者社区的中心，是学习和参与开源项目的重要平台。",
    category: "开发",
    tags: ["代码", "开源", "Git"],
    rating: 5,
    featured: true,
    addedDate: "2025-08-01"
  },
  {
    id: "gitlab",
    url: "https://gitlab.com",
    title: "GitLab",
    description: "DevOps平台，提供Git仓库管理和CI/CD功能",
    
    category: "开发",
    tags: ["Git", "DevOps", "CI/CD"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-06"
  },
  {
    id: "bitbucket",
    url: "https://bitbucket.org",
    title: "Bitbucket",
    description: "Atlassian的Git代码管理解决方案",
    
    category: "开发",
    tags: ["Git", "Atlassian", "代码管理"],
    rating: 4,
    featured: false,
    addedDate: "2025-08-06"
  },
  {
    id: "stackoverflow",
    url: "https://stackoverflow.com",
    title: "Stack Overflow",
    description: "全球最大的程序员问答社区",
    detailedDescription: "Stack Overflow是全球最大的程序员问答社区，拥有超过2000万注册用户和数千万个问题。它采用问答模式，开发者可以提出问题并获得来自全球社区的解答。Stack Overflow的声誉系统鼓励高质量的回答，用户可以通过投票来评价问题和答案的质量。平台涵盖几乎所有编程语言和技术栈，从基础的编程概念到高级的技术问题都有覆盖。Stack Overflow还提供职业发展平台，包括工作机会、技能评估等。对于程序员来说，Stack Overflow是解决技术问题、学习新知识、展示专业能力的重要平台。",
    category: "开发",
    tags: ["问答", "编程", "社区"],
    rating: 5,
    featured: true,
    addedDate: "2025-08-06"
  },
  {
    id: "codepen",
    url: "https://codepen.io",
    title: "CodePen",
    description: "前端代码在线编辑和分享平台",
    detailedDescription: "CodePen是一个专门为前端开发者设计的在线代码编辑和分享平台。它支持HTML、CSS、JavaScript的实时编辑和预览，让开发者可以快速创建和测试前端代码片段。CodePen的界面简洁直观，支持多种预处理器和框架。用户可以创建公开或私有的代码片段，分享给其他开发者。平台还提供丰富的代码示例和模板，是学习前端技术的优秀资源。CodePen的社区功能强大，用户可以关注其他开发者、收藏喜欢的作品、参与讨论。对于前端开发者来说，CodePen是展示技能、学习新技术、快速原型开发的重要工具。",
    category: "开发",
    tags: ["前端", "在线编辑", "分享"],
    rating: 4.5,
    featured: true,
    addedDate: "2025-08-06"
  },
  {
    id: "jsfiddle",
    url: "https://jsfiddle.net",
    title: "JSFiddle",
    description: "在线JavaScript、HTML、CSS代码测试工具",
    
    category: "开发",
    tags: ["JavaScript", "在线测试", "前端"],
    rating: 4,
    featured: false,
    addedDate: "2025-08-06"
  },
  {
    id: "codesandbox",
    url: "https://codesandbox.io",
    title: "CodeSandbox",
    description: "在线代码编辑器，支持多种框架和库",
    
    category: "开发",
    tags: ["在线编辑", "框架", "协作"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-06"
  },
  {
    id: "replit",
    url: "https://replit.com",
    title: "Replit",
    description: "在线编程环境，支持多种编程语言",
    
    category: "开发",
    tags: ["在线编程", "多语言", "协作"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-06"
  },
  {
    id: "glitch",
    url: "https://glitch.com",
    title: "Glitch",
    description: "创建和部署Web应用的友好平台",
    
    category: "开发",
    tags: ["Web应用", "部署", "协作"],
    rating: 4,
    featured: false,
    addedDate: "2025-08-06"
  },
  {
    id: "netlify",
    url: "https://www.netlify.com",
    title: "Netlify",
    description: "现代Web项目的构建、部署和托管平台",
    
    category: "开发",
    tags: ["部署", "托管", "JAMstack"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-06"
  },
  {
    id: "vercel",
    url: "https://vercel.com",
    title: "Vercel",
    description: "前端框架和静态站点的部署平台",
    detailedDescription: "Vercel是一个专门为前端开发者设计的部署平台，特别适合React、Vue、Next.js等现代前端框架。它提供零配置的部署体验，只需连接Git仓库即可自动部署。Vercel的全球CDN网络确保网站的高速访问，支持自动HTTPS和自定义域名。它提供预览部署功能，每次提交都会生成一个预览链接，方便团队协作和测试。Vercel还支持无服务器函数，可以部署API端点。对于前端开发者和团队来说，Vercel简化了部署流程，提供了优秀的性能和开发体验，是现代前端开发的首选部署平台。",
    category: "开发",
    tags: ["部署", "前端", "静态站点"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-06"
  },
  {
    id: "heroku",
    url: "https://www.heroku.com",
    title: "Heroku",
    description: "云应用平台，支持多种编程语言",
    
    category: "开发",
    tags: ["云平台", "部署", "多语言"],
    rating: 4,
    featured: false,
    addedDate: "2025-08-06"
  },
  {
    id: "aws",
    url: "https://aws.amazon.com",
    title: "Amazon Web Services",
    description: "亚马逊的云计算服务平台",
    detailedDescription: "Amazon Web Services（AWS）是全球领先的云计算服务平台，提供200多种云服务，涵盖计算、存储、数据库、网络、安全、人工智能等领域。AWS的弹性计算云（EC2）允许用户租用虚拟服务器，简单存储服务（S3）提供可扩展的对象存储，Lambda支持无服务器计算。AWS在全球拥有多个数据中心，提供高可用性和低延迟的服务。它采用按需付费模式，用户只需为实际使用的资源付费。AWS还提供丰富的开发工具和SDK，支持多种编程语言。对于企业和开发者来说，AWS是构建和部署云应用的首选平台。",
    category: "开发",
    tags: ["云计算", "AWS", "基础设施"],
    rating: 5,
    featured: true,
    addedDate: "2025-08-06"
  },
  {
    id: "azure",
    url: "https://azure.microsoft.com",
    title: "Microsoft Azure",
    description: "微软的云计算平台和服务",
    
    category: "开发",
    tags: ["云计算", "微软", "企业"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-06"
  },
  {
    id: "gcp",
    url: "https://cloud.google.com",
    title: "Google Cloud Platform",
    description: "Google的云计算服务平台",
    
    category: "开发",
    tags: ["云计算", "Google", "机器学习"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-06"
  },
  {
    id: "docker",
    url: "https://www.docker.com",
    title: "Docker",
    description: "容器化平台，简化应用部署和管理",
    detailedDescription: "Docker是一个开源的容器化平台，允许开发者将应用程序及其依赖项打包到轻量级的容器中。Docker容器可以在任何支持Docker的环境中运行，确保应用在不同环境中的一致性。Docker使用镜像来创建容器，镜像包含了运行应用所需的所有文件和配置。它提供Docker Hub镜像仓库，用户可以分享和下载预构建的镜像。Docker Compose允许用户定义和运行多容器应用。对于开发者和运维团队来说，Docker简化了应用的开发、测试和部署流程，是现代软件开发和DevOps实践的重要工具。",
    category: "开发",
    tags: ["容器", "部署", "DevOps"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-06"
  },
  {
    id: "kubernetes",
    url: "https://kubernetes.io",
    title: "Kubernetes",
    description: "开源的容器编排平台",
    
    category: "开发",
    tags: ["容器编排", "开源", "云原生"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-06"
  },
  {
    id: "npm",
    url: "https://www.npmjs.com",
    title: "npm",
    description: "Node.js包管理器和JavaScript包仓库",
    
    category: "开发",
    tags: ["包管理", "JavaScript", "Node.js"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-06"
  },
  {
    id: "pypi",
    url: "https://pypi.org",
    title: "PyPI",
    description: "Python包索引，Python软件包的官方仓库",
    
    category: "开发",
    tags: ["Python", "包管理", "仓库"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-06"
  },
  {
    id: "maven",
    url: "https://mvnrepository.com",
    title: "Maven Repository",
    description: "Java项目的依赖管理和构建工具仓库",
    
    category: "开发",
    tags: ["Java", "Maven", "依赖管理"],
    rating: 4,
    featured: false,
    addedDate: "2025-08-06"
  },
  {
    id: "mdn",
    url: "https://developer.mozilla.org",
    title: "MDN Web Docs",
    description: "Mozilla开发者网络，Web技术文档和学习资源",
    detailedDescription: "MDN Web Docs（Mozilla Developer Network）是Web开发领域最权威的文档和学习资源平台。它提供HTML、CSS、JavaScript等Web技术的详细文档，包括API参考、教程、示例代码等。MDN的内容由Mozilla维护，质量高且更新及时，被全球开发者广泛使用。平台还提供Web开发的学习路径、最佳实践、兼容性信息等实用内容。MDN支持多语言，包括中文版本，方便不同地区的开发者使用。对于Web开发者来说，MDN是学习和查阅Web技术文档的首选平台，被誉为Web开发的圣经。",
    category: "开发",
    tags: ["文档", "Web技术", "学习"],
    rating: 5,
    featured: true,
    addedDate: "2025-08-06"
  },
  {
    id: "w3schools",
    url: "https://www.w3schools.com",
    title: "W3Schools",
    description: "Web开发教程和参考资料网站",
    
    category: "开发",
    tags: ["教程", "Web开发", "学习"],
    rating: 4,
    featured: false,
    addedDate: "2025-08-06"
  },
  {
    id: "devdocs",
    url: "https://devdocs.io",
    title: "DevDocs",
    description: "多种编程语言和框架的API文档集合",
    
    category: "开发",
    tags: ["API文档", "多语言", "参考"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-06"
  },
  {
    id: "postman",
    url: "https://www.postman.com",
    title: "Postman",
    description: "API开发和测试平台",
    detailedDescription: "Postman是一个功能强大的API开发和测试平台，被全球数百万开发者使用。它提供直观的界面来创建、测试和文档化API。Postman支持各种HTTP方法，包括GET、POST、PUT、DELETE等，并提供丰富的请求参数设置选项。它支持环境变量和集合，让用户可以管理不同环境的API配置。Postman的自动化测试功能允许用户创建测试脚本，验证API响应的正确性。它还提供团队协作功能，支持API集合的共享和版本控制。对于前端开发者、后端开发者和测试工程师来说，Postman是API开发和测试的必备工具。",
    category: "开发",
    tags: ["API", "测试", "开发工具"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-06"
  },
  {
    id: "insomnia",
    url: "https://insomnia.rest",
    title: "Insomnia",
    description: "现代化的REST客户端和API设计工具",
    
    category: "开发",
    tags: ["REST", "API", "客户端"],
    rating: 4,
    featured: false,
    addedDate: "2025-08-06"
  },
  {
    id: "swagger",
    url: "https://swagger.io",
    title: "Swagger",
    description: "API设计、构建、文档化和测试工具",
    
    category: "开发",
    tags: ["API", "文档", "设计"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-06"
  },
  {
    id: "jenkins",
    url: "https://www.jenkins.io",
    title: "Jenkins",
    description: "开源的持续集成和持续部署工具",
    
    category: "开发",
    tags: ["CI/CD", "自动化", "开源"],
    rating: 4,
    featured: false,
    addedDate: "2025-08-06"
  },
  {
    id: "travis-ci",
    url: "https://travis-ci.org",
    title: "Travis CI",
    description: "持续集成服务，与GitHub深度集成",
    
    category: "开发",
    tags: ["CI/CD", "GitHub", "自动化"],
    rating: 4,
    featured: false,
    addedDate: "2025-08-06"
  },
  {
    id: "circleci",
    url: "https://circleci.com",
    title: "CircleCI",
    description: "现代化的持续集成和部署平台",
    
    category: "开发",
    tags: ["CI/CD", "现代化", "部署"],
    rating: 4,
    featured: false,
    addedDate: "2025-08-06"
  },
  {
    id: "sentry",
    url: "https://sentry.io",
    title: "Sentry",
    description: "应用性能监控和错误跟踪平台",
    
    category: "开发",
    tags: ["监控", "错误跟踪", "性能"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-06"
  },
  {
    id: "datadog",
    url: "https://www.datadoghq.com",
    title: "Datadog",
    description: "云规模的监控和安全平台",
    
    category: "开发",
    tags: ["监控", "安全", "云服务"],
    rating: 4,
    featured: false,
    addedDate: "2025-08-06"
  },
  {
    id: "newrelic",
    url: "https://newrelic.com",
    title: "New Relic",
    description: "应用性能监控和可观测性平台",
    
    category: "开发",
    tags: ["APM", "监控", "可观测性"],
    rating: 4,
    featured: false,
    addedDate: "2025-08-06"
  },

  // 一网一匠网站
  {
    id: "ywyj",
    url: "https://ywyj.cn/",
    title: "一网一匠",
    description: "精选优质网站导航，发现互联网优质内容",
    detailedDescription: "一网一匠是一个精心筛选的网站导航平台，致力于发现和推荐互联网上的优质内容和工具。平台按照不同领域和功能对网站进行分类，包括设计、开发、学习、工具、资源等多个类别。每个推荐的网站都经过严格筛选，确保内容的质量和实用性。一网一匠不仅提供网站链接，还附有简洁的描述和评价，帮助用户快速了解网站的核心功能和特点。对于希望发现高质量网络资源的用户来说，一网一匠是一个理想的起点，能够节省大量搜索时间，直达优质内容。",
    category: "工具",
    tags: ["导航", "资源", "精选"],
    rating: 4.5,
    featured: true,
    addedDate: "2025-08-10"
  },
  
  // 更多工具类网站
  {
    id: "trello",
    url: "https://trello.com",
    title: "Trello",
    description: "基于看板的项目管理工具",
    detailedDescription: "Trello是一个基于看板（Kanban）方法的项目管理工具，使用卡片和列表来组织任务和工作流程。它的界面直观易用，用户可以创建看板、列表和卡片来管理项目进度。Trello支持团队协作，多人可以同时编辑看板，添加评论、附件和标签。它提供丰富的集成功能，可以与Slack、Google Drive、GitHub等工具连接。Trello还支持自动化功能，可以设置规则来自动移动卡片或发送通知。对于小型团队和个人项目来说，Trello是一个灵活且高效的项目管理工具，特别适合敏捷开发和任务跟踪。",
    category: "工具",
    tags: ["项目管理", "看板", "协作"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-07"
  },
  {
    id: "asana",
    url: "https://asana.com",
    title: "Asana",
    description: "团队协作和项目管理平台",
    
    category: "工具",
    tags: ["项目管理", "团队协作", "任务"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-07"
  },
  {
    id: "slack",
    url: "https://slack.com",
    title: "Slack",
    description: "团队沟通和协作平台",
    detailedDescription: "Slack是一个专为团队协作设计的即时通讯平台，提供频道、私聊、文件共享等功能。它支持创建主题频道，让团队成员可以按项目或话题进行讨论。Slack的集成功能非常强大，可以与GitHub、Trello、Google Drive等数百种工具连接，实现工作流程的自动化。它支持语音和视频通话，以及屏幕共享功能。Slack的搜索功能强大，可以快速找到历史消息和文件。对于远程团队和分布式办公来说，Slack是保持团队沟通和协作的重要工具，已经成为现代工作场所的标准配置。",
    category: "工具",
    tags: ["团队沟通", "协作", "即时消息"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-07"
  },
  {
    id: "discord",
    url: "https://discord.com",
    title: "Discord",
    description: "为游戏玩家和社区设计的语音、视频和文字聊天应用",
    
    category: "工具",
    tags: ["语音聊天", "社区", "游戏"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-07"
  },
  {
    id: "zoom",
    url: "https://zoom.us",
    title: "Zoom",
    description: "视频会议和在线协作平台",
    
    category: "工具",
    tags: ["视频会议", "在线协作", "远程"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-07"
  },
  {
    id: "google-drive",
    url: "https://drive.google.com",
    title: "Google Drive",
    description: "Google的云存储和文件同步服务",
    detailedDescription: "Google Drive是Google提供的云存储和文件同步服务，与Google Workspace（原G Suite）深度集成。它提供15GB的免费存储空间，支持各种文件类型的存储和同步。Google Drive与Google Docs、Sheets、Slides等在线办公套件无缝集成，支持实时协作编辑。它提供强大的搜索功能，可以搜索文件内容、OCR识别图片中的文字。Google Drive支持文件版本控制，可以恢复之前的文件版本。对于个人用户和团队来说，Google Drive是文件存储、共享和协作的重要工具，特别适合需要在线办公和团队协作的场景。",
    category: "工具",
    tags: ["云存储", "文件同步", "协作"],
    rating: 4.5,
    featured: false,
    addedDate: "2025-08-07"
  },
  {
    id: "dropbox",
    url: "https://www.dropbox.com",
    title: "Dropbox",
    description: "云存储和文件同步服务",
    
    category: "工具",
    tags: ["云存储", "文件同步", "备份"],
    rating: 4,
    featured: false,
    addedDate: "2025-08-07"
  },
  {
    id: "onedrive",
    url: "https://onedrive.live.com",
    title: "OneDrive",
    description: "微软的云存储服务",
    
    category: "工具",
    tags: ["云存储", "微软", "Office"],
    rating: 4,
    featured: false,
    addedDate: "2025-08-07"
  }
];

// 根据ID获取网站详情
export function getSiteById(id: string): FeaturedSite | undefined {
  return featuredSites.find(site => site.id === id);
}

// 根据URL获取网站详情
export function getSiteByUrl(url: string): FeaturedSite | undefined {
  return featuredSites.find(site => site.url === url);
}

// 相关网站结果接口
export interface RelatedSiteResult {
  site: FeaturedSite;
  score: number;
  matchReasons: string[];
}

// 获取相关网站（使用加权算法）
export function getRelatedSites(siteId: string, limit: number = 5): RelatedSiteResult[] {
  const site = getSiteById(siteId);
  if (!site) return [];
  
  // 创建一个Map来存储网站ID和其相关性得分
  const siteScores = new Map();
  
  // 当前网站的标签集合
  const currentTags = new Set(site.tags || []);
  
  // 为每个网站计算相关性得分
  featuredSites.forEach(s => {
    // 跳过当前网站
    if (s.id === site.id) return;
    
    let score = 0;
    const matchReasons: string[] = [];
    
    // 1. 同类别加高分（权重最高）
    if (s.category === site.category) {
      score += 10;
      matchReasons.push(`同类别: ${s.category}`);
    }
    
    // 2. 标签匹配度（每匹配一个标签加分）
    if (s.tags && s.tags.length > 0) {
      const matchingTags = s.tags.filter(tag => currentTags.has(tag));
      if (matchingTags.length > 0) {
        score += matchingTags.length * 3;
        matchReasons.push(`相同标签: ${matchingTags.join(', ')}`);
      }
    }
    
    // 3. 评分因素（评分越高加分越多）
    score += s.rating;
    if (s.rating >= 4.5) {
      matchReasons.push('高评分网站');
    }
    
    // 4. 特别推荐的网站加分
    if (s.featured) {
      score += 2;
      matchReasons.push('特别推荐');
    }
    
    // 只有得分大于0的网站才被考虑为相关网站
    if (score > 0) {
      siteScores.set(s.id, { 
        site: s, 
        score,
        matchReasons
      });
    }
  });
  
  // 按得分排序并返回前limit个
  return Array.from(siteScores.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// 获取特别推荐的网站
export function getFeaturedSites(): FeaturedSite[] {
  return featuredSites.filter(site => site.featured);
}

// 获取优先推荐的网站（优先显示可在中国大陆访问的）
export function getPriorityFeaturedSites(): FeaturedSite[] {
  const featured = featuredSites.filter(site => site.featured);
  
  // 将网站分为两组：可在中国大陆访问的和可能无法访问的
  const chinaAccessible = featured.filter(site => !site.unchina);
  const chinaRestricted = featured.filter(site => site.unchina);
  
  // 优先返回可在中国大陆访问的网站，然后是其他网站
  return [...chinaAccessible, ...chinaRestricted];
}

// 根据分类获取网站
export function getSitesByCategory(category: string): FeaturedSite[] {
  if (category === CATEGORIES.ALL) {
    return featuredSites;
  }
  return featuredSites.filter(site => site.category === category);
}

// 获取所有分类
export function getAllCategories(): string[] {
  return Object.values(CATEGORIES);
}

// 根据标签搜索网站

// 获取分类统计信息
export function getCategoryStats(): Record<string, number> {
  const stats: Record<string, number> = {};
  
  // 初始化所有分类为0
  Object.values(CATEGORIES).forEach(category => {
    stats[category] = 0;
  });
  
  // 统计每个分类的网站数量
  featuredSites.forEach(site => {
    if (stats[site.category] !== undefined) {
      stats[site.category]++;
    }
  });
  
  // "全部"分类显示总数
  stats[CATEGORIES.ALL] = featuredSites.length;
  
  return stats;
}

// 获取高评分网站
export function getHighRatedSites(minRating: number = 4.5): FeaturedSite[] {
  return featuredSites.filter(site => site.rating >= minRating);
}

// 获取最新添加的网站
export function getRecentSites(limit: number = 10): FeaturedSite[] {
  return featuredSites
    .sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime())
    .slice(0, limit);
}

// 随机获取网站
export function getRandomSites(limit: number = 5): FeaturedSite[] {
  const shuffled = [...featuredSites].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, limit);
}

// 获取可能无法在中国大陆使用的网站
export function getUnchinaSites(): FeaturedSite[] {
  return featuredSites.filter(site => site.unchina === true);
}

// 检查网站是否可能无法在中国大陆使用
export function isUnchinaSite(siteId: string): boolean {
  const site = getSiteById(siteId);
  return site?.unchina === true;
}
