
  /*
    MIT License
    
    Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
    Mindoro State University - Philippines

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
    */
    
import express from "express";
import { homePage } from "../controllers/homeController.js";
import { loginPage, registerPage, forgotPasswordPage, dashboardPage, loginUser, registerUser, logoutUser } from "../controllers/authController.js";
import { bookingsPage, bookingSelectPage, newBookingPage, createBooking, cottageBookingPage, createCottageBooking, waterActivitiesBookingPage, createWaterActivityBooking, uploadPaymentProof, cancelBookingByUser } from "../controllers/bookingController.js";
import { uploadPaymentProof as uploadMiddleware } from "../middleware/uploadMiddleware.js";
import { profilePage, updateProfile } from "../controllers/profileController.js";
import { contactPage, sendMessage } from "../controllers/contactController.js";
import { amenitiesPage, floatingCottagePage, beachAccessPage, waterSportsPage } from "../controllers/amenitiesController.js";
import { adminDashboardPage, usersManagementPage, bookingsManagementPage, reportsPage, paymentsPage, feedbackManagementPage, respondToFeedback, updateUserStatus, updateUserRole, confirmBooking, cancelBooking } from "../controllers/adminController.js";
import { feedbackPage, submitFeedback, myFeedbackPage } from "../controllers/feedbackController.js";
import { exportBookingsCSV, exportUsersCSV } from "../controllers/exportController.js";
import { getBookingAnalytics, getCustomerInsights, getReviewAnalytics } from "../controllers/analyticsController.js";
import { getUserStats } from "../controllers/userStatsController.js";
import { isAuthenticated, isGuest, isAdmin } from "../middleware/authMiddleware.js";
import { getWeatherData } from "../controllers/weatherController.js";

const router = express.Router();

// Public routes - redirect to login
router.get("/", (req, res) => {
  if (req.session.userId) {
    return res.redirect("/dashboard");
  }
  res.redirect("/login");
});

// Guest routes (only accessible when not logged in)
router.get("/login", isGuest, loginPage);
router.post("/login", loginUser);
router.get("/register", isGuest, registerPage);
router.post("/register", registerUser);
router.get("/forgot-password", isGuest, forgotPasswordPage);

// Protected routes (require authentication)
router.get("/dashboard", isAuthenticated, dashboardPage);
router.get("/logout", isAuthenticated, logoutUser);

// Booking routes
router.get("/bookings", isAuthenticated, bookingsPage);
router.get("/bookings/select", isAuthenticated, bookingSelectPage);
router.get("/bookings/new", isAuthenticated, newBookingPage);
router.post("/bookings/new", isAuthenticated, createBooking);
router.get("/bookings/cottage", isAuthenticated, cottageBookingPage);
router.post("/bookings/cottage", isAuthenticated, createCottageBooking);
router.get("/bookings/water-activities", isAuthenticated, waterActivitiesBookingPage);
router.post("/bookings/water-activities", isAuthenticated, createWaterActivityBooking);
router.post("/bookings/:id/payment", isAuthenticated, uploadMiddleware, uploadPaymentProof);
router.post("/bookings/:id/cancel", isAuthenticated, cancelBookingByUser);

// Profile routes
router.get("/profile", isAuthenticated, profilePage);
router.post("/profile", isAuthenticated, updateProfile);

// Feedback routes
router.get("/feedback", isAuthenticated, feedbackPage);
router.post("/feedback", isAuthenticated, submitFeedback);
router.get("/my-feedback", isAuthenticated, myFeedbackPage);

// Contact route
router.get("/contact", isAuthenticated, contactPage);
router.post("/contact", isAuthenticated, sendMessage);

// Amenities routes
router.get("/amenities", isAuthenticated, amenitiesPage);
router.get("/amenities/floating-cottage", isAuthenticated, floatingCottagePage);
router.get("/amenities/beach-access", isAuthenticated, beachAccessPage);
router.get("/amenities/water-sports", isAuthenticated, waterSportsPage);

// Admin routes
router.get("/admin/dashboard", isAdmin, adminDashboardPage);
router.get("/admin/users", isAdmin, usersManagementPage);
router.get("/admin/bookings", isAdmin, bookingsManagementPage);
router.get("/admin/payments", isAdmin, paymentsPage);
router.get("/admin/feedback", isAdmin, feedbackManagementPage);
router.post("/admin/feedback/respond", isAdmin, respondToFeedback);
router.get("/admin/reports", isAdmin, reportsPage);
router.post("/admin/users/status", isAdmin, updateUserStatus);
router.post("/admin/users/role", isAdmin, updateUserRole);
router.post("/admin/bookings/confirm", isAdmin, confirmBooking);
router.post("/admin/bookings/cancel", isAdmin, cancelBooking);

// Admin export routes
router.get("/admin/export/bookings", isAdmin, exportBookingsCSV);
router.get("/admin/export/users", isAdmin, exportUsersCSV);

// Admin analytics API routes
router.get("/admin/api/analytics/bookings", isAdmin, getBookingAnalytics);
router.get("/admin/api/analytics/customers", isAdmin, getCustomerInsights);
router.get("/admin/api/analytics/reviews", isAdmin, getReviewAnalytics);

// User API routes
router.get("/api/user/stats", isAuthenticated, getUserStats);

// Weather API route
router.get("/api/weather", getWeatherData);

export default router;
