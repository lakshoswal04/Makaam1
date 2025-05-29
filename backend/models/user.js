const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const { JWTPRIVATEKEY } = require("../config/keys");

const userSchema = new mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	educationLevel: { type: String },
	interests: [{ type: String }],
	skills: { type: String },
	careerGoals: { type: String },
	onboardingCompleted: { type: Boolean, default: false },
	isAdmin: { type: Boolean, default: false },
	roadmap: {
		learn: {
			title: String,
			description: String,
			topics: [String],
			tools: [String],
			projects: [String],
			resources: [{
				title: String,
				url: String
			}]
		},
		practice: {
			title: String,
			description: String,
			topics: [String],
			tools: [String],
			projects: [String],
			resources: [{
				title: String,
				url: String
			}]
		},
		build: {
			title: String,
			description: String,
			topics: [String],
			tools: [String],
			projects: [String],
			resources: [{
				title: String,
				url: String
			}]
		},
		apply: {
			title: String,
			description: String,
			topics: [String],
			tools: [String],
			projects: [String],
			resources: [{
				title: String,
				url: String
			}]
		},
		createdAt: { type: Date, default: Date.now }
	}
});

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign(
		{ 
			_id: this._id,
			isAdmin: this.isAdmin || false,
			onboardingCompleted: this.onboardingCompleted || false
		}, 
		JWTPRIVATEKEY, 
		{
			expiresIn: "7d",
		}
	);
	return token;
};

const User = mongoose.model("user", userSchema);

const validate = (data) => {
	const schema = Joi.object({
		firstName: Joi.string().required().label("First Name"),
		lastName: Joi.string().required().label("Last Name"),
		email: Joi.string().email().required().label("Email"),
		password: passwordComplexity().required().label("Password"),
		educationLevel: Joi.string().label("Education Level"),
		interests: Joi.array().items(Joi.string()).label("Interests"),
		skills: Joi.string().label("Skills"),
		careerGoals: Joi.string().label("Career Goals"),
		onboardingCompleted: Joi.boolean().label("Onboarding Completed"),
		isAdmin: Joi.boolean().label("Is Admin"),
	});
	return schema.validate(data);
};

module.exports = { User, validate };
