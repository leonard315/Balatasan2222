// Weather Widget JavaScript
async function loadWeather() {
  try {
    const response = await fetch('/api/weather');
    const data = await response.json();
    
    if (data.current) {
      updateWeatherDisplay(data.current, data.recommendation);
    }
    
    if (data.forecast) {
      updateForecastDisplay(data.forecast);
    }
  } catch (error) {
    console.error('Failed to load weather:', error);
  }
}

function updateWeatherDisplay(weather, recommendation) {
  const weatherIcon = document.getElementById('weatherIcon');
  const weatherTemp = document.getElementById('weatherTemp');
  const weatherConditions = document.getElementById('weatherConditions');
  const weatherRecommendation = document.getElementById('weatherRecommendation');
  
  if (weatherIcon) {
    weatherIcon.innerHTML = getWeatherEmoji(weather.conditions);
    // Add subtle animation
    weatherIcon.style.animation = 'none';
    setTimeout(() => {
      weatherIcon.style.animation = 'pulse 2s ease-in-out infinite';
    }, 10);
  }
  
  if (weatherTemp) {
    weatherTemp.textContent = `${weather.temperature}°C`;
  }
  
  if (weatherConditions) {
    weatherConditions.textContent = weather.description;
  }
  
  if (weatherRecommendation && recommendation) {
    const icons = {
      good: '🏖️',
      moderate: '⚠️',
      poor: '🚫'
    };
    
    weatherRecommendation.innerHTML = `
      <span class="inline-block">${icons[recommendation.status]} ${recommendation.message}</span>
    `;
  }
  
  // Update last refresh time
  updateLastRefreshTime();
}

function updateForecastDisplay(forecast) {
  const forecastContainer = document.getElementById('weatherForecast');
  if (!forecastContainer) return;
  
  forecastContainer.innerHTML = forecast.map(day => `
    <div class="text-center p-3 bg-white rounded-lg shadow">
      <p class="text-xs text-gray-600">${new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
      <span class="text-2xl">${getWeatherEmoji(day.conditions)}</span>
      <p class="font-bold text-gray-800">${day.temperature}°C</p>
      <p class="text-xs text-gray-600">${day.description}</p>
    </div>
  `).join('');
}

function getWeatherEmoji(conditions) {
  const emojiMap = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '❄️',
    'Mist': '🌫️',
    'Fog': '🌫️',
    'Haze': '🌫️'
  };
  
  return emojiMap[conditions] || '🌤️';
}

// Add pulse animation style
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`;
document.head.appendChild(style);

// Real-time weather updates with visual feedback
let weatherRefreshInterval;

function initWeatherWidget() {
  loadWeather();
  
  // Refresh weather every 5 minutes for more real-time updates
  weatherRefreshInterval = setInterval(loadWeather, 5 * 60 * 1000);
  
  // Add click handler to manually refresh
  const weatherWidget = document.querySelector('[data-weather-widget]');
  if (weatherWidget) {
    weatherWidget.style.cursor = 'pointer';
    weatherWidget.title = 'Click to refresh weather';
    
    weatherWidget.addEventListener('click', (e) => {
      e.preventDefault();
      showRefreshIndicator();
      loadWeather();
    });
  }
  
  // Show last update time
  updateLastRefreshTime();
  setInterval(updateLastRefreshTime, 60 * 1000); // Update every minute
}

function showRefreshIndicator() {
  const widget = document.querySelector('[data-weather-widget]');
  if (widget) {
    widget.style.transition = 'opacity 0.3s';
    widget.style.opacity = '0.5';
    setTimeout(() => {
      widget.style.opacity = '1';
    }, 300);
  }
}

function updateLastRefreshTime() {
  const timeElement = document.getElementById('weatherLastUpdate');
  if (timeElement) {
    const now = new Date();
    timeElement.textContent = `Updated: ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWeatherWidget);
} else {
  initWeatherWidget();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (weatherRefreshInterval) {
    clearInterval(weatherRefreshInterval);
  }
});
