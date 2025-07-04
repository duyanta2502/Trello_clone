import { slugify } from '~/utils/formaters'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'

const CreateNew = async (reqBody) => {
  try {
    // xử lí logic dữ liệu tùy theo yêu cầu
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }
    // gọi tới tần Model để xử lí lưu bản ghi newBoard vào db
    const createdBoard = await boardModel.createNew(newBoard)
    // console.log(createdBoard)

    // Lấy bản ghi board sau khi gọi
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)
    // console.log(getNewBoard)

    // Làm thêm các xử lí logic khác vớic collection khác tùy dự án
    // Sendmail, bắn notification cho admin khi có board mới, v.v...

    // Trả về kết quả trong services luôn phải có return
    return getNewBoard
  } catch (error) {
    throw error
  }
}

const getDetails = async (boardId) => {
  try {
    const board = await boardModel.getDetails(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }
    // Deep clone board ra một cái mới để xử lí, ko ảnh hưởng đến board ban đầu, tùy mục đích sử dụng về sau mà có cần clonedeep hay không
    const resBoard = cloneDeep(board)
    // đưa card về đúng column của nó
    resBoard.columns.forEach((column) => {
      // console.log(column.cardOrderIds)
      // console.log('column.cards', column.cards)
      // column.cards = resBoard.cards.filter(card => card?.columnId?.equals(column._id))
      column.cards = resBoard.cards.filter(card => card.columnId.toString() === column._id.toString())
    })
    delete resBoard.cards // xóa đi cards vì đã đưa về đúng column của nó rồi
    return resBoard
  } catch (error) {
    // console.log(error)
    throw error
  }
}
export const boardService = {
  CreateNew,
  getDetails
}