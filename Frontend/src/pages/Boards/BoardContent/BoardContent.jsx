// dnd-kit
import { defaultDropAnimationSideEffects, DndContext, DragOverlay, MouseSensor, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
// MUI - Components
import Box from '@mui/material/Box'
import { cloneDeep } from 'lodash'
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

  // cùng 1 thời điểm, chỉ có 1 ptu được kéo
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)

  useEffect(() => {
    setOrderesColums(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const findColumnByCardId = (cardId) => {
    return orderesColums.find(column => column.cards.map(card => card._id)?.includes(cardId))
  }

  // Trigger khi bat dau hanh dong keo(drag)
  const handleDragStart = (event) => {
    // console.log('handleDragStart', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
  }

  // Trigger khi dang keo qua mot vi tri khac (drag over)
  const handleDragOver = (event) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return
    //console.log('handleDragOver', event)
    const { active, over } = event
    if (!active || !over) return

    // activeDraggingCardData là card đang được kéo
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    // overCard là card đang tương tác trên hoặc dưới so với card đang được kéo
    const { id: overCardId } = over

    // Tìm 2 column theo CardId
    const activeColum = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)
    // console.log('activeColum:', activeColum)
    // console.log('overColumn:', overColumn)

    if (!activeColum || !overColumn) return
    // nếu activeColum và overColumn khác nhau thì mới thực hiện sắp xếp
    if (activeColum._id !== overColumn._id) {
      setOrderesColums(prevColumns => {
        // tìm vị trí của overCard trong column đích ( nơi mà active card sắp được thả)
        const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)
        let newCardIndex
        // từ chối hiểu =))
        const isBelowOverItem = active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height

        const modifier = isBelowOverItem ? 1 : 0

        newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

        // console.log('isbelowOverItem:', isBelowOverItem)
        // console.log('modifier:', modifier)
        // console.log('newCardIndex:', newCardIndex)

        const nextColumns = cloneDeep(prevColumns)
        const nextActiveColumn = nextColumns.find(column => column._id === activeColum._id)
        const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)
        // column cũ
        if (nextActiveColumn) {
          // xoá card ra khỏi column cũ
          nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)

          // cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
        }
        // column mới
        if (nextOverColumn) {
          // kiểm tra xem card đang kéo có tồn tại trong overColums ko, có thì xóa nó trước
          nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)

          // thêm card vào vị trí mới trong column đích
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, activeDraggingCardData)

          // cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
        }

        return nextColumns
      })
    }
  }

  // Trigger khi ket thuc hanh dong keo (drop)
  const handleDragEnd = (event) => {
    //console.log('handleDragEnd', event)
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      //console.log('activeDragItemData:', activeDragItemData)
      return
    }
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
      onDragOver={handleDragOver}
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