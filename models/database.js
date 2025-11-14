/*
MIT License

Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
Mindoro State University - Philippines
*/

import { Sequelize } from "sequelize";

// Database configuration with environment variables support
// Supports both Railway variables (MYSQL*) and custom variables (DB_*)
export const sequelize = new Sequelize(
  process.env.MYSQLDATABASE || process.env.DB_NAME || "Balatasan32",
  process.env.MYSQLUSER || process.env.DB_USER || "root",
  process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || "",
  {
    host: process.env.MYSQLHOST || process.env.DB_HOST || "localhost",
    dialect: "mysql",
    port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);
