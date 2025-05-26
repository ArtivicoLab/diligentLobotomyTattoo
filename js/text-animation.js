/**
 * Text Animation for TATTOOS letters
 * Creates a light tracing effect that follows around each letter
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize the animation for the glowing letters
  initializeLetterAnimation();
});

function initializeLetterAnimation() {
  // Get all the animated letters
  const letters = document.querySelectorAll('.letter-glow');
  
  // Apply sequential animation delay to each letter
  letters.forEach((letter, index) => {
    letter.style.animationDelay = `${index * 0.5}s`;
  });
  
  // Create the light tracing effect for each letter
  letters.forEach(letter => {
    // Create the light trace element
    const lightTrace = document.createElement('div');
    lightTrace.className = 'light-trace';
    letter.appendChild(lightTrace);
    
    // Animate the light trace around the letter
    animateTraceAroundLetter(letter, lightTrace);
  });
}

function animateTraceAroundLetter(letter, trace) {
  // Get the dimensions of the letter
  const letterWidth = letter.offsetWidth;
  const letterHeight = letter.offsetHeight;
  
  // Set trace animation path
  const pathPoints = [
    // Start from top left, go clockwise
    { x: 0, y: 0 },
    { x: letterWidth, y: 0 },
    { x: letterWidth, y: letterHeight },
    { x: 0, y: letterHeight },
    { x: 0, y: 0 }
  ];
  
  // Function to animate the trace along the path
  function animateAlongPath(currentPoint = 0) {
    if (currentPoint >= pathPoints.length - 1) {
      currentPoint = 0;
    }
    
    const startPoint = pathPoints[currentPoint];
    const endPoint = pathPoints[currentPoint + 1];
    
    // Animate from current point to next point
    const duration = 1000; // 1 second per side
    const startTime = performance.now();
    
    // Show the trace
    trace.style.opacity = '1';
    
    function step(timestamp) {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Calculate current position
      const currentX = startPoint.x + (endPoint.x - startPoint.x) * progress;
      const currentY = startPoint.y + (endPoint.y - startPoint.y) * progress;
      
      // Update trace position
      trace.style.left = `${currentX}px`;
      trace.style.top = `${currentY}px`;
      
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Move to next segment
        animateAlongPath(currentPoint + 1);
      }
    }
    
    requestAnimationFrame(step);
  }
  
  // Start the animation with random delay for each letter
  setTimeout(() => {
    animateAlongPath();
  }, Math.random() * 2000); // Random delay up to 2 seconds
}

// Add pulsing highlight animation to individual letters
document.addEventListener('DOMContentLoaded', function() {
  const animatedLetters = document.querySelectorAll('.letter-glow');
  
  function highlightRandomLetter() {
    // Remove highlight from all letters
    animatedLetters.forEach(letter => {
      letter.classList.remove('letter-highlight');
    });
    
    // Add highlight to a random letter
    const randomIndex = Math.floor(Math.random() * animatedLetters.length);
    animatedLetters[randomIndex].classList.add('letter-highlight');
    
    // Schedule next highlight
    setTimeout(highlightRandomLetter, 2000 + Math.random() * 1000);
  }
  
  // Start the random highlight animation
  setTimeout(highlightRandomLetter, 3000);
});