import Joi from "joi";


// ====================== create subCategory Schema ===================


export const createSubCategorySchema ={
        body:Joi.object({
                name:Joi.string().min(4).max(10)
        }).required().options({presence:'required'})
}