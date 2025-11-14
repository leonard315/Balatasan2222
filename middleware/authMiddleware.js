/*
MIT License

Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
Mindoro State University - Philippines
*/

export const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  req.flash("error_msg", "Please login to access this page");
  res.redirect("/login");
};

export const isGuest = (req, res, next) => {
  if (!req.session.userId) {
    return next();
  }
  res.redirect("/dashboard");
};

export const isAdmin = (req, res, next) => {
  if (req.session.userId && req.session.userRole === 'admin') {
    return next();
  }
  req.flash("error_msg", "Access denied. Admin privileges required.");
  res.redirect("/dashboard");
};

export const isStaff = (req, res, next) => {
  if (req.session.userId && (req.session.userRole === 'staff' || req.session.userRole === 'admin')) {
    return next();
  }
  req.flash("error_msg", "Access denied. Staff privileges required.");
  res.redirect("/dashboard");
};
