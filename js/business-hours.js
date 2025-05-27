/**
 * Business Hours Status Banner
 * Real-time status updates for Ink 102 Tattoos and Piercings
 */

(function() {
  'use strict';

  // Business hours configuration
  const BUSINESS_HOURS = {
    // Monday-Saturday: 11:00 AM - 8:00 PM
    // Sunday: 1:00 PM - 6:00 PM
    monday: { open: 11, close: 20 },
    tuesday: { open: 11, close: 20 },
    wednesday: { open: 11, close: 20 },
    thursday: { open: 11, close: 20 },
    friday: { open: 11, close: 20 },
    saturday: { open: 11, close: 20 },
    sunday: { open: 13, close: 18 } // 1:00 PM - 6:00 PM
  };

  const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  let statusBanner;
  let statusText;
  let nextChange;
  let updateInterval;

  /**
   * Initialize the business hours status system
   */
  function initializeBusinessStatus() {
    statusBanner = document.getElementById('business-status-banner');
    if (!statusBanner) return;

    statusText = statusBanner.querySelector('.status-text');
    nextChange = statusBanner.querySelector('.next-change');

    if (!statusText || !nextChange) return;

    // Update immediately and then every minute
    updateBusinessStatus();
    updateInterval = setInterval(updateBusinessStatus, 60000); // Update every minute

    console.log('✅ Business Hours Status System initialized');
  }

  /**
   * Update business status banner
   */
  function updateBusinessStatus() {
    const now = new Date();
    const currentDay = DAYS[now.getDay()];
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour + (currentMinute / 60);

    const todayHours = BUSINESS_HOURS[currentDay];
    const status = getBusinessStatus(currentTime, todayHours, now);

    updateBannerDisplay(status);
  }

  /**
   * Determine current business status
   */
  function getBusinessStatus(currentTime, todayHours, now) {
    const { open, close } = todayHours;
    const isOpen = currentTime >= open && currentTime < close;
    
    // Calculate time until next change
    let nextChangeTime;
    let nextChangeText;
    let statusClass;
    let statusMessage;

    if (isOpen) {
      // Currently open
      const timeUntilClose = close - currentTime;
      
      if (timeUntilClose <= 1) { // Closing within 1 hour
        statusClass = 'closing-soon';
        statusMessage = '🟡 Closing Soon';
        nextChangeText = `Closes in ${Math.round(timeUntilClose * 60)} minutes`;
      } else {
        statusClass = 'open';
        statusMessage = '🟢 We\'re Open!';
        const closeTime = formatTime(close);
        nextChangeText = `Open until ${closeTime}`;
      }
    } else {
      // Currently closed
      const nextOpenInfo = getNextOpenTime(now);
      
      if (nextOpenInfo.isToday && nextOpenInfo.hoursUntil <= 2) {
        // Opening within 2 hours today
        statusClass = 'opening-soon';
        statusMessage = '🟣 Opening Soon';
        nextChangeText = `Opens at ${nextOpenInfo.timeText}`;
      } else {
        statusClass = 'closed';
        statusMessage = '🔴 Currently Closed';
        nextChangeText = `Next open: ${nextOpenInfo.dayText} at ${nextOpenInfo.timeText}`;
      }
    }

    return {
      statusClass,
      statusMessage,
      nextChangeText
    };
  }

  /**
   * Get next opening time
   */
  function getNextOpenTime(now) {
    const currentDay = DAYS[now.getDay()];
    const currentTime = now.getHours() + (now.getMinutes() / 60);
    
    // Check if we can still open today
    const todayHours = BUSINESS_HOURS[currentDay];
    if (currentTime < todayHours.open) {
      return {
        isToday: true,
        hoursUntil: todayHours.open - currentTime,
        timeText: formatTime(todayHours.open),
        dayText: 'Today'
      };
    }

    // Find next day we're open
    for (let i = 1; i <= 7; i++) {
      const nextDayIndex = (now.getDay() + i) % 7;
      const nextDay = DAYS[nextDayIndex];
      const nextDayHours = BUSINESS_HOURS[nextDay];
      
      if (nextDayHours.open) {
        const dayName = i === 1 ? 'Tomorrow' : getDayName(nextDayIndex);
        return {
          isToday: false,
          hoursUntil: null,
          timeText: formatTime(nextDayHours.open),
          dayText: dayName
        };
      }
    }

    return {
      isToday: false,
      hoursUntil: null,
      timeText: 'Unknown',
      dayText: 'Unknown'
    };
  }

  /**
   * Update banner display
   */
  function updateBannerDisplay(status) {
    // Remove all status classes
    statusBanner.className = 'business-status-banner';
    
    // Add current status class
    statusBanner.classList.add(status.statusClass);
    
    // Update text content
    statusText.textContent = status.statusMessage;
    nextChange.textContent = status.nextChangeText;
  }

  /**
   * Format hour to readable time
   */
  function formatTime(hour) {
    const h = Math.floor(hour);
    const m = Math.round((hour - h) * 60);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h > 12 ? h - 12 : (h === 0 ? 12 : h);
    const displayMinute = m === 0 ? '' : `:${m.toString().padStart(2, '0')}`;
    
    return `${displayHour}${displayMinute} ${period}`;
  }

  /**
   * Get day name from day index
   */
  function getDayName(dayIndex) {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return dayNames[dayIndex];
  }

  /**
   * Cleanup function
   */
  function cleanup() {
    if (updateInterval) {
      clearInterval(updateInterval);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBusinessStatus);
  } else {
    initializeBusinessStatus();
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', cleanup);

})();