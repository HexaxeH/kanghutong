# 康护通

康护通是一个基于uni-app开发的跨平台应用项目。

## 技术栈

- Vue 3.4.21
- uni-app 3.0
- Vite 5.2.8
- JavaScript
- ESLint
- Prettier

## 支持平台

- H5
- 微信小程序
- 支付宝小程序
- 百度小程序
- QQ小程序
- 字节跳动小程序
- 快手小程序
- 飞书小程序
- 小红书小程序
- 鸿蒙原子化服务
- 快应用(Webview)

## 开发环境要求

- Node.js
- pnpm 包管理器

## 项目设置

### 安装依赖
```bash
pnpm install
```

### 启动开发服务

H5版本：
```bash
pnpm dev:h5
```

微信小程序版本：
```bash
pnpm dev:mp-weixin
```

其他平台请参考 `package.json` 中的相应命令。

### 构建生产版本

H5版本：
```bash
pnpm build:h5
```

微信小程序版本：
```bash
pnpm build:mp-weixin
```

## 代码规范

项目使用 ESLint 和 Prettier 进行代码规范和格式化：

- 代码检查：`pnpm lint`
- 代码检查(不自动修复)：`pnpm lint:check`

## 目录结构

```
src/
├── App.vue                 # 应用入口组件
├── main.js                 # 应用入口文件
├── manifest.json           # 应用配置文件
├── pages.json             # 页面路由配置
├── uni.scss               # 全局样式文件
└── pages/                 # 页面文件夹
    └── index/            # 首页
        └── index.vue    # 首页组件
```