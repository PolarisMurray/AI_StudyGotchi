# Live2D Extension 调试指南

## 🔍 快速调试步骤

### 1. 在浏览器控制台运行调试脚本

打开任意网页，按 F12 打开开发者工具，在 Console 标签页中运行：

```javascript
// 复制并运行 debug.js 的内容，或者：
fetch(chrome.runtime.getURL('debug.js'))
  .then(r => r.text())
  .then(eval);
```

或者直接访问扩展的调试脚本：
```
chrome-extension://[EXTENSION_ID]/debug.js
```

### 2. 检查控制台日志

查找以下日志前缀：
- `[Live2D Extension]` - 扩展初始化日志
- `[Live2D Widget]` - Widget 内部日志
- `[Live2D]` - Live2D SDK 日志

### 3. 检查网络请求

在 Network 标签页中检查：
- ✅ `waifu.css` - 状态码应该是 200
- ✅ `waifu-tips.js` - 状态码应该是 200
- ✅ `model_list.json` - 状态码应该是 200
- ✅ `waifu-tips.json` - 状态码应该是 200
- ✅ `miku.model3.json` - 状态码应该是 200
- ✅ `chunk/index.js` - 状态码应该是 200
- ✅ `chunk/index2.js` - 状态码应该是 200

### 4. 检查 DOM 元素

在 Elements 标签页中搜索：
- `#waifu` - 看板娘容器
- `#live2d` - Canvas 元素
- `#waifu-tips` - 提示文本容器
- `#waifu-tool` - 工具按钮容器

### 5. 常见问题排查

#### 问题 1: initWidget 未定义
**症状**: 控制台显示 "initWidget function not found"

**可能原因**:
- `waifu-tips.js` 未正确加载
- ES6 模块加载失败
- CSP 策略阻止

**解决方法**:
1. 检查 Network 标签页，确认 `waifu-tips.js` 返回 200
2. 检查控制台是否有 CSP 错误
3. 确认 manifest.json 中 `web_accessible_resources` 包含 `*.js`

#### 问题 2: 模型文件未找到
**症状**: 控制台显示 "Model file missing" 或 404 错误

**可能原因**:
- 模型路径不正确
- 模型文件不存在
- `web_accessible_resources` 配置不正确

**解决方法**:
1. 检查 `model_list.json` 中的路径是否正确
2. 确认模型文件存在于指定路径
3. 确认 manifest.json 中 `web_accessible_resources` 包含 `models/*`

#### 问题 3: #waifu 元素未创建
**症状**: DOM 中找不到 `#waifu` 元素

**可能原因**:
- `initWidget` 调用失败
- `waifu-tips.js` 中的初始化代码未执行
- 页面阻止了 DOM 操作

**解决方法**:
1. 检查控制台是否有 JavaScript 错误
2. 确认 `initWidget` 是否被调用
3. 检查是否有其他脚本冲突

#### 问题 4: Canvas 未渲染
**症状**: `#waifu` 元素存在，但看不到看板娘

**可能原因**:
- WebGL 不支持
- chunk 文件未正确实现
- 模型加载失败

**解决方法**:
1. 检查浏览器是否支持 WebGL
2. 检查控制台是否有 WebGL 相关错误
3. 检查 chunk 文件的实现

## 📋 调试检查清单

- [ ] Extension runtime 可用 (`chrome.runtime.getURL`)
- [ ] `initWidget` 函数已定义
- [ ] `#waifu` 元素存在
- [ ] `#live2d` canvas 元素存在
- [ ] 所有资源文件可访问（200 状态码）
- [ ] 模型文件存在且可访问
- [ ] chunk 文件存在且可访问
- [ ] 控制台无 JavaScript 错误
- [ ] 控制台无 CSP 错误
- [ ] WebGL 上下文可用

## 🛠️ 手动测试命令

在浏览器控制台中运行以下命令进行测试：

```javascript
// 1. 检查扩展是否加载
console.log('Extension ID:', chrome.runtime.id);
console.log('Base URL:', chrome.runtime.getURL(''));

// 2. 检查 initWidget
console.log('initWidget:', typeof window.initWidget);

// 3. 检查 DOM 元素
console.log('#waifu:', document.getElementById('waifu'));
console.log('#live2d:', document.getElementById('live2d'));

// 4. 测试资源加载
fetch(chrome.runtime.getURL('model_list.json'))
  .then(r => r.json())
  .then(d => console.log('Model list:', d));

// 5. 检查 WebGL
const canvas = document.getElementById('live2d');
if (canvas) {
  const gl = canvas.getContext('webgl');
  console.log('WebGL:', gl ? 'Available' : 'Not available');
}
```

## 📝 报告问题

如果问题仍然存在，请提供：

1. **浏览器信息**: Chrome 版本、操作系统
2. **控制台错误**: 完整的错误堆栈
3. **网络请求**: 失败的请求及其状态码
4. **调试输出**: 运行调试脚本后的完整输出
5. **扩展版本**: manifest.json 中的版本号

