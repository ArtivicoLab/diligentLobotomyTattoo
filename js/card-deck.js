/**
 * Interactive Card Deck Gallery
 * Gaming-style card effects for showcasing tattoo images
 * Dynamic card loading from images/card-gallery folder
 */

document.addEventListener('DOMContentLoaded', function() {
  const cardDeck = document.getElementById('card-deck');
  const shuffleBtn = document.getElementById('shuffle-deck');
  const fanOutBtn = document.getElementById('fan-out');
  const resetBtn = document.getElementById('reset-deck');
  const cardCounter = document.getElementById('card-counter');
  
  let cards = [];
  let isAnimating = false;
  let isFannedOut = false;
  let selectedCard = null;
  
  // Dynamic card loading from folder
  async function loadCardsFromFolder() {
    const cardGalleryPath = 'images/card-gallery/';
    const supportedFormats = ['jpg', 'jpeg', 'png', 'webp'];
    const imageList = [];
    
    // Try to load images from the card gallery folder
    try {
      // Common image filenames to check
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
        'traditional-style.jpg'
      ];
      
      // Check which images exist by trying to load them
      for (const imageName of potentialImages) {
        const imageUrl = cardGalleryPath + imageName;
        if (await imageExists(imageUrl)) {
          imageList.push({
            url: imageUrl,
            name: formatCardTitle(imageName)
          });
        }
      }
      
      // If no images found in card-gallery, use fallback images
      if (imageList.length === 0) {
        const fallbackImages = [
          { url: 'images/tattoos/IMG_8684.jpeg', name: 'Vibrant Color Work' },
          { url: 'images/tattoos/IMG_8685.jpeg', name: 'Black & Gray Mastery' },
          { url: 'images/tattoos/IMG_8686.jpeg', name: 'Custom Design' },
          { url: 'images/tattoos/IMG_8687.jpeg', name: 'Detailed Portrait Work' },
          { url: 'images/tattoos/IMG_8688.jpeg', name: 'Realistic Artistry' },
          { url: 'images/tattoos/IMG_8689.jpeg', name: 'Bespoke Art' },
          { url: 'images/tattoos/IMG_8690.jpeg', name: 'Color Mastery' },
          { url: 'images/tattoos/IMG_8691.jpeg', name: 'Fine Line Work' }
        ];
        
        for (const img of fallbackImages) {
          if (await imageExists(img.url)) {
            imageList.push(img);
          }
        }
      }
      
    } catch (error) {
      console.log('Loading images from available sources...');
    }
    
    return imageList;
  }
  
  // Check if image exists
  function imageExists(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }
  
  // Format filename to card title
  function formatCardTitle(filename) {
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
    return nameWithoutExt
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  // Generate card description based on filename
  function generateDescription(filename) {
    const descriptions = {
      'vibrant': 'Stunning color work with exceptional detail',
      'color': 'Bold and vibrant artistic expression',
      'black': 'Expert black and gray shading technique',
      'gray': 'Masterful monochrome artistry',
      'custom': 'Unique design tailored to your vision',
      'design': 'Creative and innovative artwork',
      'portrait': 'Lifelike detail and realistic shading',
      'realistic': 'Photorealistic artistic technique',
      'detailed': 'Intricate work with precise execution',
      'fine': 'Delicate line work and precision',
      'geometric': 'Clean lines and mathematical precision',
      'floral': 'Nature-inspired artistic beauty',
      'traditional': 'Classic tattoo artistry',
      'minimalist': 'Simple elegance and clean design'
    };
    
    const lowerFilename = filename.toLowerCase();
    for (const [key, desc] of Object.entries(descriptions)) {
      if (lowerFilename.includes(key)) {
        return desc;
      }
    }
    return 'Professional tattoo artistry at its finest';
  }
  
  // Create card element
  function createCard(imageData, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-card', index + 1);
    
    card.innerHTML = `
      <div class="card-face card-back"></div>
      <div class="card-face card-front">
        <img src="${imageData.url}" alt="${imageData.name} - professional tattoo work by Ink 102" loading="lazy">
        <div class="card-info">
          <h4>${imageData.name}</h4>
          <p>${generateDescription(imageData.url)}</p>
        </div>
      </div>
    `;
    
    return card;
  }
  
  // Initialize dynamic deck
  async function initializeDynamicDeck() {
    // Clear existing static cards
    cardDeck.innerHTML = '';
    
    // Load images from folder
    const imageList = await loadCardsFromFolder();
    
    // Create cards dynamically
    imageList.forEach((imageData, index) => {
      const card = createCard(imageData, index);
      cardDeck.appendChild(card);
    });
    
    // Update cards array
    cards = document.querySelectorAll('.card');
    
    // Initialize card interactions
    initializeCardInteractions();
    
    // Update counter
    updateCounter();
    
    console.log(`✨ Loaded ${cards.length} cards dynamically!`);
  }
  
  // Initialize card interactions
  function initializeCardInteractions() {
    cards.forEach((card, index) => {
      card.style.zIndex = cards.length - index;
      card.addEventListener('click', handleCardClick);
      card.addEventListener('mouseenter', handleCardHover);
      card.addEventListener('mouseleave', handleCardLeave);
      
      // Set initial position
      card.style.transform = `translateX(${-index * 5}px) translateY(${-index * 3}px) rotateZ(${-index * 2}deg)`;
    });
  }
  
  // Handle card click
  function handleCardClick(e) {
    if (isAnimating) return;
    
    const card = e.currentTarget;
    
    // If card is already selected, deselect it
    if (card.classList.contains('selected')) {
      deselectCard(card);
      return;
    }
    
    // Deselect any previously selected card
    if (selectedCard) {
      deselectCard(selectedCard);
    }
    
    // Select the clicked card
    selectCard(card);
  }
  
  // Select a card
  function selectCard(card) {
    selectedCard = card;
    card.classList.add('selected');
    
    // Flip the card if it's not already flipped
    if (!card.classList.contains('flipped')) {
      card.classList.add('flipped');
    }
    
    // Move other cards away slightly
    cards.forEach(otherCard => {
      if (otherCard !== card) {
        otherCard.style.transform += ' translateY(20px)';
        otherCard.style.opacity = '0.7';
      }
    });
    
    // Add glow effect
    setTimeout(() => {
      card.style.filter = 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.6))';
    }, 300);
  }
  
  // Deselect a card
  function deselectCard(card) {
    card.classList.remove('selected');
    card.style.filter = '';
    
    // Reset other cards
    cards.forEach(otherCard => {
      if (otherCard !== card) {
        otherCard.style.opacity = '1';
        // Remove the translateY that was added
        let transform = otherCard.style.transform;
        otherCard.style.transform = transform.replace('translateY(20px)', '');
      }
    });
    
    selectedCard = null;
  }
  
  // Handle card hover
  function handleCardHover(e) {
    if (isAnimating || e.currentTarget.classList.contains('selected')) return;
    
    const card = e.currentTarget;
    card.style.filter = 'brightness(1.1) drop-shadow(0 5px 15px rgba(212, 175, 55, 0.3))';
  }
  
  // Handle card leave
  function handleCardLeave(e) {
    if (isAnimating || e.currentTarget.classList.contains('selected')) return;
    
    const card = e.currentTarget;
    card.style.filter = '';
  }
  
  // Shuffle deck animation
  function shuffleDeck() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Deselect any selected card
    if (selectedCard) {
      deselectCard(selectedCard);
    }
    
    // Reset all cards first
    resetDeck(false);
    
    setTimeout(() => {
      // Add shuffle animation to all cards
      cards.forEach((card, index) => {
        card.classList.add('shuffling');
        
        // Random delay for each card
        setTimeout(() => {
          // Random new position in the deck
          const newIndex = Math.floor(Math.random() * cards.length);
          card.style.zIndex = cards.length - newIndex;
          
          // Apply new stacking position
          card.style.transform = `translateX(${-newIndex * 5}px) translateY(${-newIndex * 3}px) rotateZ(${-newIndex * 2}deg)`;
        }, index * 100);
      });
      
      // Remove shuffle class after animation
      setTimeout(() => {
        cards.forEach(card => {
          card.classList.remove('shuffling');
        });
        isAnimating = false;
        playCardSound();
      }, 1000);
    }, 200);
  }
  
  // Fan out cards
  function fanOutCards() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Deselect any selected card
    if (selectedCard) {
      deselectCard(selectedCard);
    }
    
    if (!isFannedOut) {
      // Fan out
      cards.forEach(card => {
        card.classList.add('fanned-out');
      });
      fanOutBtn.innerHTML = '<i class="fas fa-compress"></i> Collapse';
      isFannedOut = true;
    } else {
      // Collapse
      cards.forEach(card => {
        card.classList.remove('fanned-out');
      });
      fanOutBtn.innerHTML = '<i class="fas fa-layer-group"></i> Fan Out';
      isFannedOut = false;
    }
    
    setTimeout(() => {
      isAnimating = false;
      playCardSound();
    }, 600);
  }
  
  // Reset deck to original position
  function resetDeck(animate = true) {
    if (isAnimating && animate) return;
    if (animate) isAnimating = true;
    
    // Deselect any selected card
    if (selectedCard) {
      deselectCard(selectedCard);
    }
    
    // Remove all animation classes
    cards.forEach((card, index) => {
      card.classList.remove('flipped', 'selected', 'fanned-out', 'shuffling');
      card.style.filter = '';
      card.style.opacity = '1';
      
      if (animate) {
        card.classList.add('dealing');
      }
      
      // Reset to original stacked position
      card.style.transform = `translateX(${-index * 5}px) translateY(${-index * 3}px) rotateZ(${-index * 2}deg)`;
      card.style.zIndex = cards.length - index;
      
      if (animate) {
        setTimeout(() => {
          card.classList.remove('dealing');
        }, 600 + (index * 50));
      }
    });
    
    // Reset fan out button
    fanOutBtn.innerHTML = '<i class="fas fa-layer-group"></i> Fan Out';
    isFannedOut = false;
    
    if (animate) {
      setTimeout(() => {
        isAnimating = false;
        playCardSound();
      }, 800);
    }
  }
  
  // Update card counter
  function updateCounter() {
    const visibleCards = Array.from(cards).filter(card => 
      !card.classList.contains('hidden')
    ).length;
    cardCounter.textContent = `${visibleCards} Cards in Deck`;
  }
  
  // Play card sound effect (visual feedback)
  function playCardSound() {
    // Create a visual feedback instead of actual sound
    const soundIndicator = document.createElement('div');
    soundIndicator.className = 'sound-indicator';
    soundIndicator.innerHTML = '♪';
    soundIndicator.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 2rem;
      color: var(--accent-gold);
      z-index: 9999;
      pointer-events: none;
      animation: soundPulse 0.5s ease-out forwards;
    `;
    
    document.body.appendChild(soundIndicator);
    
    setTimeout(() => {
      document.body.removeChild(soundIndicator);
    }, 500);
  }
  
  // Add sound animation
  const soundAnimation = `
    @keyframes soundPulse {
      0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.5);
      }
      50% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1.2);
      }
      100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(1.5);
      }
    }
  `;
  
  // Add the animation to the page
  const style = document.createElement('style');
  style.textContent = soundAnimation;
  document.head.appendChild(style);
  
  // Event listeners
  shuffleBtn.addEventListener('click', shuffleDeck);
  fanOutBtn.addEventListener('click', fanOutCards);
  resetBtn.addEventListener('click', () => resetDeck(true));
  
  // Keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    switch(e.key) {
      case 's':
      case 'S':
        shuffleDeck();
        break;
      case 'f':
      case 'F':
        fanOutCards();
        break;
      case 'r':
      case 'R':
        resetDeck(true);
        break;
      case 'Escape':
        if (selectedCard) {
          deselectCard(selectedCard);
        }
        break;
    }
  });
  
  // Touch/swipe support for mobile
  let touchStartX = 0;
  let touchStartY = 0;
  
  cardDeck.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  });
  
  cardDeck.addEventListener('touchend', function(e) {
    if (!touchStartX || !touchStartY) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    
    // Detect swipe gestures
    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          // Swipe left - shuffle
          shuffleDeck();
        } else {
          // Swipe right - fan out
          fanOutCards();
        }
      }
    } else {
      if (Math.abs(diffY) > 50) {
        if (diffY > 0) {
          // Swipe up - reset
          resetDeck(true);
        }
      }
    }
    
    touchStartX = 0;
    touchStartY = 0;
  });
  
  // Initialize the dynamic deck
  initializeDynamicDeck();
  
  // Add a helpful tooltip
  const tooltip = document.createElement('div');
  tooltip.className = 'deck-tooltip';
  tooltip.innerHTML = `
    <p><strong>Controls:</strong></p>
    <p>🖱️ Click cards to flip and view</p>
    <p>⌨️ Press S to Shuffle, F to Fan Out, R to Reset</p>
    <p>📱 Swipe left/right/up for controls</p>
  `;
  tooltip.style.cssText = `
    position: absolute;
    bottom: -120px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.9);
    color: var(--accent-gold);
    padding: 15px;
    border-radius: 8px;
    font-size: 0.8rem;
    text-align: center;
    max-width: 280px;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    border: 1px solid rgba(212, 175, 55, 0.3);
  `;
  
  document.querySelector('.card-deck-container').appendChild(tooltip);
  
  // Show tooltip on first visit
  setTimeout(() => {
    tooltip.style.opacity = '1';
    setTimeout(() => {
      tooltip.style.opacity = '0';
    }, 4000);
  }, 1000);
});