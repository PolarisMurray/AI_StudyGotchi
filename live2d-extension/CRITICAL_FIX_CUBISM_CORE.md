# 🚨 关键修复：Live2DCubismCore 未定义

## 问题描述 (Problem)
```
ReferenceError: Live2DCubismCore is not defined
```

## 根本原因 (Root Cause)
原项目使用了**两套 Live2D SDK**：

### SDK v2（旧版）
- **文件**: `live2d.min.js` (Cubism 2)
- **全局对象**: `window.Live2D`
- **支持**: `.moc` 格式模型
- **用途**: 渲染 Cubism 2 模型

### SDK v4/v5（新版）
- **文件**: `live2dcubismcore.min.js` (Cubism Core 5)
- **全局对象**: `window.Live2DCubismCore`
- **支持**: `.moc3` 格式模型  
- **用途**: 渲染 Cubism 3/4/5 模型

### 问题定位
- `waifu-tips.js` 检测到 `.model3.json` → 识别为 **Cubism 3**
- 加载 `chunk/index2.js`（Cubism 5 渲染器）
- `index2.js` 内部调用 `Live2DCubismCore.startUp()` → **未定义**❌

**原因**: 我们只有 `live2d.min.js`（v2 SDK），缺少 `live2dcubismcore.min.js`（v5 Core）！

## 解决方案 (Solution)

### 1️⃣ 下载 Cubism Core SDK
```bash
curl -L "https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js" \
  -o live2dcubismcore.min.js
```

### 2️⃣ 修改 manifest.json
```json
"js": [
  "live2dcubismcore.min.js",  // ← 新增：Cubism 5 Core
  "live2d.min.js",             // ← 原有：Cubism 2 SDK
  "autoload.js"
]
```

**加载顺序至关重要**：
1. 先加载 Core → `Live2DCubismCore` 全局对象
2. 再加载 v2 SDK → `Live2D` 全局对象
3. 最后执行初始化脚本

### 3️⃣ 验证 Core 正确性
```javascript
// 在控制台检查
console.log(typeof window.Live2DCubismCore); // "object"
console.log(Live2DCubismCore.getVersion());  // 例如: 421 (4.2.1)
```

## 文件对比 (File Comparison)

| 文件 | SDK 版本 | 大小 | 导出对象 | 支持格式 |
|------|---------|------|---------|---------|
| `live2dcubismcore.min.js` | v5 Core | 202 KB | `Live2DCubismCore` | `.moc3` |
| `live2d.min.js` | v2 SDK | ~60 KB | `Live2D` | `.moc` |

## SDK 架构说明 (SDK Architecture)

```
stevenjoezhang/live2d-widget 项目架构:

waifu-tips.js (主逻辑)
    ├── 检测模型版本 (checkModelVersion)
    │   ├── Cubism 2 → 调用 chunk/index.js
    │   └── Cubism 3/4/5 → 调用 chunk/index2.js
    │
    ├── chunk/index.js (Cubism 2 渲染器)
    │   └── 依赖: window.Live2D (来自 live2d.min.js)
    │
    └── chunk/index2.js (Cubism 5 渲染器)
        └── 依赖: window.Live2DCubismCore (来自 live2dcubismcore.min.js) ⚠️

我们的 Miku 模型:
    models/miku/runtime/miku.model3.json → Cubism 3 格式
    → 需要 chunk/index2.js 渲染
    → 必须有 Live2DCubismCore ✅
```

## 验证步骤 (Verification)

### 刷新扩展
1. 访问 `chrome://extensions/`
2. 点击 "Live2D Waifu" 的刷新按钮 🔄

### 检查控制台
访问任意网页（如 https://www.google.com/），打开 DevTools Console:

```javascript
// ✅ 应该看到:
[Live2D Extension] initWidget found!
[Live2D Widget][INFO] Model ...miku.model3.json (Cubism version 3) loaded

// ❌ 不应该看到:
ReferenceError: Live2DCubismCore is not defined
```

### 确认模型显示
- 页面右下角显示 Miku 模型 ✨
- 鼠标悬停/点击有反应
- Canvas 正常渲染

## 技术细节 (Technical Details)

### Live2DCubismCore 对象结构
```javascript
Live2DCubismCore = {
  Logging: { ... },
  Memory: { ... },
  Moc: { ... },
  Model: { ... },
  Version: { ... },
  
  // 关键方法
  getVersion(),           // 获取 Core 版本
  getLatestMocVersion(),  // 获取支持的最新 moc 版本
  getMocVersion(moc),     // 检测 moc 文件版本
  ...
}
```

### Cubism 版本对应关系
| Cubism 版本 | moc 格式 | SDK 文件 | 渲染器 |
|------------|---------|---------|--------|
| 2.x | `.moc` | `live2d.min.js` | `chunk/index.js` |
| 3.x | `.moc3` | `live2dcubismcore.min.js` | `chunk/index2.js` |
| 4.x | `.moc3` | `live2dcubismcore.min.js` | `chunk/index2.js` |
| 5.x | `.moc3` | `live2dcubismcore.min.js` | `chunk/index2.js` |

## 相关链接 (References)
- [Live2D Cubism SDK for Web](https://www.live2d.com/en/sdk/)
- [Cubism Core Download](https://cubism.live2d.com/sdk-web/cubismcore/)
- [Original Project](https://github.com/stevenjoezhang/live2d-widget)

---
修复时间: 2025-11-18  
修复原因: 缺少 Cubism 5 Core SDK 导致无法渲染 Cubism 3 模型

