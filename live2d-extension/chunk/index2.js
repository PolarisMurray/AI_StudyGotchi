// Cubism 5 model wrapper
// This wraps the Live2D Cubism 5 SDK functionality from live2d.min.js

// Check if Live2DCubismCore is available (from live2d.min.js)
let CubismCore = null;
if (typeof window !== 'undefined' && window.Live2DCubismCore) {
  CubismCore = window.Live2DCubismCore;
} else if (typeof globalThis !== 'undefined' && globalThis.Live2DCubismCore) {
  CubismCore = globalThis.Live2DCubismCore;
}

export class AppDelegate {
  constructor() {
    this.subdelegates = [];
    this.model = null;
    this.canvas = null;
    this.gl = null;
    console.log('[Live2D] Cubism 5 AppDelegate initialized');
    
    if (!CubismCore) {
      console.warn('[Live2D] Live2DCubismCore not found. Model may not render correctly.');
    }
  }

  initialize() {
    console.log('[Live2D] Cubism 5 initialize called');
    // Get canvas element
    this.canvas = document.getElementById('live2d');
    if (!this.canvas) {
      console.error('[Live2D] Canvas element not found');
      return;
    }
    
    // Initialize WebGL context
    this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
    if (!this.gl) {
      console.error('[Live2D] WebGL context not available');
      return;
    }
    
    console.log('[Live2D] WebGL context initialized');
  }

  async changeModel(modelPath) {
    console.log('[Live2D] Cubism 5 changeModel called with:', modelPath);
    
    if (this.model) {
      this.release();
    }
    
    try {
      // Parse modelPath to get directory
      // modelPath is already a full chrome-extension:// URL
      // Extract the relative path part
      const modelUrl = new URL(modelPath);
      const relativePath = modelUrl.pathname.substring(1); // Remove leading /
      const modelDir = relativePath.substring(0, relativePath.lastIndexOf('/'));
      console.log('[Live2D] Model directory:', modelDir);
      console.log('[Live2D] Full model path:', modelPath);
      
      // Fetch model JSON
      const modelResponse = await fetch(modelPath);
      if (!modelResponse.ok) {
        throw new Error(`Failed to load model JSON: ${modelResponse.status}`);
      }
      const modelJson = await modelResponse.json();
      console.log('[Live2D] Model JSON loaded:', modelJson.Version || 'Unknown version');
      
      // Resolve relative paths
      const resolvePath = (relativePath) => {
        // If it's already an absolute URL, return as is
        if (relativePath.startsWith('http://') || relativePath.startsWith('https://') || relativePath.startsWith('chrome-extension://')) {
          return relativePath;
        }
        // Otherwise, resolve relative to model directory
        return chrome.runtime.getURL(`${modelDir}/${relativePath}`);
      };
      
      // Load Moc file
      const mocPath = modelJson.FileReferences.Moc;
      const mocUrl = resolvePath(mocPath);
      console.log('[Live2D] Loading Moc file:', mocUrl);
      
      const mocResponse = await fetch(mocUrl);
      if (!mocResponse.ok) {
        throw new Error(`Failed to load Moc file: ${mocResponse.status}`);
      }
      const mocData = await mocResponse.arrayBuffer();
      console.log('[Live2D] Moc file loaded, size:', mocData.byteLength);
      
      // Load textures
      const textures = [];
      for (const texturePath of modelJson.FileReferences.Textures || []) {
        const textureUrl = resolvePath(texturePath);
        console.log('[Live2D] Loading texture:', textureUrl);
        const textureResponse = await fetch(textureUrl);
        if (textureResponse.ok) {
          const textureBlob = await textureResponse.blob();
          const textureImage = await createImageBitmap(textureBlob);
          textures.push(textureImage);
          console.log('[Live2D] Texture loaded:', texturePath);
        } else {
          console.warn('[Live2D] Failed to load texture:', texturePath, textureResponse.status);
        }
      }
      
      // Store model data for rendering
      this.model = {
        json: modelJson,
        moc: mocData,
        textures: textures,
        modelPath: modelPath,
        modelDir: modelDir
      };
      
      console.log('[Live2D] Model loaded successfully');
      console.log('[Live2D] Note: Actual rendering requires Live2D SDK implementation');
      
    } catch (error) {
      console.error('[Live2D] Failed to load model:', error);
      throw error;
    }
  }

  run() {
    console.log('[Live2D] Cubism 5 run called');
    
    if (!this.gl || !this.canvas) {
      console.error('[Live2D] Cannot run: WebGL context not initialized');
      return;
    }
    
    if (!this.model) {
      console.warn('[Live2D] Cannot run: No model loaded');
      return;
    }
    
    // Start rendering loop
    const render = () => {
      if (!this.gl || !this.model) return;
      
      // Clear canvas
      this.gl.clearColor(0, 0, 0, 0);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
      
      // TODO: Actual Live2D rendering would go here
      // This requires the full Live2D SDK implementation
      
      requestAnimationFrame(render);
    };
    
    render();
    console.log('[Live2D] Rendering loop started');
  }

  release() {
    console.log('[Live2D] Cubism 5 release called');
    // Cleanup
    if (this.model) {
      this.model = null;
    }
    this.subdelegates = [];
  }
}

