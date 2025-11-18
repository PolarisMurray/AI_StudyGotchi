// 错误收集和诊断脚本
// 请在浏览器控制台运行此脚本，然后提供输出结果

console.log('%c=== Live2D Extension 错误诊断 ===', 'color: #f44336; font-size: 18px; font-weight: bold;');
console.log('开始收集诊断信息...\n');

const report = {
  timestamp: new Date().toISOString(),
  errors: [],
  warnings: [],
  info: {},
  checks: {}
};

// 1. 检查 Chrome Extension API
console.log('%c1. Chrome Extension API', 'color: #2196F3; font-weight: bold;');
try {
  report.checks.chromeRuntime = typeof chrome !== 'undefined' && !!chrome.runtime;
  report.checks.extensionId = chrome?.runtime?.id || 'N/A';
  console.log('  chrome.runtime:', report.checks.chromeRuntime ? '✅' : '❌');
  console.log('  Extension ID:', report.checks.extensionId);
  
  if (chrome.runtime) {
    const testUrl = chrome.runtime.getURL('manifest.json');
    console.log('  Test URL:', testUrl);
    report.info.baseUrl = chrome.runtime.getURL('');
  } else {
    report.errors.push('chrome.runtime is not available');
  }
} catch (e) {
  report.errors.push(`Chrome API check failed: ${e.message}`);
  console.error('  ❌ Error:', e);
}

// 2. 检查 DOM 元素
console.log('\n%c2. DOM 元素检查', 'color: #2196F3; font-weight: bold;');
const elements = {
  '#waifu': document.getElementById('waifu'),
  '#waifu-toggle': document.getElementById('waifu-toggle'),
  '#live2d': document.getElementById('live2d'),
  '#waifu-tips': document.getElementById('waifu-tips'),
  '#waifu-tool': document.getElementById('waifu-tool')
};

Object.entries(elements).forEach(([selector, el]) => {
  const exists = !!el;
  report.checks[selector] = exists;
  console.log(`  ${selector}:`, exists ? '✅' : '❌');
  
  if (el) {
    const styles = window.getComputedStyle(el);
    console.log(`    display: ${styles.display}, visibility: ${styles.visibility}, opacity: ${styles.opacity}`);
    if (selector === '#waifu') {
      console.log(`    classes: ${el.className}`);
      console.log(`    bottom: ${styles.bottom}, left: ${styles.left}`);
    }
  }
});

// 3. 检查全局变量和函数
console.log('\n%c3. 全局变量检查', 'color: #2196F3; font-weight: bold;');
const globals = {
  'window.initWidget': typeof window.initWidget,
  'window.Live2DCubismCore': typeof window.Live2DCubismCore,
  'window.Image': typeof window.Image
};

Object.entries(globals).forEach(([name, type]) => {
  report.checks[name] = type;
  console.log(`  ${name}:`, type === 'undefined' ? '❌ undefined' : `✅ ${type}`);
});

// 4. 检查控制台错误
console.log('\n%c4. 控制台历史（最近的错误）', 'color: #2196F3; font-weight: bold;');
console.log('  请手动查看控制台中的红色错误信息');
console.log('  特别注意以下类型的错误：');
console.log('    - Failed to load resource');
console.log('    - CSP violation');
console.log('    - Module import errors');
console.log('    - Uncaught TypeError/ReferenceError');

// 5. 尝试加载关键资源
console.log('\n%c5. 资源加载测试', 'color: #2196F3; font-weight: bold;');
const testResources = [
  'manifest.json',
  'autoload.js',
  'waifu.css',
  'waifu-tips.js',
  'model_list.json',
  'live2d.min.js',
  'chunk/index2.js'
];

if (chrome.runtime) {
  Promise.all(testResources.map(async (resource) => {
    try {
      const url = chrome.runtime.getURL(resource);
      const response = await fetch(url);
      const status = response.ok ? '✅' : '❌';
      const size = response.headers.get('content-length');
      console.log(`  ${status} ${resource}`, response.status, size ? `(${size} bytes)` : '');
      
      if (!response.ok) {
        report.errors.push(`Failed to load ${resource}: HTTP ${response.status}`);
      }
      return { resource, ok: response.ok, status: response.status };
    } catch (e) {
      console.error(`  ❌ ${resource}:`, e.message);
      report.errors.push(`Failed to load ${resource}: ${e.message}`);
      return { resource, ok: false, error: e.message };
    }
  })).then(results => {
    report.info.resources = results;
    console.log('\n资源加载完成');
  });
}

