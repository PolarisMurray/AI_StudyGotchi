# 缓存问题修复指南

## 问题
`window.initWidget` 仍然未定义,可能是因为浏览器缓存了旧版本的 `waifu-tips.js`。

## 解决方案:完全清除缓存

### 方法 1:硬刷新扩展(推荐)

1. **完全移除扩展**
   - 访问 `chrome://extensions/`
   - 找到 "Live2D Waifu"
   - 点击 **"移除"** 按钮
   - 确认删除

2. **重启 Chrome 浏览器**
   - 关闭所有 Chrome 窗口
   - 重新打开 Chrome

3. **重新加载扩展**
   - 访问 `chrome://extensions/`
   - 确保"开发者模式"开启
   - 点击"加载已解压的扩展程序"
   - 选择 `/Users/alex/github/AI_StudyGotchi/live2d-extension`

### 方法 2:清除 Chrome 缓存

1. **打开清除数据页面**
   ```
   chrome://settings/clearBrowserData
   ```

2. **选择选项**
   - 时间范围:全部时间
   - ✅ 缓存的图片和文件
   - (可选) ✅ Cookie 和其他网站数据

3. **点击"清除数据"**

4. **重新加载扩展**
   - 访问 `chrome://extensions/`
   - 点击扩展的刷新按钮 🔄

### 方法 3:强制刷新(最简单)

1. 访问 `chrome://extensions/`
2. 找到 "Live2D Waifu"
3. **点击刷新按钮 🔄**
4. 打开测试网页
5. 按 `Ctrl + Shift + R` (Mac: `Cmd + Shift + R`) 硬刷新页面

### 方法 4:检查文件版本

在控制台运行以下命令检查文件是否更新:

```javascript
fetch(chrome.runtime.getURL('waifu-tips.js'))
  .then(r => r.text())
  .then(content => {
    console.log('File size:', content.length);
    console.log('Has window.initWidget:', content.includes('window.initWidget'));
    console.log('Has export:', content.includes('export'));
    console.log('Last 200 chars:', content.slice(-200));
  });
```

**期望输出:**
```
File size: 17792  (或类似)
Has window.initWidget: true  ✅
Has export: false  ✅ (应该是 false,不是 true!)
Last 200 chars: ...{null==t||t.classList.add("waifu-toggle-active")}),0)):r(e)}
//# sourceMappingURL=waifu-tips.js.map
```

**如果 `Has export: true`**,说明浏览器缓存了旧文件!

## 终极解决方案:修改文件名

如果清除缓存都不行,可以重命名文件强制浏览器加载新版本:

```bash
cd /Users/alex/github/AI_StudyGotchi/live2d-extension
cp waifu-tips.js waifu-tips-v2.js
```

然后修改 `autoload.js` 中的文件名:
```javascript
loadExternalResource(chrome.runtime.getURL('waifu-tips-v2.js'), 'js')
```

## 测试步骤

清除缓存后:

1. 刷新扩展
2. 打开新标签页: https://www.google.com
3. 按 F12 打开控制台
4. 应该看到:
   ```
   [Live2D Extension] File size: 17792 bytes  ✅
   [Live2D Extension] Has window.initWidget: true  ✅
   [Live2D Extension] Has export keyword: false  ✅
   [Live2D Extension] Waiting for initWidget...
   [Live2D Extension] initWidget found!  ✅
   ```

## 如果还是不行

请运行完整测试:
```javascript
fetch(chrome.runtime.getURL('test-waifu-tips.js'))
  .then(r => r.text())
  .then(eval);
```

这会详细检查脚本加载状态。

