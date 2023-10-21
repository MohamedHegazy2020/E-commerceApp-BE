import { asyncHandler } from "./../../utils/errorhandling.js";
import { productModel } from "./../../../DB/Models/product.model.js";
import { cartModel } from "./../../../DB/Models/cart.model.js";

export const addToCart = asyncHandler(async (req, res, next) => {
	const userId = req.authUser._id;
	const { productId, quantity } = req.body;

	// --------------------------------- product check -----------------------

	const productCheck = await productModel.findById(productId);

	if (!productCheck) {
		return next(new Error("invalid productId"));
	}
	if (productCheck.stock < quantity) {
		return next(
			new Error("the required quantity is greater than available stock")
		);
	}

	// -------------------- user cart ---------------------------
	const userCart = await cartModel.findOne({ userId }).lean();

	if (userCart) {
		// update quantity

		let productExist = false;
		for (const product of userCart.products) {
			if (productId == product.productId) {
				productExist = true;
				product.quantity = quantity;
			}
		}

		// push new product
		if (!productExist) {
			userCart.products.push({ productId, quantity });
		}

		// calculate subTotal

		let subTotal = 0;

		for (const product of userCart.products) {
			const foundedProduct = await productModel.findById(product.productId);
			subTotal += foundedProduct.priceAfterDiscount * product.quantity || 0;
		}

		const cart = await cartModel.findByIdAndUpdate(
			userCart._id,
			{ products: userCart.products, subTotal },
			{ new: true }
		);
		return res.json({ message: "Done", cart });
	}

	const cartObject = {
		userId,
		products: [{ productId, quantity }],
		subTotal: productCheck.priceAfterDiscount * quantity,
	};
	const cart = await cartModel.create(cartObject);

	return res.json({ message: "Done", cart });
});

// ==================== delete fromm cart ==============================
export const deleteFromCart = asyncHandler(async (req, res, next) => {
	const userId = req.authUser._id;
	const { productId } = req.body;
	const productCheck = await productModel.findById(productId);
	if (!productCheck) {
		return next(new Error("invalid productId"));
	}

	const userCart = await cartModel.findOne({
		userId,
		"products.productId": productId,
	});
	if (!userCart) {
		return next(new Error("can't find this product in this cart"));
	}

	userCart.products.forEach(async (elem) => {
		if (elem.productId == productId) {
			userCart.products.splice(userCart.products.indexOf(elem), 1);
			const product = await productModel.findById(elem.productId);
			userCart.subTotal -= product.priceAfterDiscount * elem.quantity;
			console.log(userCart.subTotal);
		}
	});

	await userCart.save();
	return res.status(200).json({ message: "Done", userCart });
});

// ================= clear  cart ============================

export const clearCart = asyncHandler(async (req, res, next) => {
	const userId = req.authUser._id;
	const cart = await cartModel.findOne({ userId });
	if (!cart) {
		return next(new Error("cart doesn't exist"));
	}
	cart.products = [];
	cart.subTotal = 0;
	await cart.save()
	return res.status(200).json({ message: "Done", cart });

});
