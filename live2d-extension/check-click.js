// 检查点击无反应的问题
// 在浏览器控制台运行此脚本

console.log('%c=== 检查点击无反应问题 ===', 'color: #ff9800; font-size: 16px; font-weight: bold;');

// 1. 检查 DOM 元素
console.log('\n1. 检查 DOM 元素:');
const waifu = document.getElementById('waifu');
const canvas = document.getElementById('live2d');
const waifuTool = document.getElementById('waifu-tool');

console.log('  #waifu:', waifu ? '✅ 存在' : '❌ 不存在');
console.log('  #live2d:', canvas ? '✅ 存在' : '❌ 不存在');
console.log('  #waifu-tool:', waifuTool ? '✅ 存在' : '❌ 不存在');

if (waifu) {
  const styles = window.getComputedStyle(waifu);
  console.log('  #waifu 样式:');
  console.log('    display:', styles.display);
  console.log('    visibility:', styles.visibility);
  console.log('    opacity:', styles.opacity);
  console.log('    bottom:', styles.bottom);
  console.log('    是否有 waifu-active 类:', waifu.classList.contains('waifu-active'));
}

if (canvas) {
  console.log('  Canvas 信息:');
  console.log('    尺寸:', canvas.width, 'x', canvas.height);
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  console.log('    WebGL:', gl ? '✅ 可用' : '❌ 不可用');
  
  // 检查 canvas 是否有内容
  const imageData = canvas.getContext('2d')?.getImageData(0, 0, canvas.width, canvas.height);
  if (imageData) {
    const hasContent = imageData.data.some((v, i) => i % 4 === 3 && v > 0); // 检查 alpha 通道
    console.log('    是否有内容:', hasContent ? '✅ 有' : '❌ 无');
  }
}

// 2. 检查事件监听器
console.log('\n2. 检查事件监听器:');
const hasHoverListener = window.addEventListener.toString().includes('live2d:hoverbody') || 
  (window._live2dListeners && window._live2dListeners.includes('live2d:hoverbody'));
const hasTapListener = window.addEventListener.toString().includes('live2d:tapbody') ||
  (window._live2dListeners && window._live2dListeners.includes('live2d:tapbody'));

console.log('  live2d:hoverbody:', hasHoverListener ? '✅ 已注册' : '⚠️ 未检测到');
console.log('  live2d:tapbody:', hasTapListener ? '✅ 已注册' : '⚠️ 未检测到');

// 3. 手动测试点击事件
console.log('\n3. 测试点击事件:');
if (canvas) {
  // 添加测试点击监听器
  canvas.addEventListener('click', (e) => {
    console.log('  ✅ Canvas 点击事件触发:', e);
    // 尝试触发 Live2D 事件
    window.dispatchEvent(new CustomEvent('live2d:tapbody'));
  }, { once: true });
  
  canvas.addEventListener('mousemove', (e) => {
    console.log('  ✅ Canvas 鼠标移动事件触发:', e);
    // 尝试触发 Live2D 事件
    window.dispatchEvent(new CustomEvent('live2d:hoverbody'));
  }, { once: true });
  
  console.log('  已添加测试监听器，请点击 canvas 测试');
}

// 4. 检查模型加载状态
console.log('\n4. 检查模型加载状态:');
if (window.live2dModel) {
  console.log('  ✅ 模型对象存在');
  console.log('  模型信息:', window.live2dModel);
} else {
  console.log('  ⚠️ 模型对象不存在');
}

// 5. 检查工具按钮
console.log('\n5. 检查工具按钮:');
if (waifuTool) {
  const tools = waifuTool.querySelectorAll('span');
  console.log(`  找到 ${tools.length} 个工具按钮`);
  tools.forEach((tool, i) => {
    console.log(`    工具 ${i + 1}:`, tool.id, tool.innerHTML.substring(0, 50));
    // 检查是否有点击监听器
    const hasClick = tool.onclick !== null || tool.getAttribute('onclick') !== null;
    console.log(`      点击监听器:`, hasClick ? '✅' : '⚠️ 未检测到');
  });
}

// 6. 检查控制台错误
console.log('\n6. 检查控制台:');
console.log('  请查看是否有红色错误信息');
console.log('  请查看 [Live2D] 和 [Live2D Extension] 开头的日志');

// 7. 提供修复建议
console.log('\n7. 修复建议:');
if (!waifu) {
  console.log('  ❌ #waifu 元素不存在 - 扩展可能未正确初始化');
  console.log('  建议: 重新加载扩展并刷新页面');
} else if (!waifu.classList.contains('waifu-active')) {
  console.log('  ⚠️ #waifu 没有 waifu-active 类 - 看板娘可能被隐藏');
  console.log('  建议: 运行 document.getElementById("waifu").classList.add("waifu-active")');
} else if (!canvas) {
  console.log('  ❌ Canvas 不存在 - 模型可能未加载');
  console.log('  建议: 检查模型加载日志');
} else {
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) {
    console.log('  ❌ WebGL 不可用 - 无法渲染模型');
    console.log('  建议: 检查浏览器 WebGL 支持');
  } else {
    console.log('  ✅ 基础元素都存在');
    console.log('  如果点击无反应，可能是:');
    console.log('    1. Live2D SDK 未正确初始化');
    console.log('    2. 模型未正确加载');
    console.log('    3. 事件监听器未正确绑定');
    console.log('  建议: 查看控制台中的 [Live2D] 日志');
  }
}

console.log('\n' + '='.repeat(60));

