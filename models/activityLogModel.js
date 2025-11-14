/*
MIT License

Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
Mindoro State University - Philippines
*/

import { DataTypes } from "sequelize";
import { sequelize } from "./database.js";
import { User } from "./userModel.js";

export const ActivityLog = sequelize.define("ActivityLog", {
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
  action: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Type of action performed'
  },
  entity: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Entity affected (booking, user, etc.)'
  },
  entityId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'ID of the affected entity'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'ActivityLogs',
  timestamps: true,
  updatedAt: false
});

// Associations
ActivityLog.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(ActivityLog, { foreignKey: 'userId' });

// Helper function to log activity
export const logActivity = async (userId, action, entity, entityId, description, req = null) => {
  try {
    await ActivityLog.create({
      userId,
      action,
      entity,
      entityId,
      description,
      ipAddress: req ? (req.ip || req.connection.remoteAddress) : null,
      userAgent: req ? req.get('user-agent') : null
    });
  } catch (error) {
    console.error('Activity log error:', error);
  }
};
