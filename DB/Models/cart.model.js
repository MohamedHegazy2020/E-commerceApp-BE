// const { Schema, model } = ("mongoose");

import mongoose, { Schema, model } from "mongoose";

const cartSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		products: [
			{
				productId: {
					type: Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
				quantity: {      
					type: Number,
					required: true,
				},
			},
		],
		subTotal: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
);

export const cartModel = model("Cart", cartSchema) || mongoose.models("Cart");
