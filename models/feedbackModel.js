/*
MIT License

Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
Mindoro State University - Philippines
*/

import { DataTypes } from "sequelize";
import { sequelize } from "./database.js";
import { User } from "./userModel.js";

export const Feedback = sequelize.define("Feedback", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    },
    comment: 'Overall rating from 1 to 5 stars'
  },
  category: {
    type: DataTypes.ENUM('service', 'facilities', 'cleanliness', 'value', 'location', 'general'),
    allowNull: false,
    defaultValue: 'general'
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  suggestion: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Suggestions for improvement'
  },
  status: {
    type: DataTypes.ENUM('pending', 'reviewed', 'resolved'),
    defaultValue: 'pending'
  },
  adminResponse: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  respondedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  respondedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'Feedbacks',
  timestamps: true
});

// Associations
Feedback.belongsTo(User, { foreignKey: 'userId', as: 'Customer' });
Feedback.belongsTo(User, { foreignKey: 'respondedBy', as: 'Admin' });
User.hasMany(Feedback, { foreignKey: 'userId' });
