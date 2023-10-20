import mongoose from "mongoose";

const subCayegorySchema = new mongoose.Schema(
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
			ref: "User",
			required: true, //TODO:convert true after userModel generation
		},
		categoryId: {
			type: mongoose.Types.ObjectId,
			ref: "Category",
			required: true,
		},
	},
	{ timestamps: true,
	toJSON:{virtuals:true},toObject:{virtuals:true}, }
);
subCayegorySchema.virtual("Brands", {
	ref: "Brand",
	foreignField: "subCategoryId",
	localField: "_id",
});
export const subCategoryModel =
	mongoose.model("SubCategory", subCayegorySchema) ||
	mongoose.models("SubCategory");
