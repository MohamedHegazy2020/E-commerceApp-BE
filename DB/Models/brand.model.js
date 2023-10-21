import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			lowercase: true,
			trim: true,
			unique: true,
		},
		slug: {
			type: String,
			required: true,
			lowercase: true,
			trim: true,
		},
		// subCategoryId: {
		// 	type: mongoose.Types.ObjectId,
		// 	ref: "SubCategory",
		// 	required: true,
		// },
		addBy: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: true, // TODO: set to true after creating userModel
		},
		logo: {
			secure_url: {
				type: String,
				required: true,
			},
			public_id: {
				type: String,
				required: true,
			},
		},
		customId: String,
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },toObject: { virtuals: true }
	}
);
brandSchema.virtual("products", {
	ref: "Product",
	foreignField: "brandId",
	localField: "_id",
});
export const brandModel =
	mongoose.model("Brand", brandSchema) || mongoose.models("Brand");
