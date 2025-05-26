/**
 * Tattoo Price Calculator
 * Interactive calculator to estimate tattoo prices based on size, complexity, and placement
 */

// Execute when the page is fully loaded
window.onload = function() {
  // Get all the calculator elements
  const sizeInput = document.getElementById('tattoo-size');
  const sizeSlider = document.getElementById('size-slider');
  const calculateBtn = document.getElementById('calculate-btn');
  const result = document.getElementById('calculator-result');
  const priceDisplay = document.getElementById('price-display');
  const errorDisplay = document.getElementById('calc-error');
  
  if (!sizeInput || !sizeSlider || !calculateBtn || !result || !priceDisplay) {
    console.error("Calculator elements not found in the DOM");
    return;
  }
  
  // Sync the input field and slider
  sizeInput.addEventListener('input', function() {
    // Limit to valid range
    if (this.value < 1) this.value = 1;
    if (this.value > 24) this.value = 24;
    sizeSlider.value = this.value;
  });
  
  sizeSlider.addEventListener('input', function() {
    sizeInput.value = this.value;
  });
  
  // Calculate price when button is clicked
  calculateBtn.addEventListener('click', calculatePrice);
  
  // Initialize with a default calculation
  calculatePrice();
  
  // Function to calculate the tattoo price
  function calculatePrice() {
    // Clear any previous errors
    hideError();
    
    // Get values from form
    const size = parseInt(sizeInput.value);
    
    // Validate size
    if (isNaN(size) || size < 1 || size > 24) {
      showError('Please enter a valid size between 1 and 24 inches.');
      return;
    }
    
    const complexity = document.querySelector('input[name="complexity"]:checked').value;
    const colorType = document.querySelector('input[name="color"]:checked').value;
    const placement = document.getElementById('tattoo-placement').value;
    
    // Base price calculation
    let basePrice = 40; // Minimum price
    
    // Size factor (bigger = more expensive)
    // Small (1-3 inches): Base
    // Medium (4-8 inches): More
    // Large (9+ inches): Most
    let sizeFactor = 1;
    if (size <= 3) {
      sizeFactor = 1;
    } else if (size <= 8) {
      sizeFactor = size / 2;
    } else {
      sizeFactor = size * 0.8;
    }
    
    // Complexity multiplier
    let complexityMultiplier = 1;
    switch (complexity) {
      case 'simple':
        complexityMultiplier = 1;
        break;
      case 'moderate':
        complexityMultiplier = 1.5;
        break;
      case 'detailed':
        complexityMultiplier = 2;
        break;
    }
    
    // Color multiplier
    let colorMultiplier = colorType === 'blackgray' ? 1 : 1.3;
    
    // Placement factor (difficult areas cost more)
    let placementFactor = 1;
    switch (placement) {
      case 'arm':
      case 'leg':
        placementFactor = 1;
        break;
      case 'back':
        placementFactor = 1.2;
        break;
      case 'shoulder':
        placementFactor = 1.1;
        break;
      case 'foot':
        placementFactor = 1.4;
        break;
      case 'ribs':
        placementFactor = 1.5;
        break;
      case 'neck':
        placementFactor = 1.6;
        break;
    }
    
    // Calculate price
    let calculatedPrice = basePrice + (sizeFactor * complexityMultiplier * colorMultiplier * placementFactor * 10);
    
    // Round to nearest 10
    calculatedPrice = Math.round(calculatedPrice / 10) * 10;
    
    // Create a price range (± 20%)
    const minPrice = Math.max(40, Math.round((calculatedPrice * 0.8) / 10) * 10);
    const maxPrice = Math.round((calculatedPrice * 1.2) / 10) * 10;
    
    // Display the price range
    priceDisplay.textContent = `$${minPrice}-${maxPrice}`;
    
    // Show the result
    result.classList.add('active');
  }
  
  function showError(message) {
    errorDisplay.textContent = message;
    errorDisplay.style.display = 'block';
    result.classList.remove('active');
  }
  
  function hideError() {
    errorDisplay.textContent = '';
    errorDisplay.style.display = 'none';
  }
}