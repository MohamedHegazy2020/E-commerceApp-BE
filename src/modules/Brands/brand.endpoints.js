import { systemRoles } from "../../utils/systemRoles.js";

export const brandRoles = {
        addBrand:[systemRoles.ADMIN , systemRoles.SUPER_ADMIN],
        updateBrand:[systemRoles.ADMIN , systemRoles.SUPER_ADMIN],
        deleteBrand:[systemRoles.ADMIN , systemRoles.SUPER_ADMIN],
}