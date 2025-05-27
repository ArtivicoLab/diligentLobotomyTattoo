/**
 * 404 Error Handler for Static Site
 * Detects broken links and redirects to custom 404 page
 */

(function() {
  'use strict';

  /**
   * Check if current page should show 404
   */
  function check404() {
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;
    
    // Don't redirect if we're already on the 404 page
    if (currentPath.includes('404.html')) {
      return;
    }
    
    // Don't redirect if we're on the homepage
    if (currentPath === '/' || currentPath === '/index.html') {
      return;
    }
    
    // List of valid pages/sections that exist
    const validPaths = [
      '/',
      '/index.html',
      '/404.html',
      '/#home',
      '/#about',
      '/#services', 
      '/#gallery',
      '/#card-gallery',
      '/#calculator',
      '/#contact',
      '/#featured',
      '/#testimonials'
    ];
    
    // Check if current path is valid
    const isValidPath = validPaths.some(path => {
      if (path.startsWith('/#')) {
        return currentPath === '/' && window.location.hash === path.substring(1);
      }
      return currentPath === path;
    });
    
    // If path is not valid and doesn't contain common file extensions, redirect to 404
    if (!isValidPath && !currentPath.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|pdf)$/i)) {
      // Add a small delay to prevent flash
      setTimeout(() => {
        window.location.href = '/404.html';
      }, 100);
    }
  }

  /**
   * Handle hash changes for single page navigation
   */
  function handleHashChange() {
    const hash = window.location.hash;
    
    // Valid hash sections
    const validHashes = [
      '',
      '#home',
      '#about', 
      '#services',
      '#gallery',
      '#card-gallery',
      '#calculator',
      '#contact',
      '#featured',
      '#testimonials'
    ];
    
    // If hash is not empty and not in valid list, redirect to 404
    if (hash && !validHashes.includes(hash)) {
      setTimeout(() => {
        window.location.href = '/404.html';
      }, 100);
    }
  }

  /**
   * Handle broken image links
   */
  function handleBrokenImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      img.addEventListener('error', function() {
        // Don't redirect for missing images, just handle gracefully
        this.style.display = 'none';
        console.log('Image not found:', this.src);
      });
    });
  }

  /**
   * Handle broken internal links
   */
  function handleBrokenLinks() {
    const links = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]');
    
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip if it's a hash link or external
        if (href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) {
          return;
        }
        
        // Check if the link would lead to a 404
        const validLinks = [
          '/',
          '/index.html',
          '/404.html'
        ];
        
        if (!validLinks.includes(href) && !href.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|pdf)$/i)) {
          e.preventDefault();
          window.location.href = '/404.html';
        }
      });
    });
  }

  /**
   * Initialize 404 handling
   */
  function init() {
    // Check current page on load
    check404();
    
    // Handle hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Handle broken images and links when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        handleBrokenImages();
        handleBrokenLinks();
      });
    } else {
      handleBrokenImages();
      handleBrokenLinks();
    }
    
    console.log('✅ 404 Handler initialized');
  }

  // Initialize when script loads
  init();

})();