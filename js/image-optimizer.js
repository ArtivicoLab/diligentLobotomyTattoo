/**
 * Client-Side Image Optimizer
 * Automatically resizes and compresses images for better web performance
 * Works with pure JavaScript - no server required
 */

class ImageOptimizer {
  constructor(options = {}) {
    this.maxWidth = options.maxWidth || 1200;
    this.maxHeight = options.maxHeight || 1600;
    this.quality = options.quality || 0.85;
    this.outputFormat = options.outputFormat || 'webp';
    this.fallbackFormat = options.fallbackFormat || 'jpeg';
  }

  /**
   * Optimize a single image file
   * @param {File} file - The image file to optimize
   * @returns {Promise<Blob>} - Optimized image blob
   */
  async optimizeImage(file) {
    return new Promise((resolve, reject) => {
      // Check if it's an image file
      if (!file.type.startsWith('image/')) {
        reject(new Error('File is not an image'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          try {
            const optimizedBlob = this.processImage(img);
            resolve(optimizedBlob);
          } catch (error) {
            reject(error);
          }
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = event.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Process the loaded image
   * @param {HTMLImageElement} img - The loaded image
   * @returns {Blob} - Optimized image blob
   */
  processImage(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Calculate new dimensions while maintaining aspect ratio
    const { width, height } = this.calculateDimensions(img.width, img.height);
    
    canvas.width = width;
    canvas.height = height;

    // Enable high-quality image rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw the resized image
    ctx.drawImage(img, 0, 0, width, height);

    // Try WebP first, fallback to JPEG if not supported
    const mimeType = this.getSupportedFormat();
    
    return new Promise((resolve) => {
      canvas.toBlob(resolve, mimeType, this.quality);
    });
  }

  /**
   * Calculate optimal dimensions while maintaining aspect ratio
   * @param {number} originalWidth - Original image width
   * @param {number} originalHeight - Original image height
   * @returns {object} - New width and height
   */
  calculateDimensions(originalWidth, originalHeight) {
    let { width, height } = { width: originalWidth, height: originalHeight };

    // Only resize if image is larger than max dimensions
    if (width > this.maxWidth || height > this.maxHeight) {
      const aspectRatio = width / height;

      if (width > height) {
        // Landscape orientation
        width = Math.min(width, this.maxWidth);
        height = width / aspectRatio;
      } else {
        // Portrait orientation
        height = Math.min(height, this.maxHeight);
        width = height * aspectRatio;
      }
    }

    return {
      width: Math.round(width),
      height: Math.round(height)
    };
  }

  /**
   * Check browser support and return best format
   * @returns {string} - MIME type for the best supported format
   */
  getSupportedFormat() {
    // Test WebP support
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    try {
      const webpData = canvas.toDataURL('image/webp');
      if (webpData.indexOf('image/webp') === 5) {
        return 'image/webp';
      }
    } catch (e) {
      // WebP not supported
    }

    // Fallback to JPEG
    return `image/${this.fallbackFormat}`;
  }

  /**
   * Get file size reduction info
   * @param {number} originalSize - Original file size in bytes
   * @param {number} optimizedSize - Optimized file size in bytes
   * @returns {object} - Size reduction statistics
   */
  getSizeReduction(originalSize, optimizedSize) {
    const reduction = originalSize - optimizedSize;
    const percentage = Math.round((reduction / originalSize) * 100);
    
    return {
      originalSize: this.formatFileSize(originalSize),
      optimizedSize: this.formatFileSize(optimizedSize),
      reduction: this.formatFileSize(reduction),
      percentage: percentage
    };
  }

  /**
   * Format file size in human-readable format
   * @param {number} bytes - File size in bytes
   * @returns {string} - Formatted file size
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Batch optimize multiple images
   * @param {FileList} files - List of image files
   * @param {function} progressCallback - Progress update callback
   * @returns {Promise<Array>} - Array of optimized image blobs
   */
  async optimizeMultiple(files, progressCallback = null) {
    const optimizedImages = [];
    const total = files.length;

    for (let i = 0; i < total; i++) {
      try {
        const optimizedBlob = await this.optimizeImage(files[i]);
        optimizedImages.push({
          original: files[i],
          optimized: optimizedBlob,
          sizeReduction: this.getSizeReduction(files[i].size, optimizedBlob.size)
        });

        if (progressCallback) {
          progressCallback({
            current: i + 1,
            total: total,
            percentage: Math.round(((i + 1) / total) * 100)
          });
        }
      } catch (error) {
        console.error(`Failed to optimize ${files[i].name}:`, error);
        optimizedImages.push({
          original: files[i],
          optimized: null,
          error: error.message
        });
      }
    }

    return optimizedImages;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ImageOptimizer;
} else {
  window.ImageOptimizer = ImageOptimizer;
}