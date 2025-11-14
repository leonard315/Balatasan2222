/*
MIT License

Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
Mindoro State University - Philippines
*/

export const contactPage = (req, res) => {
  res.render("contact", { 
    title: "Contact Us",
    userName: req.session.userName,
    userRole: req.session.userRole
  });
};

export const sendMessage = async (req, res) => {
  try {
    const { subject, message } = req.body;
    
    if (!subject || !message) {
      req.flash("error_msg", "Please fill in all fields");
      return res.redirect("/contact");
    }

    // TODO: Send email or save to database
    req.flash("success_msg", "Message sent successfully! We'll get back to you soon.");
    res.redirect("/contact");
  } catch (error) {
    console.error("Contact error:", error);
    req.flash("error_msg", "Error sending message");
    res.redirect("/contact");
  }
};
