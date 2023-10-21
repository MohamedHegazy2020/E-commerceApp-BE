import mongoose, { model } from "mongoose";
const reviewSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Types.ObjectId,
		required: true,
		ref: "User",
	},
	productId: {
		type: mongoose.Types.ObjectId,
		required: true,
		ref: "Product",
	},
	text: { type: String, required: true },
	rating: { type: Number, required: true },
});

const reviewModel = model("Review", reviewSchema) || mongoose.models("Review");

export default reviewModel;
