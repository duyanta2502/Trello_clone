import Container from '@mui/material/Container'
import { useEffect, useState } from 'react'

// import { mockData } from '~/apis/mock-data'
import AppBar from '~/components/AppBar/AppBar'

import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { fetchBoardDetailsAPI, createNewColumnAPI, createNewCardAPI } from '~/apis'
// import { mockData } from '~/apis/mock-data'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    const boardId = '6858f4b430e1b68de1b877cb'
    // call api to get board data
    fetchBoardDetailsAPI(boardId).then( board => {
      // cần xử lí vấn đề kéo thả vào column rỗng
      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          // nếu column không có cards thì tạo một card placeholder (khi  f5 hoặc mới mở trang web)
          column.cards = [generatePlaceholderCard(column)]
          // khởi tạo cardOrderIds với ptu đầu tiên là placeholder
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        }
      })
      setBoard(board)
    })
  }, [])

  // Func này gọi api tạo column mới và cập nhật lại state board
  const createNewColumn = async (newColumnData) => {  
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id // thêm boardId vào dữ liệu để tạo column
    })
    // vừa tạo column mới thì sẽ khởi tạo cards với card placeholder là ptu đầu tiên
    createdColumn.cards = [generatePlaceholderCard(createdColumn)] // khởi tạo cards với card placeholder
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    // Cập nhật lại state board với column mới
    // Dựng lại state từ fe cho board, thay vì phải gọi api fetchBoardDetailsAPI
    // phụ thuộc vào tùy vào dự án, nếu be có api trả về dữ liệu toàn board thì ko cần
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id) // thêm id của column mới vào orderIds
    setBoard(newBoard)
  }

  // Func này gọi api tạo card mới và cập nhật lại state board
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })
    // Cập nhật lại state column và board với card mới
    // Dựng lại state từ fe cho board, thay vì phải gọi api fetchBoardDetailsAPI
    // phụ thuộc vào tùy vào dự án, nếu be có api trả về dữ liệu toàn board thì ko cần
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    if (columnToUpdate) {
      columnToUpdate.cards.push(createdCard) // thêm card mới vào column tương ứng
      columnToUpdate.cardOrderIds.push(createdCard._id) // thêm id của card mới vào orderIds
    }
    setBoard(newBoard) // cập nhật lại state board
  }

  return (
    // , backgroundColor: 'primary.main'
    <Container disableGutters maxWidth = {false} sx ={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board = {board}/>
      <BoardContent
        board = {board}
        createNewColumn = {createNewColumn}
        createNewCard = {createNewCard}
      />
    </Container>
  )
}

export default Board