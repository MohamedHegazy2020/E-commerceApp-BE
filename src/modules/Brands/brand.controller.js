import { asyncHandler } from "./../../utils/errorhandling.js";
import { subCategoryModel } from "./../../../DB/Models/subCategory.model.js";
import createSlug from "../../utils/slugGenerator.js";
import cloudinary from "./../../utils/coludinaryConfigrations.js";
import createCustomId from "../../utils/customIdGenerator.js";
import { brandModel } from "../../../DB/Models/brand.model.js";

// ==================== add brand ============================
export const addBrand = asyncHandler(async (req, res, next) => {
	const { name } = req.body;
	const { userId } = req.query;
	// ------------ search subCategory -------------------
	// const subCategory = await subCategoryModel
	// 	.findById(subCategoryId)
	// 	.populate([{ path: "categoryId" }]);
	// if (!subCategory) {
	// 	return next(new Error("in-valid subCategoryId"));
	// }
	// console.log(subCategory);
	const slug = createSlug(name);
	// console.log(slug);
	if (!req.file) {
		return next(new Error("please upload your logo", { cause: 400 }));
	}
	const customId = createCustomId();
	// console.log(customId);
	// -----------upload logo ---------------------------------
	req.uploadPath = `${process.env.PROJECT_FOLDER}/Brands/${customId}`
	const { secure_url, public_id } = await cloudinary.uploader.upload(
		req.file.path,
		{
			folder: req.uploadPath,
		}
	);

	const brandObject = {
		name,
		slug,
		customId,
		logo: { secure_url, public_id },
		// subCategoryId, 
	};
	// console.log(brandObject);
	// -------- create brand --------------------
	const brand = await brandModel.create(brandObject)

		return res.json({ message: "Done", brand });
	
});
