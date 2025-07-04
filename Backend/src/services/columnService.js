import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'
const CreateNew = async (reqBody) => {
  try {
    const newColumn = {
      ...reqBody
    }
    const createdColumn = await columnModel.createNew(newColumn)
    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)

    if (getNewColumn) {
      // Tạo mảng cards khi tạo columns mới
      getNewColumn.cards = []
      // Cập nhật mảng columnOrderIds trong collection board
      await boardModel.pushColumnOrderIds(getNewColumn)
    }
    return getNewColumn
  } catch (error) {
    throw error
  }
}
export const columnService = {
  CreateNew
}