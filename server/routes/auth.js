import express from "express";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/github/callback", (req, res, next) => {
  passport.authenticate("github", {
    failureRedirect: "/auth/failure",
    failureMessage: true,
  }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.redirect("/auth/failure");
    req.logIn(user, (err) => {
      if (err) return next(err);
      const token = jwt.sign(
        { id: user.id, name: user.name, avatar_url: user.avatar_url, role: user.role },
        process.env.SESSION_SECRET,
        { expiresIn: '7d' }
      )
      res.redirect(`${process.env.FRONTEND_URL}/auth-callback?token=${token}`)
    });
  })(req, res, next);
});

router.get("/github", passport.authenticate("github", {
  scope: ["user:email"],
}));

router.get("/me", (req, res) => {
  if (req.user) {
    const { github_access_token, ...safeUser } = req.user;
    res.json({ user: safeUser });
  } else {
    res.status(401).json({ error: "Not logged in" });
  }
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.json({ message: "Logged Out Successfully" });
  });
});

router.get("/failure", (req, res) => {
  res.status(401).json({ error: "Github authentication failed" });
});

export default router;