// dnd-kit
import { defaultDropAnimationSideEffects, DndContext, DragOverlay, MouseSensor, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
// MUI - Components
import Box from '@mui/material/Box'
// React
import { useEffect, useState } from 'react'

import { mapOrder } from '~/utils/sorts'

// components
import Column from './ListColumn/Column/Column'
import Card from './ListColumn/Column/ListCards/Card/Card'
import ListColumn from './ListColumn/ListColumn'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

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
  // cùng 1 thời điểm, chỉ có 1 ptu được kéokéo
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  useEffect(() => {
    setOrderesColums(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])
  // khi bat dau hanh dong keo(drag)
  const handleDragStart = (event) => {
    console.log('handleDragStart', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
  }
  // khi ket thuc hanh dong keo (drop)
  const handleDragEnd = (event) => {
    // console.log('handleDragEnd', event)
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
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
  }
  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles:{ active: { opcatity: 0.5 } } }) 
  }
  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Box sx = {{
        height: (theme) => theme.trello.boardContentHeight,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        p: '10px 0'
      }}>
        <ListColumn columns = {orderesColums}/>
        <DragOverlay dropAnimation={customDropAnimation}>
          {/* {(!activeDragItemType) && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column = { activeDragItemData }/>}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card = { activeDragItemData }/>}  */}
          {!activeDragItemType ? null
            : activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN ? <Column column={activeDragItemData} />
              : activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD ? <Card card={activeDragItemData} />
                : null
          }
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent