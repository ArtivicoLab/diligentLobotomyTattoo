/**
 * Gaming-Style Card Deck Gallery
 * Interactive deck system with smooth animations and smart hover controls
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
      if (cards.length > 0) {
        setupCardInteractions();
        updateCounter();
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
      'tribal-artwork.jpg'
    ];

    const existingCards = [];
    
    for (const imageName of potentialImages) {
      const imageUrl = cardGalleryPath + imageName;
      if (await imageExists(imageUrl)) {
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
   * Create a card element
   */
  function createCard(cardData, index) {
    const card = document.createElement('div');
    card.className = 'deck-card';
    card.innerHTML = `
      <div class="card-image">
        <img src="${cardData.url}" alt="${cardData.title}" loading="lazy">
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
        autoRevealBtn.innerHTML = '<i class="fas fa-play"></i> <span>Auto Reveal</span>';
        autoRevealBtn.style.background = 'linear-gradient(135deg, #d4af37, #f4d03f)';
        autoRevealBtn.style.opacity = '1';
      }
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
        autoRevealBtn.innerHTML = '<i class="fas fa-pause"></i> <span>Stop Auto</span>';
        autoRevealBtn.style.background = 'linear-gradient(135deg, #dc3545, #ff6b7d)';
      }
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
        break;
      case 'ArrowRight':
        event.preventDefault();
        nextCard();
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