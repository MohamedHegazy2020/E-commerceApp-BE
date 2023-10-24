import { connectionDB } from "../DB/connection.js";
import * as allRouters from "./modules/index.routes.js";
import { cahangeCouponStatusCron } from "./utils/crons.js";
import { globalResponse } from "./utils/errorhandling.js";
import cors from 'cors'

export const initiateApp = (express, app) => {
	const port = process.env.port || 5000;
	app.use(express.json());
	app.use(cors())
	connectionDB();

	app.use("/category", allRouters.categoryRouter);
	app.use("/subCategory", allRouters.subCategoryRouter);
	app.use("/brand", allRouters.brandRouter);
	app.use("/product", allRouters.productRouter);
	app.use("/coupon", allRouters.couponRouter);
	app.use("/auth", allRouters.authRouter);
	app.use("/cart", allRouters.cartRouter);
	app.use("/order", allRouters.orderRouter);
	app.use("/review", allRouters.reviewRouter);

	app.get("/", (req, res) => res.send("hello world"));
	app.all("*", (req, res, next) => {
		return next(new Error("in-valid Routing", { cause: 404 }));
	});
	app.use(globalResponse);
	cahangeCouponStatusCron()
	app.listen(port, () => console.log(`your app is listening on port ${port}`));
};
