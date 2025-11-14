/*
MIT License

Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
Mindoro State University - Philippines
*/

import { Booking } from "../models/bookingModel.js";
import { User } from "../models/userModel.js";

export const bookingsPage = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.session.userId },
      order: [['createdAt', 'DESC']]
    });

    res.render("bookings", { 
      title: "My Bookings",
      userName: req.session.userName,
      userRole: req.session.userRole,
      bookings: bookings
    });
  } catch (error) {
    console.error("Bookings page error:", error);
    req.flash("error_msg", "Error loading bookings");
    res.redirect("/dashboard");
  }
};

export const bookingSelectPage = (req, res) => {
  res.render("booking-select", { 
    title: "Select Booking Type",
    userName: req.session.userName,
    userRole: req.session.userRole
  });
};

export const newBookingPage = (req, res) => {
  res.render("new-booking", { 
    title: "New Booking",
    userName: req.session.userName,
    userRole: req.session.userRole
  });
};

export const createBooking = async (req, res) => {
  try {
    const { checkIn, checkOut, tourType, guests, paymentMethod, notes, referenceNumber } = req.body;
    
    // Validation with specific error messages
    const missingFields = [];
    if (!checkIn) missingFields.push("Booking Date");
    if (!tourType) missingFields.push("Tour Package");
    if (!guests) missingFields.push("Number of Guests");
    if (!paymentMethod) missingFields.push("Payment Method");
    
    if (missingFields.length > 0) {
      req.flash("error_msg", `Please fill in the following required fields: ${missingFields.join(", ")}`);
      return res.redirect("/bookings/new");
    }

    // Tour pricing
    const tourPrices = {
      'aslom-silahaf': 1200,
      'target-island': 1000,
      'buyayao': 1500,
      'suguicay': 900,
      'silad': 950
    };

    const tourNames = {
      'aslom-silahaf': 'Aslom & Sibalat Island Hopping',
      'target-island': 'Target Island Adventure',
      'buyayao': 'Buyayao Island Marine Sanctuary',
      'suguicay': 'Suguicay Island Getaway',
      'silad': 'Silad Island Exploration'
    };
    
    const pricePerPerson = tourPrices[tourType] || 1000;
    const guestCount = parseInt(guests);
    const totalAmount = pricePerPerson * guestCount;

    // Create booking in database
    const booking = await Booking.create({
      userId: req.session.userId,
      checkIn,
      checkOut: checkOut || null,
      roomType: `Island Tour - ${tourNames[tourType] || tourType}`,
      guests: guestCount,
      paymentMethod,
      referenceNumber: referenceNumber || null,
      notes: notes || null,
      status: 'pending',
      totalAmount
    });

    // Log activity
    try {
      const { logActivity } = await import('../models/activityLogModel.js');
      await logActivity(
        req.session.userId,
        'create',
        'booking',
        booking.id,
        `Created new booking for ${tourNames[tourType]} - ₱${totalAmount}`,
        req
      );
    } catch (error) {
      console.error('Activity log error:', error);
    }

    let paymentMessage = "Tour booking submitted successfully! ";
    
    switch(paymentMethod) {
      case 'gcash':
        paymentMessage += "Please send payment via GCash and upload proof.";
        break;
      case 'paymaya':
        paymentMessage += "Please send payment via PayMaya and upload proof.";
        break;
      case 'credit-card':
        paymentMessage += "Payment link will be sent to your email.";
        break;
      case 'cash':
        paymentMessage += "You can pay in cash upon arrival.";
        break;
    }
    
    req.flash("success_msg", paymentMessage);
    res.redirect("/bookings");
  } catch (error) {
    console.error("Booking error:", error);
    req.flash("error_msg", `Booking failed: ${error.message || 'Please try again'}`);
    res.redirect("/bookings/new");
  }
};

