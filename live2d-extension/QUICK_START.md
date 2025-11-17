# 快速开始指南 - Miku 模型

## ✅ 已完成的配置

1. **模型路径已更新**: `model_list.json` 指向 `models/miku/runtime/miku.model3.json`
2. **模型文件存在**: 所有必需的模型文件都在正确位置
3. **路径解析**: chunk/index2.js 已实现相对路径解析

## 🚀 安装步骤

1. **打开 Chrome 扩展管理页面**
   ```
   chrome://extensions/
   ```

2. **启用开发者模式**
   - 点击右上角的"开发者模式"开关

3. **加载扩展**
   - 点击"加载已解压的扩展程序"
   - 选择 `live2d-extension` 文件夹

4. **验证安装**
   - 扩展应该出现在扩展列表中
   - 状态应该显示为"已启用"

## 🧪 测试步骤

1. **打开任意网页**（如 google.com）

2. **打开开发者工具**（F12）

3. **查看控制台**
   - 应该看到 `[Live2D Extension]` 开头的日志
   - 应该看到 `[Live2D]` 开头的日志
   - 不应该有红色错误信息

4. **检查页面**
   - 右下角应该出现看板娘
   - 如果看不到，检查控制台错误

## 🔍 调试工具

### 方法 1: 运行测试脚本

在浏览器控制台中运行：

```javascript
fetch(chrome.runtime.getURL('test-model.js'))
  .then(r => r.text())
  .then(eval);
```

### 方法 2: 运行完整调试

```javascript
fetch(chrome.runtime.getURL('debug.js'))
  .then(r => r.text())
  .then(eval);
```

### 方法 3: 手动检查

```javascript
// 检查模型文件
fetch(chrome.runtime.getURL('models/miku/runtime/miku.model3.json'))
  .then(r => r.json())
  .then(d => console.log('Model:', d));

// 检查 DOM
console.log('Waifu element:', document.getElementById('waifu'));
console.log('Canvas element:', document.getElementById('live2d'));
```

## ⚠️ 已知限制

1. **chunk 文件是占位符**: `chunk/index.js` 和 `chunk/index2.js` 实现了基本的文件加载，但实际的 Live2D 渲染需要完整的 SDK 实现

2. **需要 Live2D SDK**: 要完全运行，需要集成 Live2D Cubism SDK 的实际实现

3. **模型渲染**: 当前实现可以加载模型文件，但渲染需要额外的 SDK 代码

## 📝 下一步

如果模型文件加载成功但看不到渲染：

1. 检查 WebGL 是否可用
2. 检查 Live2D SDK 是否正确加载
3. 查看控制台中的详细错误信息
4. 考虑使用完整的 Live2D SDK 实现

## 🐛 常见问题

**Q: 控制台显示 "Failed to load module script"**
A: 检查 manifest.json 中的 `web_accessible_resources` 是否包含 `chunk/*`

**Q: 模型文件 404 错误**
A: 检查 `model_list.json` 中的路径是否正确，确保文件存在于指定位置

**Q: #waifu 元素不存在**
A: 检查 `initWidget` 是否被调用，查看控制台错误

**Q: Canvas 存在但不显示**
A: 检查 WebGL 支持，查看是否有 WebGL 相关错误

