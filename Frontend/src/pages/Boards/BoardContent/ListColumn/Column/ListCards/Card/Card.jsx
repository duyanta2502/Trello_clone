// React
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
// MUI - Icons
import AttachmentIcon from '@mui/icons-material/Attachment'
import CommentIcon from '@mui/icons-material/Comment'
import GroupIcon from '@mui/icons-material/Group'
import { Card as MuiCard } from '@mui/material'
// MUI - Components
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'

function Card({ card }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id,
    data:{ ...card }
  })
  const dndKitCardStyles = {
    touchAction: 'none',
    // nếu sử dụng CSS.Transform.toString giống docs thì sẽ bị lỗi kiểu stretch
    // github: https://github.com/clauderic/dnd-kit/issues/117
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '2px solid #2ecc71' : undefined
  }
  const shouldShowCard = () => {
    return !!card?.memberIds?.length ||
           !!card?.comments?.length ||
           !!card?.attachments?.length
  }
  return (
    <MuiCard
      ref={setNodeRef} style = {dndKitCardStyles}{...attributes}{...listeners}
      sx={{
        cursor: 'pointer',
        boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
        overflow: 'unset',
        display: card?.FE_PlaceholderCard ? 'none' : 'block'
      }}>
      { card?.cover && <CardMedia sx={{ height: 140 }} image={card.cover} /> }
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Typography> {card?.title} </Typography>
      </CardContent>
      { shouldShowCard() &&
        <CardActions sx={{ p: '0 4px 8px 4px' }}>
          {!!card?.memberIds?.length
            && <Button size="small" startIcon={<GroupIcon />}>{card?.memberIds?.length}</Button>}
          {!!card?.comments?.length
            && <Button size="small" startIcon={<CommentIcon />}>{card?.comments?.length}</Button>}
          {!!card?.attachments?.length
            && <Button size="small" startIcon={<AttachmentIcon />}>{card?.attachments?.length}</Button>}
        </CardActions>
      }
    </MuiCard>
  )
}

export default Card