import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import { Button, TextField } from '@mui/material'
import Box from '@mui/material/Box'
import InputAdornment from '@mui/material/InputAdornment'
import { useState } from 'react'
import { horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import Column from './Column/Column'
function ListColumn({ columns }) {
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)


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
        {!openNewColumnForm
          ? <Box onClick = {toggleOpenNewColumnForm} sx={{
            minWidth: '250px',
            maxWidth: '250px',
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
          :
          <Box sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            p: 1,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d',
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}>
            <TextField
              label="Enter column title..."
              type="text"
              size='small'
              variant='outlined'
              autoFocus
              // value={searchValue}
              // onChange={(e) => setSearchValue(e.target.value)}
              sx={{
                '& input': { color: 'white' },
                '& label': { color: 'white' },
                '& label.Mui-focused': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' }
                }
              }}
            />
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
            }}>
              <Button variant='contained' color='success' size='small'
                sx={{
                  boxShadow: 'none',
                  border: '0.5px solid',
                  borderColor: { bgcolor: (theme) => theme.palette.success.main },
                  // '&:hover': { bgcolor: (theme) => theme.palette.success.light }
                }}
                startIcon={<NoteAddIcon />}
                // onClick={handleAddColumn}
              >Add Column</Button>
              <CloseIcon
                fontSize='small'
                sx={{ color: 'white', cursor: 'pointer' }}
                onClick={toggleOpenNewColumnForm} />
            </Box>
          </Box>
        }

      </Box>
    </SortableContext>
  )
}

export default ListColumn