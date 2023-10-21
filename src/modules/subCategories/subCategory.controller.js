import { categoryModel } from "../../../DB/Models/category.model.js";
import { subCategoryModel } from "./../../../DB/Models/subCategory.model.js";

// import { customAlphabet } from "nanoid";
import { asyncHandler } from "./../../utils/errorhandling.js";
import slugify from "slugify";
import cloudinary from "../../utils/coludinaryConfigrations.js";
import createCustomId from "../../utils/customIdGenerator.js";
// const nanoid = customAlphabet("123654789asdfg+_=-", 5);

// ========================== get all subCategories =======================

export const getAllSubCategories = asyncHandler(async (req, res, next) => {
	const allSubCategories = await subCategoryModel.find().populate("categoryId");
	// TODO: get all subCategories with related brands
	if (!allSubCategories) {
		return next(new Error("there is no subCategories"));
	}
	return res.json({ message: "Done", allSubCategories });
});

// ============================ create category ===========================
export const createSubCategory = asyncHandler(async (req, res, next) => {
	const { name } = req.body;
	const { categoryId } = req.query;
	// check categoryId
	const category = await categoryModel.findById(categoryId);

	if (!category) {
		return next(new Error("in-valid category id"));
	}
	//  name is unique
	const isNameDuplicate = await subCategoryModel.findOne({ name });

	if (isNameDuplicate) {
		return next(new Error("subCategory name is duplicated", { cause: 409 }));
	}
	// generate slug
	const slug = slugify(name, { lower: true, trim: true, replacement: "_" });
	// image upload
	if (!req.file) {
		return next(new Error("upload your image"));
	}
	const customId = createCustomId();
	const { secure_url, public_id } = await cloudinary.uploader.upload(
		req.file.path,
		{
			folder: `${process.env.PROJECT_FOLDER}/Categories/${category.customId}/SubCategories/${customId}`,
			// use_filename:true
		}
	);

	const subCategoryObject = {
		name,
		slug,
		image: { public_id, secure_url },
		customId,
		categoryId,
		createdBy: req.authUser._id,
	};

	const subCategory = await subCategoryModel
		.create(subCategoryObject)
		.catch(async (err) => {
			await cloudinary.uploader.destroy(public_id);
			await cloudinary.api.delete_folder(
				`${process.env.PROJECT_FOLDER}/Categories/${category.customId}/SubCategories/${customId}`
			);

			return next(new Error(err, { cause: 400 }));
		});
	if (subCategory) {
		res.status(201).json({ message: "Done", subCategory });
	}
	// res.status(201).json({ message: "Done", subCategory });
});
// ======================= update SubCategory ==============================

export const updateSubCategory = asyncHandler(async (req, res, next) => {
	const { subCategoryId } = req.query;
	const { name } = req.body;

	const subCategory = await subCategoryModel.findById(subCategoryId);
	if (!subCategory) {
		return next(new Error("in-valid subCategory id"));
	}
	if (name) {
		// same as old name

		if (subCategory.name == name.toLowerCase()) {
			return next(new Error("same to old name", { cause: 400 }));
		}
		const isNameDuplicate = await subCategoryModel.findOne({ name });

		if (isNameDuplicate) {
			return next(new Error("subCategory name is duplicated", { cause: 409 }));
		}

		const slug = slugify(name, { lower: true, trim: true, replacement: "_" });
		subCategory.name = name;
		subCategory.slug = slug;
	}

	if (req.file) {
		const category = await categoryModel.findById(subCategory.categoryId);

		const { secure_url, public_id } = await cloudinary.uploader.upload(
			req.file.path,
			{
				folder: `${process.env.PROJECT_FOLDER}/Categories/${category.customId}/SubCategories/${subCategory.customId}`,
			}
		);

		// delete old image
		await cloudinary.uploader.destroy(subCategory.image.public_id);

		subCategory.image = { secure_url, public_id };
	}

	await subCategory.save();

	return res.status(200).json({ message: "Done", subCategory });
});

// ===================== delete SubCategory ===========================
export const deleteSubCategory = asyncHandler(async (req, res, next) => {
	const { subCategoryId } = req.query;
	const subCategory = await subCategoryModel
		.findByIdAndDelete(subCategoryId)
		.populate("products");
	if (!subCategory) {
		return next(new Error("in-valid subCategory id"));
	}
	const category = await categoryModel.findById(subCategory.categoryId);

	// delete category
	// db

	if (subCategory.products.length) {
		const deleteRelatedProducts = await productModel.deleteMany({ subCategoryId });

		if (!deleteRelatedProducts.deletedCount) {
			return next(new Error("delete related products failed"));
		}
		for (const product of subCategory.products) {
			await cloudinary.api.delete_resources_by_prefix(
				`${process.env.PROJECT_FOLDER}/Products/${product.customId}`
			);
			await cloudinary.api.delete_folder(
				`${process.env.PROJECT_FOLDER}/Products/${product.customId}`
			);
		}
	}

	// host

	// delete all files in specific Path
	await cloudinary.api.delete_resources_by_prefix(
		`${process.env.PROJECT_FOLDER}/Categories/${category.customId}/SubCategories/${subCategory.customId}`
	);
	// delete folder after delete all files in it
	await cloudinary.api.delete_folder(
		`${process.env.PROJECT_FOLDER}/Categories/${category.customId}/SubCategories/${subCategory.customId}`
	);

	return res.json({ message: "done" });
});
