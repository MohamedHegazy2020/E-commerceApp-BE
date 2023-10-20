import axios from "axios";
import { userModel } from "../../../DB/Models/user.model.js";
import { sendEmailService } from "../../services/sendEmailService.js";
import { emailTemplate } from "../../utils/emailTemplate.js";
import { asyncHandler } from "./../../utils/errorhandling.js";
import { generateToken, verifyToken } from "./../../utils/tokenFunctions.js";
import pkg, { compareSync } from "bcrypt";
import { nanoid } from "nanoid";
import otpGenerator from "otp-generator";

// ================== SignUp ========================
export const signUp = asyncHandler(async (req, res, next) => {
	const { userName, email, password, address, gender, age, phoneNumber } =
		req.body;

	// ------------- check if user exist------------
	const isEmailDuplicate = await userModel.findOne({ email });
	if (isEmailDuplicate) {
		return next(new Error("email is already exist", { cause: 400 }));
	}

	// --------------- hash password --------------------

	// ------------- generate token --------------------

	const token = generateToken({
		payload: { email },
		signature: process.env.CONFIRMATION_EMAIL_TOKEN,
		expiresIn: "1h",
	});

	// ------------------ confirm email -----------------
	const confirmationLink = `${req.protocol}://${req.headers.host}/auth/confirm/${token}`;

	const isConfirmationSent = sendEmailService({
		to: email,
		subject: "confirmation Email",
		message: emailTemplate({
			link: confirmationLink,
			linkData: "confirm email",
			subject: "confirmation Email",
		}),
	});

	if (!isConfirmationSent) {
		return next(new Error("fail to send confirmation email ", { cause: 400 }));
	}

	const user = await userModel({
		userName,
		email,
		password,
		address,
		gender,
		age,
		phoneNumber,
	});
	const savedUser = await user.save();

	return res.status(201).json({ message: "Done", user: savedUser });
});

// =================== confirmation email ======================================

export const confirmEmail = asyncHandler(async (req, res, next) => {
	const { token } = req.params;
	const { email } = verifyToken({
		token,
		signature: process.env.CONFIRMATION_EMAIL_TOKEN,
	});
	const user = await userModel.findOne({ email });

	if (!user?.isConfirmed == false) {
		return next(new Error("already confirmed", { cause: 400 }));
	}
	await user.updateOne({ isConfirmed: true });
	// const user = await userModel.create({ userName, email, password, address, gender, age, phoneNumber,isConfirmed:true })
	return res
		.status(200)
		.json({ message: "confirmed Done , please try to login" });
});

//  ============================= logIn ===================
export const logIn = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;
	const user = await userModel.findOne({ email });
	if (!user) {
		return next(new Error("invalid email", { cause: 400 }));
	}
	if (!user.isConfirmed) {
		return next(new Error("not confirmed email", { cause: 400 }));
	}


	console.log(compareSync(password ,"$2b$08$BwcFvrccbP7EdVqeSlYJbeB.b9YdVq6eVmm4Hpo1KzckKcjHb2yQK"));
	const isPassMatch = pkg.compareSync(password, user.password)
	
	if (!isPassMatch) {
	  return next(new Error('invalid password', { cause: 400 }))
	}

	const token = generateToken({
		payload: {
			email,
			_id: user._id,
			role: user.role,
		},
		signature: process.env.SIGN_IN_TOKEN_SECRET,
		expiresIn: "1h",
	});

	const loggedUser = await userModel.findByIdAndUpdate(
		user._id,
		{
			token,
			status: "Online",
		},
		{ new: true }
	);

	return res.status(200).json({ message: "Login Done", loggedUser });
});

// ========================= forget Password =====================

export const forgetPassword = asyncHandler(async (req, res, next) => {
	const { email } = req.body;
	const user = await userModel.findOne({ email });

	if (!user) {
		return next(new Error("invalid email", { cause: 400 }));
	}

	const otp = otpGenerator.generate(4, {
		upperCaseAlphabets: false,
		specialChars: false,
	});
	const token = generateToken({
		payload: { email, otp },
		expiresIn: "1h",
		signature: process.env.RESET_PASSWORD_SIGNATURE,
	});

	// const resetPasswordLink = `${req.protocol}://${req.headers.host}/auth/reset/${token}`;

	const isEmailSent = sendEmailService({
		to: email,
		subject: "reset password",
		message: emailTemplate({
			subject: "reset password",otp
		}),
	});

	if (!isEmailSent) {
		return next(new Error("fail to sent reset password email", { cause: 400 }));
	}

	const updatedUser = await userModel.findByIdAndUpdate(
		user._id,
		{ forgetCode: otp },
		{ new: true }
	);
	return res
		.status(200)
		.json({
			message: "check your email for otp code ",
			resetPasswordToken: token,
		});
});

// ======================= reset password =========================

export const resetPassword = asyncHandler(async (req, res, next) => {
	const { token } = req.params;
	const { newPassword, otp } = req.body;
	const decode = verifyToken({
		token,
		signature: process.env.RESET_PASSWORD_SIGNATURE,
	});
	if(otp!=decode.otp){
		return next(new Error('invalid resetPasswordToken'))
	}
	const user = await userModel.findOne({
		email: decode?.email,
		forgetCode: otp,
	});

	if (!user) {
		return next(new Error("already password resetted", { cause: 400 }));
	}

	user.password = newPassword;
	user.forgetCode = null;

	const updatedUser = await user.save();
	return res.status(200).json({
		message: "password resetted suessfully ,try to login ",
		updatedUser,
	});
});
