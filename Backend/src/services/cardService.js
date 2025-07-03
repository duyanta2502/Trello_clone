import { cardModel } from '~/models/cardModel'

const CreateNew = async (reqBody) => {
  try {
    const newCard = {
      ...reqBody
    }
    const createdCard = await cardModel.createNew(newCard)
    const getNewCard = await cardModel.findOneById(createdCard.insertedId)
    return getNewCard
  } catch (error) {
    throw error
  }
}
export const cardService = {
  CreateNew
}