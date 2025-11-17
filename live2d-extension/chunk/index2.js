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

  changeModel(modelPath) {
    console.log('[Live2D] Cubism 5 changeModel called with:', modelPath);
    // This is a placeholder - actual implementation would load and render the model
    // For now, we'll just log that it was called
    if (this.model) {
      // Release previous model if exists
      this.release();
    }
    // In a real implementation, you would:
    // 1. Fetch the model JSON file
    // 2. Load the .moc3 file
    // 3. Load textures
    // 4. Initialize the model with CubismCore
    // 5. Set up rendering loop
    console.log('[Live2D] Model change requested (placeholder implementation)');
  }

  run() {
    console.log('[Live2D] Cubism 5 run called');
    // This would start the rendering loop
    // For now, just log
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

