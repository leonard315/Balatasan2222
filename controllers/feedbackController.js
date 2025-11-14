/*
MIT License

Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
Mindoro State University - Philippines
*/

import { Feedback } from "../models/feedbackModel.js";
import { User } from "../models/userModel.js";

// Show feedback form page
export const feedbackPage = (req, res) => {
  res.render("feedback", {
    title: "Feedback & Suggestions",
    userName: req.session.userName,
    userRole: req.session.userRole
  });
};

// Submit feedback
export const submitFeedback = async (req, res) => {
  try {
    const { rating, category, subject, message, suggestion } = req.body;
    const userId = req.session.userId;

    // Validation
    if (!rating || !category || !subject || !message) {
      req.flash('error_msg', 'Please fill in all required fields');
      return res.redirect('/feedback');
    }

    // Create feedback
    await Feedback.create({
      userId,
      rating: parseInt(rating),
      category,
      subject,
      message,
      suggestion: suggestion || null,
      status: 'pending'
    });

    // Log activity
    try {
      const { logActivity } = await import('../models/activityLogModel.js');
      await logActivity(
        userId,
        'create',
        'feedback',
        null,
        `Submitted feedback with ${rating} stars rating`,
        req
      );
    } catch (error) {
      console.error('Activity log error:', error);
    }

    req.flash('success_msg', 'Thank you for your feedback! We appreciate your input and will review it shortly.');
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Submit feedback error:', error);
    req.flash('error_msg', 'Failed to submit feedback. Please try again.');
    res.redirect('/feedback');
  }
};

// View user's own feedback
export const myFeedbackPage = async (req, res) => {
  try {
    const userId = req.session.userId;

    const feedbacks = await Feedback.findAll({
      where: { userId },
      include: [
        {
          model: User,
          as: 'Admin',
          attributes: ['name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.render("my-feedback", {
      title: "My Feedback",
      userName: req.session.userName,
      userRole: req.session.userRole,
      feedbacks
    });
  } catch (error) {
    console.error('My feedback page error:', error);
    req.flash('error_msg', 'Error loading feedback');
    res.redirect('/dashboard');
  }
};
