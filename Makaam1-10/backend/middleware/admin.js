module.exports = function (req, res, next) {
  // Check if user exists and has admin privileges
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).send({ message: "Access denied. Admin privileges required." });
  }
  
  next();
};
