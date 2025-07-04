import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import AddCardIcon from '@mui/icons-material/AddCard'
import Cloud from '@mui/icons-material/Cloud'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentPaste from '@mui/icons-material/ContentPaste'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { mapOrder } from '~/utils/sorts'
import ListCards from './ListCards/ListCards'
import CloseIcon from '@mui/icons-material/Close'
import { Button, TextField } from '@mui/material'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { toast } from 'react-toastify'

function Column({ column, createNewCard }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    data:{ ...column }
  })
  const dndKitColumnStyles = {
    touchAction: 'none',
    // nếu sử dụng CSS.Transform.toString giống docs thì sẽ bị lỗi kiểu stretch
    // github: https://github.com/clauderic/dnd-kit/issues/117
    transform: CSS.Translate.toString(transform),
    transition,
    // Chiều cao phải luôn là 100% vì nếu ko sẽ lỗi lúc kéo column ngắn qua một column dài.
    // ! Lưu ý: Phải kết hợp với {...listeners} nằm ở trong Box, các thuộc tính còn lại đẻ ở
    //  div ngoài cùng để tránh trường hợp kéo vào backgroud
    // youtube: 11:00 https://www.youtube.com/watch?v=bD26jjX0cHk&list=PLP6tw4Zpj-RJP2-YrhtkWqObMQ-AA4TDy&index=36
    height: '100%',
    opacity: isDragging ? 0.5 : undefined
    // border: isDragging ? '2px solid #007bff' : undefined
  }
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)
  const orderedCards = mapOrder(column?.cards, column?.cardOrderIds, '_id')

  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

  const [newCardTitle, setNewCardTitle] = useState('')

  const addNewCard = async() => {
    if (!newCardTitle) {
      toast.error('Card title cannot be empty', { position: 'bottom-right' })
      return
    }

    // Tạo dữ liệu card gọi API để thêm cột mới
    const newCardData = {
      title: newCardTitle,
      columnId: column._id // thêm columnId vào dữ liệu để tạo card
    }

    await createNewCard(newCardData) // gọi hàm createNewCard từ props(_id.jsx) để thực hiện API

    toast.success(`New card "${newCardTitle}" added successfully`, { position: 'bottom-right' })
    toggleOpenNewCardForm() // đóng form sau khi thêm cột
    setNewCardTitle('') // reset giá trị input
  }
  return (
    <div ref={setNodeRef} style = {dndKitColumnStyles}{...attributes}>
      <Box
        {...listeners}
        sx = {{
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`
        }}>
        {/*========================== header ==========================*/}
        <Box sx={{
          height: (theme) => theme.trello.columnHeaderHeight,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Typography variant='h6' sx={{
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            {column?.title}
          </Typography>
          <Box>
            <Tooltip title="More options">
              <ExpandMoreIcon
                sx = {{ color:'text.primary', cursor: 'pointer' }}
                id="basic-column-dropdown"
                aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />
            </Tooltip>
            <Menu
              id="basic-menu-column-dropdown"
              aria-labelledby="demo-positioned-button"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button-column-dropdown'
              }}
            >
              <MenuItem>
                <ListItemIcon> <AddCardIcon fontSize="small" /> </ListItemIcon>
                <ListItemText> Add new card </ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon> <ContentCut fontSize="small" /> </ListItemIcon>
                <ListItemText> Cut </ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon> <ContentCopy fontSize="small" /> </ListItemIcon>
                <ListItemText> Coppy </ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon> <ContentPaste fontSize="small" /> </ListItemIcon>
                <ListItemText> Paste </ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem>
                <ListItemIcon> <DeleteForeverIcon fontSize="small" /> </ListItemIcon>
                <ListItemText> Remove this column </ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon> <Cloud fontSize="small" /> </ListItemIcon>
                <ListItemText> Archive this column </ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
        {/*========================== list card ==========================*/}
        <ListCards cards = { orderedCards }/>
        {/*========================== footer ==========================*/}
        <Box sx={{
          height: (theme) => theme.trello.columnFooterHeight,
          p: 2
        }}>
          { !openNewCardForm ?
            <Box sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Button startIcon = { <AddCardIcon />} onClick={toggleOpenNewCardForm}> Add new card</Button>
              <Tooltip title="Drag to move">
                <DragHandleIcon sx = {{ cursor: 'pointer' }} />
              </Tooltip>
            </Box>
            :
            <Box sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <TextField
                label="Enter card title..."
                type="text"
                size='small'
                variant='outlined'
                autoFocus
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                sx={{
                  '& label': { color: 'text.primary' },
                  '& input': {
                    color: (theme) => theme.palette.text.primary,
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'white')
                  },
                  '& label.Mui-focused': { color: (theme) => (theme.palette.mode === 'dark' ? 'white' : '#1976d2') },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor:  (theme) => (theme.palette.mode === 'dark' ? 'white' : '#1976d2') },
                    '&:hover fieldset': { borderColor:  (theme) => (theme.palette.mode === 'dark' ? 'white' : '#1976d2') },
                    '&.Mui-focused fieldset': { borderColor:  (theme) => (theme.palette.mode === 'dark' ? 'white' : '#1976d2') }
                  },
                  '& .MuiOutlinedInput-input': {
                    borderRadius: 1
                  }
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  onClick={addNewCard}
                  variant='contained' color='success' size='small'
                  sx={{
                    height: '100%',
                    boxShadow: 'none',
                    border: '0.5px solid',
                    borderColor: (theme) => theme.palette.success.dark,
                    '&:hover': { bgcolor: (theme) => theme.palette.success.light }
                  }}
                  startIcon={<NoteAddIcon />}
                > Add </Button>
                <CloseIcon
                  fontSize='small'
                  sx={{
                    color: 'white',
                    cursor: 'pointer',
                    '&:hover': { color: (theme) => theme.palette.error.main }
                  }}
                  onClick={toggleOpenNewCardForm}
                />
              </Box>
            </Box>
          }
        </Box>
      </Box>
    </div>
  )
}

export default Column