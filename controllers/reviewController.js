/*
MIT License

Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
Mindoro State University - Philippines
*/

import { Review } from "../models/reviewModel.js";
import { Booking } from "../models/bookingModel.js";
import { User } from "../models/userModel.js";

export const reviewPage = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    
    // Check if booking exists and belongs to user
    const booking = await Booking.findOne({
      where: { 
        id: bookingId,
        userId: req.session.userId
      }
    });

    if (!booking) {
      req.flash("error_msg", "Booking not found");
      return res.redirect("/bookings");
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      req.flash("error_msg", "You can only review completed bookings");
      return res.redirect("/bookings");
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({
      where: { bookingId: bookingId }
    });

    if (existingReview) {
      req.flash("error_msg", "You have already reviewed this booking");
      return res.redirect("/bookings");
    }

    res.render("review", {
      title: "Leave a Review",
      userName: req.session.userName,
      userRole: req.session.userRole,
      booking: booking
    });
  } catch (error) {
    console.error("Review page error:", error);
    req.flash("error_msg", "Error loading review page");
    res.redirect("/bookings");
  }
};

export const submitReview = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const { rating, review, suggestion } = req.body;

    if (!rating) {
      req.flash("error_msg", "Please provide a rating");
      return res.redirect(`/bookings/${bookingId}/review`);
    }

    // Verify booking belongs to user
    const booking = await Booking.findOne({
      where: { 
        id: bookingId,
        userId: req.session.userId,
        status: 'completed'
      }
    });

    if (!booking) {
      req.flash("error_msg", "Invalid booking");
      return res.redirect("/bookings");
    }

    // Create review
    await Review.create({
      userId: req.session.userId,
      bookingId: bookingId,
      rating: parseInt(rating),
      review: review || null,
      suggestion: suggestion || null
    });

    req.flash("success_msg", "Thank you for your review! Your feedback helps us improve.");
    res.redirect("/bookings");
  } catch (error) {
    console.error("Submit review error:", error);
    req.flash("error_msg", "Error submitting review");
    res.redirect("/bookings");
  }
};

export const allReviewsPage = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        {
          model: User,
          attributes: ['name', 'email']
        },
        {
          model: Booking,
          attributes: ['roomType', 'checkIn']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    res.render("reviews", {
      title: "Guest Reviews",
      userName: req.session.userName,
      userRole: req.session.userRole,
      reviews: reviews
    });
  } catch (error) {
    console.error("Reviews page error:", error);
    req.flash("error_msg", "Error loading reviews");
    res.redirect("/dashboard");
  }
};
