const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

// Register new user
router.post("/", async (req, res) => {
	try {
		console.log("Registration request received:", { ...req.body, password: "[HIDDEN]" });
		
		const { error } = validate(req.body);
		if (error) {
			console.log("Validation error:", error.details[0].message);
			return res.status(400).send({ message: error.details[0].message });
		}

		const user = await User.findOne({ email: req.body.email });
		if (user) {
			console.log("User already exists with email:", req.body.email);
			return res.status(409).send({ message: "User with given email already exists!" });
		}

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		const newUser = new User({ 
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			password: hashPassword,
			isAdmin: req.body.isAdmin || false, // Set isAdmin flag from request or default to false
			onboardingCompleted: req.body.onboardingCompleted || false // Set onboardingCompleted flag from request or default to false
		});
		
		// Log if this is an admin user creation
		if (req.body.isAdmin) {
			console.log(`Creating admin user with email: ${req.body.email} (onboarding completed: ${req.body.onboardingCompleted})`);
		}
		
		await newUser.save();
		console.log("User created successfully:", { id: newUser._id, email: newUser.email });
		res.status(201).send({ message: "User created successfully" });
	} catch (error) {
		console.error("Registration error:", error);
		res.status(500).send({ message: "Internal Server Error: " + error.message });
	}
});

// Get current user profile
router.get("/me", auth, async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select("-password");
		if (!user) return res.status(404).send({ message: "User not found" });
		
		res.status(200).send({ data: user });
	} catch (error) {
		console.error("Error fetching user profile:", error);
		res.status(500).send({ message: "Internal Server Error" });
	}
});

// Update user profile (including onboarding data)
router.put("/profile", auth, async (req, res) => {
	try {
		console.log('Profile update request received:', {
			userId: req.user._id,
			educationLevel: req.body.educationLevel,
			interestsCount: req.body.interests?.length,
			hasSkills: !!req.body.skills,
			hasCareerGoals: !!req.body.careerGoals,
			onboardingCompleted: req.body.onboardingCompleted
		});

		const user = await User.findById(req.user._id);
		if (!user) {
			console.error('User not found:', req.user._id);
			return res.status(404).send({ message: "User not found" });
		}

		console.log('User found:', { id: user._id, email: user.email });

		// Update allowed fields
		const allowedUpdates = ['educationLevel', 'interests', 'skills', 'careerGoals', 'onboardingCompleted'];
		let updatedFields = [];

		allowedUpdates.forEach(field => {
			if (req.body[field] !== undefined) {
				user[field] = req.body[field];
				updatedFields.push(field);
			}
		});

		console.log('Updating fields:', updatedFields);

		await user.save();
		console.log('User profile updated successfully');

		const updatedUser = await User.findById(user._id).select("-password");
		res.status(200).send({ message: "Profile updated successfully", data: updatedUser });
	} catch (error) {
		console.error("Error updating user profile:", error);
		res.status(500).send({ message: "Internal Server Error: " + error.message });
	}
});

// Update user password only
router.put("/me", auth, async (req, res) => {
	try {
		console.log('Password update request received');
		
		// Validate request body
		if (!req.body) {
			return res.status(400).send({ message: "Request body is missing" });
		}

		console.log('Request body validation passed');
		
		// Find user
		const user = await User.findById(req.user._id);
		if (!user) {
			console.error('User not found:', req.user._id);
			return res.status(404).send({ message: "User not found" });
		}

		console.log('User found:', { id: user._id, email: user.email });

		// Check if password fields are provided
		if (!req.body.currentPassword || !req.body.newPassword) {
			console.error('Missing password fields');
			return res.status(400).send({ message: "Current password and new password are required" });
		}

		console.log('Password fields validation passed');

		// Verify current password
		const validPassword = await bcrypt.compare(req.body.currentPassword, user.password);
		if (!validPassword) {
			console.error('Invalid current password for user:', user._id);
			return res.status(400).send({ message: "Current password is incorrect" });
		}

		console.log('Current password verified successfully');

		// Hash and set new password
		try {
			const salt = await bcrypt.genSalt(Number(process.env.SALT));
			user.password = await bcrypt.hash(req.body.newPassword, salt);
			console.log('New password hashed successfully');
		} catch (hashError) {
			console.error('Error hashing password:', hashError);
			return res.status(500).send({ message: "Error processing new password" });
		}
		
		// Save the user
		try {
			await user.save();
			console.log('User password updated successfully:', { id: user._id });
		} catch (saveError) {
			console.error('Error saving user:', saveError);
			return res.status(500).send({ message: "Error saving new password" });
		}
		
		// Return updated user without password
		const updatedUser = await User.findById(user._id).select("-password");
		res.status(200).send({ message: "Password updated successfully", data: updatedUser });
	} catch (error) {
		console.error("Error updating user password:", error);
		res.status(500).send({ message: "Internal Server Error: " + error.message });
	}
});

module.exports = router;
