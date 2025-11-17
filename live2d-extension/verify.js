// Final verification script for Miku model
// Run this in browser console to verify everything is ready

(async function verify() {
  console.log('%c=== Live2D Extension - Final Verification ===', 'color: #4CAF50; font-size: 18px; font-weight: bold;');
  console.log('Checking Miku model configuration...\n');
  
  const results = {
    passed: [],
    failed: [],
    warnings: []
  };
  
  function check(name, test, isWarning = false) {
    try {
      if (test()) {
        results.passed.push(name);
        console.log(`✅ ${name}`);
        return true;
      } else {
        if (isWarning) {
          results.warnings.push(name);
          console.warn(`⚠️ ${name}`);
        } else {
          results.failed.push(name);
          console.error(`❌ ${name}`);
        }
        return false;
      }
    } catch (e) {
      if (isWarning) {
        results.warnings.push(`${name}: ${e.message}`);
        console.warn(`⚠️ ${name}: ${e.message}`);
      } else {
        results.failed.push(`${name}: ${e.message}`);
        console.error(`❌ ${name}: ${e.message}`);
      }
      return false;
    }
  }
  
  // Check 1: Extension runtime
  check('Extension runtime available', () => {
    return typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL;
  });
  
  // Check 2: Model list
  const modelListUrl = chrome.runtime.getURL('model_list.json');
  console.log(`\n📋 Checking model_list.json: ${modelListUrl}`);
  try {
    const modelListRes = await fetch(modelListUrl);
    if (!modelListRes.ok) throw new Error(`HTTP ${modelListRes.status}`);
    const modelList = await modelListRes.json();
    check('model_list.json format valid', () => {
      return modelList && modelList.models && Array.isArray(modelList.models) && modelList.models.length > 0;
    });
    
    if (modelList.models && modelList.models.length > 0) {
      const modelPath = modelList.models[0];
      console.log(`   Model path: ${modelPath}`);
      check('Model path points to miku', () => modelPath.includes('miku'));
      
      // Check 3: Model JSON file
      const modelJsonUrl = chrome.runtime.getURL(modelPath);
      console.log(`\n📄 Checking model JSON: ${modelJsonUrl}`);
      const modelJsonRes = await fetch(modelJsonUrl);
      if (modelJsonRes.ok) {
        const modelJson = await modelJsonRes.json();
        check('Model JSON loaded', () => true);
        check('Model version is 3', () => modelJson.Version === 3);
        
        // Check 4: Moc file
        const mocPath = modelJson.FileReferences.Moc;
        const modelDir = modelPath.substring(0, modelPath.lastIndexOf('/'));
        const mocFullPath = `${modelDir}/${mocPath}`;
        const mocUrl = chrome.runtime.getURL(mocFullPath);
        console.log(`\n🎭 Checking Moc file: ${mocUrl}`);
        const mocRes = await fetch(mocUrl);
        check('Moc file exists', () => mocRes.ok);
        if (mocRes.ok) {
          console.log(`   Size: ${mocRes.headers.get('content-length')} bytes`);
        }
        
        // Check 5: Textures
        console.log(`\n🖼️ Checking textures:`);
        for (const texturePath of modelJson.FileReferences.Textures || []) {
          const textureFullPath = `${modelDir}/${texturePath}`;
          const textureUrl = chrome.runtime.getURL(textureFullPath);
          const textureRes = await fetch(textureUrl);
          check(`Texture: ${texturePath}`, () => textureRes.ok, true);
        }
        
        // Check 6: Physics
        if (modelJson.FileReferences.Physics) {
          const physicsPath = `${modelDir}/${modelJson.FileReferences.Physics}`;
          const physicsUrl = chrome.runtime.getURL(physicsPath);
          const physicsRes = await fetch(physicsUrl);
          check('Physics file exists', () => physicsRes.ok, true);
        }
      } else {
        check('Model JSON file exists', () => false);
      }
    }
  } catch (e) {
    check('model_list.json accessible', () => false);
    console.error('Error:', e);
  }
  
  // Check 7: DOM elements
  console.log(`\n🎨 Checking DOM elements:`);
  check('#waifu element exists', () => {
    const el = document.getElementById('waifu');
    if (el) {
      console.log(`   Display: ${window.getComputedStyle(el).display}`);
      console.log(`   Visibility: ${window.getComputedStyle(el).visibility}`);
      console.log(`   Position: ${window.getComputedStyle(el).position}`);
    }
    return !!el;
  }, true);
  
  check('#live2d canvas exists', () => {
    const canvas = document.getElementById('live2d');
    if (canvas) {
      console.log(`   Size: ${canvas.width}x${canvas.height}`);
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      console.log(`   WebGL: ${gl ? 'Available' : 'Not available'}`);
    }
    return !!canvas;
  }, true);
  
  // Check 8: initWidget
  check('initWidget function available', () => typeof window.initWidget === 'function');
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('%c📊 Verification Summary', 'color: #2196F3; font-size: 16px; font-weight: bold;');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${results.passed.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`⚠️ Warnings: ${results.warnings.length}`);
  
  if (results.failed.length > 0) {
    console.log('\n❌ Failed checks:');
    results.failed.forEach(f => console.log(`   - ${f}`));
  }
  
  if (results.warnings.length > 0) {
    console.log('\n⚠️ Warnings:');
    results.warnings.forEach(w => console.log(`   - ${w}`));
  }
  
  if (results.failed.length === 0) {
    console.log('\n%c🎉 All critical checks passed! Extension should be ready to run.', 'color: #4CAF50; font-size: 14px; font-weight: bold;');
  } else {
    console.log('\n%c⚠️ Some checks failed. Please review the errors above.', 'color: #ff9800; font-size: 14px; font-weight: bold;');
  }
  
  console.log('='.repeat(60));
  
  // Return results for programmatic access
  window.live2dVerify = results;
  return results;
})();