export const cottageBookingPage = (req, res) => {
  res.render("cottage-booking", { 
    title: "Reserve Floating Cottage",
    userName: req.session.userName,
    userRole: req.session.userRole
  });
};

export const createCottageBooking = async (req, res) => {
  try {
    const { checkIn, duration, guests, paymentMethod, notes } = req.body;
    
    // Validation with specific error messages
    const missingFields = [];
    if (!checkIn) missingFields.push("Booking Date");
    if (!duration) missingFields.push("Cottage Type");
    if (!guests) missingFields.push("Number of Guests");
    if (!paymentMethod) missingFields.push("Payment Method");
    
    if (missingFields.length > 0) {
      req.flash("error_msg", `Please fill in the following required fields: ${missingFields.join(", ")}`);
      return res.redirect("/bookings/cottage");
    }
    
    // Price mapping
    const prices = {
      'standard': 1500,
      'teenager': 2000,
      'family': 2500
    };
    
    const cottageNames = {
      'standard': 'Standard',
      'teenager': 'Teenager/Children',
      'family': 'Family'
    };
    
    const totalAmount = prices[duration];
    
    // Create cottage booking
    await Booking.create({
      userId: req.session.userId,
      checkIn,
      checkOut: null,
      roomType: `Floating Cottage - ${cottageNames[duration]}`,
      guests,
      paymentMethod,
      notes: notes || null,
      status: 'pending',
      totalAmount
    });
    
    req.flash("success_msg", "Cottage reservation submitted successfully! We'll contact you soon.");
    res.redirect("/bookings");
  } catch (error) {
    console.error("Cottage booking error:", error);
    req.flash("error_msg", "An error occurred. Please try again.");
    res.redirect("/bookings/cottage");
  }
};

export const waterActivitiesBookingPage = (req, res) => {
  res.render("water-activities-booking", { 
    title: "Book Water Activity",
    userName: req.session.userName,
    userRole: req.session.userRole
  });
};

export const createWaterActivityBooking = async (req, res) => {
  try {
    const { checkIn, activity, guests, paymentMethod, notes } = req.body;
    
    // Validation with specific error messages
    const missingFields = [];
    if (!checkIn) missingFields.push("Booking Date");
    if (!activity) missingFields.push("Water Activity");
    if (!guests) missingFields.push("Number of Guests");
    if (!paymentMethod) missingFields.push("Payment Method");
    
    if (missingFields.length > 0) {
      req.flash("error_msg", `Please fill in the following required fields: ${missingFields.join(", ")}`);
      return res.redirect("/bookings/water-activities");
    }
    
    // Activity pricing
    const activities = {
      'flying-fish': { name: 'Flying Fish', price: 1500, capacity: 3, excess: 500 },
      'banana-boat': { name: 'Banana Boat', price: 3000, capacity: 12, excess: 250 },
      'hurricane': { name: 'Hurricane', price: 2000, capacity: 6, excess: 350 },
      'crazy-ufo': { name: 'Crazy UFO', price: 2000, capacity: 6, excess: 350 },
      'pedal-boat': { name: 'Pedal Boat', price: 500, capacity: 4, excess: 0 },
      'hand-paddle': { name: 'Hand Paddle Boat', price: 200, capacity: 2, excess: 0 },
      'jet-ski': { name: 'Jet Ski', price: 150, capacity: 4, excess: 0, perMinute: true }
    };
    
    const selectedActivity = activities[activity];
    if (!selectedActivity) {
      req.flash("error_msg", "Invalid activity selected");
      return res.redirect("/bookings/water-activities");
    }
    
    // Calculate total with excess charges or per-minute pricing
    let totalAmount = selectedActivity.price;
    const guestCount = parseInt(guests);

    if (selectedActivity.perMinute) {
      // Handle per-minute pricing for jet-ski
      const duration = parseInt(req.body.duration) || 15; // Default to 15 minutes if not provided
      totalAmount = selectedActivity.price * duration;
    } else if (guestCount > selectedActivity.capacity && selectedActivity.excess > 0) {
      const excessCount = guestCount - selectedActivity.capacity;
      totalAmount += excessCount * selectedActivity.excess;
    }
    
    // Create water activity booking
    await Booking.create({
      userId: req.session.userId,
      checkIn,
      checkOut: null,
      roomType: `Water Activity - ${selectedActivity.name}`,
      guests: guestCount,
      paymentMethod,
      notes: notes || null,
      status: 'pending',
      totalAmount
    });
    
    req.flash("success_msg", "Water activity booking submitted successfully! We'll contact you soon.");
    res.redirect("/bookings");
  } catch (error) {
    console.error("Water activity booking error:", error);
    req.flash("error_msg", "An error occurred. Please try again.");
    res.redirect("/bookings/water-activities");
  }
};

