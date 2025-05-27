/**
 * Gaming-Style Card Deck Gallery
 * Interactive deck system with smooth animations and smart hover controls
 * Now includes automatic image optimization for better performance
 */

document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const cardDeck = document.getElementById('card-deck');
  const prevBtn = document.getElementById('prev-card');
  const nextBtn = document.getElementById('next-card');
  const autoRevealBtn = document.getElementById('auto-reveal');
  const resetBtn = document.getElementById('reset-deck');
  const shuffleBtn = document.getElementById('shuffle-deck');
  const cardCounter = document.getElementById('card-counter');

  // State Management
  let cards = [];
  let currentCardIndex = 0;
  let isAnimating = false;
  let autoRevealInterval = null;
  let isAutoRevealing = false;
  let isPaused = false;
  let hoverTimeout = null;

  // Accessibility elements
  const announcements = document.getElementById('gallery-announcements');

  // Initialize the deck
  initializeDeck();

  // Event Listeners
  if (prevBtn) prevBtn.addEventListener('click', prevCard);
  if (nextBtn) nextBtn.addEventListener('click', nextCard);
  if (autoRevealBtn) autoRevealBtn.addEventListener('click', toggleAutoReveal);
  if (resetBtn) resetBtn.addEventListener('click', resetDeck);
  if (shuffleBtn) shuffleBtn.addEventListener('click', shuffleDeck);

  // Keyboard Navigation
  document.addEventListener('keydown', handleKeyboard);

  // Touch/Swipe Support
  let touchStartX = 0;
  let touchStartY = 0;

  if (cardDeck) {
    cardDeck.addEventListener('touchstart', handleTouchStart, { passive: true });
    cardDeck.addEventListener('touchend', handleTouchEnd, { passive: true });
  }

  /**
   * Initialize the card deck system
   */
  async function initializeDeck() {
    if (!cardDeck) return;

    // Show loading state
    cardDeck.innerHTML = '<div class="deck-loading"><i class="fas fa-spinner"></i><p>Loading cards...</p></div>';

    try {
      await loadCardsFromFolder();
      if (existingCards && existingCards.length > 0) {
        createCardsFromData();
        setupCardInteractions();
        startAutoReveal();
      } else {
        cardDeck.innerHTML = '<div class="deck-loading"><p>No cards found. Add images to the gallery folder.</p></div>';
      }
    } catch (error) {
      console.error('Error loading cards:', error);
      cardDeck.innerHTML = '<div class="deck-loading"><p>Error loading cards. Please try again.</p></div>';
    }
  }

  /**
   * Load cards dynamically from the images/card-gallery folder
   */
  async function loadCardsFromFolder() {
    const cardGalleryPath = 'images/card-gallery/';
    
    // Try to get the list of files from the server
    let imageFiles = [];
    
    try {
      const response = await fetch(cardGalleryPath);
      if (response.ok) {
        const html = await response.text();
        // Parse HTML to extract image file names
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = doc.querySelectorAll('a[href]');
        
        links.forEach(link => {
          const href = link.getAttribute('href');
          if (href && (href.match(/\.(jpg|jpeg|png|gif|webp)$/i))) {
            imageFiles.push(href);
          }
        });
      }
    } catch (error) {
      console.log('Could not fetch directory listing, using fallback method');
    }
    
    // Fallback: try known patterns and common filenames
    if (imageFiles.length === 0) {
      const potentialImages = [
        'vibrant-color-masterpiece.jpg',
        'black-gray-artistry.jpg', 
        'custom-design-work.jpg',
        'detailed-portrait-work.jpg',
        'colorful-dragon-tattoo.jpg',
        'realistic-portrait.jpg',
        'geometric-design.jpg',
        'floral-sleeve.jpg',
        'minimalist-art.jpg',
        'traditional-style.jpg',
        'watercolor-design.jpg',
        'tribal-artwork.jpg',
        // Common patterns from attached assets
        'IMG_8677.png',
        'IMG_8678.png',
        'IMG_8679.png',
        'IMG_8680.png',
        'IMG_8681.png',
        'IMG_8682.png',
        'IMG_8683.png',
        'IMG_8684.jpeg',
        'IMG_8685.jpeg',
        'IMG_8686.jpeg',
        'IMG_8687.jpeg',
        'IMG_8688.jpeg',
        'IMG_8689.jpeg',
        'IMG_8690.jpeg',
        'IMG_8691.jpeg',
        'IMG_8692.jpeg'
      ];
      imageFiles = potentialImages;
    }

    const existingCards = [];
    
    for (const imageName of imageFiles) {
      let imageUrl = cardGalleryPath + imageName;
      
      // Use optimized version if smart gallery manager is available
      if (window.smartGalleryManager) {
        try {
          const optimizedUrl = await window.smartGalleryManager.getDisplayImage(imageName);
          if (optimizedUrl) {
            imageUrl = optimizedUrl;
          }
        } catch (error) {
          console.log(`Using original image for ${imageName}`);
        }
      }
      
      if (await imageExists(imageUrl) || imageUrl.startsWith('data:')) {
        existingCards.push({
          url: imageUrl,
          title: formatCardTitle(imageName),
          description: generateDescription(imageName)
        });
      }
    }

    // Clear the deck and create cards
    cardDeck.innerHTML = '';
    cards = [];

    existingCards.forEach((cardData, index) => {
      const card = createCard(cardData, index);
      cardDeck.appendChild(card);
      cards.push(card);
    });

    console.log(`✨ Loaded ${cards.length} cards into deck!`);
  }

  /**
   * Check if an image exists
   */
  function imageExists(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
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
    return card;
  }

  /**
   * Setup card interactions and initial states
   */
  function setupCardInteractions() {
    // Set initial card states
    cards.forEach((card, index) => {
      if (index === 0) {
        card.classList.add('top-card');
      } else {
        card.classList.add('in-deck');
      }
      
      // Add click handler
      card.addEventListener('click', nextCard);
      
      // Add touch hover effects
      card.addEventListener('touchstart', (e) => {
        e.preventDefault();
        card.classList.add('touch-active');
      });
      
      card.addEventListener('touchend', (e) => {
        e.preventDefault();
        setTimeout(() => {
          card.classList.remove('touch-active');
        }, 150);
      });
      
      card.addEventListener('touchcancel', () => {
        card.classList.remove('touch-active');
      });
    });

    // Setup hover pause functionality with debouncing
    if (cardDeck) {
      cardDeck.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimeout);
        pauseAutoReveal();
      });
      
      cardDeck.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(resumeAutoReveal, 200);
      });
    }

    currentCardIndex = 0;
  }

  /**
   * Announce to screen readers
   */
  function announce(message) {
    if (announcements) {
      announcements.textContent = message;
    }
  }

  /**
   * Move to next card
   */
  function nextCard() {
    if (isAnimating || cards.length === 0) return;
    
    isAnimating = true;
    const currentCard = cards[currentCardIndex];
    const nextIndex = (currentCardIndex + 1) % cards.length;
    const nextCard = cards[nextIndex];
    
    // Start animations
    currentCard.classList.remove('top-card');
    currentCard.classList.add('moving-to-back');
    
    nextCard.classList.remove('in-deck');
    nextCard.classList.add('coming-from-back');
    
    // Update index
    currentCardIndex = nextIndex;
    
    // Complete animation after transition
    setTimeout(() => {
      currentCard.classList.remove('moving-to-back');
      currentCard.classList.add('in-deck');
      
      nextCard.classList.remove('coming-from-back');
      nextCard.classList.add('top-card');
      
      isAnimating = false;
      updateCounter();
      
      // Announce card change to screen readers
      const cardTitle = nextCard.querySelector('h4')?.textContent || 'Card';
      announce(`Now viewing ${cardTitle}, card ${currentCardIndex + 1} of ${cards.length}`);
    }, 600);
  }

  /**
   * Move to previous card
   */
  function prevCard() {
    if (isAnimating || cards.length === 0) return;
    
    isAnimating = true;
    const currentCard = cards[currentCardIndex];
    const prevIndex = currentCardIndex === 0 ? cards.length - 1 : currentCardIndex - 1;
    const prevCard = cards[prevIndex];
    
    // Start animations
    currentCard.classList.remove('top-card');
    currentCard.classList.add('in-deck');
    
    prevCard.classList.remove('in-deck');
    prevCard.classList.add('coming-from-back');
    
    // Update index
    currentCardIndex = prevIndex;
    
    // Complete animation
    setTimeout(() => {
      prevCard.classList.remove('coming-from-back');
      prevCard.classList.add('top-card');
      
      isAnimating = false;
      updateCounter();
      
      // Announce card change to screen readers
      const cardTitle = prevCard.querySelector('h4')?.textContent || 'Card';
      announce(`Now viewing ${cardTitle}, card ${currentCardIndex + 1} of ${cards.length}`);
    }, 600);
  }

  /**
   * Pause auto reveal on hover
   */
  function pauseAutoReveal() {
    if (isAutoRevealing && !isPaused) {
      isPaused = true;
      clearInterval(autoRevealInterval);
      autoRevealInterval = null;
      
      if (autoRevealBtn) {
        autoRevealBtn.style.opacity = '0.6';
        autoRevealBtn.innerHTML = '<i class="fas fa-pause"></i> <span>Paused</span>';
      }
    }
  }

  /**
   * Resume auto reveal when hover ends
   */
  function resumeAutoReveal() {
    if (isAutoRevealing && isPaused && !autoRevealInterval) {
      isPaused = false;
      
      autoRevealInterval = setInterval(() => {
        if (!isPaused && !isAnimating && isAutoRevealing) {
          nextCard();
        }
      }, 2000);
      
      if (autoRevealBtn) {
        autoRevealBtn.style.opacity = '1';
        autoRevealBtn.innerHTML = '<i class="fas fa-pause"></i> <span>Stop Auto</span>';
      }
    }
  }

  /**
   * Toggle auto reveal mode
   */
  function toggleAutoReveal() {
    if (isAutoRevealing) {
      // Stop auto reveal
      clearInterval(autoRevealInterval);
      autoRevealInterval = null;
      isAutoRevealing = false;
      isPaused = false;
      
      if (autoRevealBtn) {
        autoRevealBtn.innerHTML = '<i class="fas fa-play" aria-hidden="true"></i> <span>Auto Reveal</span>';
        autoRevealBtn.style.background = 'linear-gradient(135deg, #d4af37, #f4d03f)';
        autoRevealBtn.style.opacity = '1';
        autoRevealBtn.setAttribute('aria-pressed', 'false');
      }
      
      announce('Auto reveal stopped');
    } else {
      // Start auto reveal
      isAutoRevealing = true;
      isPaused = false;
      
      autoRevealInterval = setInterval(() => {
        if (!isPaused && !isAnimating) {
          nextCard();
        }
      }, 2000);
      
      if (autoRevealBtn) {
        autoRevealBtn.innerHTML = '<i class="fas fa-pause" aria-hidden="true"></i> <span>Stop Auto</span>';
        autoRevealBtn.style.background = 'linear-gradient(135deg, #dc3545, #ff6b7d)';
        autoRevealBtn.setAttribute('aria-pressed', 'true');
      }
      
      announce('Auto reveal started. Cards will change every 2 seconds');
    }
  }

  /**
   * Shuffle deck
   */
  function shuffleDeck() {
    if (isAnimating || cards.length === 0) return;
    
    // Stop auto reveal if running
    if (isAutoRevealing) {
      toggleAutoReveal();
    }
    
    // Shuffle the cards array
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    
    // Reset positions
    resetDeck();
    announce('Deck shuffled. Cards are now in random order');
  }

  /**
   * Reset deck to original state
   */
  function resetDeck() {
    if (isAnimating) return;
    
    // Stop auto reveal
    if (isAutoRevealing) {
      toggleAutoReveal();
    }
    
    isPaused = false;
    
    // Reset all card states
    cards.forEach((card, index) => {
      card.classList.remove('top-card', 'in-deck', 'moving-to-back', 'coming-from-back');
      
      if (index === 0) {
        card.classList.add('top-card');
      } else {
        card.classList.add('in-deck');
      }
    });
    
    currentCardIndex = 0;
    updateCounter();
    
    const firstCardTitle = cards[0]?.querySelector('h4')?.textContent || 'First card';
    announce(`Deck reset. Now viewing ${firstCardTitle}, card 1 of ${cards.length}`);
  }

  /**
   * Update the card counter display
   */
  function updateCounter() {
    if (!cardCounter || cards.length === 0) return;
    
    const currentCardTitle = cards[currentCardIndex]?.querySelector('.card-info h4')?.textContent || 'Card';
    cardCounter.textContent = `${currentCardIndex + 1} of ${cards.length} - ${currentCardTitle}`;
  }

  /**
   * Handle keyboard navigation
   */
  function handleKeyboard(event) {
    if (!cards.length) return;
    
    switch(event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        prevCard();
        announce('Navigated to previous card using keyboard');
        break;
      case 'ArrowRight':
        event.preventDefault();
        nextCard();
        announce('Navigated to next card using keyboard');
        break;
      case 'a':
      case 'A':
        event.preventDefault();
        toggleAutoReveal();
        break;
      case 'r':
      case 'R':
        event.preventDefault();
        resetDeck();
        break;
      case 's':
      case 'S':
        event.preventDefault();
        shuffleDeck();
        break;
      case 'Home':
        event.preventDefault();
        if (currentCardIndex !== 0) {
          currentCardIndex = 0;
          resetDeck();
        }
        break;
      case 'End':
        event.preventDefault();
        if (currentCardIndex !== cards.length - 1) {
          // Go to last card
          const targetIndex = cards.length - 1;
          while (currentCardIndex !== targetIndex) {
            nextCard();
          }
        }
        break;
    }
  }

  /**
   * Handle touch start for swipe navigation
   */
  function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
  }

  /**
   * Handle touch end for swipe navigation
   */
  function handleTouchEnd(event) {
    if (!touchStartX || !touchStartY) return;
    
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;
    
    const deltaX = touchStartX - touchEndX;
    const deltaY = touchStartY - touchEndY;
    
    // Minimum swipe distance
    const minSwipeDistance = 50;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          nextCard(); // Swipe left = next
        } else {
          prevCard(); // Swipe right = previous
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > minSwipeDistance && deltaY > 0) {
        toggleAutoReveal(); // Swipe up = toggle auto reveal
      }
    }
    
    touchStartX = 0;
    touchStartY = 0;
  }
});

