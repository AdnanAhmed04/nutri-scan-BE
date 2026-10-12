/**
 * Auth Middleware
 * Prepared for future JWT / OAuth authentication.
 * In development / unauthenticated mode, it attaches a default mock user.
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    // In future: jwt.verify(token, process.env.JWT_SECRET)
    req.user = { id: 'mock-user-id', email: 'alex.johnson@example.com', token };
  } else {
    // Development mode fallback
    req.user = { id: 'mock-user-id', email: 'alex.johnson@example.com' };
  }

  next();
};

module.exports = authMiddleware;
