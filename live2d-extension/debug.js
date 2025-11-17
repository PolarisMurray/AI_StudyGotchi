// Debug utility for Live2D Extension
// Run this in browser console to check extension status

(function() {
  console.log('%c=== Live2D Extension Debug Tool ===', 'color: #4CAF50; font-size: 16px; font-weight: bold;');
  
  const checks = {
    extensionLoaded: false,
    waifuElement: false,
    canvasElement: false,
    initWidget: false,
    modelList: false,
    resources: {
      waifuCss: false,
      waifuTipsJs: false,
      modelListJson: false,
      waifuTipsJson: false,
      live2dJs: false
    },
    chunkFiles: {
      indexJs: false,
      index2Js: false
    },
    errors: []
  };
  
  // Check 1: Extension loaded
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
    checks.extensionLoaded = true;
    console.log('✅ Extension runtime available');
  } else {
    checks.errors.push('Extension runtime not available');
    console.error('❌ Extension runtime not available');
  }
  
  // Check 2: initWidget function
  if (typeof window.initWidget === 'function') {
    checks.initWidget = true;
    console.log('✅ initWidget function found');
  } else {
    checks.errors.push('initWidget function not found');
    console.error('❌ initWidget function not found');
  }
  
  // Check 3: DOM elements
  const waifuEl = document.getElementById('waifu');
  if (waifuEl) {
    checks.waifuElement = true;
    console.log('✅ #waifu element found');
    console.log('   Styles:', window.getComputedStyle(waifuEl).display);
  } else {
    checks.errors.push('#waifu element not found');
    console.error('❌ #waifu element not found');
  }
  
  const canvasEl = document.getElementById('live2d');
  if (canvasEl) {
    checks.canvasElement = true;
    console.log('✅ #live2d canvas found');
    console.log('   Size:', canvasEl.width, 'x', canvasEl.height);
  } else {
    checks.errors.push('#live2d canvas not found');
    console.error('❌ #live2d canvas not found');
  }
  
  // Check 4: Resources
  const baseUrl = chrome.runtime.getURL('');
  const resources = [
    { name: 'waifu.css', key: 'waifuCss' },
    { name: 'waifu-tips.js', key: 'waifuTipsJs' },
    { name: 'model_list.json', key: 'modelListJson' },
    { name: 'waifu-tips.json', key: 'waifuTipsJson' },
    { name: 'live2d.min.js', key: 'live2dJs' }
  ];
  
  console.log('\n📦 Checking resources...');
  Promise.all(resources.map(r => {
    return fetch(chrome.runtime.getURL(r.name))
      .then(response => {
        if (response.ok) {
          checks.resources[r.key] = true;
          console.log(`✅ ${r.name} - OK (${response.status})`);
          return response;
        } else {
          checks.resources[r.key] = false;
          checks.errors.push(`${r.name} - HTTP ${response.status}`);
          console.error(`❌ ${r.name} - HTTP ${response.status}`);
          return null;
        }
      })
      .catch(error => {
        checks.resources[r.key] = false;
        checks.errors.push(`${r.name} - ${error.message}`);
        console.error(`❌ ${r.name} - ${error.message}`);
        return null;
      });
  })).then(() => {
    // Check model list
    fetch(chrome.runtime.getURL('model_list.json'))
      .then(r => r.json())
      .then(data => {
        if (data && data.models && Array.isArray(data.models)) {
          checks.modelList = true;
          console.log('✅ model_list.json - Valid format');
          console.log('   Models:', data.models);
          
          // Check each model file
          data.models.forEach(modelPath => {
            const fullPath = chrome.runtime.getURL(modelPath);
            fetch(fullPath)
              .then(r => {
                if (r.ok) {
                  console.log(`   ✅ Model file exists: ${modelPath}`);
                } else {
                  console.error(`   ❌ Model file missing: ${modelPath} (${r.status})`);
                  checks.errors.push(`Model file missing: ${modelPath}`);
                }
              })
              .catch(e => {
                console.error(`   ❌ Model file error: ${modelPath} - ${e.message}`);
                checks.errors.push(`Model file error: ${modelPath}`);
              });
          });
        } else {
          checks.errors.push('model_list.json - Invalid format');
          console.error('❌ model_list.json - Invalid format');
        }
      })
      .catch(e => {
        checks.errors.push(`model_list.json - ${e.message}`);
        console.error('❌ model_list.json -', e.message);
      });
    
    // Check chunk files
    console.log('\n🔧 Checking chunk files...');
    const chunkFiles = [
      { name: 'chunk/index.js', key: 'indexJs' },
      { name: 'chunk/index2.js', key: 'index2Js' }
    ];
    
    Promise.all(chunkFiles.map(f => {
      return fetch(chrome.runtime.getURL(f.name))
        .then(r => {
          if (r.ok) {
            checks.chunkFiles[f.key] = true;
            console.log(`✅ ${f.name} - OK`);
          } else {
            checks.chunkFiles[f.key] = false;
            checks.errors.push(`${f.name} - HTTP ${r.status}`);
            console.error(`❌ ${f.name} - HTTP ${r.status}`);
          }
        })
        .catch(e => {
          checks.chunkFiles[f.key] = false;
          checks.errors.push(`${f.name} - ${e.message}`);
          console.error(`❌ ${f.name} - ${e.message}`);
        });
    })).then(() => {
      // Final summary
      console.log('\n' + '='.repeat(50));
      console.log('%c📊 Debug Summary', 'color: #2196F3; font-size: 14px; font-weight: bold;');
      console.log('='.repeat(50));
      
      const totalChecks = Object.keys(checks).filter(k => k !== 'errors' && k !== 'resources' && k !== 'chunkFiles').length;
      const passedChecks = Object.keys(checks).filter(k => {
        if (k === 'errors' || k === 'resources' || k === 'chunkFiles') return false;
        return checks[k] === true;
      }).length;
      
      console.log(`Extension Loaded: ${checks.extensionLoaded ? '✅' : '❌'}`);
      console.log(`initWidget: ${checks.initWidget ? '✅' : '❌'}`);
      console.log(`#waifu Element: ${checks.waifuElement ? '✅' : '❌'}`);
      console.log(`#live2d Canvas: ${checks.canvasElement ? '✅' : '❌'}`);
      console.log(`Model List: ${checks.modelList ? '✅' : '❌'}`);
      
      console.log('\nResources:');
      Object.keys(checks.resources).forEach(k => {
        console.log(`  ${k}: ${checks.resources[k] ? '✅' : '❌'}`);
      });
      
      console.log('\nChunk Files:');
      Object.keys(checks.chunkFiles).forEach(k => {
        console.log(`  ${k}: ${checks.chunkFiles[k] ? '✅' : '❌'}`);
      });
      
      if (checks.errors.length > 0) {
        console.log('\n❌ Errors Found:');
        checks.errors.forEach((err, i) => {
          console.log(`  ${i + 1}. ${err}`);
        });
      } else {
        console.log('\n✅ No errors found!');
      }
      
      console.log('\n' + '='.repeat(50));
      console.log(`Passed: ${passedChecks}/${totalChecks} checks`);
      console.log('='.repeat(50));
    });
  });
  
  // Return checks object for programmatic access
  window.live2dDebug = checks;
  console.log('\n💡 Tip: Access debug results with window.live2dDebug');
})();

