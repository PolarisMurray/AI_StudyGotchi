# 点击无反应问题修复

## 问题描述
用户反馈：打开网页后，点击看板娘没有反应。

## 问题分析

### 可能的原因：
1. **看板娘未显示** - `#waifu` 元素没有 `waifu-active` 类
2. **事件未触发** - Canvas 点击事件没有触发 Live2D 的 `tapbody` 事件
3. **模型未加载** - 模型加载失败导致无法交互
4. **事件监听器未绑定** - Live2D SDK 没有正确绑定事件

## 修复方案

### 1. 添加 Canvas 事件监听器
在 `chunk/index2.js` 的 `initialize()` 方法中添加：
- 点击事件监听器 → 触发 `live2d:tapbody` 事件
- 鼠标悬停事件监听器 → 触发 `live2d:hoverbody` 事件

### 2. 确保看板娘可见
在模型加载成功后，自动添加 `waifu-active` 类，确保看板娘显示。

### 3. 调试工具
创建 `check-click.js` 脚本，帮助诊断点击问题。

## 使用方法

### 检查问题
在浏览器控制台运行：
```javascript
fetch(chrome.runtime.getURL('check-click.js'))
  .then(r => r.text())
  .then(eval);
```

### 手动测试
1. 检查看板娘是否显示：
   ```javascript
   const waifu = document.getElementById('waifu');
   console.log('Visible:', waifu && waifu.classList.contains('waifu-active'));
   ```

2. 手动触发点击事件：
   ```javascript
   const canvas = document.getElementById('live2d');
   canvas.click(); // 或 canvas.dispatchEvent(new MouseEvent('click'));
   ```

3. 检查事件监听器：
   ```javascript
   window.addEventListener('live2d:tapbody', (e) => {
     console.log('Tapbody event triggered!', e);
   });
   ```

## 预期行为

修复后，点击 canvas 应该：
1. ✅ 触发 `live2d:tapbody` 事件
2. ✅ 显示提示消息（如果配置了）
3. ✅ 播放点击动作（如果模型支持）

## 如果仍然无反应

请检查：
1. 控制台是否有错误信息
2. 模型是否成功加载（查看 `[Live2D]` 日志）
3. Canvas 元素是否存在且可见
4. WebGL 是否可用