/**
 * Website Sharing Functions
 */

// Get the current page URL for sharing context
function getCurrentPageUrl() {
  return window.location.href;
}

// Share website to Facebook
function shareWebsiteToFacebook() {
  const pageUrl = getCurrentPageUrl();
  const shareText = 'Check out INK 102 Tattoos - Premium tattoo studio in Stonecrest, GA! Amazing custom designs, expert artists, and professional service.';
  
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}&quote=${encodeURIComponent(shareText)}`;
  
  window.open(facebookUrl, 'facebook-share', 'width=600,height=400,scrollbars=yes,resizable=yes');
  
  if (window.announce) {
    window.announce('Sharing INK 102 Tattoos website to Facebook');
  }
}

// Share website to Twitter
function shareWebsiteToTwitter() {
  const pageUrl = getCurrentPageUrl();
  const hashtags = 'tattoo,ink,tattooart,StonecrestGA,INK102Tattoos';
  const shareText = 'Amazing tattoo studio in Stonecrest, GA! Check out @INK102Tattoos for custom designs, expert artistry, and professional service.';
  
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}&hashtags=${hashtags}`;
  
  window.open(twitterUrl, 'twitter-share', 'width=600,height=400,scrollbars=yes,resizable=yes');
  
  if (window.announce) {
    window.announce('Sharing INK 102 Tattoos website to Twitter');
  }
}

