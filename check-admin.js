/*
Check admin user in database
*/

import { User, sequelize } from "./models/userModel.js";

async function checkAdmin() {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to database");

    const admin = await User.findOne({ 
      where: { email: "admin@balatasan.com" } 
    });

    if (!admin) {
      console.log("❌ Admin user not found!");
    } else {
      console.log("✅ Admin user found:");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("ID:", admin.id);
      console.log("Name:", admin.name);
      console.log("Email:", admin.email);
      console.log("Role:", admin.role);
      console.log("Active:", admin.isActive);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      
      if (admin.role !== 'admin') {
        console.log("⚠️  Role is not 'admin', updating...");
        await admin.update({ role: 'admin' });
        console.log("✅ Role updated to 'admin'");
      }
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    process.exit();
  }
}

checkAdmin();
