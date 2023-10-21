import slugify from "slugify";
import { categoryModel } from "../../../DB/Models/category.model.js";
import { asyncHandler } from "./../../utils/errorhandling.js";
import cloudinary from "./../../utils/coludinaryConfigrations.js";
import { subCategoryModel } from "../../../DB/Models/subCategory.model.js";
import createCustomId from "./../../utils/customIdGenerator.js";
import { productModel } from "../../../DB/Models/product.model.js";

// ============================ get all categories ========================
export const getAllCategories = asyncHandler(async (req, res, next) => {
	// -------------- virtual populate to get subCategories ---------------------

	const allCategories = await categoryModel
		.find()
		.populate([{ path: "subCategories", populate: [{ path: "Brands" }] }]);

	return res.json({ message: "done", allCategories });

	// -------------- original for loop to get subCategory --------------------

	// let allCategories = [];
	// let subCategories = [];

	// for (const category of await categoryModel.find()) {
	// 	subCategories = await subCategoryModel.find({ categoryId: category._id });
	// 	const objectCat = category.toObject()
	// 	objectCat.subCategories = subCategories

	// 	allCategories.push(objectCat)
	// }
	// return res.json({ message: "done", allCategories });

	// --------------------- cursor to get subCategories --------------------

	// let allCategories = [];
	// let subCategories = [];
	// const cursor = await categoryModel.find().cursor();
	// console.log(await cursor.next());

	// for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {

	// 	subCategories = await subCategoryModel.find({ categoryId: doc._id });
	// 		const objectCat = doc.toObject()
	// 		objectCat.subCategories = subCategories

	// 		allCategories.push(objectCat)
	// 	}
	// 	return res.json({ message: "done", allCategories });
});
// ============================ create category ===========================
export const createCategory = asyncHandler(async (req, res, next) => {
	const { name } = req.body;
	const isNameDuplicate = await categoryModel.findOne({ name });

	if (isNameDuplicate) {
		return next(new Error("category name is duplicated", { cause: 409 }));
	}

	const slug = slugify(name, { trim: true, replacement: "_", lower: true });
	if (!req.file) {
		return next(new Error("upload your image", { cause: 400 }));
	}
	const customId = createCustomId();

	req.uploadPath = `${process.env.PROJECT_FOLDER}/Categories/${customId}`;
	const { public_id, secure_url } = await cloudinary.uploader
		.upload(req.file.path, {
			folder: req.uploadPath,
		})
	const categoryObject = {
		name,
		slug,
		customId,
		image: { public_id, secure_url },
		createdBy: req.authUser._id,
	};
	console.log(categoryObject);

	const category = await categoryModel
		.create(categoryObject)
		

	return res.status(201).json({ message: "Done", category });
});
// ========================= update category ======================

export const updateCategory = asyncHandler(async (req, res, next) => {
	const { categoryId } = req.query;
	const { name } = req.body;

	const category = await categoryModel.findById(categoryId);
	if (!category) {
		return next(new Error("in-valid category id"));
	}

	if (name) {
		if (category.name == name) {
			return next(new Error("same to old name", { cause: 400 }));
		}
		const isNameDuplicate = await categoryModel.findOne({ name });

		if (isNameDuplicate) {
			return next(new Error("category name is duplicated", { cause: 409 }));
		}

		const slug = slugify(name, { trim: true, lower: true, replacement: "_" });
		category.name = name;
		category.slug = slug;
	}

	if (req.file) {
		const { secure_url, public_id } = await cloudinary.uploader.upload(
			req.file.path,
			{
				folder: `${process.env.PROJECT_FOLDER}/Categories/${category.customId}`,
			}
		);

		// delete old image
		await cloudinary.uploader.destroy(category.image.public_id);

		category.image = { secure_url, public_id };
	}

	await category.save();

	res.status(200).json({ message: "Done", category });
});

// ============= delete cayegory ==========================

export const deleteCategory = asyncHandler(async (req, res, next) => {
	const { categoryId } = req.query;
	const category = await categoryModel
		.findByIdAndDelete(categoryId)
		.populate(["subCategories", "products"]);
	console.log(category);  
	if (!category) {
		return next(new Error("in-valid category id"));
	}

	// delete category >> db
	if (category.subCategories.length) {
		const deleteRelatedSubCategory = await subCategoryModel.deleteMany({
			categoryId,
		});

		if (!deleteRelatedSubCategory.deletedCount) {
			return next(new Error("delete related subCategories failed"));
		}
	}
	// delete related products
	if (category.products.length) {
		const deleteRelatedProducts = await productModel.deleteMany({ categoryId });

		if (!deleteRelatedProducts.deletedCount) {
			return next(new Error("delete related products failed"));
		}
		for (const product of category.products) {
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
		`${process.env.PROJECT_FOLDER}/Categories/${category.customId}`
	);
	// delete folder after delete all files in it
	await cloudinary.api.delete_folder(
		`${process.env.PROJECT_FOLDER}/Categories/${category.customId}`
	);

	return res.json({ message: "Deleted Done" });
});
