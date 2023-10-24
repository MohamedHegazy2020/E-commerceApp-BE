import { couponModel } from "../../../DB/Models/coupon.model.js";
import { isCouponValid } from "../../utils/couponValidation.js";
import { asyncHandler } from "./../../utils/errorhandling.js";
import { productModel } from "./../../../DB/Models/product.model.js";
import { orderModel } from "../../../DB/Models/order.model.js";
import { cartModel } from "./../../../DB/Models/cart.model.js";
import { nanoid } from "nanoid";
import createInvoice from "../../utils/pdfkit.js";
import { sendEmailService } from "../../services/sendEmailService.js";
import { qrcodeFunction } from "../../utils/qrCode.js";
import { paymentFunction } from "../../utils/payment.js";
import { generateToken, verifyToken } from "./../../utils/tokenFunctions.js";
import Stripe from "stripe";

//================ create order =============================

export const createOrder = asyncHandler(async (req, res, next) => {
	const userId = req.authUser._id;
	const {
		productId,
		quantity,
		address,
		phoneNumbers,
		paymentMethod,
		couponCode,
	} = req.body;

	// coupon check

	if (couponCode) {
		const coupon = await couponModel
			.findOne({ couponCode })
			.select("isPercentage isFixedAmount couponAmount couponAsssignedUsers");
		const isCouponValidResult = await isCouponValid({
			couponCode,
			userId,
			next,
		});
		// console.log(isCouponValidResult);
		if (isCouponValidResult !== true) {
			return next(new Error(isCouponValidResult.msg, { cause: 400 }));
		}

		req.coupon = coupon;
	}

	// check products

	const products = [];
	const isProductValid = await productModel.findOne({
		_id: productId,
		stock: { $gte: quantity },
	});

	if (!isProductValid) {
		return next(new Error("invalid product please check your quantity"));
	}

	const prodtuctObject = {
		productId,
		quantity,
		title: isProductValid.title,
		price: isProductValid.priceAfterDiscount,
		finalPrice: isProductValid.priceAfterDiscount * quantity,
	};
	// console.log(prodtuctObject);
	products.push(prodtuctObject);
	//  subTotal
	let subTotal = prodtuctObject.finalPrice;
	// paid Amound
	let paidAmount = 0;
	if (req.coupon?.isPercentage) {
		paidAmount = subTotal * (1 - (req.coupon.couponAmount || 0) / 100);
	} else if (req.coupon?.isFixedAmount) {
		paidAmount = subTotal - req.coupon.couponAmount;
	} else {
		paidAmount = subTotal;
	}

	// payment && orderStatus

	let orderStatus;
	paymentMethod == "cash"
		? (orderStatus = "placed")
		: (orderStatus = "pending");

	const orderObject = {
		userId,
		products,
		address,
		phoneNumbers,
		orderStatus,
		paymentMethod,
		subTotal,
		paidAmount,
		couponId: req.coupon?._id,
	};
	const orderDB = await orderModel.create(orderObject);

	if (!orderDB) {
		return next(new Error("fail to create your order ", { cause: 400 }));
	}
	//-------------------- payment --------------------------------------------------
	let orderSession;
	if (orderDB.paymentMethod == "card") {
		if (req.coupon) {
			const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
			let coupon;

			// coupon =>percentage

			if (req.coupon.isPercentage) {
				coupon = await stripe.coupons.create({
					percent_off: req.coupon.couponAmount,
				});
			}
			// coupon => fixedAmount
			if (req.coupon.isFixedAmount) {
				coupon = await stripe.coupons.create({
					amount_off: req.coupon.couponAmount * 100,
					currency: "EGP",
				});
			}
			req.couponId = coupon.id;
		}
		const tokenOrder = generateToken({
			payload: { orderId: orderDB._id },
			signature: process.env.ORDER_TOKEN,
			expiresIn: "1h",
		});

		orderSession = await paymentFunction({
			payment_method_types: ["card"],
			mode: "payment",
			customer_email: req.authUser.email,
			metadata: { orderId: orderDB._id.toString() },
			success_url: `${req.protocol}://${req.headers.host}/order/successOrder?token=${tokenOrder}`,
			cancel_url: `${req.protocol}://${req.headers.host}/order/cancelOrder?token=${tokenOrder}`,
			line_items: orderDB.products.map((ele) => {
				return {
					price_data: {
						currency: "EGP",
						product_data: {
							name: ele.title,
						},
						unit_amount: ele.price * 100,
					},
					quantity: ele.quantity,
				};
			}),
			discounts: req.couponId ? [{ coupon: req.couponId }] : [],
		});
	}

	// increase usageCount for coupon

	if (req.coupon) {
		for (const user of req.coupon.couponAsssignedUsers) {
			if (user.userId == userId) {
				user.usagecount += 1;
			}
		}
		await req.coupon.save();
	}

	// decrease product's stock by order's product quantity
	await productModel.findByIdAndUpdate(productId, {
		$inc: { stock: -parseInt(quantity) },
	});

	// remove product from userCart if exist

	// ---------------------------- qrcode ---------------------

	const orderQr = await qrcodeFunction({
		data: { orderID: orderDB._id, products: orderDB.products },
	});

	//----------------------- invoice ---------------------------------
	const orderCode = `${req.authUser.userName}_${nanoid(3)}`;
	// // generate invoice object

	const orderInvoice = {
		orderCode,
		date: orderDB.createdAt,
		items: orderDB.products,
		subTotal: orderDB.subTotal,
		paidAmount: orderDB.paidAmount,
		shipping: {
			name: req.authUser.userName,
			address: orderDB.address,
			city: "Cairo",
			state: "Cairo",
			country: "Cairo",
		},
	};
	createInvoice(orderInvoice, `${orderCode}.pdf`);
	await sendEmailService({
		to: req.authUser.email,
		subject: "Order Confimation",
		message: "<h1> please find your invoice below </h1>",
		attachments: [{ path: `./Files/${orderCode}.pdf` }],
	});
	return res.status(201).json({
		message: "Done",
		orderDB,
		orderQr,
		checkOutUrl: paymentMethod == "card" ? orderSession.url : "",
	});
});
// ==================== from  cart to user Api ==============================

