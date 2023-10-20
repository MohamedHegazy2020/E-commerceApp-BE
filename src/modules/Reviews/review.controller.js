import { asyncHandler } from "./../../utils/errorhandling.js";
import { productModel } from "./../../../DB/Models/product.model.js";
import { orderModel } from "./../../../DB/Models/order.model.js";
import reviewModel from "../../../DB/Models/review.model.js";

// ====================== add review ========================================
export const addReview = asyncHandler(async (req, res, next) => {
	const { productId } = req.query;
	const { comment, rating } = req.body;
	const userId = req.authUser._id;

	const product = await productModel.findById(productId);
	if (!product) {
		return next(new Error("invalid productId"));
	}
	const isProductValidToReview = await orderModel.find({
		userId,
		"products.productId": productId,
		orderStatus: "delivered",
	});

	if(!isProductValidToReview){
		return next(new Error('you should buy the product first' ,{cause:400}))
	}

	const review = await reviewModel.create({
		userId,
		productId,
		comment,
		rating,  
	});
	return res.status(200).json({ message: "Done", review });
});

// ======================================= update review ===============================

export const updateReview = asyncHandler(async (req, res, next) => {});
