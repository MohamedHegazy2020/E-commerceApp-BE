import { systemRoles } from "../../utils/systemRoles.js";

export const categoryRoles = {
	createCategory: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN],
	updateCategory: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN],
	deleteCategory: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN],
};
