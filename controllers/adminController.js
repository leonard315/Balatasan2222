/*
MIT License

Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
Mindoro State University - Philippines
*/

import { User } from "../models/userModel.js";
import { Booking } from "../models/bookingModel.js";
import { sequelize } from "../models/database.js";

export const adminDashboardPage = async (req, res) => {
  try {
    // Get user statistics
    const totalUsers = await User.count();
    const guestUsers = await User.count({ where: { role: 'guest' } });
    const staffUsers = await User.count({ where: { role: 'staff' } });
    const adminUsers = await User.count({ where: { role: 'admin' } });
    const activeUsers = await User.count({ where: { isActive: true } });

    // Get booking statistics
    const totalBookings = await Booking.count();
    const pendingBookings = await Booking.count({ where: { status: 'pending' } });
    const confirmedBookings = await Booking.count({ where: { status: 'confirmed' } });
    
    // Calculate total revenue
    const revenueResult = await Booking.sum('totalAmount', {
      where: { status: ['confirmed', 'completed'] }
    });
    const totalRevenue = revenueResult || 0;

    // Get recent bookings
    const recentBookings = await Booking.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['name', 'email'] }]
    });

    res.render("admin/dashboard", { 
      title: "Admin Dashboard",
      userName: req.session.userName,
      userRole: req.session.userRole,
      stats: {
        totalUsers,
        guestUsers,
        staffUsers,
        adminUsers,
        activeUsers,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        totalRevenue: totalRevenue.toFixed(2)
      },
      recentBookings
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    req.flash("error_msg", "Error loading dashboard");
    res.redirect("/dashboard");
  }
};

export const usersManagementPage = async (req, res) => {
  try {
    const users = await User.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.render("admin/users", { 
      title: "User Management",
      userName: req.session.userName,
      userRole: req.session.userRole,
      users: users
    });
  } catch (error) {
    console.error("Users management error:", error);
    req.flash("error_msg", "Error loading users");
    res.redirect("/admin/dashboard");
  }
};

export const bookingsManagementPage = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['name', 'email', 'phone'] }]
    });

    res.render("admin/bookings", { 
      title: "Bookings Management",
      userName: req.session.userName,
      userRole: req.session.userRole,
      bookings: bookings
    });
  } catch (error) {
    console.error("Bookings management error:", error);
    req.flash("error_msg", "Error loading bookings");
    res.redirect("/admin/dashboard");
  }
};

export const reportsPage = (req, res) => {
  res.render("admin/reports", { 
    title: "Reports & Analytics",
    userName: req.session.userName,
    userRole: req.session.userRole
  });
};

export const feedbackManagementPage = async (req, res) => {
  try {
    const { Feedback } = await import('../models/feedbackModel.js');
    
    const feedbacks = await Feedback.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'Customer',
          attributes: ['name', 'email', 'phone']
        },
        {
          model: User,
          as: 'Admin',
          attributes: ['name']
        }
      ]
    });

    // Calculate statistics
    const totalFeedback = feedbacks.length;
    const pendingFeedback = feedbacks.filter(f => f.status === 'pending').length;
    const avgRating = feedbacks.length > 0 
      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
      : 0;

    res.render("admin/feedback", {
      title: "Feedback Management",
      userName: req.session.userName,
      userRole: req.session.userRole,
      feedbacks,
      totalFeedback,
      pendingFeedback,
      avgRating
    });
  } catch (error) {
    console.error("Feedback management error:", error);
    req.flash("error_msg", "Error loading feedback");
    res.redirect("/admin/dashboard");
  }
};

