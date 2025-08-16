<p align="center">
<img src="https://www.lingke.ink/wp-content/uploads/2025/08/space-scaled.png" alt="pARPxN8.png" border="0" />
</p>

# Space.Tab

Space.Tab是一个现代化的Web应用程序，提供多种功能，包括用户认证、服务器管理、设备信息收集、天气查询、搜索引擎集成等功能。

## 技术栈

- 前端：Vue 3、Tailwind CSS、GSAP
- 后端：Express.js、MySQL、Redis
- 构建工具：Vite
- 其他：JWT认证、Swagger API文档

## wiki文档
<p align="center">
<a href="https://deepwiki.com/lingke-net/Space.Tab"><img src="https://www.lingke.ink/wp-content/uploads/2025/08/wiki-scaled.png" alt="pARPxN8.png" border="0" /></a>
</p>

## 项目设置

<p align="center">
<img src="https://www.lingke.ink/wp-content/uploads/2025/08/setup-scaled.png" alt="pARPxN8.png" border="0" />
</p>

### 环境要求

- Node.js (推荐v18+)
- MySQL
- Redis
- PNPM (推荐v10+)

### 安装依赖

```bash
# 安装依赖
pnpm install
```

### 环境变量配置

1. 复制环境变量示例文件作为基础
```bash
cp .env.example .env
```

2. 编辑`.env`文件，填入你的实际配置信息：
   - 数据库连接信息（MySQL和Redis）
   - API密钥（高德地图、极验验证等）
   - JWT密钥
   - 其他应用配置

### 数据库初始化

1. 确保MySQL服务已启动
2. 创建数据库并导入初始数据
```bash
mysql -u your_username -p < sql/spacetab-data.sql
```

## 开发

<p align="center">
<img src="https://www.lingke.ink/wp-content/uploads/2025/08/dev-scaled.png" border="0" />
</p>

启动开发服务器：

```bash
pnpm dev
```

应用将在 http://localhost:3001 (或环境变量中配置的端口) 上运行。

## 构建

<p align="center">
<img src="https://www.lingke.ink/wp-content/uploads/2025/08/build-scaled.png" alt="pARPxN8.png" border="0" />
</p>

构建生产版本：

```bash
pnpm build
```

## 部署

<p align="center">
<img src="https://www.lingke.ink/wp-content/uploads/2025/08/run-scaled.png" border="0" />
</p>

### 标准部署

```bash
# 构建项目
pnpm build

# 启动生产服务器
pnpm start
```

### Docker部署

```bash
# 使用生产环境配置启动Docker容器
pnpm docker
```

## 项目结构

- `src/client/` - 前端Vue应用
- `src/server/` - 后端Express服务器
- `sql/` - 数据库初始化脚本
- `public/` - 静态资源文件

## 环境变量说明

<p align="center">
<img src="https://www.lingke.ink/wp-content/uploads/2025/08/env-scaled.png" alt="pARPxN8.png" border="0" />
</p>

项目使用了多种环境变量来配置不同的功能。请参考`.env.example`文件了解所有可用的配置选项。关键配置包括：

### 基础配置
- `NODE_ENV` - 运行环境（development/production）
- `PORT` - 服务器端口

### 数据库配置
- `MYSQL_HOST` - MySQL主机地址
- `MYSQL_PORT` - MySQL端口
- `MYSQL_USER` - MySQL用户名
- `MYSQL_PASSWORD` - MySQL密码
- `MYSQL_DATABASE` - MySQL数据库名

### Redis配置
- `REDIS_HOST` - Redis主机地址
- `REDIS_PORT` - Redis端口
- `REDIS_PASSWORD` - Redis密码
- `REDIS_DATABASE` - Redis数据库索引

### 认证配置
- `JWT_SECRET` - JWT签名密钥
- `JWT_EXPIRES_IN` - JWT过期时间

### 第三方服务配置
- `VITE_MAMP_KEY` - 高德地图API密钥
- `VITE_GEETEST_CAPTCHA_ID` - 极验验证ID
- `VITE_GEETEST_CAPTCHA_KEY` - 极验验证密钥

## 安全注意事项

<p align="center">
<img src="https://www.lingke.ink/wp-content/uploads/2025/08/warning-scaled.png" alt="pARPxN8.png" border="0" />
<img src="https://www.lingke.ink/wp-content/uploads/2025/08/warning-tip-scaled.png" alt="pARPxN8.png" border="0" />
</p>


1. **环境变量文件**：
   - `.env`、`.env.*` 文件包含敏感信息，已在`.gitignore`中配置为不上传
   - 永远不要将包含实际密钥的环境文件提交到版本控制系统

2. **数据库凭证**：
   - 生产环境中使用强密码
   - 限制数据库用户权限

3. **API密钥**：
   - 定期轮换第三方服务的API密钥
   - 实施适当的访问控制和速率限制

## 贡献指南

<p align="center">
<img src="https://www.lingke.ink/wp-content/uploads/2025/08/gongxian-scaled.png" alt="pARPxN8.png" border="0" />
</p>

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 许可证

<p align="center">
<img src="https://www.lingke.ink/wp-content/uploads/2025/08/license-scaled.png" alt="pARPxN8.png" border="0" />
</p>

本项目遵守 GPL-3.0 license 协议，在协议规范内，禁止用于商业用途
