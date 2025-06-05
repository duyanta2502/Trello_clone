import Container from '@mui/material/Container'

import { mockData } from '~/apis/mock-data'
import AppBar from '~/components/AppBar/AppBar'

import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'

function Board() {
  return (
    // , backgroundColor: 'primary.main'
    <Container disableGutters maxWidth = {false} sx ={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board = {mockData?.board}/>
      <BoardContent board = {mockData.board}/>
    </Container>
  )
}

export default Board