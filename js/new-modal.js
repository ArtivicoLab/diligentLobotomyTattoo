/**
 * Crimson Ink Tattoos - Redesigned
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
      let touchStartX = 0;
      let touchStartY = 0;
      
      item.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      }, { passive: true });
      
      item.addEventListener('touchend', function(e) {
        // Only trigger if it was a tap (not a scroll)
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        const xDiff = Math.abs(touchEndX - touchStartX);
        const yDiff = Math.abs(touchEndY - touchStartY);
        
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
        closeSuccessModal();
      }
    }
  });
  
  // Helper function to close the modal with animation
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
  
  // Handle success modal
  const closeSuccess = document.querySelectorAll('.close-success');
  if (closeSuccess.length > 0 && successModal) {
    closeSuccess.forEach(btn => {
      btn.addEventListener('click', function() {
        closeSuccessModal();
      });
    });
    
    // Close success modal when clicking outside
    successModal.addEventListener('click', function(e) {
      if (e.target === successModal) {
        closeSuccessModal();
      }
    });
  }
  
  // Helper function to close success modal with animation
  function closeSuccessModal() {
    successModal.classList.remove('fade-in');
    setTimeout(() => {
      successModal.style.display = 'none';
    }, 300);
  }
  
  // Add hover effect for merchandise items
  const merchItems = document.querySelectorAll('.merch-item');
  merchItems.forEach(item => {
    const btn = item.querySelector('.btn');
    
    item.addEventListener('mouseenter', function() {
      if (btn) btn.classList.add('pulse');
    });
    
    item.addEventListener('mouseleave', function() {
      if (btn) btn.classList.remove('pulse');
    });
  });
});