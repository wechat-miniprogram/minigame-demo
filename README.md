# 微信小游戏示例

微信小游戏示例源码，欢迎扫描以下小程序码体验。

> 提示：请使用微信开发者工具或微信客户端 6.7.2 及以上版本运行。

<img src="./readmeImages/QR code.jpg" width="200" />

## 快速开始

### 环境要求

- [Node.js](https://nodejs.org/) >= 18.0
- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

### 安装与构建

```bash
# 1. 安装依赖
npm install

# 2. 构建项目（TypeScript 编译 + 静态资源复制 → dist/）
npm run build
```

### 运行

1. 打开微信开发者工具
2. 导入本项目根目录
3. 填写开发者自己的小游戏 AppID（不能使用测试 AppID，因涉及云开发功能）
4. 项目会自动加载 `dist/` 目录运行

### 开发模式

```bash
# 监听 TypeScript 文件变化，自动编译
npm run watch
```

> 注意：`watch` 模式只编译 TypeScript，不会复制静态资源。首次运行或修改了静态资源后需执行 `npm run build`。

## 目录结构

```
.
├── minigame/                       # TypeScript 源码目录
│   ├── game.ts                     # 入口文件
│   ├── game.json                   # 小游戏配置
│   ├── images/                     # 图标资源
│   ├── js/
│   │   ├── api/                    # API 示例目录（按官方文档分类）
│   │   │   ├── base/               # 基础
│   │   │   ├── navigate/           # 跳转
│   │   │   ├── share/              # 转发
│   │   │   ├── ui/                 # 界面
│   │   │   ├── network/            # 网络
│   │   │   ├── storage/            # 数据缓存
│   │   │   ├── data-analysis/      # 数据分析
│   │   │   ├── render/             # 渲染
│   │   │   ├── media/              # 媒体
│   │   │   ├── location/           # 位置
│   │   │   ├── device/             # 设备
│   │   │   ├── file/               # 文件
│   │   │   ├── open-api/           # 开放接口
│   │   │   ├── pay/                # 虚拟支付
│   │   │   ├── game-recorder/      # 游戏对局回放
│   │   │   ├── game-server/        # 游戏服务
│   │   │   ├── ad/                 # 广告
│   │   │   ├── recommend/          # 推荐
│   │   │   ├── util/               # 工具
│   │   │   ├── worker/             # Worker
│   │   │   ├── wasm/               # WASM
│   │   │   ├── chat-tool/          # 聊天工具
│   │   │   ├── ai/                 # AI / VisionKit
│   │   │   ├── server/             # 服务端 API
│   │   │   └── perf/               # 性能
│   │   ├── libs/                   # 项目自有工具库
│   │   └── vendor/                 # 第三方库（PIXI.js、weapp-adapter 等）
│   ├── open-data-context/          # 开放数据域（好友排行榜等）
│   └── workers/                    # Worker 多线程
├── dist/                           # 构建输出（开发者工具加载此目录）
├── cloudfunction/                  # 云函数
├── jsserver/                       # 数据安全性校验（关系链互动）
├── scripts/                        # 构建脚本
├── project.config.json             # 微信开发者工具配置
└── tsconfig.json                   # TypeScript 配置
```

## 云开发

此示例使用了微信云开发，环境搭建请参考 [云开发示例说明](./CLOUD_README.md)。

## 注意

1. 所有 `view.ts` 文件仅用于 UI 绘制，开发者主要关注 `index.ts` 中的 API 调用逻辑。
2. 如需正常运行网络相关功能，请在开发者工具中打开"调试模式"或配置合法域名。
3. 使用手机预览时请在"详情"中取消勾选"上传时进行代码保护"。

## 截图

<img src="./readmeImages/samplePlate.png" />
