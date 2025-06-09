// dnd-kit
import { DndContext, MouseSensor, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
// MUI - Components
import Box from '@mui/material/Box'
// React
import { useEffect, useState } from 'react'

import { mapOrder } from '~/utils/sorts'

// components
import ListColumn from './ListColumn/ListColumn'


function BoardContent({ board }) {

  // docs: https://docs.dndkit.com/api-documentation/sensors
  const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  // ycau chuột di chuyển 10px mới kích hoạt event, fix lỗi click chuột
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  // nhấn giữ 250ms mới kích hoạt event, fix lỗi click chuột
  // tolerace (dung sai): khoảng cách di chuyển tối đa cho phép trước khi kích hoạt sự kiện kéo thả
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerace: 500 } })
  const sensors = useSensors(pointerSensor, mouseSensor, touchSensor)
  const [orderesColums, setOrderesColums] = useState([])
  useEffect(() => {
    setOrderesColums(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])
  // xử lí kéo thả data
  const handleDragEnd = (event) => {
    const { active, over } = event
    // nếu không tồn tại trí kéo thả thì return
    if (!over) return
    // nếu vị trí kéo thả khác vị trí ban đầu
    if (active.id !== over.id) {
      // lấy vị trí cũ từ active
      const oldIndex = orderesColums.findIndex(c => c._id === active.id)
      // lấy vị trí mới từ over
      const newIndex = orderesColums.findIndex(c => c._id === over.id)
      // dung hàm arrayMove để sắp xếp lại vị trí của các columns
      // github: https://github.com/clauderic/dnd-kit/blob/master/packages/sortable/src/utilities/arrayMove.ts
      const dndOrderesColums = arrayMove(orderesColums, oldIndex, newIndex)
      // const dndOrderesColumsIds = dndOrderesColums.map(c => c._id)
      // console.log('dndOrderesColums:', dndOrderesColums)
      // console.log('dndOrderesColumsIds:', dndOrderesColumsIds)
      setOrderesColums(dndOrderesColums)
    }
  }
  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <Box sx = {{
        height: (theme) => theme.trello.boardContentHeight,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        p: '10px 0'
      }}>
        <ListColumn columns = {orderesColums}/>
      </Box>
    </DndContext>
  )
}

export default BoardContent