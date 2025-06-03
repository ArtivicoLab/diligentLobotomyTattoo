/*
 * Diligent Lobotomy Tattoo - Core JavaScript
 * Business hours tracking and interactive features
 */

class DiligentLobotomyCore {
  constructor() {
    this.businessHours = {
      0: null, // Sunday - Closed
      1: { open: 11, close: 19 }, // Monday
      2: { open: 11, close: 19 }, // Tuesday
      3: { open: 11, close: 19 }, // Wednesday
      4: { open: 11, close: 19 }, // Thursday
      5: { open: 10, close: 21 }, // Friday
      6: { open: 10, close: 21 }  // Saturday
    };
    
    this.currentSlide = 0;
    this.totalSlides = 0;
    this.slideInterval = null;
    
    this.init();
  }

  init() {
    this.initBusinessStatus();
    this.initHeroSlider();
    this.initNavigation();
    this.initScrollEffects();
    this.initAnimations();
    this.initGalleryFilters();
    this.initFAQ();
    this.initGalleryModal();
  }

  initBusinessStatus() {
    const banner = document.getElementById('business-status-banner');
    if (!banner) return;

    this.updateBusinessStatus();
    // Update every minute
    setInterval(() => this.updateBusinessStatus(), 60000);
  }

  updateBusinessStatus() {
    const now = new Date();
    const currentDay = now.getDay();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour + (currentMinute / 60);

    const statusText = document.querySelector('.status-text');
    const statusIndicator = document.querySelector('.status-indicator');
    const currentTimeDisplay = document.querySelector('.current-time');
    const nextChangeDisplay = document.querySelector('.next-change');

    if (!statusText || !statusIndicator) return;

    // Update current time display
    if (currentTimeDisplay) {
      currentTimeDisplay.textContent = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    }

    const todayHours = this.businessHours[currentDay];
    let status, nextChange;

    if (!todayHours) {
      // Closed today
      status = 'CLOSED TODAY';
      nextChange = this.getNextOpenTime(now);
      statusIndicator.style.background = '#FF6B6B';
      statusIndicator.style.boxShadow = '0 0 15px #FF6B6B';
    } else if (currentTime >= todayHours.open && currentTime < todayHours.close) {
      // Currently open
      status = 'OPEN NOW';
      const closeTime = this.formatTime(todayHours.close);
      nextChange = `Closes at ${closeTime}`;
      statusIndicator.style.background = '#7FB069';
      statusIndicator.style.boxShadow = '0 0 15px #7FB069';
    } else {
      // Currently closed
      status = 'CLOSED';
      if (currentTime < todayHours.open) {
        // Will open today
        const openTime = this.formatTime(todayHours.open);
        nextChange = `Opens at ${openTime}`;
      } else {
        // Will open next business day
        nextChange = this.getNextOpenTime(now);
      }
      statusIndicator.style.background = '#FF8A9B';
      statusIndicator.style.boxShadow = '0 0 15px #FF8A9B';
    }

    statusText.textContent = status;
    if (nextChangeDisplay && nextChange) {
      nextChangeDisplay.textContent = nextChange;
    }
  }

  getNextOpenTime(now) {
    const currentDay = now.getDay();
    let checkDay = (currentDay + 1) % 7;
    let daysAhead = 1;

    while (daysAhead <= 7) {
      const dayHours = this.businessHours[checkDay];
      if (dayHours) {
        const dayName = this.getDayName(checkDay);
        const openTime = this.formatTime(dayHours.open);
        return `Opens ${dayName} at ${openTime}`;
      }
      checkDay = (checkDay + 1) % 7;
      daysAhead++;
    }

    return 'Hours coming soon';
  }

  formatTime(hour) {
    const h = Math.floor(hour);
    const m = Math.round((hour - h) * 60);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h > 12 ? h - 12 : (h === 0 ? 12 : h);
    return `${displayHour}:${m.toString().padStart(2, '0')} ${period}`;
  }

