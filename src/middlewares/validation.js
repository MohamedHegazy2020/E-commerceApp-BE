// req => userdata
// schema => endPoint schema

import Joi from 'joi'
import { Types } from 'mongoose'
const reqMethods = ['body', 'query', 'params', 'headers', 'file', 'files']


const objectIdValidation = (value,helper)=>{
  return Types.ObjectId.isValid(value)?true:helper.message('invalid id')
}

export const generalFields = {
  email: Joi
    .string()
    .email({ tlds: { allow: ['com', 'net', 'org'] } })
    .required(),
  password: Joi
    .string()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    .messages({
      'string.pattern.base': 'Password regex fail',
    })
    .required(),
    _id:Joi.string().custom(objectIdValidation) ,
    token:Joi.string().regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/)
}

export const validationCoreFunction = (schema) => {
  return (req, res, next) => {
    // req
    const validationErrorArr = []
    for (const key of reqMethods) {
      if (schema[key]) {
        const validationResult = schema[key].validate(req[key], {
          abortEarly: false,
        }) // error
        if (validationResult.error) {
          validationErrorArr.push(validationResult.error.details)
        }
      }
    }

    if (validationErrorArr.length) {

      req.error = validationErrorArr
      return next(req.error)
    }
    next()
  }
}
