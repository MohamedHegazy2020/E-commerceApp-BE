import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
	{
		name: { type: String, required: true, unique: true, lowercase: true },
		slug: { type: String, required: true, unique: true, lowercase: true },
		image: {
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
		createdBy: {
			type: mongoose.Types.ObjectId,
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

categorySchema.virtual("subCategories", {
	ref: "SubCategory",
	foreignField: "categoryId",
	localField: "_id",
});

categorySchema.virtual("products", {
	ref: "Product",
	foreignField: "categoryId",
	localField: "_id", 
});


export const categoryModel =
	mongoose.model("Category", categorySchema) || mongoose.models("Category");
	mongoose.model("Category", categorySchema) || mongoose.models("Category");
