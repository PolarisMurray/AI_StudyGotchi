/*!
 * Live2D Widget
 * https://github.com/stevenjoezhang/live2d-widget
 */

// Recommended to use absolute path for live2d_path parameter
// live2d_path 参数建议使用绝对路径
// Use Chrome Extension runtime URL for local resources
const live2d_path = chrome.runtime.getURL("");

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
  console.log('[Live2D Extension] Starting initialization...');
  console.log('[Live2D Extension] Extension ID:', chrome.runtime.id);
  console.log('[Live2D Extension] Base URL:', chrome.runtime.getURL(''));
  console.log('[Live2D Extension] Loading waifu-tips.js module...');
  
  try {
    await import(chrome.runtime.getURL('waifu-tips.js'));
    console.log('[Live2D Extension] waifu-tips.js module loaded');
  } catch (error) {
    console.error('[Live2D Extension] Failed to load waifu-tips.js module:', error);
    throw error;
  }
  
  console.log('[Live2D Extension] Waiting for waifu-tips.js to initialize...');
  
  // Wait for initWidget to be available (it's defined in waifu-tips.js)
  // 等待 initWidget 函数可用（它在 waifu-tips.js 中定义）
  console.log('[Live2D Extension] Waiting for initWidget...');
  let retries = 0;
  while (typeof window.initWidget === 'undefined' && retries < 50) {
    await new Promise(resolve => setTimeout(resolve, 100));
    retries++;
    if (retries % 10 === 0) {
      console.log(`[Live2D Extension] Still waiting for initWidget... (${retries}/50)`);
    }
  }
  
  if (typeof window.initWidget === 'undefined') {
    console.error('[Live2D Extension] initWidget not found after 5 seconds');
    console.error('[Live2D Extension] Available window properties:', Object.keys(window).filter(k => k.includes('init') || k.includes('widget') || k.includes('waifu')));
    throw new Error('initWidget function not found. waifu-tips.js may not have loaded correctly.');
  }
  console.log('[Live2D Extension] initWidget found!');
  
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
    const modelPaths = modelList.models.map(path => {
      const fullPath = chrome.runtime.getURL(path);
      console.log(`[Live2D Extension] Model path: ${path} -> ${fullPath}`);
      return {
        paths: [fullPath],
        message: ''
      };
    });
    
    const config = {
      waifuPath: chrome.runtime.getURL('waifu-tips.json'),
      models: modelPaths,
      cubism2Path: chrome.runtime.getURL('live2d.min.js'),
      cubism5Path: chrome.runtime.getURL('live2d.min.js'),
      tools: ['switch-model', 'switch-texture', 'photo', 'info', 'quit'],
      logLevel: 'info',
    drag: false,
    };
    
    console.log('[Live2D Extension] Config:', JSON.stringify(config, null, 2));
    console.log('[Live2D Extension] Calling initWidget...');
    
    window.initWidget(config);
    
    console.log('[Live2D Extension] initWidget called successfully');
    
    // Check if waifu element was created
    setTimeout(() => {
      const waifuEl = document.getElementById('waifu');
      if (waifuEl) {
        console.log('[Live2D Extension] ✅ #waifu element created');
        console.log('[Live2D Extension] Element styles:', window.getComputedStyle(waifuEl).display);
      } else {
        console.warn('[Live2D Extension] ⚠️ #waifu element not found after initWidget');
      }
    }, 1000);
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
