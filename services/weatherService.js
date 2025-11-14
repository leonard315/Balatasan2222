/*
MIT License

Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
Mindoro State University - Philippines
*/

import axios from 'axios';

// Balatasan, Bulalacao, Oriental Mindoro coordinates
const LOCATION = {
  lat: 12.3167,
  lon: 121.3500,
  name: 'Balatasan, Bulalacao, Oriental Mindoro'
};

/**
 * Get current weather data from OpenWeatherMap API
 * Sign up for free API key at: https://openweathermap.org/api
 */
export async function getCurrentWeather() {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    if (!apiKey) {
      console.warn('OpenWeatherMap API key not configured');
      return getMockWeatherData();
    }
    
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${LOCATION.lat}&lon=${LOCATION.lon}&appid=${apiKey}&units=metric`
    );
    
    const data = response.data;
    
    return {
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      conditions: data.weather[0].main,
      description: data.weather[0].description,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      humidity: data.main.humidity,
      icon: data.weather[0].icon,
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Weather API error:', error.message);
    return getMockWeatherData();
  }
}

/**
 * Get weather forecast for next 5 days
 */
export async function getWeatherForecast() {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    if (!apiKey) {
      return getMockForecastData();
    }
    
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${LOCATION.lat}&lon=${LOCATION.lon}&appid=${apiKey}&units=metric`
    );
    
    // Get daily forecast (one per day at noon)
    const dailyForecasts = response.data.list.filter(item => 
      item.dt_txt.includes('12:00:00')
    ).slice(0, 5);
    
    return dailyForecasts.map(day => ({
      date: new Date(day.dt * 1000),
      temperature: Math.round(day.main.temp),
      conditions: day.weather[0].main,
      description: day.weather[0].description,
      windSpeed: Math.round(day.wind.speed * 3.6),
      icon: day.weather[0].icon
    }));
  } catch (error) {
    console.error('Weather forecast error:', error.message);
    return getMockForecastData();
  }
}

/**
 * Determine if weather conditions are suitable for water activities
 */
export function getActivityRecommendation(weather) {
  const { conditions, windSpeed, temperature } = weather;
  
  // Poor conditions
  if (conditions === 'Thunderstorm' || conditions === 'Squall' || conditions === 'Tornado') {
    return {
      status: 'poor',
      message: 'Water activities not recommended due to severe weather',
      color: 'red',
      activities: {
        swimming: false,
        snorkeling: false,
        waterSports: false,
        boating: false,
        cottage: true // Cottage is still safe
      }
    };
  }
  
  // Moderate conditions
  if (windSpeed > 30 || conditions === 'Rain' || temperature < 24) {
    return {
      status: 'moderate',
      message: 'Some water activities may be limited. Check with staff.',
      color: 'yellow',
      activities: {
        swimming: true,
        snorkeling: windSpeed < 35,
        waterSports: false,
        boating: windSpeed < 35,
        cottage: true
      }
    };
  }
  
  // Good conditions
  return {
    status: 'good',
    message: 'Perfect weather for all water activities!',
    color: 'green',
    activities: {
      swimming: true,
      snorkeling: true,
      waterSports: true,
      boating: true,
      cottage: true
    }
  };
}

/**
 * Mock weather data for development/fallback
 */
function getMockWeatherData() {
  return {
    temperature: 28,
    feelsLike: 31,
    conditions: 'Clear',
    description: 'clear sky',
    windSpeed: 15,
    humidity: 75,
    icon: '01d',
    timestamp: new Date(),
    isMock: true
  };
}

function getMockForecastData() {
  const today = new Date();
  return Array.from({ length: 5 }, (_, i) => ({
    date: new Date(today.getTime() + (i + 1) * 24 * 60 * 60 * 1000),
    temperature: 27 + Math.floor(Math.random() * 4),
    conditions: ['Clear', 'Clouds', 'Clear'][i % 3],
    description: 'partly cloudy',
    windSpeed: 12 + Math.floor(Math.random() * 8),
    icon: '02d',
    isMock: true
  }));
}
