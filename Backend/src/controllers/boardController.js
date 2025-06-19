import { StatusCodes } from 'http-status-codes'
import { BoardService } from '~/services/boardService'
const createNew = async (req, res, next) => {
  try {
    // console.log('req.body', req.body)
    // console.log('req.query', req.query)
    // console.log('req.params', req.params)
    // console.log('req.files', req.files)
    // console.log('req.cookies', req.cookies)
    // console.log('req.jwtdecoded', req.JWTdecoded)

    // Điều hướng đến service để xử lý logic
    const createdBoard = await BoardService.CreateNew(req.body)
    // Có kết quả thì trả về client
    res.status(StatusCodes.CREATED).json(createdBoard)
  } catch (error) { next(error) }
}

export const boardController = {
  createNew
}