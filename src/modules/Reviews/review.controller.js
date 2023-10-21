import { asyncHandler } from "./../../utils/errorhandling.js";
import { productModel } from "./../../../DB/Models/product.model.js";
import { orderModel } from "./../../../DB/Models/order.model.js";
import reviewModel from "../../../DB/Models/review.model.js";

export const addReview = asyncHandler(async (req, res, next) => {
	const { productId } = req.query;
	const { text, rating } = req.body;
	const userId = req.authUser._id;

	const product = await productModel.findById(productId);
	if (!product) {
		return next(new Error("invalid productId"));
	}
        
	let isProductBought = false;
	const orders = await orderModel.find({$and:[{userId} , {orderStatus:"delivered"}]});
    console.log(orders);
	if (!orders.length) {
		return next(new Error("this user is not allowed to add reviews ,buy a product"));
	}

	for (const order of orders) {
		order.products.forEach((product) => {
			if ((product.productId = productId)) {
				isProductBought = true;
			}
		});
	}

	if (!isProductBought) {
		return next(new Error("this user hasn't bought this product"));
	}

	const review = await reviewModel.create({ userId, productId, text, rating });
    return res.status(200).json({message:"Done" ,review})
});
