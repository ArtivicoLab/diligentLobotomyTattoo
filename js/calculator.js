/**
 * Tattoo Price Calculator
 * Interactive calculator to estimate tattoo prices based on size, complexity, and placement
 */

document.addEventListener('DOMContentLoaded', function() {
  'use strict';
  
  const calculator = document.getElementById('tattoo-calculator');
  if (!calculator) return;
  
  const sizeInput = document.getElementById('tattoo-size');
  const complexityInputs = document.querySelectorAll('input[name="complexity"]');
  const placementSelect = document.getElementById('tattoo-placement');
  const colorSelect = document.getElementById('tattoo-color');
  const priceOutput = document.getElementById('estimated-price');
  const priceRange = document.getElementById('price-range');
  const calculateBtn = document.getElementById('calculate-price');
  
  // Base prices
  const BASE_PRICE = 50;
  const SIZE_MULTIPLIER = 10; // per square inch
  const COMPLEXITY_MULTIPLIERS = {
    low: 1,
    medium: 1.5,
    high: 2.5
  };
  const PLACEMENT_MULTIPLIERS = {
    arm: 1,
    leg: 1.1,
    back: 1.2,
    chest: 1.3,
    ribs: 1.5,
    hand: 1.8,
    foot: 1.8,
    face: 2.5,
    other: 1.2
  };
  const COLOR_MULTIPLIERS = {
    blackgray: 1,
    color: 1.5,
    custom: 1.8
  };
  
  function calculatePrice() {
    // Get values from inputs
    const size = parseFloat(sizeInput.value) || 0;
    
    let complexity = 'low';
    complexityInputs.forEach(input => {
      if (input.checked) {
        complexity = input.value;
      }
    });
    
    const placement = placementSelect.value;
    const colorType = colorSelect.value;
    
    // Validate inputs
    if (size <= 0) {
      showError('Please enter a valid size');
      return;
    }
    
    // Calculate price
    let price = BASE_PRICE + (size * SIZE_MULTIPLIER);
    price *= COMPLEXITY_MULTIPLIERS[complexity];
    price *= PLACEMENT_MULTIPLIERS[placement];
    price *= COLOR_MULTIPLIERS[colorType];
    
    // Add some variability for price range
    const minPrice = Math.floor(price * 0.9);
    const maxPrice = Math.ceil(price * 1.1);
    
    // Update UI
    priceOutput.textContent = `$${Math.round(price)}`;
    priceRange.textContent = `$${minPrice} - $${maxPrice}`;
    
    // Show result
    document.getElementById('calculator-result').classList.add('active');
  }
  
  function showError(message) {
    const errorElement = document.getElementById('calculator-error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    // Hide error after 3 seconds
    setTimeout(() => {
      errorElement.style.display = 'none';
    }, 3000);
  }
  
  // Event listeners
  if (calculateBtn) {
    calculateBtn.addEventListener('click', function(e) {
      e.preventDefault();
      calculatePrice();
    });
  }
  
  // Size range slider (if present)
  const sizeSlider = document.getElementById('size-slider');
  if (sizeSlider && sizeInput) {
    sizeSlider.addEventListener('input', function() {
      sizeInput.value = this.value;
    });
    
    sizeInput.addEventListener('input', function() {
      sizeSlider.value = this.value;
    });
  }
});