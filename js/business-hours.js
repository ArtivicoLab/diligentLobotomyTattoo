/**
 * Live Business Hours Display
 * Shows real-time store status with countdown and visual indicators
 */

class BusinessHours {
  constructor() {
    this.businessHours = {
      // Monday = 1, Sunday = 0
      1: { open: 11, close: 20 }, // Monday
      2: { open: 11, close: 20 }, // Tuesday  
      3: { open: 11, close: 20 }, // Wednesday
      4: { open: 11, close: 20 }, // Thursday
      5: { open: 11, close: 20 }, // Friday
      6: { open: 11, close: 20 }, // Saturday
      0: { open: 13, close: 18 }  // Sunday
    };
    
    this.statusElement = null;
    this.timeElement = null;
    this.countdownElement = null;
    this.statusInterval = null;
    
    this.init();
  }

  init() {
    this.createStatusDisplay();
    this.updateStatus();
    // Update every minute
    this.statusInterval = setInterval(() => this.updateStatus(), 60000);
  }

  createStatusDisplay() {
    // Find hero section or main content area
    const heroSection = document.querySelector('.hero') || document.querySelector('main') || document.querySelector('.main-content');
    if (!heroSection) return;

    // Create status banner container
    const statusContainer = document.createElement('div');
    statusContainer.className = 'business-status-banner';
    statusContainer.innerHTML = `
      <div class="container">
        <div class="business-status">
          <div class="status-indicator">
            <div class="status-dot"></div>
            <div class="status-pulse"></div>
          </div>
          <div class="status-content">
            <div class="status-text">Loading...</div>
            <div class="status-time"></div>
            <div class="status-countdown"></div>
          </div>
        </div>
      </div>
    `;

    // Insert right after hero section
    heroSection.parentNode.insertBefore(statusContainer, heroSection.nextSibling);

    // Cache elements
    this.statusElement = statusContainer.querySelector('.status-text');
    this.timeElement = statusContainer.querySelector('.status-time');
    this.countdownElement = statusContainer.querySelector('.status-countdown');
    this.dotElement = statusContainer.querySelector('.status-dot');
    this.pulseElement = statusContainer.querySelector('.status-pulse');
    this.containerElement = statusContainer.querySelector('.business-status');

    this.addStyles();
  }

  addStyles() {
    const styles = `
      .business-status-banner {
        background: linear-gradient(135deg, #0a0a0a, #1a1a1a);
        border-top: 3px solid #d4af37;
        border-bottom: 3px solid #d4af37;
        padding: 24px 0;
        position: relative;
        overflow: hidden;
        width: 100%;
        z-index: 100;
      }

      .business-status-banner::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(218, 165, 32, 0.15), transparent);
        animation: shimmer 4s infinite;
      }

      .business-status-banner::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: 
          radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%);
        pointer-events: none;
      }

      @keyframes shimmer {
        0% { left: -100%; }
        100% { left: 100%; }
      }

      .business-status-banner .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
        position: relative;
        z-index: 1;
      }

      .business-status {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;
        position: relative;
        z-index: 1;
        text-align: center;
      }

      .status-indicator {
        position: relative;
        width: 24px;
        height: 24px;
      }

      .status-dot {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        transition: all 0.3s ease;
        position: relative;
        z-index: 2;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
      }

      .status-pulse {
        position: absolute;
        top: 0;
        left: 0;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        opacity: 0.6;
        animation: pulse 2s infinite;
      }

      @keyframes pulse {
        0% { transform: scale(1); opacity: 0.6; }
        50% { transform: scale(1.8); opacity: 0.3; }
        100% { transform: scale(2.5); opacity: 0; }
      }

      .status-content {
        flex: 1;
        max-width: 600px;
      }

      .status-text {
        font-size: 1.4rem;
        font-weight: 700;
        margin-bottom: 6px;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }

      .status-time {
        font-size: 1rem;
        color: #f5f5f5;
        margin-bottom: 4px;
        font-weight: 500;
      }

      .status-countdown {
        font-size: 0.95rem;
        color: #d4af37;
        font-weight: 600;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      }

      /* Status States */
      .business-status.open .status-dot,
      .business-status.open .status-pulse {
        background: #4CAF50;
      }

      .business-status.open .status-text {
        color: #4CAF50;
      }

      .business-status.closed .status-dot,
      .business-status.closed .status-pulse {
        background: #f44336;
      }

      .business-status.closed .status-text {
        color: #f44336;
      }

      .business-status.closing-soon .status-dot,
      .business-status.closing-soon .status-pulse {
        background: #FF9800;
      }

      .business-status.closing-soon .status-text {
        color: #FF9800;
      }

      .business-status.opening-soon .status-dot,
      .business-status.opening-soon .status-pulse {
        background: #2196F3;
      }

      .business-status.opening-soon .status-text {
        color: #2196F3;
      }

      @media (max-width: 768px) {
        .business-status-banner {
          padding: 20px 0;
        }
        
        .business-status {
          gap: 16px;
          flex-direction: column;
          text-align: center;
        }
        
        .status-indicator {
          width: 20px;
          height: 20px;
        }
        
        .status-dot, .status-pulse {
          width: 20px;
          height: 20px;
        }
        
        .status-text {
          font-size: 1.2rem;
        }
        
        .status-time {
          font-size: 0.9rem;
        }
        
        .status-countdown {
          font-size: 0.85rem;
        }
      }

      @media (max-width: 480px) {
        .business-status-banner {
          padding: 16px 0;
        }
        
        .business-status-banner .container {
          padding: 0 16px;
        }
        
        .status-text {
          font-size: 1.1rem;
        }
        
        .status-time {
          font-size: 0.85rem;
        }
        
        .status-countdown {
          font-size: 0.8rem;
        }
      }
    `;

    // Add styles to head
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }

