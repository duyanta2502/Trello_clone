import Container from '@mui/material/Container'
import { useEffect, useState } from 'react'

// import { mockData } from '~/apis/mock-data'
import AppBar from '~/components/AppBar/AppBar'

import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { fetchBoardDetailsAPI, createNewColumnAPI, createNewCardAPI } from '~/apis'
// import { mockData } from '~/apis/mock-data'
function Board() {
  const [board, setBoard] = useState(null)
  useEffect(() => {
    const boardId = '6858f4b430e1b68de1b877cb'
    // call api to get board data
    fetchBoardDetailsAPI(boardId).then( board => {
      setBoard(board)
    })
  }, [])


  // Func này gọi api tạo column mới và cập nhật lại state board
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id // thêm boardId vào dữ liệu để tạo column
    })
    console.log('createdColumn', createdColumn)
    // Cập nhật lại state board với column mới
  }

  // Func này gọi api tạo card mới và cập nhật lại state board
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })
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