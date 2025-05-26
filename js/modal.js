/**
 * Crimson Ink Tattoos
 * Image Modal Functionality
 */

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // Image modal functionality
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-image');
  const closeModal = document.querySelector('.close-modal');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const successModal = document.getElementById('success-modal');
  
  // Open modal when clicking on gallery items
  galleryItems.forEach(item => {
    item.addEventListener('click', function() {
      const imgSrc = this.querySelector('img').src;
      const imgAlt = this.querySelector('img').alt;
      
      modalImg.src = imgSrc;
      modalImg.alt = imgAlt;
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
      
      // Add fade-in animation
      setTimeout(() => {
        modal.classList.add('fade-in');
      }, 10);
    });
  });
  
  // Support for touch events on gallery items
  const isTouchDevice = ('ontouchstart' in window) || 
                        (navigator.maxTouchPoints > 0) || 
                        (navigator.msMaxTouchPoints > 0);
  
  if (isTouchDevice) {
    galleryItems.forEach(item => {
      // Use touchstart and touchend for more responsive feel on mobile
      item.addEventListener('touchstart', function(e) {
        this.touchStartX = e.changedTouches[0].screenX;
        this.touchStartY = e.changedTouches[0].screenY;
      }, { passive: true });
      
      item.addEventListener('touchend', function(e) {
        // Only trigger if it was a tap (not a scroll)
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        const xDiff = Math.abs(touchEndX - this.touchStartX);
        const yDiff = Math.abs(touchEndY - this.touchStartY);
        
        // If movement is small enough to be considered a tap
        if (xDiff < 10 && yDiff < 10) {
          const imgSrc = this.querySelector('img').src;
          const imgAlt = this.querySelector('img').alt;
          
          modalImg.src = imgSrc;
          modalImg.alt = imgAlt;
          modal.style.display = 'flex';
          document.body.style.overflow = 'hidden';
          
          setTimeout(() => {
            modal.classList.add('fade-in');
          }, 10);
        }
      }, { passive: true });
    });
  }
  
  // Close modal when clicking the close button
  if (closeModal) {
    closeModal.addEventListener('click', function() {
      closeImageModal();
    });
  }
  
  // Close modal when clicking outside the image
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeImageModal();
    }
  });
  
  // Close modal with escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (modal.style.display === 'flex') {
        closeImageModal();
      }
      if (successModal && successModal.style.display === 'flex') {
        successModal.style.display = 'none';
      }
    }
  });
  
  // Helper function to close the modal
  function closeImageModal() {
    modal.classList.remove('fade-in');
    setTimeout(() => {
      modal.style.display = 'none';
      document.body.style.overflow = ''; // Re-enable scrolling
    }, 300);
  }
  
  // Modal swiping on touch devices
  if (isTouchDevice) {
    let touchStartX = 0;
    let touchEndX = 0;
    
    modal.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    modal.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
      const swipeThreshold = 100;
      if (touchEndX < touchStartX - swipeThreshold) {
        // Swiped left - could implement next image
        closeImageModal();
      }
      if (touchEndX > touchStartX + swipeThreshold) {
        // Swiped right - could implement previous image
        closeImageModal();
      }
    }
  }
  
  // Handle success modal close button
  const closeSuccess = document.querySelector('.close-success');
  if (closeSuccess && successModal) {
    closeSuccess.addEventListener('click', function() {
      successModal.style.display = 'none';
    });
    
    // Close success modal when clicking outside
    successModal.addEventListener('click', function(e) {
      if (e.target === successModal) {
        successModal.style.display = 'none';
      }
    });
  }
});
