import { scheduleJob } from "node-schedule"
import { couponModel } from './../../DB/Models/coupon.model.js';
import moment from "moment/moment.js";



export const cahangeCouponStatusCron = ()=>{
        scheduleJob('* * /1 * * *' ,async()=>{
                const validCoupons =await couponModel.find({couponStatus:'Valid'})
                console.log(`cahangeCouponStatusCron is running ...........${moment()}`);
                for (const coupon of validCoupons) {
                        if(moment(coupon.toDate).isBefore(moment())){}
                        await coupon.updateOne({couponStatus:'Expired'}) 
                }
        })
}
  