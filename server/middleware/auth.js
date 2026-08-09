export const requireAuth = (req, res, next) => {
  if (req.user) {
    return next();
  }
  res.status(401).json({ error: "You must be logged in" });
};

export const requireManager = (req, res, next) => {
  if (req.user && req.user.role === "manager") {
    return next();
  }
  res.status(403).json({ error: "Manager access required" });
};
