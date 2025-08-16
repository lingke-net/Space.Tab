// 工具类网站数据
import { FeaturedSite } from '../utils/featuredSites';

export const toolSites: FeaturedSite[] = [
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
  }
];