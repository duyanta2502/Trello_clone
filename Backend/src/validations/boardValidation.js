import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().min(3).max(50).required().trim().strict().message({
      'any.required': 'Title is required (duyanta2502)',
      'string.empty': 'Title is not allowed to be empty (duyanta2502)',
      'string.min': 'Title must be at least 3 characters long (duyanta2502)',
      'string.max': 'Title must not exceed 50 characters (duyanta2502)',
      'string.trim': 'Title must not have leading or trailing spaces (duyanta2502)'
    }),
    description: Joi.string().min(3).max(255).required().trim().strict()
  })
  try {
    // console.log(req.body)
    // Chỉ định abortEarly: false để trường hợp có nhiều lỗi, tất cả sẽ được trả về
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    // next()

    res.status(StatusCodes.CREATED).json({ message: 'POST from Validation: API created new board' })
  } catch (error) {
    // console.log(error)
    // console.log(new Error(error))
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      error: new Error(error).message
    })
  }

}

export const boardValidation = {
  createNew
}
