/**
 * Tattoo Price Calculator
 * Interactive calculator to estimate tattoo prices based on size, complexity, and placement
 */

document.addEventListener('DOMContentLoaded', function() {
  // Add the calculator section to the page
  addCalculatorSection();
  
  // Initialize calculator functionality after adding it to the DOM
  initializeCalculator();
});

function addCalculatorSection() {
  // Create calculator section and insert before the footer
  const contactSection = document.getElementById('contact');
  const calculatorSection = document.createElement('section');
  calculatorSection.id = 'calculator';
  calculatorSection.className = 'calculator';
  
  calculatorSection.innerHTML = `
    <div class="container">
      <div class="section-title">
        <h2>PRICE CALCULATOR</h2>
      </div>
      <p class="section-subtitle">Get an estimate for your custom tattoo based on size, complexity, and placement</p>
      
      <div class="calculator-container">
        <div class="calculator-form">
          <div class="calc-group">
            <label for="tattoo-size">Size (in inches)</label>
            <div class="size-input-container">
              <input type="number" id="tattoo-size" min="1" max="24" value="3">
              <div class="slider-container">
                <input type="range" id="size-slider" min="1" max="24" value="3">
                <div class="size-labels">
                  <span>Small</span>
                  <span>Medium</span>
                  <span>Large</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="calc-group">
            <label for="tattoo-complexity">Complexity</label>
            <div class="radio-group">
              <div class="radio-option">
                <input type="radio" id="complexity-simple" name="complexity" value="simple" checked>
                <label for="complexity-simple">Simple</label>
              </div>
              <div class="radio-option">
                <input type="radio" id="complexity-moderate" name="complexity" value="moderate">
                <label for="complexity-moderate">Moderate</label>
              </div>
              <div class="radio-option">
                <input type="radio" id="complexity-detailed" name="complexity" value="detailed">
                <label for="complexity-detailed">Detailed</label>
              </div>
            </div>
          </div>
          
          <div class="calc-group">
            <label for="tattoo-color">Color Type</label>
            <div class="radio-group">
              <div class="radio-option">
                <input type="radio" id="color-blackgray" name="color" value="blackgray" checked>
                <label for="color-blackgray">Black & Gray</label>
              </div>
              <div class="radio-option">
                <input type="radio" id="color-color" name="color" value="color">
                <label for="color-color">Color</label>
              </div>
            </div>
          </div>
          
          <div class="calc-group">
            <label for="tattoo-placement">Placement</label>
            <select id="tattoo-placement">
              <option value="arm">Arm/Forearm</option>
              <option value="leg">Leg/Thigh</option>
              <option value="back">Back/Chest</option>
              <option value="shoulder">Shoulder</option>
              <option value="foot">Hand/Foot</option>
              <option value="ribs">Ribs/Side</option>
              <option value="neck">Neck/Face</option>
            </select>
          </div>
          
          <div class="calculator-error" id="calc-error"></div>
          
          <div class="calc-submit">
            <button class="btn btn-primary" id="calculate-btn">Calculate Price</button>
          </div>
        </div>
        
        <div class="calculator-result" id="calculator-result">
          <h3>Estimated Price</h3>
          <div class="price-display" id="price-display">$80-120</div>
          <p class="price-range-text">This is an estimated price range</p>
          <p class="price-disclaimer">Final price may vary based on consultation with the artist. Contact us for a personalized quote.</p>
          <a href="#contact" class="btn btn-primary">Book a Consultation</a>
        </div>
      </div>
    </div>
  `;
  
  // Insert calculator before the contact section
  contactSection.parentNode.insertBefore(calculatorSection, contactSection);
}

function initializeCalculator() {
  // Get all the calculator elements
  const sizeInput = document.getElementById('tattoo-size');
  const sizeSlider = document.getElementById('size-slider');
  const calculateBtn = document.getElementById('calculate-btn');
  const result = document.getElementById('calculator-result');
  const priceDisplay = document.getElementById('price-display');
  const errorDisplay = document.getElementById('calc-error');
  
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