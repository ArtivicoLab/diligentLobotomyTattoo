/**
 * Gaming-Style Card Deck Gallery
 * Interactive deck system with smooth animations and smart hover controls
 */

// Global variables
let currentIndex = 0;
let cards = [];
let isAutoRevealing = false;
let autoRevealInterval;
let cardDeck;
let deckControls;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  cardDeck = document.querySelector('.card-deck');
  deckControls = document.querySelectorAll('.deck-control');
  
  if (cardDeck) {
    initializeDeck();
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboard);
    
    // Touch navigation
    cardDeck.addEventListener('touchstart', handleTouchStart, { passive: true });
    cardDeck.addEventListener('touchend', handleTouchEnd, { passive: true });
  }

  /**
   * Initialize the card deck system
   */
  function initializeDeck() {
    if (!cardDeck) return;

    // Load cards directly
    loadCardsFromFolder();
  }

  /**
   * Load cards from gallery folder
   */
  function loadCardsFromFolder() {
    const cardGalleryPath = 'images/card-gallery/';
    
    // Known image files from your gallery
    const cardData = [
      {
        url: cardGalleryPath + 'black-gray-artistry.jpg',
        title: 'Black & Gray Artistry',
        description: 'Stunning black and gray realism showcasing incredible detail and shading techniques.'
      },
      {
        url: cardGalleryPath + 'custom-design-work.jpg',
        title: 'Custom Design Work',
        description: 'Unique custom designs tailored specifically to bring client visions to life.'
      },
      {
        url: cardGalleryPath + 'detailed-portrait-work.jpg',
        title: 'Detailed Portrait Work',
        description: 'Incredibly detailed portrait work capturing every nuance with artistic precision.'
      },
      {
        url: cardGalleryPath + 'geometric-design.jpg',
        title: 'Geometric Design',
        description: 'Modern geometric patterns featuring clean lines and contemporary artistic elements.'
      },
      {
        url: cardGalleryPath + 'realistic-portrait.jpg',
        title: 'Realistic Portrait',
        description: 'Photorealistic portrait work demonstrating masterful technique and attention to detail.'
      },
      {
        url: cardGalleryPath + 'vibrant-color-masterpiece.jpg',
        title: 'Vibrant Color Masterpiece',
        description: 'Bold, vibrant colors bringing life and energy to creative tattoo designs.'
      },
      {
        url: cardGalleryPath + 'IMG_8677.png',
        title: 'Professional Artistry',
        description: 'Professional tattoo artistry showcasing our skilled craftsmanship and creativity.'
      }
    ];

    createCardsFromData(cardData);
  }

  /**
   * Create cards from data
   */
  function createCardsFromData(cardData) {
    // Clear the deck and create cards
    cardDeck.innerHTML = '';
    cards = [];

    cardData.forEach((data, index) => {
      const card = createCard(data, index);
      cardDeck.appendChild(card);
      cards.push(card);
    });

    console.log(`✨ Created ${cards.length} interactive cards!`);
    
    // Setup interactions and start auto-cycling
    if (cards.length > 0) {
      setupCardInteractions();
      startAutoReveal();
    }
  }

  /**
   * Format filename into a readable card title
   */
  function formatCardTitle(filename) {
    return filename
      .replace(/\.(jpg|jpeg|png|gif)$/i, '')
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Generate description based on filename
   */
  function generateDescription(filename) {
    const descriptions = {
      'vibrant-color': 'Stunning vibrant color tattoo showcasing artistic brilliance',
      'black-gray': 'Masterful black and gray shading technique',
      'custom-design': 'Unique custom design tailored to client vision',
      'detailed-portrait': 'Incredibly detailed portrait work with precision',
      'colorful-dragon': 'Majestic dragon design with vivid colors',
      'realistic-portrait': 'Photorealistic portrait capturing every detail',
      'geometric-design': 'Modern geometric patterns with clean lines',
      'floral-sleeve': 'Beautiful floral sleeve with intricate details',
      'minimalist-art': 'Clean minimalist design with elegant simplicity',
      'traditional-style': 'Classic traditional tattoo style',
      'watercolor-design': 'Artistic watercolor technique with flowing colors',
      'tribal-artwork': 'Bold tribal patterns with cultural significance'
    };

    for (const [key, desc] of Object.entries(descriptions)) {
      if (filename.toLowerCase().includes(key)) {
        return desc;
      }
    }
    return 'Professional tattoo artistry by our skilled artists';
  }

  /**
   * Create a card element with accessibility features
   */
  function createCard(cardData, index) {
    const card = document.createElement('div');
    card.className = 'deck-card';
    card.setAttribute('role', 'img');
    card.setAttribute('aria-label', `Tattoo artwork: ${cardData.title}. ${cardData.description}`);
    card.setAttribute('tabindex', '0');
    card.innerHTML = `
      <div class="card-image">
        <img src="${cardData.url}" alt="${cardData.title} - ${cardData.description}" loading="lazy" role="presentation">
      </div>
      <div class="card-info">
        <h4>${cardData.title}</h4>
        <p>${cardData.description}</p>
      </div>
    `;

    // Hide all cards except the first one
    if (index !== 0) {
      card.style.display = 'none';
    }

    return card;
  }

  /**
   * Setup card interactions and initial states
   */
  function setupCardInteractions() {
    if (cards.length === 0) return;

    // Show first card
    currentIndex = 0;
    showCurrentCard();

    // Update counter
    updateCounter();

    // Setup hover pause/resume
    cardDeck.addEventListener('mouseenter', pauseAutoReveal);
    cardDeck.addEventListener('mouseleave', resumeAutoReveal);

    // Announce to screen readers
    announce(`Card gallery loaded with ${cards.length} tattoo designs. Use arrow keys to navigate.`);
  }

  /**
   * Show current card and hide others
   */
  function showCurrentCard() {
    cards.forEach((card, index) => {
      if (index === currentIndex) {
        card.style.display = 'block';
        card.classList.add('active');
      } else {
        card.style.display = 'none';
        card.classList.remove('active');
      }
    });
  }

  /**
   * Announce to screen readers
   */
  function announce(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  }

  /**
   * Move to next card
   */
  function nextCard() {
    if (cards.length === 0) return;
    currentIndex = (currentIndex + 1) % cards.length;
    showCurrentCard();
    updateCounter();
    announce(`Showing card ${currentIndex + 1} of ${cards.length}`);
  }

  /**
   * Move to previous card
   */
  function prevCard() {
    if (cards.length === 0) return;
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    showCurrentCard();
    updateCounter();
    announce(`Showing card ${currentIndex + 1} of ${cards.length}`);
  }

  /**
   * Start auto reveal mode
   */
  function startAutoReveal() {
    if (cards.length <= 1) return;
    isAutoRevealing = true;
    autoRevealInterval = setInterval(nextCard, 4000);
  }

  /**
   * Pause auto reveal on hover
   */
  function pauseAutoReveal() {
    if (autoRevealInterval) {
      clearInterval(autoRevealInterval);
    }
  }

  /**
   * Resume auto reveal when hover ends
   */
  function resumeAutoReveal() {
    if (isAutoRevealing && cards.length > 1) {
      autoRevealInterval = setInterval(nextCard, 4000);
    }
  }

  /**
   * Toggle auto reveal mode
   */
  function toggleAutoReveal() {
    if (isAutoRevealing) {
      pauseAutoReveal();
      isAutoRevealing = false;
      announce('Auto-cycling paused');
    } else {
      startAutoReveal();
      announce('Auto-cycling resumed');
    }
  }

  /**
   * Shuffle deck
   */
  function shuffleDeck() {
    if (cards.length <= 1) return;
    
    // Fisher-Yates shuffle
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      cardDeck.insertBefore(cards[j], cards[i].nextSibling);
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    
    currentIndex = 0;
    showCurrentCard();
    updateCounter();
    announce('Deck shuffled');
  }

  /**
   * Reset deck to original state
   */
  function resetDeck() {
    currentIndex = 0;
    showCurrentCard();
    updateCounter();
    if (!isAutoRevealing) {
      startAutoReveal();
    }
    announce('Deck reset to beginning');
  }

  /**
   * Update the card counter display
   */
  function updateCounter() {
    const counter = document.querySelector('.deck-counter');
    if (counter && cards.length > 0) {
      counter.textContent = `${currentIndex + 1} / ${cards.length}`;
    }
  }

  /**
   * Handle keyboard navigation
   */
  function handleKeyboard(event) {
    if (!cardDeck.contains(document.activeElement) && document.activeElement !== cardDeck) {
      return;
    }

    switch(event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        nextCard();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        prevCard();
        break;
      case ' ':
        event.preventDefault();
        toggleAutoReveal();
        break;
      case 'Home':
        event.preventDefault();
        currentIndex = 0;
        showCurrentCard();
        updateCounter();
        break;
      case 'End':
        event.preventDefault();
        currentIndex = cards.length - 1;
        showCurrentCard();
        updateCounter();
        break;
    }
  }

  // Touch navigation variables
  let touchStartX = 0;
  let touchEndX = 0;

  /**
   * Handle touch start for swipe navigation
   */
  function handleTouchStart(event) {
    touchStartX = event.changedTouches[0].screenX;
  }

  /**
   * Handle touch end for swipe navigation
   */
  function handleTouchEnd(event) {
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
  }

  /**
   * Handle swipe gestures
   */
  function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchStartX - touchEndX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0) {
        // Swiped left - next card
        nextCard();
      } else {
        // Swiped right - previous card
        prevCard();
      }
    }
  }

  // Global functions for button controls
  window.nextCard = nextCard;
  window.prevCard = prevCard;
  window.toggleAutoReveal = toggleAutoReveal;
  window.shuffleDeck = shuffleDeck;
  window.resetDeck = resetDeck;
});

