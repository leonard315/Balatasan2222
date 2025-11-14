/*
MIT License

Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
Mindoro State University - Philippines
*/

import { DataTypes } from "sequelize";
import { sequelize } from "./database.js";

export const PromoCode = sequelize.define("PromoCode", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'Promo code (e.g., SUMMER2025)'
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  discountType: {
    type: DataTypes.ENUM('percentage', 'fixed'),
    allowNull: false,
    defaultValue: 'percentage'
  },
  discountValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Percentage (e.g., 20) or Fixed amount (e.g., 500)'
  },
  minAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Minimum booking amount required'
  },
  maxDiscount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Maximum discount amount for percentage type'
  },
  validFrom: {
    type: DataTypes.DATE,
    allowNull: false
  },
  validUntil: {
    type: DataTypes.DATE,
    allowNull: false
  },
  usageLimit: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Total number of times code can be used'
  },
  usageCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Number of times code has been used'
  },
  perUserLimit: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: 'Times each user can use this code'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  applicableFor: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Comma-separated list: tours,cottage,activities or null for all'
  }
}, {
  tableName: 'PromoCodes',
  timestamps: true
});

// Helper function to validate promo code
export const validatePromoCode = async (code, bookingAmount, bookingType, userId) => {
  const promo = await PromoCode.findOne({
    where: {
      code: code.toUpperCase(),
      isActive: true
    }
  });

  if (!promo) {
    return { valid: false, message: 'Invalid promo code' };
  }

  // Check date validity
  const now = new Date();
  if (now < new Date(promo.validFrom) || now > new Date(promo.validUntil)) {
    return { valid: false, message: 'Promo code has expired' };
  }

  // Check usage limit
  if (promo.usageLimit && promo.usageCount >= promo.usageLimit) {
    return { valid: false, message: 'Promo code usage limit reached' };
  }

  // Check minimum amount
  if (promo.minAmount && bookingAmount < promo.minAmount) {
    return { valid: false, message: `Minimum booking amount of ₱${promo.minAmount} required` };
  }

  // Check applicable booking type
  if (promo.applicableFor) {
    const types = promo.applicableFor.split(',');
    if (!types.includes(bookingType)) {
      return { valid: false, message: 'Promo code not applicable for this booking type' };
    }
  }

  // Calculate discount
  let discount = 0;
  if (promo.discountType === 'percentage') {
    discount = (bookingAmount * promo.discountValue) / 100;
    if (promo.maxDiscount && discount > promo.maxDiscount) {
      discount = promo.maxDiscount;
    }
  } else {
    discount = promo.discountValue;
  }

  return {
    valid: true,
    discount: parseFloat(discount.toFixed(2)),
    promoId: promo.id,
    description: promo.description
  };
};
