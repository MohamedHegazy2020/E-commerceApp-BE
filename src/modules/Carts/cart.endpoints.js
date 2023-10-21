import { systemRoles } from "../../utils/systemRoles.js";

export const cartRoles ={
    addTocart :[systemRoles.ADMIN ,systemRoles.SUPER_ADMIN ,systemRoles.USER],
    deleteFromCart :[systemRoles.ADMIN ,systemRoles.SUPER_ADMIN ,systemRoles.USER],
    clearCart :[systemRoles.ADMIN ,systemRoles.SUPER_ADMIN ,systemRoles.USER]
}