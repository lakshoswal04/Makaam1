const jwt = require("jsonwebtoken");
const { JWTPRIVATEKEY } = require("../config/keys");

module.exports = function (req, res, next) {
	const token = req.header("x-auth-token");
	if (!token) return res.status(401).send({ message: "Access denied. No token provided." });

	try {
		const decoded = jwt.verify(token, JWTPRIVATEKEY);
		req.user = decoded;
		next();
	} catch (error) {
		res.status(400).send({ message: "Invalid token" });
	}
};
