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
	comment: { type: String },
	rate: { type: Number, required: true  ,enum:[1,2,3,4,5] , min:1 ,max:5},
});

const reviewModel = model("Review", reviewSchema) || mongoose.models("Review");

export default reviewModel;
