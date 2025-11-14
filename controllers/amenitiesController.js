/*
MIT License

Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
Mindoro State University - Philippines
*/

export const amenitiesPage = (req, res) => {
  res.render("amenities", { 
    title: "Resort Amenities",
    userName: req.session.userName,
    userRole: req.session.userRole
  });
};

export const floatingCottagePage = (req, res) => {
  res.render("amenities/floating-cottage", { 
    title: "Floating Cottage",
    userName: req.session.userName,
    userRole: req.session.userRole
  });
};

export const beachAccessPage = (req, res) => {
  res.render("amenities/beach-access", { 
    title: "Beach Access",
    userName: req.session.userName,
    userRole: req.session.userRole
  });
};

export const waterSportsPage = (req, res) => {
  res.render("amenities/water-sports", { 
    title: "Water Activities",
    userName: req.session.userName,
    userRole: req.session.userRole
  });
};
