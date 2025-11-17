# Live2D Waifu Chrome Extension

这是一个 Chrome 扩展程序，可以在任意网页右下角显示 Live2D 看板娘。

## 安装说明

1. 打开 Chrome 浏览器，访问 `chrome://extensions/`
2. 启用"开发者模式"（右上角开关）
3. 点击"加载已解压的扩展程序"
4. 选择 `live2d-extension` 文件夹

## 模型文件说明

当前扩展已配置使用 `haru` 模型，但需要下载实际的模型文件才能正常显示。

### 获取模型文件

模型文件较大，需要从以下来源获取：

1. **Live2D 官方示例模型**（推荐）
   - 访问：https://www.live2d.com/en/learn/sample/
   - 下载 Haru 模型
   - 解压后将文件放入 `models/haru/` 目录

2. **GitHub 模型仓库**
   - 可以从公开的 Live2D 模型仓库下载
   - 确保模型文件结构符合 `models/haru/index.json` 中的配置

### 模型文件结构

模型文件应放置在以下目录结构中：

```
models/haru/
├── index.json          (已创建，需要与实际模型匹配)
├── haru.moc3          (模型文件)
├── haru.physics3.json (物理文件)
├── haru.display3.json (显示配置)
├── textures/          (贴图文件夹)
│   └── texture_00.png
├── motions/           (动作文件夹)
│   ├── idle_00.motion3.json
│   └── tapBody_00.motion3.json
└── expressions/       (表情文件夹，可选)
    ├── f01.exp3.json
    └── f02.exp3.json
```

## 功能特性

- ✅ 完全本地化，不依赖任何 CDN
- ✅ 符合 Chrome Extension Manifest V3 规范
- ✅ 不违反内容安全策略（CSP）
- ✅ 支持模型切换、贴图切换等功能
- ✅ 支持拖拽（可在配置中启用）

## 注意事项

1. 模型文件需要手动下载并放置到正确位置
2. 确保所有模型文件路径在 `index.json` 中正确配置
3. 扩展会在所有网页（`<all_urls>`）上加载
4. 某些需要网络连接的功能（如 hitokoto、asteroids）已禁用

## 文件结构

```
live2d-extension/
├── manifest.json          # 扩展配置文件
├── autoload.js            # 主加载脚本
├── content.js             # 内容脚本（占位）
├── live2d.min.js          # Live2D 核心库
├── waifu.css              # 样式文件
├── waifu-tips.js          # 提示和交互逻辑
├── waifu-tips.json        # 提示文本配置
├── model_list.json        # 模型列表配置
└── models/                # 模型文件夹
    └── haru/              # Haru 模型
        ├── index.json
        ├── textures/
        └── motions/
```

## 开发说明

所有资源路径都通过 `chrome.runtime.getURL()` 解析，确保在 Chrome Extension 环境中正常工作。

## 许可证

基于 [stevenjoezhang/live2d-widget](https://github.com/stevenjoezhang/live2d-widget) 项目改造。

