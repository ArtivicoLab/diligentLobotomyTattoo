/**
 * Hero Carousel Functionality
 */
document.addEventListener('DOMContentLoaded', function() {
  'use strict';
  
  // Hero carousel functionality
  const slides = document.querySelectorAll('.carousel-slide');
  const indicators = document.querySelectorAll('.indicator');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  let currentSlide = 0;
  const slideCount = slides.length;
  let slideInterval;
  
  // Function to show a specific slide
  function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => {
      slide.classList.remove('active');
    });
    
    // Remove active class from all indicators
    indicators.forEach(dot => {
      dot.classList.remove('active');
    });
    
    // Show the current slide
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
  }
  
  // Function to show the next slide
  function nextSlide() {
    currentSlide = (currentSlide + 1) % slideCount;
    showSlide(currentSlide);
  }
  
  // Function to show the previous slide
  function prevSlide() {
    currentSlide = (currentSlide - 1 + slideCount) % slideCount;
    showSlide(currentSlide);
  }
  
  // Event listeners for navigation buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      prevSlide();
      resetInterval();
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      nextSlide();
      resetInterval();
    });
  }
  
  // Event listeners for indicators
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', function() {
      currentSlide = index;
      showSlide(currentSlide);
      resetInterval();
    });
  });
  
  // Autoplay function
  function startAutoplay() {
    slideInterval = setInterval(nextSlide, 5000);
  }
  
  // Reset interval after manual navigation
  function resetInterval() {
    clearInterval(slideInterval);
    startAutoplay();
  }
  
  // Start autoplay on page load
  startAutoplay();
  
  // Pause autoplay on hover
  const carousel = document.querySelector('.hero-carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', function() {
      clearInterval(slideInterval);
    });
    
    carousel.addEventListener('mouseleave', function() {
      startAutoplay();
    });
  }
  
  // Touch support for mobile devices
  let touchStartX = 0;
  let touchEndX = 0;
  
  if (carousel) {
    carousel.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carousel.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }
  
  function handleSwipe() {
    // Minimum distance required for swipe
    const swipeThreshold = 50;
    
    // Detect swipe direction
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swiped left, show next slide
      nextSlide();
      resetInterval();
    } else if (touchEndX > touchStartX + swipeThreshold) {
      // Swiped right, show previous slide
      prevSlide();
      resetInterval();
    }
  }
});