export const fromCartToOrder = asyncHandler(async (req, res, next) => {
	const userId = req.authUser._id;
	const { cartId } = req.query;
	const { address, phoneNumbers, paymentMethod, couponCode } = req.body;
	const cart = await cartModel.findById(cartId);
	if (!cart) {
		return next(new Error("invalid cartId", { cause: 400 }));
	} else if (!cart.products.length) {
		return next(new Error("this cart is empty", { cause: 400 }));
	}

	if (couponCode) {
		const coupon = await couponModel
			.findOne({ couponCode })
			.select("isPercentage isFixedAmount couponAmount couponAsssignedUsers");
		const isCouponValidResult = await isCouponValid({
			couponCode,
			userId,
			next,
		});
		// console.log(isCouponValidResult);
		if (isCouponValidResult !== true) {
			return next(new Error(isCouponValidResult.msg, { cause: 400 }));
		}

		req.coupon = coupon;
		// console.log(req.coupon);
	}

	//  subTotal
	let subTotal = cart.subTotal;
	// paid Amound
	let paidAmount = 0;
	if (req.coupon?.isPercentage) {
		paidAmount = subTotal * (1 - (req.coupon.couponAmount || 0) / 100);
	} else if (req.coupon?.isFixedAmount) {
		paidAmount = subTotal - req.coupon.couponAmount;
	} else {
		paidAmount = subTotal;
	}

	// paymentMethod && orderStatus

	let orderStatus;
	paymentMethod == "cash"
		? (orderStatus = "placed")
		: (orderStatus = "pending");
	let orderProducts = [];
	for (const product of cart.products) {
		const productExist = await productModel.findById(product.productId);
		orderProducts.push({
			productId: product.productId,
			quantity: product.quantity,
			title: productExist.title,
			price: productExist.priceAfterDiscount,
			finalPrice: productExist.priceAfterDiscount * product.quantity,
		});
	}

	const orderObject = {
		userId,
		products: orderProducts,
		address,
		phoneNumbers,
		orderStatus,
		paymentMethod,
		subTotal,
		paidAmount,
		couponId: req.coupon?._id,
	};
	const orderDB = await orderModel.create(orderObject);

	if (!orderDB) {
		return next(new Error("fail to create your order ", { cause: 400 }));
	}

	//-------------------- payment --------------------------------------------------
	let orderSession;
	if (orderDB.paymentMethod == "card") {
		if (req.coupon) {
			const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
			let coupon;

			// coupon =>percentage

			if (req.coupon.isPercentage) {
				coupon = await stripe.coupons.create({
					percent_off: req.coupon.couponAmount,
				});
			}
			// coupon => fixedAmount
			if (req.coupon.isFixedAmount) {
				coupon = await stripe.coupons.create({
					amount_off: req.coupon.couponAmount * 100,
					currency: "EGP",
				});
			}
			req.couponId = coupon.id;
		}
		const tokenOrder = generateToken({
			payload: { orderId: orderDB._id },
			signature: process.env.ORDER_TOKEN,
			expiresIn: "1h",
		});

		orderSession = await paymentFunction({
			payment_method_types: ["card"],
			mode: "payment",
			customer_email: req.authUser.email,
			metadata: { orderId: orderDB._id.toString() },
			success_url: `${req.protocol}://${req.headers.host}/order/successOrder?token=${tokenOrder}`,
			cancel_url: `${req.protocol}://${req.headers.host}/order/cancelOrder?token=${tokenOrder}`,
			line_items: orderDB.products.map((ele) => {
				return {
					price_data: {
						currency: "EGP",
						product_data: {
							name: ele.title,
						},
						unit_amount: ele.price * 100,
					},
					quantity: ele.quantity,
				};
			}),
			discounts: req.couponId ? [{ coupon: req.couponId }] : [],
		});
	}

	// increase usageCount for coupon

	if (req.coupon) {
		for (const user of req.coupon.couponAsssignedUsers) {
			if (user.userId == userId) {
				user.usagecount += 1;
			}
		}
		await req.coupon.save();
	}

	// decrease product's stock by order's product quantity
	for (const product of cart.products) {
		await productModel.findByIdAndUpdate(product.productId, {
			$inc: { stock: -parseInt(product.quantity) },
		});
	}

	// remove product from userCart if exist
	cart.products = [];
	cart.subTotal = 0;
	await cart.save();
	// ---------------------------- qrcode ---------------------

	const orderQr = await qrcodeFunction({
		data: { orderID: orderDB._id, products: orderDB.products },
	});
	//----------------------- invoice ---------------------------------
	const orderCode = `${req.authUser.userName}_${nanoid(3)}`;
	// generate invoice object

	const orderInvoice = {
		orderCode,
		date: orderDB.createdAt,
		items: orderDB.products,
		subTotal: orderDB.subTotal,
		paidAmount: orderDB.paidAmount,
		shipping: {
			name: req.authUser.userName,
			address: orderDB.address,
			city: "Cairo",
			state: "Cairo",
			country: "Cairo",
		},
	};
	createInvoice(orderInvoice, `${orderCode}.pdf`);
	await sendEmailService({
		to: req.authUser.email,
		subject: "Order Confimation",
		message: "<h1> please find your invoice below </h1>",
		attachments: [{ path: `./Files/${orderCode}.pdf` }],
	});

	return res.status(201).json({
		message: "Done",
		orderDB,
		orderQr,
		checkOutUrl: paymentMethod == "card" ? orderSession.url : "",
	});
});