// Upload payment proof
export const uploadPaymentProof = async (req, res) => {
  try {
    const { id } = req.params;
    const { referenceNumber } = req.body;
    const userId = req.session.userId;

    // Verify booking belongs to user
    const booking = await Booking.findOne({
      where: { id, userId }
    });

    if (!booking) {
      req.flash('error_msg', 'Booking not found or you do not have permission to upload payment proof for this booking.');
      return res.redirect('/bookings');
    }

    // Check if booking is in correct status
    if (booking.status !== 'pending') {
      req.flash('error_msg', 'Payment proof can only be uploaded for pending bookings.');
      return res.redirect('/bookings');
    }

    // Check if file was uploaded
    if (!req.file) {
      req.flash('error_msg', 'Please select an image file to upload.');
      return res.redirect('/bookings');
    }

    // Validate file details
    const fileSize = (req.file.size / (1024 * 1024)).toFixed(2);
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!allowedTypes.includes(req.file.mimetype)) {
      req.flash('error_msg', 'Invalid file type. Please upload an image file (JPEG, PNG, GIF, WebP).');
      return res.redirect('/bookings');
    }

    // Update booking with payment proof
    await booking.update({
      paymentProof: `/uploads/payments/${req.file.filename}`,
      referenceNumber: referenceNumber ? referenceNumber.trim() : null,
      status: 'pending_verification'
    });

    // Log activity
    try {
      const { logActivity } = await import('../models/activityLogModel.js');
      await logActivity(
        userId,
        'upload',
        'payment_proof',
        booking.id,
        `Uploaded payment proof for booking #${id} (${fileSize}MB)`,
        req
      );
    } catch (error) {
      console.error('Activity log error:', error);
    }

    req.flash('success_msg', `Payment proof uploaded successfully! File size: ${fileSize}MB. Your payment is now under verification and will be reviewed by our team within 24 hours.`);
    res.redirect('/bookings');
  } catch (error) {
    console.error('Upload payment proof error:', error);
    req.flash('error_msg', `Failed to upload payment proof: ${error.message || 'Please try again.'}`);
    res.redirect('/bookings');
  }
};

// Cancel booking by user
export const cancelBookingByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.userId;

    // Verify booking belongs to user
    const booking = await Booking.findOne({
      where: { id, userId }
    });

    if (!booking) {
      req.flash('error_msg', 'Booking not found');
      return res.redirect('/bookings');
    }

    // Only allow cancellation of pending bookings
    if (booking.status !== 'pending' && booking.status !== 'pending_verification') {
      req.flash('error_msg', 'Only pending bookings can be cancelled. Please contact support for confirmed bookings.');
      return res.redirect('/bookings');
    }

    // Update booking status
    await booking.update({ status: 'cancelled' });

    req.flash('success_msg', 'Booking cancelled successfully.');
    res.redirect('/bookings');
  } catch (error) {
    console.error('Cancel booking error:', error);
    req.flash('error_msg', 'Failed to cancel booking');
    res.redirect('/bookings');
  }
};