export const respondToFeedback = async (req, res) => {
  try {
    const { Feedback } = await import('../models/feedbackModel.js');
    const { feedbackId, response, status } = req.body;

    const feedback = await Feedback.findByPk(feedbackId);
    if (!feedback) {
      req.flash("error_msg", "Feedback not found");
      return res.redirect("/admin/feedback");
    }

    await feedback.update({
      adminResponse: response,
      status: status || 'reviewed',
      respondedBy: req.session.userId,
      respondedAt: new Date()
    });

    req.flash("success_msg", "Response submitted successfully");
    res.redirect("/admin/feedback");
  } catch (error) {
    console.error("Respond to feedback error:", error);
    req.flash("error_msg", "Error submitting response");
    res.redirect("/admin/feedback");
  }
};

export const paymentsPage = async (req, res) => {
  try {
    // Get all bookings with payment information
    const bookings = await Booking.findAll({
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['name', 'email', 'phone'] }]
    });

    // Calculate statistics
    const pendingVerification = await Booking.count({
      where: { status: 'pending_verification' }
    });

    const verifiedPayments = await Booking.count({
      where: { status: 'confirmed' }
    });

    // Today's revenue
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRevenueResult = await Booking.sum('totalAmount', {
      where: {
        status: ['confirmed', 'completed'],
        createdAt: {
          [sequelize.Sequelize.Op.gte]: today
        }
      }
    });
    const todayRevenue = (todayRevenueResult || 0).toFixed(2);

    // Total revenue
    const totalRevenueResult = await Booking.sum('totalAmount', {
      where: { status: ['confirmed', 'completed'] }
    });
    const totalRevenue = (totalRevenueResult || 0).toFixed(2);

    res.render("admin/payments", {
      title: "Payment Details",
      userName: req.session.userName,
      userRole: req.session.userRole,
      bookings,
      pendingVerification,
      verifiedPayments,
      todayRevenue,
      totalRevenue
    });
  } catch (error) {
    console.error("Payments page error:", error);
    req.flash("error_msg", "Error loading payment details");
    res.redirect("/admin/dashboard");
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { userId, isActive } = req.body;
    const user = await User.findByPk(userId);

    if (!user) {
      req.flash("error_msg", "User not found");
      return res.redirect("/admin/users");
    }

    await user.update({ isActive: isActive === 'true' });
    req.flash("success_msg", `User ${isActive === 'true' ? 'activated' : 'deactivated'} successfully`);
    res.redirect("/admin/users");
  } catch (error) {
    console.error("Update user status error:", error);
    req.flash("error_msg", "Error updating user status");
    res.redirect("/admin/users");
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const user = await User.findByPk(userId);

    if (!user) {
      req.flash("error_msg", "User not found");
      return res.redirect("/admin/users");
    }

    await user.update({ role });
    req.flash("success_msg", `User role updated to ${role} successfully`);
    res.redirect("/admin/users");
  } catch (error) {
    console.error("Update user role error:", error);
    req.flash("error_msg", "Error updating user role");
    res.redirect("/admin/users");
  }
};

export const confirmBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findByPk(bookingId, {
      include: [{ model: User, attributes: ['name', 'email'] }]
    });

    if (!booking) {
      req.flash("error_msg", "Booking not found");
      return res.redirect("/admin/bookings");
    }

    await booking.update({ status: 'confirmed' });
    req.flash("success_msg", `Booking #${bookingId} confirmed successfully! Customer ${booking.User.name} will be notified.`);
    res.redirect("/admin/bookings");
  } catch (error) {
    console.error("Confirm booking error:", error);
    req.flash("error_msg", "Error confirming booking");
    res.redirect("/admin/bookings");
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findByPk(bookingId, {
      include: [{ model: User, attributes: ['name', 'email'] }]
    });

    if (!booking) {
      req.flash("error_msg", "Booking not found");
      return res.redirect("/admin/bookings");
    }

    await booking.update({ status: 'cancelled' });
    req.flash("success_msg", `Booking #${bookingId} cancelled. Customer ${booking.User.name} will be notified.`);
    res.redirect("/admin/bookings");
  } catch (error) {
    console.error("Cancel booking error:", error);
    req.flash("error_msg", "Error cancelling booking");
    res.redirect("/admin/bookings");
  }
};
