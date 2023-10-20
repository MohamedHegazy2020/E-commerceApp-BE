import Stripe from "stripe";

export const paymentFunction = async ({
	payment_method_types = ["card"], //required
	mode = "payment", //required
	customer_email = "", //optional
	metadata = {}, //optional
	success_url, //required
	cancel_url, //required
	discounts = [], //optional
	line_items = [],
}) => {
	// connection
	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

	//session

	const paymentData = await stripe.checkout.sessions.create({
		payment_method_types, //required
		mode, //required
		customer_email, //optional
		metadata, //optional
		success_url, //required
		cancel_url, //required
		discounts, //optional
		line_items //required
	});
	return paymentData;
};

// {price_data: {
//         currancy,
//         product_data: {
//                 name,
//         },
//         unit_amount,
// },
// quantity,}
