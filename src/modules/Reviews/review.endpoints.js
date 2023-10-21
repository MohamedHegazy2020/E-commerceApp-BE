
import { systemRoles } from './../../utils/systemRoles.js';

export const reviewRoles ={
    addReview : [systemRoles.ADMIN,systemRoles.SUPER_ADMIN,systemRoles.USER]
}