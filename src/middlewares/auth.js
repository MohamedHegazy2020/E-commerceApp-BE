import { userModel } from "../../DB/Models/user.model.js";
import { generateToken, verifyToken } from "../utils/tokenFunctions.js";
import { asyncHandler } from "./../utils/errorhandling.js";

export const isAuth = (roles) => {
	return async (req, res, next) => {
		try {
			const { authorization } = req.headers;
			if (!authorization) {
				return next(new Error("Please login first", { cause: 400 }));
			}

			if (!authorization.startsWith(process.env.BEARER_TOKEN_KEY)) {
				return next(new Error("invalid token prefix", { cause: 400 }));
			}

			const splitedToken = authorization.split("__")[1];
			// console.log(splitedToken);

			try {
				const decodedData = verifyToken({
					token: splitedToken,
					signature: process.env.SIGN_IN_TOKEN_SECRET,
				});
				// console.log(decodedData);
				const findUser = await userModel.findById(decodedData._id);
				// console.log(findUser);

				if (!findUser) {
					return next(new Error("Please SignUp", { cause: 400 }));
				}
				if (!roles.includes(findUser.role)) {
					return next(
						new Error("unauthorized to access this API", { cause: 401 })
					);
				}
				req.authUser = findUser;
				next();
			} catch (error) {
				// token  => search in db
				if (error == "TokenExpiredError: jwt expired") {
					// refresh token
					const user = await userModel.findOne({ token: splitedToken });
					if (!user) {
						return next(new Error("Wrong token", { cause: 400 }));
					}
					// generate new token
					const userToken = generateToken({
						payload: {
							email: user.email,
							_id: user._id,
							role: user.role,
						},
						signature: process.env.SIGN_IN_TOKEN_SECRET,
						expiresIn: "1h",
					});

					if (!userToken) {
						return next(
							new Error("token generation fail, payload canot be empty", {
								cause: 400,
							})
						);
					}
					user.token = userToken;
					await user.updateOne();
					return res
						.status(200)
						.json({ message: "Token refreshed", userToken });
				}
				return next(new Error("invalid token", { cause: 500 }));
			}
		} catch (error) {
			console.log(error);
			next(new Error(error, { cause: 500 }));
		}
	};
};

// =================== Admin , SuperAdmin middleware ==============================
