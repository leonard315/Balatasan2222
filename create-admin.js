/*
MIT License

Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
Mindoro State University - Philippines
*/

import bcrypt from "bcrypt";
import { User, sequelize } from "./models/userModel.js";

async function createAdmin() {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to database");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      where: { email: "admin@balatasan.com" } 
    });

    if (existingAdmin) {
      console.log("⚠️  Admin user already exists!");
      console.log("Email: admin@balatasan.com");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Create admin user
    const admin = await User.create({
      name: "Admin",
      email: "admin@balatasan.com",
      phone: "09171234567",
      address: "Balatasan Beach Resort, Bulalacao, Oriental Mindoro",
      password: hashedPassword,
      role: "admin",
      isActive: true
    });

    console.log("✅ Admin user created successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧 Email: admin@balatasan.com");
    console.log("🔑 Password: admin123");
    console.log("👑 Role: admin");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("You can now login with these credentials!");

  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
  } finally {
    process.exit();
  }
}

createAdmin();
