# 简单测试步骤

## 请严格按照以下步骤操作，并告诉我结果：

### 测试 1：扩展是否加载

```
访问：chrome://extensions/
找到：Live2D Waifu
回答：扩展是否显示为"已启用"（蓝色开关）？
回答：是否有红色错误提示？
```

### 测试 2：基础注入测试

```
1. 打开 https://www.google.com
2. 按 F12 打开开发者工具
3. 在 Console 标签页中运行：

console.log('===测试开始===');
console.log('chrome:', typeof chrome);
console.log('chrome.runtime:', typeof chrome?.runtime);
console.log('Extension ID:', chrome?.runtime?.id);

4. 把输出结果发给我
```

### 测试 3：查看错误

```
在 Console 中，找到红色的错误信息
复制所有红色的错误
发给我
```

### 测试 4：查看页面元素

```
在 Console 中运行：

console.log('#waifu:', document.getElementById('waifu'));
console.log('#live2d:', document.getElementById('live2d'));
console.log('Scripts:', document.querySelectorAll('script[src*="chrome-extension"]').length);

把输出结果发给我
```

### 测试 5：运行诊断

```
在 Console 中运行：

fetch(chrome.runtime.getURL('error-report.js')).then(r => r.text()).then(eval);

等待 5 秒，然后把所有输出发给我
```

## 请提供以上 5 个测试的结果！

只有知道具体的错误信息，我才能帮你修复问题。

**提示**：
- 如果测试 1 失败 → 扩展没有加载
- 如果测试 2 失败 → content script 没有注入
- 如果测试 3 有很多红色错误 → 把错误发给我
- 如果测试 4 都返回 null → DOM 元素没有创建
- 如果测试 5 失败 → 告诉我失败的原因

