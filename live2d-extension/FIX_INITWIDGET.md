# initWidget 未定义问题修复

## 问题诊断

根据控制台输出：
```
[Live2D Extension] Resources loaded successfully  ✅
[Live2D Extension] Waiting for initWidget...
[Live2D Extension] Still waiting... (10/50, 20/50, 30/50, 40/50, 50/50)
[Live2D Extension] initWidget not found after 5 seconds  ❌
```

**问题原因**：
`waifu-tips.js` 文件被作为 ES6 模块 (`type="module"`) 加载，导致 `window.initWidget` 没有被正确暴露到全局作用域。

## 修复方案

已修改 `autoload.js` 第 22-30 行，去掉了 `type="module"` 的设置，让 `waifu-tips.js` 作为普通脚本加载。

### 修改前：
```javascript
if (url.includes('waifu-tips.js')) {
  tag.type = 'module';  // ❌ 这导致模块作用域隔离
}
```

### 修改后：
```javascript
// Note: waifu-tips.js should be loaded as a regular script
// It uses window.initWidget which needs to be in global scope
```

## 测试步骤

1. 在 `chrome://extensions/` 中点击扩展的刷新按钮 🔄
2. 刷新测试网页（F5）
3. 打开控制台（F12）
4. 现在应该看到：
   ```
   [Live2D Extension] Resources loaded successfully
   [Live2D Extension] Waiting for initWidget...
   [Live2D Extension] initWidget found!  ✅
   [Live2D Extension] Initializing with models...
   ```

## 预期结果

修复后：
- ✅ `initWidget` 函数立即可用
- ✅ 不再有 5 秒等待超时
- ✅ 模型开始加载
- ✅ 右下角显示看板娘元素

## 如果还是不工作

运行诊断脚本：
```javascript
fetch(chrome.runtime.getURL('error-report.js')).then(r => r.text()).then(eval);
```

或者手动检查：
```javascript
console.log('initWidget:', typeof window.initWidget);
console.log('waifu-tips.js loaded:', !!document.querySelector('script[src*="waifu-tips.js"]'));
```

