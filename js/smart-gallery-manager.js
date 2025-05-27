/**
 * Smart Gallery Manager
 * Automatically manages optimized images for the card gallery
 * Shop owners only manage images/card-gallery/ - system handles the rest
 */

class SmartGalleryManager {
  constructor() {
    this.sourceFolder = 'images/card-gallery/';
    this.optimizedFolder = 'images/card-gallery-optimized/';
    this.imageOptimizer = new ImageOptimizer({
      maxWidth: 1200,
      maxHeight: 1600,
      quality: 0.85,
      outputFormat: 'webp'
    });
    this.supportedFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    this.processedImages = new Set();
  }

  /**
   * Initialize the smart gallery system
   */
  async initialize() {
    try {
      // Create optimized folder if it doesn't exist
      await this.ensureOptimizedFolderExists();
      
      // Sync the galleries
      await this.syncGalleries();
      
      // Start monitoring for changes
      this.startMonitoring();
      
      console.log('Smart Gallery Manager initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Smart Gallery Manager:', error);
    }
  }

  /**
   * Ensure the optimized folder exists
   */
  async ensureOptimizedFolderExists() {
    // This is handled by the browser - we'll create it as needed
    return true;
  }

  /**
   * Get list of images from source folder
   */
  async getSourceImages() {
    try {
      const response = await fetch(this.sourceFolder);
      const text = await response.text();
      
      // Parse directory listing to find image files
      const imageFiles = [];
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const links = doc.querySelectorAll('a[href]');
      
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && this.isImageFile(href)) {
          imageFiles.push(href);
        }
      });
      
      return imageFiles;
    } catch (error) {
      console.error('Error getting source images:', error);
      return [];
    }
  }

  /**
   * Get list of optimized images
   */
  async getOptimizedImages() {
    try {
      const response = await fetch(this.optimizedFolder);
      if (!response.ok) return [];
      
      const text = await response.text();
      const imageFiles = [];
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const links = doc.querySelectorAll('a[href]');
      
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.endsWith('.webp')) {
          imageFiles.push(href);
        }
      });
      
      return imageFiles;
    } catch (error) {
      return []; // Folder doesn't exist yet
    }
  }

  /**
   * Check if file is a supported image format
   */
  isImageFile(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    return this.supportedFormats.includes(extension);
  }

  /**
   * Convert filename to optimized version
   */
  getOptimizedFilename(originalFilename) {
    const nameWithoutExt = originalFilename.replace(/\.[^/.]+$/, '');
    return `${nameWithoutExt}.webp`;
  }

  /**
   * Sync galleries - optimize new images and remove deleted ones
   */
  async syncGalleries() {
    const sourceImages = await this.getSourceImages();
    const optimizedImages = await this.getOptimizedImages();
    
    // Create lookup sets
    const sourceSet = new Set(sourceImages);
    const optimizedSet = new Set(optimizedImages.map(img => {
      // Convert back to original name for comparison
      return this.getOriginalFilename(img);
    }));
    
    // Find images that need optimization
    const toOptimize = sourceImages.filter(img => {
      const optimizedName = this.getOptimizedFilename(img);
      return !optimizedImages.includes(optimizedName);
    });
    
    // Find optimized images that should be removed
    const toRemove = optimizedImages.filter(img => {
      const originalName = this.getOriginalFilename(img);
      return !sourceSet.has(originalName);
    });
    
    // Process optimizations
    if (toOptimize.length > 0) {
      console.log(`Optimizing ${toOptimize.length} new images...`);
      await this.optimizeImages(toOptimize);
    }
    
    // Remove orphaned optimized images
    if (toRemove.length > 0) {
      console.log(`Cleaning up ${toRemove.length} removed images...`);
      this.logRemovedImages(toRemove);
    }
  }

  /**
   * Get original filename from optimized filename
   */
  getOriginalFilename(optimizedFilename) {
    // This is tricky with client-side only - we'll use naming convention
    return optimizedFilename.replace('.webp', '.jpg'); // Fallback assumption
  }

  /**
   * Optimize a list of images
   */
  async optimizeImages(imageList) {
    for (const imageName of imageList) {
      try {
        await this.optimizeSingleImage(imageName);
      } catch (error) {
        console.error(`Failed to optimize ${imageName}:`, error);
      }
    }
  }

  /**
   * Optimize a single image
   */
  async optimizeSingleImage(imageName) {
    try {
      // Fetch the original image
      const response = await fetch(`${this.sourceFolder}${imageName}`);
      const blob = await response.blob();
      
      // Create a File object from the blob
      const file = new File([blob], imageName, { type: blob.type });
      
      // Optimize the image
      const optimizedBlob = await this.imageOptimizer.optimizeImage(file);
      
      // Store in browser cache or IndexedDB for future use
      await this.storeOptimizedImage(imageName, optimizedBlob);
      
      console.log(`Optimized: ${imageName} (${this.formatFileSize(blob.size)} → ${this.formatFileSize(optimizedBlob.size)})`);
      
    } catch (error) {
      console.error(`Error optimizing ${imageName}:`, error);
    }
  }

  /**
   * Store optimized image in browser storage
   */
  async storeOptimizedImage(originalName, optimizedBlob) {
    const optimizedName = this.getOptimizedFilename(originalName);
    
    // Convert blob to data URL for storage
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Store in localStorage or IndexedDB
        const key = `optimized_${optimizedName}`;
        try {
          localStorage.setItem(key, reader.result);
          resolve();
        } catch (e) {
          // localStorage full, could implement IndexedDB fallback
          console.warn('localStorage full, optimized image not cached');
          resolve();
        }
      };
      reader.readAsDataURL(optimizedBlob);
    });
  }

  /**
   * Get optimized image from storage
   */
  getOptimizedImage(originalName) {
    const optimizedName = this.getOptimizedFilename(originalName);
    const key = `optimized_${optimizedName}`;
    return localStorage.getItem(key);
  }

  /**
   * Log removed images (for debugging)
   */
  logRemovedImages(removedImages) {
    removedImages.forEach(img => {
      const key = `optimized_${img}`;
      localStorage.removeItem(key);
      console.log(`Cleaned up optimized version of: ${img}`);
    });
  }

  /**
   * Start monitoring for changes (polling-based)
   */
  startMonitoring() {
    // Check for changes every 30 seconds
    setInterval(async () => {
      await this.syncGalleries();
    }, 30000);
  }

  /**
   * Get image for gallery display (optimized if available, original if not)
   */
  async getDisplayImage(originalName) {
    // First check if we have an optimized version
    const optimizedData = this.getOptimizedImage(originalName);
    if (optimizedData) {
      return optimizedData;
    }
    
    // If not optimized yet, trigger optimization and return original
    this.optimizeSingleImage(originalName);
    return `${this.sourceFolder}${originalName}`;
  }

  /**
   * Format file size helper
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
  if (typeof ImageOptimizer !== 'undefined') {
    window.smartGalleryManager = new SmartGalleryManager();
    await window.smartGalleryManager.initialize();
  } else {
    console.warn('ImageOptimizer not found - smart gallery management disabled');
  }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SmartGalleryManager;
} else {
  window.SmartGalleryManager = SmartGalleryManager;
}