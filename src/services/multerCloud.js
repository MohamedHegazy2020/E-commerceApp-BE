import multer from "multer";
import { allowedExtensions } from "../utils/allowedExtensions.js";

export const multerCloudFunction = (allowedExtensionsArr) => {
	if (!allowedExtensionsArr) {
		allowedExtensionsArr = allowedExtensions.Image;
	}
	//================================== Storage =============================
	const storage = multer.diskStorage({});

	//================================== File Filter =============================
	const fileFilter = function (req, file, cb) {
		if (!allowedExtensionsArr.includes(file.mimetype)) {
			console.log(file);
			cb(new Error("invalid extension", { cause: 400 }), false);
		}
		if (file.size>11000000) {
			cb(new Error("large file", { cause: 400 }), false);
		}

		return cb(null, true);
	};

	const fileUpload = multer({
		fileFilter,
		storage,
	});
	return fileUpload;
};
