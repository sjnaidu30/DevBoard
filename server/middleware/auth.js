import jwt from "jsonwebtoken";
import pool from "../db/index.js";

export const requireAuth = async (req, res, next) => {
  // Check session first (local dev)
  if (req.user) return next()

  // Check JWT token (production)
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1]
      const decoded = jwt.verify(token, process.env.SESSION_SECRET)
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.id])
      if (result.rows.length > 0) {
        req.user = result.rows[0]
        return next()
      }
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' })
    }
  }

  res.status(401).json({ error: 'You must be logged in' })
}

export const requireManager = (req, res, next) => {
  if (req.user && req.user.role === 'manager') {
    return next()
  }
  res.status(403).json({ error: 'Manager access required' })
}