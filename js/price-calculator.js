/**
 * Tattoo Price Calculator
 * 
 * A script that estimates tattoo prices based on:
 * - Size (square inches)
 * - Complexity (simple, moderate, complex)
 * - Placement (different body areas)
 * - Color (black & gray, color, specialty)
 */

document.addEventListener('DOMContentLoaded', function() {
  // Get all the necessary elements
  const sizeInput = document.getElementById('tattoo-size');
  const sizeSlider = document.getElementById('size-slider');
  const complexityOptions = document.querySelectorAll('input[name="complexity"]');
  const placementSelect = document.getElementById('tattoo-placement');
  const colorSelect = document.getElementById('tattoo-color');
  const calculateBtn = document.getElementById('calculate-price');
  const estimatedPrice = document.getElementById('estimated-price');
  const priceRange = document.getElementById('price-range');
  const calculatorResult = document.getElementById('calculator-result');
  
  // Sync the number input and slider
  sizeInput.addEventListener('input', function() {
    sizeSlider.value = this.value;
  });
  
  sizeSlider.addEventListener('input', function() {
    sizeInput.value = this.value;
  });
  
  // Calculate button event
  calculateBtn.addEventListener('click', calculatePrice);
  
  // Function to calculate the tattoo price
  function calculatePrice() {
    // Get values from form
    const size = parseInt(sizeInput.value);
    let complexity = 'low';
    
    // Get selected complexity
    for (let option of complexityOptions) {
      if (option.checked) {
        complexity = option.value;
        break;
      }
    }
    
    const placement = placementSelect.value;
    const color = colorSelect.value;
    
    // Base price calculation
    let basePrice = 40; // Minimum tattoo price
    
    // Size factor - larger tattoos cost more per square inch
    let sizeFactor;
    if (size <= 10) {
      // Small tattoos have a higher per-square-inch cost
      sizeFactor = size * 5;
    } else if (size <= 30) {
      // Medium tattoos have slightly less cost per square inch
      sizeFactor = 50 + (size - 10) * 3.5;
    } else {
      // Large tattoos have even less cost per square inch (but more total)
      sizeFactor = 120 + (size - 30) * 2.5;
    }
    
    // Complexity multiplier
    let complexityMultiplier;
    switch (complexity) {
      case 'low':
        complexityMultiplier = 1.0;
        break;
      case 'medium':
        complexityMultiplier = 1.5;
        break;
      case 'high':
        complexityMultiplier = 2.0;
        break;
      default:
        complexityMultiplier = 1.0;
    }
    
    // Placement factor (some areas are more difficult/painful)
    let placementFactor;
    switch (placement) {
      case 'arm':
      case 'leg':
        placementFactor = 1.0;
        break;
      case 'back':
      case 'chest':
        placementFactor = 1.1;
        break;
      case 'ribs':
      case 'hand':
        placementFactor = 1.3;
        break;
      case 'foot':
        placementFactor = 1.4;
        break;
      case 'face':
        placementFactor = 1.6;
        break;
      default:
        placementFactor = 1.0;
    }
    
    // Color factor
    let colorFactor;
    switch (color) {
      case 'blackgray':
        colorFactor = 1.0;
        break;
      case 'color':
        colorFactor = 1.3;
        break;
      case 'custom':
        colorFactor = 1.5;
        break;
      default:
        colorFactor = 1.0;
    }
    
    // Calculate the final price
    let finalPrice = basePrice + (sizeFactor * complexityMultiplier * placementFactor * colorFactor);
    
    // Round to nearest 10
    finalPrice = Math.ceil(finalPrice / 10) * 10;
    
    // Generate a price range (± 15-20%)
    const minPrice = Math.max(40, Math.round((finalPrice * 0.85) / 10) * 10);
    const maxPrice = Math.round((finalPrice * 1.15) / 10) * 10;
    
    // Update the UI
    estimatedPrice.textContent = '$' + finalPrice;
    priceRange.textContent = '$' + minPrice + ' - $' + maxPrice;
    
    // Show the result
    calculatorResult.style.opacity = '1';
    
    // Add a visual indication that calculation is complete
    calculateBtn.classList.add('success');
    setTimeout(() => {
      calculateBtn.classList.remove('success');
    }, 1000);
  }
  
  // Initialize with a default calculation
  calculatePrice();
});