import moment from "moment/moment.js";
import { couponModel } from "../../DB/Models/coupon.model.js";

export const isCouponValid = async ({ couponCode, userId, next } = {}) => {
	const coupon = await couponModel.findOne({ couponCode });

	if (!coupon) {
		return {
			msg: "please enter a valid coupon code",
		};
	}

	// expiration
	if (
		coupon.couponStatus == "Expired" ||
		moment(coupon.toDate).isBefore(moment())
	) {
		return { msg: "coupon is expired" };
	}
	// starting
	if (
		coupon.couponStatus == "Valid" &&
		moment().isBefore(moment(new Date(coupon.fromDate)))
	) {
		return { msg: "coupon doesn't started yet" };
	}
	// assigned user
	if (coupon.couponAsssignedUsers.length) {
		let assignedUsers = [];
		let exceedMaxUsage = false;
		for (const user of coupon.couponAsssignedUsers) {
			assignedUsers.push(user.userId.toString());

			if (userId.toString() == user.userId.toString()) {
				if (user.maxUsage <= user.usageCount) {
					exceedMaxUsage = true;
				}
			}
		}
		//  not assigned users
		if (!assignedUsers.includes(userId.toString())) {
			

			return {
				notAssigned: true,
				msg: "user is not assigned to use this coupon",
			};
		}
		// exceed max usage count
		if (exceedMaxUsage) {
			return {
				exceedMaxUsage,
				msg: "excees the max usage for this coupon",
			};
		}
	} else {
		return next(new Error("no assigned users for this coupon", { cause: 400 }));
	}

	return true;
};