// ============================= success payment  ===================
export const successPayment = asyncHandler(async (req, res, next) => {
	const { token } = req.query;
	const decodeData = verifyToken({ token, signature: process.env.ORDER_TOKEN });
	const order = await orderModel.findOne({
		_id: decodeData.orderId,
		orderStatus: "pending",
	});
	if (!order) {
		return next(new Error("invalid order id", { cause: 400 }));
	}
	order.orderStatus = "confirmed";
	await order.save();
	res.status(200).json({ message: "done", order });
});

//================================ cancel payment =====================
export const cancelPayment = asyncHandler(async (req, res, next) => {
	const { token } = req.query;
	const decodeData = verifyToken({ token, signature: process.env.ORDER_TOKEN });
	const order = await orderModel.findOne({ _id: decodeData.orderId });
	if (!order) {
		return next(new Error("invalid order id", { cause: 400 }));
	}

	//=============== approch one orderSattus:'canceled'
	order.orderStatus = "canceled";
	await order.save();
	//================ delete from db
	// await orderModel.findOneAndDelete({ _id: decodeData.orderId })

	//=================== undo prouducts  and coupon  ====================
	for (const product of order.products) {
		await productModel.findByIdAndUpdate(product.productId, {
			$inc: { stock: parseInt(product.quantity) },
		});
	}

	if (order.couponId) {
		const coupon = await couponModel.findById(order.couponId);
		if (!coupon) {
			return next(new Error("invalid coupon id"));
		}
		coupon.couponAsssignedUsers.map((ele) => {
			if (order.userId.toString() == ele.userId.toString()) {
				ele.usageCount -= 1;
			}
		});

		await coupon.save();
	}
	res.status(200).json({ message: "done", order });
});

// ======================= deliver order =====================

export const deliverOrder = asyncHandler(async (req, res, next) => {
	const { orderId } = req.query;

	const order = await orderModel.findOneAndUpdate(
		{
			_id: orderId,
			orderStatus: { $nin: ["rejected", "pending", "delivered", "canceled"] },
		},
		{ orderStatus: "delivered" },
		{ new: true }
	);

	if (!order) {
		return next(new Error("invalid order", { cause: 400 }));
	}
	return res.status(200).json({ message: "Done", order });
});
