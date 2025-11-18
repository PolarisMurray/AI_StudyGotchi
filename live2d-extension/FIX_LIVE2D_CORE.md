# Fix: Live2DCubismCore is not defined

## 问题描述 (Problem)
```
waifu-tips.js:5 loadLive2D failed ReferenceError: Live2DCubismCore is not defined
```

## 根本原因 (Root Cause)
Chrome Extension 内容脚本存在两个隔离的执行环境：
1. **页面上下文** (Page Context) - 通过 `document.createElement('script')` 注入的脚本运行在这里
2. **内容脚本上下文** (Content Script Context) - 扩展的内容脚本运行在这里

当 `waifu-tips.js` 动态加载 `live2d.min.js` 时，使用的是 `document.head.appendChild(script)`，这会将脚本加载到**页面上下文**。但是 `chunk/index2.js` 作为 ES6 模块导入时运行在**内容脚本上下文**，无法访问页面上下文中定义的 `Live2DCubismCore`。

## 解决方案 (Solution)

### 1. 在 manifest.json 中预加载 live2d.min.js
```json
"content_scripts": [
  {
    "matches": ["<all_urls>"],
    "js": ["live2d.min.js", "autoload.js"],
    "css": ["waifu.css"],
    "run_at": "document_idle"
  }
]
```

通过 manifest 加载确保 `live2d.min.js` 在**内容脚本上下文**中执行，使 `Live2DCubismCore` 在该上下文中可用。

### 2. 修改 waifu-tips.js 跳过重复加载
修改动态加载逻辑，检查 `Live2DCubismCore` 是否已存在：

**Cubism 5 路径：**
```javascript
// 修改前
await s(this.cubism5Path);
const {AppDelegate:t} = await import(...)

// 修改后
window.Live2DCubismCore || await s(this.cubism5Path);
const {AppDelegate:t} = await import(...)
```

**Cubism 2 路径：**
```javascript
// 修改前
await s(this.cubism2Path);
const {default:e} = await import(...)

// 修改后  
window.Live2DCubismCore || await s(this.cubism2Path);
const {default:e} = await import(...)
```

使用短路运算符 `||`：
- 如果 `window.Live2DCubismCore` 存在（truthy），则跳过 `await s(...)`
- 如果不存在（falsy），则执行动态加载

## 验证步骤 (Verification)
1. 在 `chrome://extensions/` 刷新扩展
2. 刷新测试网页（如 https://www.google.com/）
3. 打开 DevTools Console，确认：
   - ✅ 没有 `Live2DCubismCore is not defined` 错误
   - ✅ 看到 `[Live2D Extension] ✅ #waifu element created`
   - ✅ 模型在页面右下角正常显示和渲染

## 技术细节 (Technical Details)
- Chrome Extension Manifest V3 的内容脚本隔离机制
- ES6 模块导入的作用域限制
- 短路运算符在异步操作中的应用
- 全局对象 `Live2DCubismCore` 的可用性检查

## 相关文件 (Related Files)
- `manifest.json` - 添加 `live2d.min.js` 到 content_scripts
- `waifu-tips.js` - 添加条件加载逻辑
- `chunk/index2.js` - Cubism 5 渲染器（依赖 `Live2DCubismCore`）
- `chunk/index.js` - Cubism 2 渲染器（依赖 `Live2DCubismCore`）

---
修复时间: 2025-11-18

