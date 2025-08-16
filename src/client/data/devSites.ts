// 开发类网站数据
import { FeaturedSite } from '../utils/featuredSites';

export const devSites: FeaturedSite[] = [
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
  }
];