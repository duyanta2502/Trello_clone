import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError.js'
import { BOARD_TYPE } from '~/utils/constants.js'
const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().min(3).max(50).required().trim().strict().message({
      'any.required': 'Title is required (duyanta2502)',
      'string.empty': 'Title is not allowed to be empty (duyanta2502)',
      'string.min': 'Title must be at least 3 characters long (duyanta2502)',
      'string.max': 'Title must not exceed 50 characters (duyanta2502)',
      'string.trim': 'Title must not have leading or trailing spaces (duyanta2502)'
    }),
    description: Joi.string().min(3).max(255).required().trim().strict(),
    type: Joi.string().valid(BOARD_TYPE.PUBLIC, BOARD_TYPE.PRIVATE).required()
  })
  try {
    // console.log(req.body)
    // Chỉ định abortEarly: false để trường hợp có nhiều lỗi, tất cả sẽ được trả về
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    // validate dữ liệu thành công thì cho request đi tiếp sang controller
    next()

  } catch (error) {
    next( new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message ))
  }
}

export const boardValidation = {
  createNew
}
