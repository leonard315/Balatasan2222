/*
MIT License

Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
Mindoro State University - Philippines
*/

import { Booking } from "../models/bookingModel.js";
import { User } from "../models/userModel.js";
import { Op } from "sequelize";

// Export bookings to CSV
export const exportBookingsCSV = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    
    const whereClause = {};
    if (startDate && endDate) {
      whereClause.checkIn = {
        [Op.between]: [startDate, endDate]
      };
    }
    if (status && status !== 'all') {
      whereClause.status = status;
    }

    const bookings = await Booking.findAll({
      where: whereClause,
      include: [{
        model: User,
        attributes: ['name', 'email', 'phone']
      }],
      order: [['createdAt', 'DESC']]
    });

    // Generate CSV
    let csv = 'Booking ID,Customer Name,Email,Phone,Activity,Check-in Date,Guests,Payment Method,Reference Number,Amount,Status,Booked At\n';
    
    bookings.forEach(booking => {
      csv += `${booking.id},"${booking.User.name}","${booking.User.email}","${booking.User.phone || 'N/A'}","${booking.roomType}",${booking.checkIn},${booking.guests},${booking.paymentMethod},"${booking.referenceNumber || 'N/A'}",${booking.totalAmount},${booking.status},${booking.createdAt}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=bookings-${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    console.error("Export CSV error:", error);
    res.status(500).send("Error exporting data");
  }
};

// Export users to CSV
export const exportUsersCSV = async (req, res) => {
  try {
    const users = await User.findAll({
      order: [['createdAt', 'DESC']]
    });

    let csv = 'User ID,Name,Email,Phone,Role,Active,Joined Date\n';
    
    users.forEach(user => {
      csv += `${user.id},"${user.name}","${user.email}","${user.phone || 'N/A'}",${user.role},${user.isActive ? 'Yes' : 'No'},${user.createdAt}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=users-${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    console.error("Export users CSV error:", error);
    res.status(500).send("Error exporting data");
  }
};
