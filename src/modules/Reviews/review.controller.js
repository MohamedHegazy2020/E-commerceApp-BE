import { asyncHandler } from "./../../utils/errorhandling.js";
import { productModel } from "./../../../DB/Models/product.model.js";
import { orderModel } from "./../../../DB/Models/order.model.js";
import reviewModel from "../../../DB/Models/review.model.js";

//  ========================== add review ======================================
export const addReview = asyncHandler(async (req, res, next) => {
	const { productId } = req.query;
	const { comment, rate } = req.body;
	const userId = req.authUser._id;

	const product = await productModel.findById(productId);
	if (!product) {
		return next(new Error("invalid productId"));
	}

	const isProductBought = await orderModel.findOne({
		userId,
		"products.productId": productId,
	});
	if (!isProductBought) {
		return next(new Error("you should buy the product first", { cause: 400 }));
	}

	const reviewDB = await reviewModel.create({
		userId,
		productId,
		comment,
		rate,
	});
	console.log(reviewDB);
	if (!reviewDB) {
		return next(new Error("failed to add review", { cause: 400 }));
	}

	const allReviews = await reviewModel.find({ productId });
	let sumOfRates ;

	for (const review of allReviews) {
		// console.log(review.rate);
		sumOfRates += review.rate;
	}
	console.log(sumOfRates);
	const totalRates = Number(sumOfRates / allReviews.length).toFixed(2);
	await product.updateOne({ totalRates }, { new: true });

	return res.status(200).json({ message: "Done", reviewDB, product });
});
