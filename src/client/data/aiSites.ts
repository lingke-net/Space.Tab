// AI类网站数据
import { FeaturedSite } from '../utils/featuredSites';

export const aiSites: FeaturedSite[] = [
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
    detailedDescription: "Anthropic是一家AI研究公司，致力于开发可靠、可解释和可控的AI系统。公司由前OpenAI研究人员创立，专注于AI安全和负责任的AI发展。Anthropic的旗舰产品是Claude AI助手，以其自然对话能力和安全性能而著称。公司采用"宪法AI"方法，通过人类反馈和明确的价值观指导AI行为。Anthropic积极参与AI安全研究，发表关于AI风险评估和缓解的学术论文。对于关注AI发展方向和寻求负责任AI解决方案的组织和个人来说，Anthropic代表了以安全和人类价值为中心的AI创新方向。",
    category: "AI",
    tags: ["AI研究", "安全", "对话系统"],
    rating: 4.6,
    featured: false,
    addedDate: "2025-08-12"
  }
];