/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formaters'
import { boardModel } from '~/models/boardModel'
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
export const BoardService = {
  CreateNew
}