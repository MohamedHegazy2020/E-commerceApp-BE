import { couponModel } from "../../../DB/Models/coupon.model.js";
import { asyncHandler } from "./../../utils/errorhandling.js";

// ===================== add coupon =======================================

export const addCoupon = asyncHandler(async (req, res, next) => {
	const {
		couponCode,
		couponAmount,
		isPercentage,
		isFixedAmount,
		fromDate,
		toDate,
	} = req.body;

	const isCouponDuplicated = await couponModel.findOne({ couponCode });

	if (isCouponDuplicated) {
		return next(new Error("duplicate couponCode"));
	}

	if ((!isFixedAmount && !isPercentage) || (isFixedAmount && isPercentage)) {
		return next(
			new Error("select if the coupon is percentage or fixed amount"),
			{ cause: 400 }
		);
	}

	const couponObject = {
		couponCode,
		couponAmount,
		isPercentage,
		isFixedAmount,
		fromDate,
		toDate,
		createdBy: req.authUser._id,
	};

	const coupon = await couponModel.create(couponObject);

	return res.status(201).json({ message: "Done", coupon });
});

// ===================================== delete coupon ==========================

export const deleteCoupon = asyncHandler(async (req, res, next) => {
	const { couponId } = req.query;
	// console.log(couponId);
	const userId = req.authUser._id;
	// console.log(userId);
	const coupon = await couponModel.findOneAndDelete({_id:couponId ,createdBy:userId});
	if (!coupon) {
		return next(new Error("invalid couponId", { cause: 400 }));
	}
	return res.status(201).json({ message: "done", coupon });
});

// =========================assign user to coupon ==================================

export const assignUserToCoupon = asyncHandler(async (req, res, next) => {
	const { couponId } = req.query;
	const { userId, maxUsage } = req.body;

	const coupon = await couponModel.findById(couponId);

	if (!coupon) {
		return next(new Error("invalid couponId"));
	}

	coupon.couponAsssignedUsers.push({ userId, maxUsage })

	await coupon.save();
	return res.json({ message: "Done", coupon });
});