  getCurrentStatus() {
    const now = new Date();
    const currentDay = now.getDay();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour + (currentMinute / 60);

    const todayHours = this.businessHours[currentDay];
    if (!todayHours) return { status: 'closed', message: 'Closed Today' };

    const { open, close } = todayHours;

    // Check if currently open
    if (currentTime >= open && currentTime < close) {
      const minutesUntilClose = Math.round((close - currentTime) * 60);
      
      if (minutesUntilClose <= 30) {
        return {
          status: 'closing-soon',
          message: 'Closing Soon',
          countdown: `Closes in ${minutesUntilClose} minutes`
        };
      }
      
      return {
        status: 'open',
        message: 'Open Now',
        countdown: `Closes at ${this.formatTime(close)}`
      };
    }

    // Check if opening soon (within 2 hours)
    const minutesUntilOpen = Math.round((open - currentTime) * 60);
    if (minutesUntilOpen > 0 && minutesUntilOpen <= 120) {
      return {
        status: 'opening-soon',
        message: 'Opening Soon',
        countdown: `Opens in ${minutesUntilOpen} minutes`
      };
    }

    // Check if it's after closing time, show next day
    if (currentTime >= close) {
      const nextDay = (currentDay + 1) % 7;
      const nextDayHours = this.businessHours[nextDay];
      
      if (nextDayHours) {
        return {
          status: 'closed',
          message: 'Closed',
          countdown: `Opens ${this.getDayName(nextDay)} at ${this.formatTime(nextDayHours.open)}`
        };
      }
    }

    // Before opening time today
    return {
      status: 'closed',
      message: 'Closed',
      countdown: `Opens today at ${this.formatTime(open)}`
    };
  }

  updateStatus() {
    if (!this.statusElement) return;

    const status = this.getCurrentStatus();
    const now = new Date();

    // Update status class
    this.containerElement.className = `business-status ${status.status}`;

    // Update text content
    this.statusElement.textContent = status.message;
    this.timeElement.textContent = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    this.countdownElement.textContent = status.countdown || '';
  }

  formatTime(hour) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:00 ${period}`;
  }

  getDayName(dayNumber) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNumber];
  }

  destroy() {
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.businessHours = new BusinessHours();
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  if (window.businessHours) {
    window.businessHours.destroy();
  }
});