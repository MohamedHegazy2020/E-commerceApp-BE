import { systemRoles } from "../../utils/systemRoles.js";

export const orderRoles = {
	createOrder: [systemRoles.ADMIN, systemRoles.USER, systemRoles.SUPER_ADMIN],
	fromCartToOrder: [
		systemRoles.ADMIN,
		systemRoles.USER,
		systemRoles.SUPER_ADMIN,
	],
};
