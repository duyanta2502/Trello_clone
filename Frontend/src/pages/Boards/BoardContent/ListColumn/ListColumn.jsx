// React

// MUI - Icons
import { horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
// MUI - Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

// components
import Column from './Column/Column'

function ListColumn({ columns }) {
  // thằng sort tableContext yêu cầu items là một arr, ko phải object với các cặp key:value
  // nếu ko đúng vẫn kéo thả được, nhưng k có animation
  // github: https://github.com/clauderic/dnd-kit/issues/183#issuecomment-812569512
  // youtube: 17:00 - https://www.youtube.com/watch?v=IttteelPx-k&list=PLP6tw4Zpj-RJP2-YrhtkWqObMQ-AA4TDy&index=34
  return (
    //thay vì items = {columns)
    <SortableContext items = {columns?.map(c => c._id)} strategy={horizontalListSortingStrategy}>
      <Box sx={{
        bgcolor: 'inherit',
        width:'100%',
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track':{
          m: 2
        }
      }}>
        {columns?.map(column => <Column key={column._id} column={column} /> )}
        <Box sx={{
          minWidth: '200px',
          maxWidth: '200px',
          mx: 2,
          borderRadius: '6px',
          height: 'fit-content',
          bgcolor: '#ffffff3d'

        }}>
          <Button startIcon={<NoteAddIcon />}
            sx={{
              color: 'white',
              width: '100%',
              justifyContent: 'flex-start',
              pl: 2.5,
              py : 1
            }}>
            Add New Column
          </Button>
        </Box>
      </Box>
    </SortableContext>
  )
}

export default ListColumn