/*
MIT License

Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
Mindoro State University - Philippines
*/

import { Booking } from "../models/bookingModel.js";
import { sequelize } from "../models/database.js";
import { Op } from "sequelize";

// Get user booking statistics
export const getUserStats = async (req, res) => {
  try {
    const userId = req.session.userId;

    // Total bookings
    const totalBookings = await Booking.count({
      where: { userId }
    });

    // Total spent
    const totalSpentResult = await Booking.sum('totalAmount', {
      where: { 
        userId,
        status: ['confirmed', 'completed']
      }
    });
    const totalSpent = totalSpentResult || 0;

    // Confirmed bookings
    const confirmedBookings = await Booking.count({
      where: { 
        userId,
        status: 'confirmed'
      }
    });

    // Upcoming trips (future check-in dates)
    const today = new Date().toISOString().split('T')[0];
    const upcomingTrips = await Booking.count({
      where: {
        userId,
        checkIn: {
          [Op.gte]: today
        },
        status: ['pending', 'confirmed', 'pending_verification']
      }
    });

    // Next trip date
    const nextTrip = await Booking.findOne({
      where: {
        userId,
        checkIn: {
          [Op.gte]: today
        },
        status: ['pending', 'confirmed', 'pending_verification']
      },
      order: [['checkIn', 'ASC']]
    });

    res.json({
      success: true,
      totalBookings,
      totalSpent: totalSpent.toFixed(2),
      confirmedBookings,
      upcomingTrips,
      nextTripDate: nextTrip ? nextTrip.checkIn : null
    });
  } catch (error) {
    console.error("User stats error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};
