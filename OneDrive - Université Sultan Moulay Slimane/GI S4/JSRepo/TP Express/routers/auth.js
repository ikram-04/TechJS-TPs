const express = require("express");
const router = express.Router();

// POST /auth/login - Fake authentication
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "admin") {
    req.session.user = { username };
    res.status(200).json({ message: "Authenticated successfully!" });
  } else {
    res.status(401).json({ message: "Invalid credentials. Use admin/admin." });
  }
});

// POST /auth/logout
router.post("/logout", (req, res) => {
  req.session.destroy();
  res.status(200).json({ message: "Logged out successfully." });
});

module.exports = router;