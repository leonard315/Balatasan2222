/*
MIT License

Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
Mindoro State University - Philippines
*/

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load translation files
const translations = {
  en: JSON.parse(fs.readFileSync(path.join(__dirname, '../locales/en.json'), 'utf8')),
  tl: JSON.parse(fs.readFileSync(path.join(__dirname, '../locales/tl.json'), 'utf8'))
};

// Helper function to get nested translation
function getTranslation(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

export const languageMiddleware = (req, res, next) => {
  // Get language from session, cookie, or default to English
  const lang = (req.session && req.session.language) || (req.cookies && req.cookies.language) || 'en';
  
  // Set language in session if session exists
  if (req.session) {
    req.session.language = lang;
  }
  
  // Create translation helper function
  res.locals.t = (key) => {
    return getTranslation(translations[lang], key) || key;
  };
  
  // Make current language available in views
  res.locals.currentLang = lang;
  res.locals.availableLanguages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'tl', name: 'Tagalog', flag: '🇵🇭' }
  ];
  
  next();
};

export const setLanguage = (req, res) => {
  const { lang } = req.body;
  
  if (translations[lang]) {
    req.session.language = lang;
    res.cookie('language', lang, { maxAge: 365 * 24 * 60 * 60 * 1000 }); // 1 year
    req.flash('success_msg', lang === 'en' ? 'Language changed to English' : 'Binago ang wika sa Tagalog');
  }
  
  res.redirect('back');
};
