import { asyncHandler } from "./../../utils/errorhandling.js";
import createSlug from "../../utils/slugGenerator.js";
import cloudinary from "./../../utils/coludinaryConfigrations.js";
import createCustomId from "../../utils/customIdGenerator.js";
import { brandModel } from "../../../DB/Models/brand.model.js";
import { productModel } from "./../../../DB/Models/product.model.js";
import { categoryModel } from "./../../../DB/Models/category.model.js";
import { subCategoryModel } from "./../../../DB/Models/subCategory.model.js";

// ==================== add brand ============================
export const addBrand = asyncHandler(async (req, res, next) => {
	const { name } = req.body;
	const isBrandExist = await brandModel.findOne({ name });
	if (isBrandExist) {
		return next(new Error("duplicated brand name"));
	}

	const slug = createSlug(name);
	console.log(slug);
	if (!req.file) {
		return next(new Error("please upload your logo", { cause: 400 }));
	}
	const customId = createCustomId();
	// console.log(customId);
	// -----------upload logo ---------------------------------
	req.uploadPath = `${process.env.PROJECT_FOLDER}/Brands/${customId}`;
	const { secure_url, public_id } = await cloudinary.uploader.upload(
		req.file.path,
		{
			folder: req.uploadPath,
		}
	);

	// const { secure_url, public_id } = await uploadImage(req.file.path ,req.uploadPath ,req , next)

	const brandObject = {
		name,
		slug,
		customId,
		logo: { secure_url, public_id },
		addBy: req.authUser._id,
	};
	console.log(brandObject);
	// -------- create brand --------------------
	const brand = await brandModel.create(brandObject);

	return res.json({ message: "Done", brand });
});

// ====================== update brand =========================

export const updateBrand = asyncHandler(async (req, res, next) => {
	const { brandId } = req.query;
	const { name } = req.body;
	// get brand

	const brand = await brandModel.findById(brandId);

	if (!brand) {
		return next(new Error("invalid brandId"));
	}

	// if update name

	if (name) {
		const isNameDuplicated = await brandModel.findOne({ name });
		if (isNameDuplicated) {
			return next(new Error("duplicate name brand", { cause: 400 }));
		}
		brand.name = name;
		brand.slug = createSlug(name);
	}

	// update logo
	if (req.file) {
		const { secure_url, public_id } = await cloudinary.uploader.upload(
			req.file.path,
			{
				folder: `${process.env.PROJECT_FOLDER}/Brands/${brand.customId}`,
			}
		);

		await cloudinary.api.delete_resources_by_prefix(brand.logo.public_id);

		brand.logo = { secure_url, public_id };
	}

	await brand.save();
	return res.status(200).json({ message: "Done", brand });
});

// ===================== delete brand ========================

export const deleteBrand = asyncHandler(async (req, res, next) => {
	const { brandId } = req.query;

	const brand = await brandModel
		.findByIdAndDelete(brandId)
		.populate("products");
	console.log(brand);
	if (!brand) {
		return next(new Error("invalid brandId"));
	}

	// delete products related to brand

	if (brand.products.length) {
		const deleteRelatedProducts = await productModel.deleteMany({ brandId });

		if (!deleteRelatedProducts.deletedCount) {
			return next(new Error("delete related products failed"));
		}
		for (const product of brand.products) {
			await cloudinary.api.delete_resources_by_prefix(
				`${process.env.PROJECT_FOLDER}/Products/${product.customId}`
			);
			await cloudinary.api.delete_folder(
				`${process.env.PROJECT_FOLDER}/Products/${product.customId}`
			);
		}
	}

	// delete brand logo
	await cloudinary.api.delete_resources_by_prefix(
		`${process.env.PROJECT_FOLDER}/Brands/${brand.customId}`
	);
	await cloudinary.api.delete_folder(
		`${process.env.PROJECT_FOLDER}/Brands/${brand.customId}`
	);

	return res.status(200).json({ message: "Done", brand });
});

// ============== get brands by category id =================

export const getBrandsByCategoryId = asyncHandler(async (req, res, next) => {
	const { categoryId } = req.query;

	const category = await categoryModel.findById(categoryId);
	if (!category) {
		return next(new Error("invalid categoryId"));
	}
	const products = await productModel
		.find({ categoryId })
		.select("brandId")
		.populate("brandId");
	// console.log(products);

	let brandsSet = new Set();

	for (const product of products) {
		brandsSet.add(product.brandId);
	}

	const brands = Array.from(brandsSet);
	// console.log(brands);

	return res.status(200).json({ message: "Done", brands });
});
// =============== get brands by subCategory Id =======================
export const getBrandsBySubCategoryId = asyncHandler(async (req, res, next) => {
	const { subCategoryId } = req.query;
	const subCategory = await subCategoryModel.findById(subCategoryId);
	if (!subCategory) {
		return next(new Error("invalid subCategoryId"));
	}
	const products = await productModel
		.find({ subCategoryId })
		.select("brandId")
		.populate("brandId");
	// console.log(products);

	let brandsSet = new Set();

	for (const product of products) {
		brandsSet.add(product.brandId);
	}
	const brands = Array.from(brandsSet);
	// console.log(brands);

	return res.status(200).json({ message: "Done", brands });
});
