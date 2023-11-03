import { subCategoryModel } from "../../../DB/Models/subCategory.model.js";
import { asyncHandler } from "../../utils/errorhandling.js";
import { brandModel } from "./../../../DB/Models/brand.model.js";
import createSlug from "./../../utils/slugGenerator.js";
import createCustomId from "./../../utils/customIdGenerator.js";
import cloudinary from "./../../utils/coludinaryConfigrations.js";
import { productModel } from "../../../DB/Models/product.model.js";
import { paginationFunction } from "../../utils/pagination.js";
import { ApiFeature } from './../../utils/apiFeature.js';
// ========================= add product =================================
export const addProduct = asyncHandler(async (req, res, next) => {
	const { title, desc, price, appliedDiscount, colors, sizes, stock } =
		req.body;

	const { brandId, subCategoryId } = req.query;
	// check ids

	// check subcategoryId
	const subCategory = await subCategoryModel
		.findById(subCategoryId)
		.populate({ path: "categoryId" }); 
	// check subCategory
	if (!subCategory) {
		return next(new Error("in-valid SubCategoryId"));
	} else if (!subCategory.categoryId) {
		return next(new Error("assigned category not found ,may be deleted"));
	}
	// get the categoryId
	const categoryId = subCategory.categoryId._id;
	// check brandId

	const brand = await brandModel.findById(brandId);
	if (!brand) {
		return next(new Error("in-valid brandId"));
	}

	//  generate slug
	const slug = createSlug(title);

	// customId
	const customId = createCustomId();

	//  calculate discount

	// upload images
	const images = [];
	req.uploadPath = `${process.env.PROJECT_FOLDER}/Products/${customId}`;
	if (!req.files) {
		return next(new Error("please upload your images"));
	}

	for (const file of req.files) {
		// console.log('upload starts')

		const { secure_url, public_id } = await cloudinary.uploader
			.upload(file.path, {
				folder: req.uploadPath,
			})
			.catch((err) => next(new Error(err)));
		// console.log('upload done')
		images.push({ secure_url, public_id });
	}
	const productObject = {
		title,
		slug,
		// desc,
		price,
		// appliedDiscount,
		// priceAfterDiscount,
		// colors,
		// sizes,
		stock,
		brandId,
		subCategoryId,
		categoryId,
		images,
		customId,
	};
	if (desc) {
		productObject.desc = desc;
	}
	if (colors) {
		productObject.colors = colors;
	}
	if (sizes) {
		productObject.sizes = sizes;
	}
	if (appliedDiscount) {
		productObject.appliedDiscount = appliedDiscount;
		productObject.priceAfterDiscount =
			price * (1 - (appliedDiscount || 0) / 100);
	}
	const product = await productModel.create(productObject);

	return res.status(201).json({ message: "Done", product });
});

// ============== update product ====================================
export const updateProduct = asyncHandler(async (req, res, next) => {
	const { title, desc, price, appliedDiscount, colors, sizes, stock } =
		req.body;

	const { newBrandId, newSubCategoryId, productId } = req.query;

	// check productId
	const product = await productModel.findById(productId);
	if (!product) {
		return next(new Error("invalid productId", { cause: 400 }));
	}
	// check newSubCategoryId
	if (newSubCategoryId) {
		const subCategory = await subCategoryModel
			.findById(newSubCategoryId)
			.populate("categoryId");

		if (!subCategory) {
			return next(new Error("invalid newSubCategoryId", { cause: 400 }));
		} else if (!subCategory.categoryId._id) {
			return next(
				new Error(
					"assigned category not found ,it may be deleted , try another newSubCategoryId ",
					{ cause: 400 }
				)
			);
		}

		product.subCategoryId = newSubCategoryId;
		product.categoryId = subCategory.categoryId._id;
	}

	// check newBrandId

	if (newBrandId) {
		const brand = await brandModel.findById(newBrandId);
		if (!brand) {
			return next(new Error("invalid brandId", { cause: 400 }));
		}
		product.brandId = newBrandId;
	}

	// title
	if (title) {
		product.title = title;
		product.slug = createSlug(title);
	}
	// desc
	if (desc) {
		product.desc = desc;
	}
	// stock
	if (stock) {
		product.stock = stock;
	}
	// colors
	if (colors) {
		product.colors = colors;
	} // sizes
	if (sizes) {
		product.sizes = sizes;
	}
	if (price && appliedDiscount) {
		product.appliedDiscount = appliedDiscount;
		product.price = price;
		product.priceAfterDiscount = price * (1 - (appliedDiscount || 0) / 100);
	} else if (price) {
		product.price = price;
		product.priceAfterDiscount =
			price * (1 - (product.appliedDiscount || 0) / 100);
	} else if (appliedDiscount) {
		product.appliedDiscount = appliedDiscount;
		product.priceAfterDiscount =
			product.price * (1 - (appliedDiscount || 0) / 100);
	}

	// check images
	if (req.files?.length) {
		req.uploadPath = `${process.env.PROJECT_FOLDER}/Products/${product.customId}`;

		const newImagesArr = [];
		const oldPublicIds = [];
		for (const file of req.files) {
			const { secure_url, public_id } = await cloudinary.uploader.upload(
				file.path,
				{
					folder: req.uploadPath,
				}
			);
			newImagesArr.push({ secure_url, public_id });
		}

		for (const image of product.images) {
			oldPublicIds.push = image.public_id;
		}

		if (newImagesArr.length && oldPublicIds.length) {
			await cloudinary.api.delete_resources(oldPublicIds);
			product.images = [...newImagesArr];
		}
	}
	await product.updateOne();
	return res
		.status(200)
		.json({ message: "Product Updated Successfully ", product });
});
// ======================get all products ===========================
export const getAllProducts = asyncHandler(async (req, res, next) => {
	const { page, size } = req.query;
	const { limit, skip } = paginationFunction({ page, size });
	const products = await productModel.find().limit(limit).skip(skip).populate('Reviews');

	return res.status(200).json({ message: "Done", page, products });
});
// ================= get products by name ===========================
export const getProductByTitle = asyncHandler(async (req, res, next) => {
	const { title } = req.query;

	const products = await productModel.find({
		title: { $regex: title, $options: "i" },
	});

	return res.status(200).json({ message: "Done", products });
});

// ============================ list Products (Api features) =====================

export const listProducts = asyncHandler(async (req, res, next) => {
	//sort
	// const { select, sort, search } = req.query;

	// // const products = await productModel
	// // 	.find({
	// // 		$or: [
	// // 			{title: { $regex: `^${search}`, $options: "i" }},
	// // 			{desc: { $regex: `^${search}`, $options: "i" }},
	// // 	],
	// // 	})
	// // 	.select(select.replaceAll(",", " "));

	// const filterObject = { ...req.query };
	// for (const key in filterObject) {
	// 	if (key.match(/sort|select|page|size|search|title/)) {
	// 		delete filterObject[key];
	// 	}
	// }
	// const filterString = JSON.parse(
	// 	JSON.stringify(filterObject).replaceAll(
	// 		/gt|gte|lt|lte|in|nin|eq|neq|regex/g,
	// 		(match) => `$${match}`
	// 	)
	// );
	// console.log(filterString);

	// const products =  productModel.find()
	// const data = await products


	const ApiFeatureInstance= new ApiFeature(productModel.find(),req.query).filters().sort()

	const data = await ApiFeatureInstance.mongooseQuery




	return res
		.status(200)
		.json({ message: "Done", count: data.length, data });
});
