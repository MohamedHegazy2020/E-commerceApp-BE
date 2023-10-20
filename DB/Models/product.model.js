import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		// ======= Text section =======
		title: {
			type: String,
			required: true,
			lowercase: true,
		},
		desc: String,
		slug: {
			type: String,
			required: true,
			lowercase: true,
		},

		// ======= Specifications section =======
		colors: [String],
		sizes: [String],

		// ======= Price section =======
		price: {
			type: Number,
			required: true,
			default: 1,
		},
		appliedDiscount: {
			type: Number,
			default: 0,
		},
		priceAfterDiscount: {
			type: Number,
			default: 0,
		},

		// ======= Quantity section =======
		stock: {
			type: Number,
			required: true,
			default: 1,
		},

		// ======= Related Ids section =======
		createdBy: {
			type:mongoose.Types.ObjectId,
			ref: "User",
			required: true, // TODO: convert into true after creating usermodel
		},
		updatedBy: {
			type: mongoose.Types.ObjectId,
			ref: "User",
		},
		deletedBy: {
			type: mongoose.Types.ObjectId,
			ref: "User",
		},
		categoryId: {
			type: mongoose.Types.ObjectId,
			ref: "Category",
			required: true,
		},
		subCategoryId: {
			type: mongoose.Types.ObjectId,
			ref: "subCategory",
			required: true,
		},
		brandId: {
			type: mongoose.Types.ObjectId,
			ref: "Brand",
			required: true,
		},

		// ======= Images section =======

		images: [
			{
				secure_url: {
					type: String,
					required: true,
				},
				public_id: {
					type: String,
					required: true,
				},
			},
		],
		customId: String,
	},         
	{ timestamps: true }
);

export const productModel =
	mongoose.model("Product", productSchema) || mongoose.models("Product");
