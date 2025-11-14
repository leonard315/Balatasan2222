
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
    
import bcrypt from "bcrypt";
import { User, sequelize } from "../models/userModel.js";
await sequelize.sync();

export const loginPage = (req, res) => res.render("login", { title: "Login" });
export const registerPage = (req, res) => res.render("register", { title: "Register" });
export const forgotPasswordPage = (req, res) => res.render("forgotpassword", { title: "Forgot Password" });
export const dashboardPage = (req, res) => {
  if (!req.session.userId) {
    req.flash("error_msg", "Please login to access the dashboard");
    return res.redirect("/login");
  }
  
  res.render("dashboard", { 
    title: "Dashboard",
    userName: req.session.userName,
    userRole: req.session.userRole
  });
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      req.flash("error_msg", "Please provide both email and password");
      return res.redirect("/login");
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      req.flash("error_msg", "Invalid email or password");
      return res.redirect("/login");
    }

    // Check if account is active
    if (!user.isActive) {
      req.flash("error_msg", "Your account has been deactivated. Please contact support.");
      return res.redirect("/login");
    }

    // Verify password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      req.flash("error_msg", "Invalid email or password");
      return res.redirect("/login");
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Set session
    req.session.userId = user.id;
    req.session.userName = user.name;
    req.session.userRole = user.role;

    req.flash("success_msg", `Welcome back, ${user.name}!`);
    
    // Redirect admin to admin dashboard
    if (user.role === 'admin') {
      res.redirect("/admin/dashboard");
    } else {
      res.redirect("/dashboard");
    }
  } catch (error) {
    console.error("Login error:", error);
    req.flash("error_msg", "An error occurred during login. Please try again.");
    res.redirect("/login");
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, address, password, confirmPassword } = req.body;

    // Validation
    if (!name || !email || !password) {
      req.flash("error_msg", "Please fill in all required fields");
      return res.redirect("/register");
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      req.flash("error_msg", "Please provide a valid email address");
      return res.redirect("/register");
    }

    // Password strength validation
    if (password.length < 8) {
      req.flash("error_msg", "Password must be at least 8 characters long");
      return res.redirect("/register");
    }

    // Password confirmation
    if (password !== confirmPassword) {
      req.flash("error_msg", "Passwords do not match");
      return res.redirect("/register");
    }

    // Phone validation (if provided)
    if (phone) {
      const phoneRegex = /^(\+63|0)?[0-9]{10}$/;
      if (!phoneRegex.test(phone.replace(/[\s-]/g, ''))) {
        req.flash("error_msg", "Invalid phone number format (e.g., 09171234567)");
        return res.redirect("/register");
      }
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      req.flash("error_msg", "Email already registered. Please login or use a different email.");
      return res.redirect("/register");
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    await User.create({ 
      name, 
      email, 
      phone: phone || null,
      address: address || null,
      password: hashed,
      role: 'guest'
    });

    // Redirect to login with success message
    req.flash("success_msg", "Registration successful! Please login to continue.");
    res.redirect("/login");
  } catch (error) {
    console.error("Registration error:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    
    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const messages = error.errors.map(e => e.message);
      req.flash("error_msg", messages.join(', '));
    } else if (error.name === 'SequelizeConnectionError' || error.name === 'SequelizeDatabaseError') {
      req.flash("error_msg", "Database connection error. Please contact support.");
    } else {
      req.flash("error_msg", `Registration error: ${error.message}`);
    }
    
    res.redirect("/register");
  }
};

export const logoutUser = (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};
