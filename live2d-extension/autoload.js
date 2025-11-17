/*!
 * Live2D Widget
 * https://github.com/stevenjoezhang/live2d-widget
 */

// Recommended to use absolute path for live2d_path parameter
// live2d_path 参数建议使用绝对路径
// Use Chrome Extension runtime URL for local resources
const live2d_path = chrome.runtime.getURL("");

// Method to encapsulate asynchronous resource loading
// 封装异步加载资源的方法
function loadExternalResource(url, type) {
  return new Promise((resolve, reject) => {
    let tag;

    if (type === 'css') {
      tag = document.createElement('link');
      tag.rel = 'stylesheet';
      tag.href = url;
    }
    else if (type === 'js') {
      tag = document.createElement('script');
      // Check if the script needs to be loaded as a module
      // For waifu-tips.js which uses ES6 exports, we need type="module"
      if (url.includes('waifu-tips.js')) {
        tag.type = 'module';
      }
      tag.src = url;
    }
    if (tag) {
      tag.onload = () => resolve(url);
      tag.onerror = () => reject(url);
      document.head.appendChild(tag);
    }
  });
}

(async () => {
  // If you are concerned about display issues on mobile devices, you can use screen.width to determine whether to load
  // 如果担心手机上显示效果不佳，可以根据屏幕宽度来判断是否加载
  // if (screen.width < 768) return;

  // Avoid cross-origin issues with image resources
  // 避免图片资源跨域问题
  const OriginalImage = window.Image;
  window.Image = function(...args) {
    const img = new OriginalImage(...args);
    img.crossOrigin = "anonymous";
    return img;
  };
  window.Image.prototype = OriginalImage.prototype;
  // Load waifu.css and waifu-tips.js
  // 加载 waifu.css 和 waifu-tips.js
  await Promise.all([
    loadExternalResource(chrome.runtime.getURL('waifu.css'), 'css'),
    loadExternalResource(chrome.runtime.getURL('waifu-tips.js'), 'js')
  ]);
  
  // Wait for initWidget to be available (it's defined in waifu-tips.js)
  // 等待 initWidget 函数可用（它在 waifu-tips.js 中定义）
  let retries = 0;
  while (typeof window.initWidget === 'undefined' && retries < 50) {
    await new Promise(resolve => setTimeout(resolve, 100));
    retries++;
  }
  
  if (typeof window.initWidget === 'undefined') {
    throw new Error('initWidget function not found. waifu-tips.js may not have loaded correctly.');
  }
  
  // For detailed usage of configuration options, see README.en.md
  // 配置选项的具体用法见 README.md
  // Load model_list.json first to get model paths
  try {
    const modelListResponse = await fetch(chrome.runtime.getURL('model_list.json'));
    if (!modelListResponse.ok) {
      throw new Error(`Failed to load model_list.json: ${modelListResponse.status}`);
    }
    const modelList = await modelListResponse.json();
    
    if (!modelList || !modelList.models || !Array.isArray(modelList.models)) {
      throw new Error('Invalid model_list.json format');
    }
    
    console.log('[Live2D Extension] Initializing with models:', modelList.models);
    window.initWidget({
      waifuPath: chrome.runtime.getURL('waifu-tips.json'),
      // Use local models instead of CDN
      models: modelList.models.map(path => ({
        paths: [chrome.runtime.getURL(path)],
        message: ''
      })),
      cubism2Path: chrome.runtime.getURL('live2d.min.js'),
      cubism5Path: chrome.runtime.getURL('live2d.min.js'), // Use same file for both, or remove if not needed
      tools: ['switch-model', 'switch-texture', 'photo', 'info', 'quit'],
      logLevel: 'info', // Changed to 'info' for better debugging
      drag: false,
    });
    console.log('[Live2D Extension] initWidget called successfully');
  } catch (error) {
    console.error('[Live2D Extension] Failed to initialize:', error);
    console.error('[Live2D Extension] Error stack:', error.stack);
    // Show user-friendly error message
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#ff4444;color:white;padding:10px;border-radius:5px;z-index:99999;font-size:12px;max-width:300px;';
    errorDiv.innerHTML = '<strong>Live2D Extension Error:</strong><br>' + error.message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 10000);
  }
})().catch(error => {
  console.error('[Live2D Extension] Unhandled error:', error);
  console.error('[Live2D Extension] Error stack:', error.stack);
});

console.log(`\n%cLive2D%cWidget%c\n`, 'padding: 8px; background: #cd3e45; font-weight: bold; font-size: large; color: white;', 'padding: 8px; background: #ff5450; font-size: large; color: #eee;', '');

/*
く__,.ヘヽ.        /  ,ー､ 〉
         ＼ ', !-─‐-i  /  /´
         ／｀ｰ'       L/／｀ヽ､
       /   ／,   /|   ,   ,       ',
     ｲ   / /-‐/  ｉ  L_ ﾊ ヽ!   i
      ﾚ ﾍ 7ｲ｀ﾄ   ﾚ'ｧ-ﾄ､!ハ|   |
        !,/7 '0'     ´0iソ|    |
        |.从"    _     ,,,, / |./    |
        ﾚ'| i＞.､,,__  _,.イ /   .i   |
          ﾚ'| | / k_７_/ﾚ'ヽ,  ﾊ.  |
            | |/i 〈|/   i  ,.ﾍ |  i  |
           .|/ /  ｉ：    ﾍ!    ＼  |
            kヽ>､ﾊ    _,.ﾍ､    /､!
            !'〈//｀Ｔ´', ＼ ｀'7'ｰr'
            ﾚ'ヽL__|___i,___,ンﾚ|ノ
                ﾄ-,/  |___./
                'ｰ'    !_,.:
*/
