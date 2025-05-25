/**
 * Crimson Ink Tattoos
 * Main JavaScript functionality
 */

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // Set current year in footer
  document.getElementById('current-year').textContent = new Date().getFullYear();

  // Navigation functionality
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  menuToggle.addEventListener('click', function() {
    this.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });

  // Close menu when clicking on a link
  const navItems = document.querySelectorAll('.nav-links a');
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return;
      
      e.preventDefault();
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerOffset = 70;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Gallery filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      const filterValue = this.getAttribute('data-filter');
      
      galleryItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
          }, 50);
        } else {
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Testimonial slider
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.prev-testimonial');
  const nextBtn = document.querySelector('.next-testimonial');
  let currentSlide = 0;
  const slideCount = testimonialSlides.length;

  function showSlide(index) {
    // Hide all slides
    testimonialSlides.forEach(slide => {
      slide.classList.remove('active');
    });
    
    // Remove active class from all dots
    dots.forEach(dot => {
      dot.classList.remove('active');
    });
    
    // Show the current slide
    testimonialSlides[index].classList.add('active');
    dots[index].classList.add('active');
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slideCount;
    showSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slideCount) % slideCount;
    showSlide(currentSlide);
  }

  // Next button click
  nextBtn.addEventListener('click', nextSlide);
  
  // Previous button click
  prevBtn.addEventListener('click', prevSlide);
  
  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentSlide = index;
      showSlide(currentSlide);
    });
  });

  // Auto advance slides every 5 seconds
  let slideInterval = setInterval(nextSlide, 5000);
  
  // Pause auto-advance when hovering over testimonial
  const testimonialSection = document.querySelector('.testimonials-slider');
  
  testimonialSection.addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
  });
  
  testimonialSection.addEventListener('mouseleave', () => {
    slideInterval = setInterval(nextSlide, 5000);
  });

  // Form validation
  const contactForm = document.getElementById('contact-form');
  const successModal = document.getElementById('success-modal');
  const closeSuccess = document.querySelector('.close-success');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Reset error messages
      document.querySelectorAll('.error-message').forEach(error => {
        error.style.display = 'none';
        error.textContent = '';
      });
      
      let hasErrors = false;
      
      // Validate name
      const nameInput = document.getElementById('name');
      if (!nameInput.value.trim()) {
        showError(nameInput, 'Name is required');
        hasErrors = true;
      }
      
      // Validate email
      const emailInput = document.getElementById('email');
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim()) {
        showError(emailInput, 'Email is required');
        hasErrors = true;
      } else if (!emailPattern.test(emailInput.value)) {
        showError(emailInput, 'Please enter a valid email address');
        hasErrors = true;
      }
      
      // Validate phone (optional)
      const phoneInput = document.getElementById('phone');
      if (phoneInput.value.trim()) {
        const phonePattern = /^[\d\s\+\-\(\)]{7,20}$/;
        if (!phonePattern.test(phoneInput.value)) {
          showError(phoneInput, 'Please enter a valid phone number');
          hasErrors = true;
        }
      }
      
      // Validate message
      const messageInput = document.getElementById('message');
      if (!messageInput.value.trim()) {
        showError(messageInput, 'Message is required');
        hasErrors = true;
      } else if (messageInput.value.trim().length < 10) {
        showError(messageInput, 'Message must be at least 10 characters');
        hasErrors = true;
      }
      
      // If no errors, submit the form (show success modal in this demo)
      if (!hasErrors) {
        // In a real implementation, you would send the form data to a server here
        // For demo purposes, just show the success modal
        successModal.style.display = 'flex';
        contactForm.reset();
      }
    });
    
    // Helper function to show error messages
    function showError(input, message) {
      const errorElement = input.nextElementSibling;
      errorElement.textContent = message;
      errorElement.style.display = 'block';
      input.focus();
    }
    
    // Close success modal
    if (closeSuccess) {
      closeSuccess.addEventListener('click', function() {
        successModal.style.display = 'none';
      });
    }
  }

  // Intersection Observer for scroll animations
  if ('IntersectionObserver' in window) {
    const sections = document.querySelectorAll('section');
    
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          sectionObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
    
    sections.forEach(section => {
      sectionObserver.observe(section);
    });
  }

  // Touch/click handling for gallery items
  const galleryImages = document.querySelectorAll('.gallery-image');
  
  // Detect if device supports touch
  const isTouchDevice = ('ontouchstart' in window) || 
                        (navigator.maxTouchPoints > 0) || 
                        (navigator.msMaxTouchPoints > 0);
  
  if (isTouchDevice) {
    // For touch devices
    galleryImages.forEach(image => {
      image.addEventListener('touchstart', function() {
        this.classList.add('pulse');
      });
      
      image.addEventListener('touchend', function() {
        this.classList.remove('pulse');
      });
    });
  } else {
    // For non-touch devices (mouse hover)
    galleryImages.forEach(image => {
      image.addEventListener('mouseenter', function() {
        this.classList.add('pulse');
      });
      
      image.addEventListener('mouseleave', function() {
        this.classList.remove('pulse');
      });
    });
  }
});
