/*
MIT License

Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
Mindoro State University - Philippines
*/

import { Booking } from "../models/bookingModel.js";
import { User } from "../models/userModel.js";
import { Review } from "../models/reviewModel.js";
import { sequelize } from "../models/database.js";
import { Op } from "sequelize";

// Get booking analytics
export const getBookingAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const whereClause = {};
    if (startDate && endDate) {
      whereClause.checkIn = {
        [Op.between]: [startDate, endDate]
      };
    }

    // Revenue by status
    const revenueByStatus = await Booking.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'revenue']
      ],
      where: whereClause,
      group: ['status']
    });

    // Revenue by payment method
    const revenueByPayment = await Booking.findAll({
      attributes: [
        'paymentMethod',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'revenue']
      ],
      where: whereClause,
      group: ['paymentMethod']
    });

    // Popular activities
    const popularActivities = await Booking.findAll({
      attributes: [
        'roomType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'bookings'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'revenue']
      ],
      where: whereClause,
      group: ['roomType'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
      limit: 10
    });

    // Monthly trends
    const monthlyTrends = await Booking.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('checkIn'), '%Y-%m'), 'month'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'bookings'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'revenue']
      ],
      where: whereClause,
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('checkIn'), '%Y-%m')],
      order: [[sequelize.fn('DATE_FORMAT', sequelize.col('checkIn'), '%Y-%m'), 'DESC']],
      limit: 12
    });

    res.json({
      success: true,
      data: {
        revenueByStatus,
        revenueByPayment,
        popularActivities,
        monthlyTrends
      }
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get customer insights
export const getCustomerInsights = async (req, res) => {
  try {
    // Top customers by bookings
    const topCustomers = await Booking.findAll({
      attributes: [
        'userId',
        [sequelize.fn('COUNT', sequelize.col('Booking.id')), 'totalBookings'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalSpent']
      ],
      include: [{
        model: User,
        attributes: ['name', 'email', 'phone']
      }],
      group: ['userId', 'User.id'],
      order: [[sequelize.fn('COUNT', sequelize.col('Booking.id')), 'DESC']],
      limit: 10
    });

    // Customer retention rate
    const repeatCustomers = await sequelize.query(`
      SELECT 
        COUNT(DISTINCT userId) as repeatCustomers
      FROM Bookings
      GROUP BY userId
      HAVING COUNT(id) > 1
    `, { type: sequelize.QueryTypes.SELECT });

    const totalCustomers = await User.count({ where: { role: 'guest' } });

    res.json({
      success: true,
      data: {
        topCustomers,
        retentionRate: totalCustomers > 0 ? (repeatCustomers.length / totalCustomers * 100).toFixed(2) : 0,
        totalCustomers,
        repeatCustomers: repeatCustomers.length
      }
    });
  } catch (error) {
    console.error("Customer insights error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get review analytics
export const getReviewAnalytics = async (req, res) => {
  try {
    const avgRating = await Review.findOne({
      attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'average']]
    });

    const ratingDistribution = await Review.findAll({
      attributes: [
        'rating',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['rating'],
      order: [['rating', 'DESC']]
    });

    const totalReviews = await Review.count();

    res.json({
      success: true,
      data: {
        averageRating: parseFloat(avgRating.dataValues.average || 0).toFixed(1),
        totalReviews,
        ratingDistribution
      }
    });
  } catch (error) {
    console.error("Review analytics error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
