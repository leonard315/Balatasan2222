/*
    MIT License
    
    Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
    Mindoro State University - Philippines
*/

// CommonJS server entry point for environments that don't support ES modules
const app = require('./index.js');

const PORT = process.env.PORT || 3000;

if (!process.env.ELECTRON && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🔥 XianFire running at http://localhost:${PORT}`);
  });
}

module.exports = app;
