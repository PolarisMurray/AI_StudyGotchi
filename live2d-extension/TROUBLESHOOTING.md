# 故障排除指南

## 问题：扩展加载后什么都没有显示，控制台有很多错误

### 第一步：收集错误信息

1. 打开任意网页
2. 按 F12 打开开发者工具
3. 在 Console 标签页中运行以下命令：

```javascript
fetch(chrome.runtime.getURL('error-report.js'))
  .then(r => r.text())
  .then(eval)
  .catch(e => console.error('无法加载诊断脚本:', e));
```

4. 如果上面的命令也失败了，说明扩展根本没有加载，请跳到"扩展未加载"部分

### 第二步：查看具体错误

请查看控制台中红色的错误信息，常见错误类型：

#### 错误类型 A：CSP (Content Security Policy) 错误
```
Refused to load the script ... because it violates the following Content Security Policy directive
```

**原因**：某些网站有严格的 CSP 策略，阻止扩展注入脚本

**解决方案**：
1. 这是正常的，某些网站无法使用扩展
2. 尝试在其他网站（如 google.com）测试
3. 或者在空白标签页（chrome://newtab）测试（可能不行）

#### 错误类型 B：模块加载失败
```
Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of "text/plain"
```

**原因**：manifest.json 中的 web_accessible_resources 配置不完整

**解决方案**：检查 manifest.json：
```json
"web_accessible_resources": [
  {
    "resources": [
      "*.js",
      "*.css",
      "*.json",
      "models/*",
      "chunk/*"
    ],
    "matches": ["<all_urls>"]
  }
]
```

#### 错误类型 C：资源 404 错误
```
Failed to load resource: the server responded with a status of 404 (Not Found)
```

**原因**：文件路径不正确或文件不存在

**解决方案**：
1. 检查文件是否存在于 live2d-extension 目录
2. 检查路径是否正确
3. 重新加载扩展

#### 错误类型 D：chrome.runtime 未定义
```
Uncaught ReferenceError: chrome is not defined
```

**原因**：脚本在非扩展环境中运行

**解决方案**：确保脚本是作为 content script 注入的，检查 manifest.json

### 第三步：基础检查

#### 检查 1：扩展是否已启用
1. 打开 `chrome://extensions/`
2. 确认 "Live2D Waifu" 扩展显示为"已启用"
3. 如果看到错误消息，点击"详细信息"查看

#### 检查 2：文件是否完整
在终端运行（在 live2d-extension 目录）：
```bash
ls -la *.js *.css *.json
ls -la chunk/
ls -la models/miku/runtime/
```

必须存在的文件：
- autoload.js
- waifu.css
- waifu-tips.js
- waifu-tips.json
- live2d.min.js
- model_list.json
- manifest.json
- chunk/index.js
- chunk/index2.js

#### 检查 3：manifest.json 格式
运行：
```bash
cat manifest.json | python3 -m json.tool
```

如果报错，说明 JSON 格式有问题

### 第四步：简化测试

创建一个最小测试版本：

1. 暂时修改 `autoload.js`，在最开始添加：
```javascript
console.log('[TEST] autoload.js loaded!');
alert('Live2D Extension: autoload.js loaded!');
```

2. 重新加载扩展
3. 刷新网页
4. 如果看到弹窗，说明基础注入成功
5. 如果没有弹窗，说明 content script 没有注入

### 第五步：常见问题和解决方案

#### 问题：扩展根本没有加载
**症状**：
- console 中没有任何 [Live2D Extension] 日志
- chrome.runtime 返回 undefined
- 没有任何元素被创建

**解决方案**：
1. 检查 manifest.json 格式是否正确
2. 检查是否有 manifest.json 解析错误（在 chrome://extensions/ 页面查看）
3. 尝试删除并重新加载扩展

#### 问题：initWidget 未定义
**症状**：
```
Uncaught ReferenceError: initWidget is not defined
```

**解决方案**：
1. waifu-tips.js 未正确加载
2. waifu-tips.js 需要作为 ES6 模块加载（type="module"）
3. 检查 autoload.js 中的 loadExternalResource 函数

#### 问题：chunk 文件加载失败
**症状**：
```
Failed to load module script: The server responded with a non-JavaScript MIME type
```

**解决方案**：
1. 确保 chunk/index.js 和 chunk/index2.js 存在
2. 确保它们使用 `export` 语法
3. 确保 manifest.json 包含 `chunk/*`

### 第六步：获取帮助

如果以上步骤都无法解决问题，请提供：

1. error-report.js 的完整输出
2. 控制台中所有的错误信息截图
3. chrome://extensions/ 中扩展的详细信息截图
4. 操作系统和 Chrome 版本

运行以下命令获取详细信息：
```javascript
console.log('Chrome version:', navigator.userAgent);
console.log('Extension ID:', chrome.runtime?.id);
console.log('Base URL:', chrome.runtime?.getURL(''));
```

### 快速修复尝试

如果什么都不工作，尝试以下步骤：

1. **完全重启**
```bash
# 在 chrome://extensions/ 中
# 1. 点击"删除"移除扩展
# 2. 关闭所有浏览器窗口
# 3. 重新打开浏览器
# 4. 重新加载扩展
```

2. **清除缓存**
```javascript
// 在控制台运行
localStorage.clear();
sessionStorage.clear();
```

3. **检查权限**
确保扩展有必要的权限（在 chrome://extensions/ 的扩展详情中查看）

