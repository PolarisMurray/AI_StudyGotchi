// 测试 waifu-tips.js 加载状态
console.log('%c=== Testing waifu-tips.js Loading ===', 'color: #ff9800; font-size: 16px; font-weight: bold;');

// 1. 检查脚本标签
const scripts = document.querySelectorAll('script');
const waifuScript = Array.from(scripts).find(s => s.src && s.src.includes('waifu-tips.js'));
console.log('\n1. Script tag check:');
console.log('  Found waifu-tips.js:', !!waifuScript);
if (waifuScript) {
  console.log('  URL:', waifuScript.src);
  console.log('  Type:', waifuScript.type || 'default');
  console.log('  Loaded:', !waifuScript.async || 'unknown');
}

// 2. 检查 window.initWidget
console.log('\n2. window.initWidget check:');
console.log('  Type:', typeof window.initWidget);
console.log('  Value:', window.initWidget);

// 3. 检查其他可能的全局变量
console.log('\n3. Other global variables from waifu-tips.js:');
const possibleVars = ['l', 'a', 'c', 'd', 'r'];
possibleVars.forEach(v => {
  if (typeof window[v] !== 'undefined') {
    console.log(`  window.${v}:`, typeof window[v]);
  }
});

// 4. 尝试手动加载
console.log('\n4. Attempting manual load:');
const testScript = document.createElement('script');
testScript.src = chrome.runtime.getURL('waifu-tips.js');
testScript.onload = () => {
  console.log('  ✅ Manual load successful');
  console.log('  window.initWidget after load:', typeof window.initWidget);
  if (typeof window.initWidget === 'function') {
    console.log('  ✅✅✅ initWidget is now available!');
  } else {
    console.log('  ❌ Still not available');
    // 检查文件内容
    fetch(chrome.runtime.getURL('waifu-tips.js'))
      .then(r => r.text())
      .then(content => {
        console.log('  File size:', content.length, 'bytes');
        console.log('  Contains "window.initWidget":', content.includes('window.initWidget'));
        console.log('  Contains "export":', content.includes('export'));
        const lastLines = content.split('\n').slice(-5).join('\n');
        console.log('  Last 5 lines:\n', lastLines);
      });
  }
};
testScript.onerror = (e) => {
  console.error('  ❌ Manual load failed:', e);
};

// 5. 检查是否有语法错误
console.log('\n5. Checking for syntax errors:');
fetch(chrome.runtime.getURL('waifu-tips.js'))
  .then(r => r.text())
  .then(content => {
    console.log('  File loaded successfully, size:', content.length);
    console.log('  Checking for common issues:');
    console.log('    Has "export" keyword:', content.includes('export'));
    console.log('    Has "import" keyword:', content.includes('import'));
    console.log('    Has "window.initWidget":', content.includes('window.initWidget'));
    
    // 尝试评估代码（仅用于测试）
    try {
      // 不实际执行，只检查语法
      new Function(content);
      console.log('  ✅ No syntax errors detected');
    } catch (e) {
      console.error('  ❌ Syntax error:', e.message);
    }
  })
  .catch(e => {
    console.error('  ❌ Failed to fetch:', e);
  });

console.log('\n等待结果...');

