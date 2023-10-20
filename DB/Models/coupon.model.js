import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
	{
		couponCode: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		couponAmount: {
			type: Number,
			required: true,
			min: 1,
			max: 100,
			default: 1,
		},
		isPercentage: {
			type: Boolean,
			required: true,
			default: false,
		},
		isFixedAmount: {
			type: Boolean,
			required: true,
			default: false,
		},
		createdBy: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: true,
		},
		updatedBy: {
			type: mongoose.Types.ObjectId,
			ref: "User",
		},
		deletedBy: {
			type: mongoose.Types.ObjectId,
			ref: "User",
		},
		couponAsssignedUsers: [
			{
				userId: { type: mongoose.Types.ObjectId, required:true ,ref: "User" },
				maxUsage: {
					type: Number,
					required: true,
					default: 1,
				},
				usageCount: {
					type: Number,
					required: true,

					default: 0,
				},
			},
		],
		fromDate: {
			type: String,
			required: true,
		},
		toDate: {
			type: String,
			required: true,
		},
		couponStatus: {
			type: String,
			required: true,
			enum: ["Expired", "Valid"],
			default: "Valid",
		},
	},
	{
		timestamps: true,
	}
);

export const couponModel =
	mongoose.model("Coupon", couponSchema) || mongoose.models("Coupon");
