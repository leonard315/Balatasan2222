/*
MIT License

Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
Mindoro State University - Philippines
*/

import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";

export const profilePage = async (req, res) => {
  try {
    const user = await User.findByPk(req.session.userId);
    res.render("profile", { 
      title: "My Profile",
      userName: req.session.userName,
      userRole: req.session.userRole,
      user: user
    });
  } catch (error) {
    console.error("Profile error:", error);
    req.flash("error_msg", "Error loading profile");
    res.redirect("/dashboard");
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const user = await User.findByPk(req.session.userId);

    if (!user) {
      req.flash("error_msg", "User not found");
      return res.redirect("/profile");
    }

    await user.update({ name, email, phone, address });
    req.session.userName = name;

    req.flash("success_msg", "Profile updated successfully!");
    res.redirect("/profile");
  } catch (error) {
    console.error("Update profile error:", error);
    req.flash("error_msg", "Error updating profile");
    res.redirect("/profile");
  }
};
