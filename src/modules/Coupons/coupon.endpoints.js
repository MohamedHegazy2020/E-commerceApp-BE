import { systemRoles } from "../../utils/systemRoles.js";

export const couponRoles ={
    addCoupon:[systemRoles.ADMIN , systemRoles.SUPER_ADMIN],
    deleteCoupon:[systemRoles.ADMIN , systemRoles.SUPER_ADMIN],
    assignUserToCoupon:[systemRoles.ADMIN , systemRoles.SUPER_ADMIN],
}