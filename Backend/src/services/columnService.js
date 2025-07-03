import { columnModel } from '~/models/columnModel'

const CreateNew = async (reqBody) => {
  try {
    const newColumn = {
      ...reqBody
    }
    const createdColumn = await columnModel.createNew(newColumn)
    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)
    return getNewColumn
  } catch (error) {
    throw error
  }
}
export const columnService = {
  CreateNew
}