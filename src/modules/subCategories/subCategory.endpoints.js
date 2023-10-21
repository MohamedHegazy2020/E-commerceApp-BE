import { systemRoles } from "../../utils/systemRoles.js";


export const subCategoryRoles ={
    createSubCategory: [systemRoles.ADMIN,systemRoles.SUPER_ADMIN],
    updateSubCategory: [systemRoles.ADMIN,systemRoles.SUPER_ADMIN],
    deleteSubCategory: [systemRoles.ADMIN,systemRoles.SUPER_ADMIN],
}