/*
MIT License

Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
Mindoro State University - Philippines
*/

import { getCurrentWeather, getWeatherForecast, getActivityRecommendation } from '../services/weatherService.js';

export const getWeatherData = async (req, res) => {
  try {
    const weather = await getCurrentWeather();
    const forecast = await getWeatherForecast();
    const recommendation = getActivityRecommendation(weather);
    
    res.json({
      current: weather,
      forecast,
      recommendation
    });
  } catch (error) {
    console.error('Weather controller error:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
};

export const weatherWidget = async (req, res) => {
  try {
    const weather = await getCurrentWeather();
    const recommendation = getActivityRecommendation(weather);
    
    res.render('partials/weather-widget', {
      weather,
      recommendation,
      layout: false
    });
  } catch (error) {
    console.error('Weather widget error:', error);
    res.status(500).send('Weather data unavailable');
  }
};