// 6. 检查 CSS 加载
console.log('\n%c6. CSS 检查', 'color: #2196F3; font-weight: bold;');
const stylesheets = Array.from(document.styleSheets);
const waifuCss = stylesheets.find(s => s.href && s.href.includes('waifu.css'));
console.log('  waifu.css loaded:', waifuCss ? '✅' : '❌');
if (waifuCss) {
  console.log('  Rules count:', waifuCss.cssRules?.length || 0);
} else {
  report.warnings.push('waifu.css not found in stylesheets');
}

// 7. 检查脚本加载
console.log('\n%c7. 脚本检查', 'color: #2196F3; font-weight: bold;');
const scripts = Array.from(document.scripts);
const extensionScripts = scripts.filter(s => s.src && s.src.includes('chrome-extension://'));
console.log(`  Extension scripts loaded: ${extensionScripts.length}`);
extensionScripts.forEach(s => {
  console.log(`    ${s.src.split('/').pop()}`);
});

// 8. WebGL 检查
console.log('\n%c8. WebGL 支持', 'color: #2196F3; font-weight: bold;');
const canvas = document.getElementById('live2d') || document.createElement('canvas');
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
report.checks.webgl = !!gl;
console.log('  WebGL available:', gl ? '✅' : '❌');
if (gl) {
  console.log('  Renderer:', gl.getParameter(gl.RENDERER));
  console.log('  Vendor:', gl.getParameter(gl.VENDOR));
}

// 9. 存储检查
console.log('\n%c9. LocalStorage 检查', 'color: #2196F3; font-weight: bold;');
try {
  const modelId = localStorage.getItem('modelId');
  const textureId = localStorage.getItem('modelTexturesId');
  const waifuDisplay = localStorage.getItem('waifu-display');
  console.log('  modelId:', modelId || 'null');
  console.log('  modelTexturesId:', textureId || 'null');
  console.log('  waifu-display:', waifuDisplay || 'null');
  report.info.storage = { modelId, textureId, waifuDisplay };
} catch (e) {
  report.warnings.push(`LocalStorage access failed: ${e.message}`);
}

// 10. 生成报告摘要
console.log('\n%c=== 诊断摘要 ===', 'color: #ff9800; font-size: 16px; font-weight: bold;');
console.log(`错误数量: ${report.errors.length}`);
console.log(`警告数量: ${report.warnings.length}`);

if (report.errors.length > 0) {
  console.log('\n%c❌ 发现的错误:', 'color: #f44336; font-weight: bold;');
  report.errors.forEach((err, i) => console.log(`  ${i + 1}. ${err}`));
}

if (report.warnings.length > 0) {
  console.log('\n%c⚠️ 警告:', 'color: #ff9800; font-weight: bold;');
  report.warnings.forEach((warn, i) => console.log(`  ${i + 1}. ${warn}`));
}

// 建议
console.log('\n%c💡 建议操作:', 'color: #4caf50; font-weight: bold;');
if (!report.checks.chromeRuntime) {
  console.log('  1. ❌ 扩展未正确加载 - 请检查扩展是否已启用');
}
if (!report.checks['#waifu']) {
  console.log('  2. ❌ #waifu 元素不存在 - autoload.js 或 waifu-tips.js 可能未执行');
}
if (typeof window.initWidget === 'undefined') {
  console.log('  3. ❌ initWidget 未定义 - waifu-tips.js 可能未正确加载');
}
if (!report.checks.webgl) {
  console.log('  4. ❌ WebGL 不可用 - 浏览器可能不支持或被禁用');
}

console.log('\n请将上面的所有输出信息截图或复制发送，以便进一步诊断。');

// 保存报告到全局变量
window.live2dErrorReport = report;
console.log('\n诊断报告已保存到 window.live2dErrorReport');

