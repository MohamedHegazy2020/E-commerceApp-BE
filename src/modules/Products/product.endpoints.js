import { systemRoles } from "../../utils/systemRoles.js";

export const productRoles = {
	addProduct: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN],
	updateProduct:[systemRoles.ADMIN, systemRoles.SUPER_ADMIN],
};
