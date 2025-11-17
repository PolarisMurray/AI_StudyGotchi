// Test script to verify model configuration
// Run this in browser console after extension loads

(async function testModel() {
  console.log('%c=== Testing Miku Model Configuration ===', 'color: #2196F3; font-size: 16px; font-weight: bold;');
  
  const baseUrl = chrome.runtime.getURL('');
  const modelPath = 'models/miku/runtime/miku.model3.json';
  const fullModelUrl = chrome.runtime.getURL(modelPath);
  
  console.log('Base URL:', baseUrl);
  console.log('Model Path:', modelPath);
  console.log('Full Model URL:', fullModelUrl);
  
  // Test 1: Load model JSON
  try {
    const response = await fetch(fullModelUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const modelJson = await response.json();
    console.log('✅ Model JSON loaded successfully');
    console.log('Model Version:', modelJson.Version);
    console.log('Moc file:', modelJson.FileReferences.Moc);
    console.log('Textures:', modelJson.FileReferences.Textures);
    
    // Test 2: Check if Moc file exists
    const mocPath = modelJson.FileReferences.Moc; // "miku.moc3"
    const mocDir = modelPath.substring(0, modelPath.lastIndexOf('/')); // "models/miku/runtime"
    const mocFullPath = `${mocDir}/${mocPath}`; // "models/miku/runtime/miku.moc3"
    const mocUrl = chrome.runtime.getURL(mocFullPath);
    
    console.log('\nTesting Moc file:');
    console.log('  Relative path:', mocPath);
    console.log('  Directory:', mocDir);
    console.log('  Full path:', mocFullPath);
    console.log('  Full URL:', mocUrl);
    
    const mocResponse = await fetch(mocUrl);
    if (mocResponse.ok) {
      console.log('  ✅ Moc file exists and accessible');
      console.log('  Size:', mocResponse.headers.get('content-length'), 'bytes');
    } else {
      console.error('  ❌ Moc file not found:', mocResponse.status);
    }
    
    // Test 3: Check textures
    console.log('\nTesting textures:');
    for (const texture of modelJson.FileReferences.Textures) {
      const textureFullPath = `${mocDir}/${texture}`;
      const textureUrl = chrome.runtime.getURL(textureFullPath);
      const textureResponse = await fetch(textureUrl);
      if (textureResponse.ok) {
        console.log(`  ✅ ${texture} - OK`);
      } else {
        console.error(`  ❌ ${texture} - HTTP ${textureResponse.status}`);
      }
    }
    
    // Test 4: Check physics
    if (modelJson.FileReferences.Physics) {
      const physicsPath = `${mocDir}/${modelJson.FileReferences.Physics}`;
      const physicsUrl = chrome.runtime.getURL(physicsPath);
      const physicsResponse = await fetch(physicsUrl);
      if (physicsResponse.ok) {
        console.log(`  ✅ Physics file (${modelJson.FileReferences.Physics}) - OK`);
      } else {
        console.error(`  ❌ Physics file - HTTP ${physicsResponse.status}`);
      }
    }
    
    console.log('\n✅ All model files checked!');
    
  } catch (error) {
    console.error('❌ Error testing model:', error);
    console.error('Stack:', error.stack);
  }
})();

