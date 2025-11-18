# Live2D 看板娘扩展 - 故障排除

## 🚨 如果扩展不工作，请按以下步骤操作：

### 步骤 1：确认扩展已加载

1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 找到 "Live2D Waifu" 扩展
4. 确认：
   - ✅ 开关是蓝色的（已启用）
   - ✅ 没有红色错误提示
   - ❌ 如果有错误，点击"详细信息"查看

### 步骤 2：重新加载扩展

1. 在 `chrome://extensions/` 页面
2. 找到 "Live2D Waifu"
3. 点击刷新图标 🔄
4. 看到"已更新"提示

### 步骤 3：测试基础功能

1. 打开任意网页（推荐：https://www.google.com）
2. 按 `F12` 打开开发者工具
3. 切换到 `Console`（控制台）标签页
4. 查看是否有 `[Live2D Extension]` 开头的消息

**如果没有任何消息：**
- 扩展的 content script 没有注入
- 可能是网站的 CSP 阻止了
- 尝试其他网站

**如果有错误消息（红色）：**
- 继续步骤 4

### 步骤 4：运行诊断脚本

在控制台中**复制粘贴**以下命令并按回车：

```javascript
fetch(chrome.runtime.getURL('error-report.js')).then(r => r.text()).then(eval);
```

这个命令会：
1. 检查所有文件是否正确加载
2. 检查 DOM 元素是否创建
3. 列出所有错误和警告
4. 提供修复建议

**然后请把所有输出结果发给我**（截图或复制文字）

### 步骤 5：如果诊断脚本也失败

如果上面的命令报错"无法加载"，说明扩展根本没有工作。

请在控制台运行这个简单测试：

```javascript
console.log('测试 1:', typeof chrome);
console.log('测试 2:', chrome?.runtime?.id);
console.log('测试 3:', chrome?.runtime?.getURL('manifest.json'));
```

**把这 3 行的输出发给我**

### 步骤 6：查看具体错误

在控制台中，找到**红色**的错误信息，通常是：

```
❌ Failed to load resource: ...
❌ Uncaught ReferenceError: ...
❌ Refused to load the script ...
❌ Failed to fetch ...
```

**请把完整的错误信息复制发给我**

## 常见错误和快速修复

### 错误 A：找不到 chrome.runtime
```
Uncaught TypeError: Cannot read properties of undefined (reading 'getURL')
```

**原因**：扩展未正确加载
**修复**：
1. 在 chrome://extensions/ 中重新加载扩展
2. 刷新网页

### 错误 B：CSP 违规
```
Refused to load ... because it violates the following Content Security Policy
```

**原因**：当前网站阻止扩展
**修复**：换一个网站测试（如 google.com）

### 错误 C：模块加载失败
```
Failed to load module script
```

**原因**：文件类型或路径问题
**修复**：需要查看完整错误信息

## 最简单的测试方法

1. 完全关闭 Chrome 浏览器
2. 重新打开 Chrome
3. 访问 chrome://extensions/
4. 删除 "Live2D Waifu" 扩展
5. 重新加载扩展（点击"加载已解压的扩展程序"）
6. 打开 https://www.google.com
7. 按 F12，查看 Console

**看右下角是否有任何东西出现**

## 需要提供的信息

如果还是不工作，请提供：

1. Chrome 版本（在 chrome://version/ 查看）
2. 操作系统
3. 控制台的**所有错误信息**（红色的）
4. error-report.js 的输出（如果能运行）
5. 扩展详情页面的截图（chrome://extensions/）

有了这些信息，我才能准确定位问题！

