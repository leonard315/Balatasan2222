/*
Fix Booking Model - Allow checkOut to be null
*/

import { sequelize } from "./models/database.js";
import { Booking } from "./models/bookingModel.js";

async function fixBookingModel() {
  try {
    console.log("Updating Booking model...");
    
    // Alter the table to allow checkOut to be null
    await sequelize.query(`
      ALTER TABLE Bookings 
      MODIFY COLUMN checkOut DATE NULL;
    `);
    
    console.log("✅ Booking model updated successfully!");
    console.log("checkOut field now allows NULL values");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating booking model:", error);
    process.exit(1);
  }
}

fixBookingModel();