  getDayName(dayIndex) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex];
  }

  initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.hero-indicator');
    
    if (slides.length === 0) return;
    
    this.totalSlides = slides.length;
    
    // Set up indicators
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index));
    });

    // Auto-play slider
    this.startSlideshow();
    
    // Pause on hover
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.addEventListener('mouseenter', () => this.pauseSlideshow());
      hero.addEventListener('mouseleave', () => this.startSlideshow());
    }
  }

  goToSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.hero-indicator');

    // Remove active class from all
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));

    // Add active class to current
    if (slides[index]) slides[index].classList.add('active');
    if (indicators[index]) indicators[index].classList.add('active');

    this.currentSlide = index;
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.goToSlide(this.currentSlide);
  }

  startSlideshow() {
    this.pauseSlideshow();
    this.slideInterval = setInterval(() => this.nextSlide(), 5000);
  }

  pauseSlideshow() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.slideInterval = null;
    }
  }

  initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
      menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
      });
    }

    // Dropdown functionality for mobile
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          const dropdown = toggle.closest('.dropdown');
          const menu = dropdown.querySelector('.dropdown-menu');
          
          // Close other dropdowns
          document.querySelectorAll('.dropdown-menu').forEach(otherMenu => {
            if (otherMenu !== menu) {
              otherMenu.classList.remove('active');
            }
          });
          
          menu.classList.toggle('active');
        }
      });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
          menu.classList.remove('active');
        });
      }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Close mobile menu after clicking
          if (navLinks) {
            navLinks.classList.remove('active');
          }
          if (menuToggle) {
            menuToggle.classList.remove('active');
          }
        }
      });
    });
  }

  initScrollEffects() {
    // Header background on scroll
    const header = document.getElementById('header');
    if (header) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
          header.style.background = 'rgba(26, 26, 26, 0.98)';
        } else {
          header.style.background = 'rgba(26, 26, 26, 0.95)';
        }
      });
    }

    // Fade in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(30px)';
      section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(section);
    });
  }

  initAnimations() {
    // Floating animation for cards and elements
    document.querySelectorAll('.card, .service-card, .artist-card').forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add('float-animation');
    });

    // Parallax effect for hero
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const heroSlider = document.querySelector('.hero-slider');
      if (heroSlider) {
        heroSlider.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    });
  }

  initGalleryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterBtns.length === 0) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter items
        galleryItems.forEach(item => {
          const categories = item.dataset.category.split(' ');
          
          if (filter === 'all' || categories.includes(filter)) {
            item.style.display = 'block';
            item.style.opacity = '0';
            setTimeout(() => {
              item.style.opacity = '1';
            }, 100);
          } else {
            item.style.opacity = '0';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all FAQ items
        faqItems.forEach(faq => faq.classList.remove('active'));
        
        // Open clicked item if it wasn't active
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  }

  initGalleryModal() {
    const galleryExpands = document.querySelectorAll('.gallery-expand');

    galleryExpands.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const galleryItem = btn.closest('.gallery-item');
        const img = galleryItem.querySelector('img');
        const info = galleryItem.querySelector('.gallery-info h4');
        
        this.openGalleryModal(img.src, info.textContent);
      });
    });
  }

  // Gallery functionality
  openGalleryModal(imageSrc, altText) {
    const modal = document.createElement('div');
    modal.className = 'gallery-modal';
    modal.innerHTML = `
      <div class="modal-backdrop">
        <div class="modal-content">
          <button class="modal-close">&times;</button>
          <img src="${imageSrc}" alt="${altText}">
          <div class="modal-info">
            <h3>${altText}</h3>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Close modal
    const closeModal = () => {
      document.body.removeChild(modal);
      document.body.style.overflow = '';
    };

    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-backdrop').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeModal();
    });

    // ESC key
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new DiligentLobotomyCore();
});

// Add CSS for floating animation
const floatingCSS = `
.float-animation {
  animation: gentleFloat 6s ease-in-out infinite;
}

@keyframes gentleFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.gallery-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
}

.modal-backdrop {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  background: var(--warm-black);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-luxury);
}

.modal-content img {
  width: 100%;
  height: auto;
  display: block;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--coral-pink);
  color: var(--warm-black);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10;
}

.modal-info {
  padding: 1rem;
  color: var(--cream-white);
}
`;

// Inject the CSS
const style = document.createElement('style');
style.textContent = floatingCSS;
document.head.appendChild(style);