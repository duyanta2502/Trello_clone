// React
// MUI - Icons
// MUI - Components
import Box from '@mui/material/Box'

import { mapOrder } from '~/utils/sorts'

// components
import ListColumn from './ListColumn/ListColumn'


function BoardContent({ board }) {
  const oderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
  return (
    <Box sx = {{
      height: (theme) => theme.trello.boardContentHeight,
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
      width: '100%',
      p: '10px 0'
    }}>
      <ListColumn columns = {oderedColumns}/>
    </Box>
  )
}

export default BoardContent