// Social sharing functions
function getCurrentPageUrl() {
  return window.location.href;
}

function shareWebsiteToFacebook() {
  const url = getCurrentPageUrl();
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  window.open(shareUrl, '_blank', 'width=600,height=400');
}

function shareWebsiteToTwitter() {
  const url = getCurrentPageUrl();
  const text = 'Check out this amazing tattoo shop! Professional artistry and custom designs.';
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  window.open(shareUrl, '_blank', 'width=600,height=400');
}

function shareWebsiteToInstagram() {
  // Instagram doesn't have direct web sharing, so copy link instead
  copyWebsiteLink();
  alert('Link copied! You can now paste it in your Instagram story or bio.');
}

function shareWebsiteToWhatsApp() {
  const url = getCurrentPageUrl();
  const text = 'Check out this amazing tattoo shop! Professional artistry and custom designs.';
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
  window.open(shareUrl, '_blank');
}

function copyWebsiteLink(buttonElement) {
  const url = getCurrentPageUrl();
  navigator.clipboard.writeText(url).then(() => {
    if (buttonElement) {
      const originalText = buttonElement.innerHTML;
      buttonElement.innerHTML = '<i class="fas fa-check"></i> Copied!';
      buttonElement.style.background = '#28a745';
      setTimeout(() => {
        buttonElement.innerHTML = originalText;
        buttonElement.style.background = '';
      }, 2000);
    } else {
      alert('Website link copied to clipboard!');
    }
  }).catch(() => {
    alert('Could not copy link. Please copy manually: ' + url);
  });
}