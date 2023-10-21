import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	api_key: "624265526725679",
	api_secret: "5vw2Th6KdfxgFVxdeHhT_AYix8o",
	cloud_name: "dipqscikr",
});

export default cloudinary;

// upload image

// export const uploadImage = async (imagePath ,uploadPath,req,next) => {

//     // Use the uploaded file's name as the asset's public ID and 
//     // allow overwriting the asset with new versions
//     const options = {
//       use_filename: true,
//       unique_filename: false,
//       overwrite: true,
// 	  folder:uploadPath
//     };

//     try {
//       // Upload the image
//       const result = await cloudinary.uploader.upload(imagePath, options);
//       console.log(result);
//       return {public_id , secure_url};
//     } catch (error) {
//       req.error = error
// 	  return next(req.error)
//     }
// };