// Share website to Instagram
function shareWebsiteToInstagram() {
  const instagramUrl = 'https://www.instagram.com/';
  const shareText = 'Check out INK 102 Tattoos in Stonecrest, GA! Premium tattoo studio with amazing custom designs and expert artists. #tattoo #ink #tattooart #StonecrestGA #INK102Tattoos #tattoostudio';
  
  // Copy text to clipboard for easy pasting
  if (navigator.clipboard) {
    navigator.clipboard.writeText(shareText).then(() => {
      alert('Caption copied to clipboard! Open Instagram and paste it in your story or post.');
    });
  }
  
  window.open(instagramUrl, 'instagram-share', 'width=600,height=600,scrollbars=yes,resizable=yes');
  
  if (window.announce) {
    window.announce('Opening Instagram. Caption copied for sharing INK 102 Tattoos');
  }
}

// Share website to WhatsApp
function shareWebsiteToWhatsApp() {
  const pageUrl = getCurrentPageUrl();
  const shareText = `Check out INK 102 Tattoos - amazing tattoo studio in Stonecrest, GA! Custom designs, expert artists, professional service. ${pageUrl}`;
  
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  
  window.open(whatsappUrl, 'whatsapp-share', 'width=600,height=400,scrollbars=yes,resizable=yes');
  
  if (window.announce) {
    window.announce('Sharing INK 102 Tattoos website to WhatsApp');
  }
}

// Copy website link to clipboard
function copyWebsiteLink(buttonElement) {
  const pageUrl = getCurrentPageUrl();
  
  if (navigator.clipboard) {
    navigator.clipboard.writeText(pageUrl).then(() => {
      // Visual feedback
      const originalIcon = buttonElement.innerHTML;
      buttonElement.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i>';
      buttonElement.classList.add('copied');
      buttonElement.title = 'Website link copied!';
      
      // Reset after 2 seconds
      setTimeout(() => {
        buttonElement.innerHTML = originalIcon;
        buttonElement.classList.remove('copied');
        buttonElement.title = 'Copy website link';
      }, 2000);
      
      if (window.announce) {
        window.announce('Website link copied to clipboard');
      }
    }).catch(() => {
      // Fallback for older browsers
      prompt('Copy this link:', pageUrl);
    });
  } else {
    // Fallback for browsers without clipboard API
    prompt('Copy this link:', pageUrl);
  }
}