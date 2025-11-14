import { sequelize } from "./models/database.js";

console.log("Testing database connection...");
console.log("Dialect:", sequelize.getDialect());

try {
  await sequelize.authenticate();
  console.log("✅ Database connected successfully!");
  process.exit(0);
} catch (error) {
  console.error("❌ Database connection failed:", error.message);
  process.exit(1);
}
