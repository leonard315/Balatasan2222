/*
MIT License

Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
Mindoro State University - Philippines
*/

import { DataTypes } from "sequelize";
import { sequelize } from "./database.js";
import { User } from "./userModel.js";

export const Booking = sequelize.define("Booking", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  checkIn: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  checkOut: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  roomType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  guests: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.ENUM('gcash', 'paymaya', 'credit-card', 'cash'),
    allowNull: false
  },
  referenceNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  proofOfPayment: {
    type: DataTypes.STRING,
    allowNull: true
  },
  paymentProof: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Path to uploaded payment proof image'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'pending_verification', 'confirmed', 'cancelled', 'completed'),
    defaultValue: 'pending'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  }
});

// Define relationship
Booking.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Booking, { foreignKey: 'userId' });

export { sequelize };
