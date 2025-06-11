// dnd-kit
import {
  closestCenter,
  closestCorners,
  defaultDropAnimationSideEffects,
  DndContext,
  DragOverlay,
  getFirstCollision,
  MouseSensor,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  TouchSensor,
  useSensor,
  useSensors } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
// MUI - Components
import Box from '@mui/material/Box'
import { cloneDeep } from 'lodash'
// React
import { useCallback, useEffect, useRef, useState } from 'react'

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
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)

  // Điểm va chạm cuối cùng truớc đó
  const lastOverId = useRef(null)
  useEffect(() => {
    setOrderesColums(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const findColumnByCardId = (cardId) => {
    return orderesColums.find(column => column.cards.map(card => card._id)?.includes(cardId))
  }

  //Funtion chung cập nhật lại state khi di chuyển card giữa các column khác nhau
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColum,
    activeDraggingCardId,
    activeDraggingCardData

  ) => {
    setOrderesColums(prevColumns => {
      // tìm vị trí của overCard trong column đích ( nơi mà active card sắp được thả)
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

      // Logic tính toán "CardIndex" mới cho card đang kéo (trên hoặc dưới của overCard) - chuẩn từ thư viện dnd-kit
      // từ chối hiểu =))
      let newCardIndex
      const isBelowOverItem = active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height

      const modifier = isBelowOverItem ? 1 : 0

      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

      // Clone mảng OrderedColumnsState ra một cái mới để xử lí data rồi return - cập nhật lại OrderedColumnsState mới
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(column => column._id === activeColum._id)
      const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)
      // column cũ
      if (nextActiveColumn) {
        //console.log('nextActiveColumn:')
        // xoá card ra khỏi column cũ, khi đang kéo card qua column khác
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)

        // cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }
      // column mới
      if (nextOverColumn) {
        //console.log('nextOverColumn:')
        // kiểm tra xem card đang kéo có tồn tại trong overColums ko, có thì xóa nó trước
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)

        //Chuẩn lại dữ liệu cho dragEnd cho comlumnId trong card sau khi kéo card giữa 2 column khác nhau
        const rebuilt_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id // cập nhật lại columnId cho card đang kéo
        }
        //console.log('rebuilt_activeDraggingCardData:', rebuilt_activeDraggingCardData)
        // thêm card vào vị trí mới trong column đích
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuilt_activeDraggingCardData)

        // cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }

      return nextColumns
    })
  }

  // Trigger khi bat dau hanh dong keo(drag)
  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    // Nếu kéo card mới set giá trị cho oldColumn
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }

  // Trigger khi dang keo qua mot vi tri khac (drag over)
  const handleDragOver = (event) => {
    // Ko lam gì nếu đang kéo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

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

    // Nếu 1 trong 2 ko tồn tại thì ko làm gì hết, tránh crash trang
    if (!activeColum || !overColumn) return

    // nếu activeColum và overColumn (2 cloumn khác nhau), còn nếu kéo card trong chính column ban đầu thì k làm gì
    if (activeColum._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColum,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }

  // Trigger khi ket thuc hanh dong keo (drop)
  const handleDragEnd = (event) => {
    //console.log('handleDragEnd', event)
    const { active, over } = event
    // nếu không tồn tại trí kéo thả thì return
    if ( !active || !over) return
    // Xử lý khi kéo thả card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      //console.log('Kéo thả card - ko lam gi ca')

      // activeDraggingCardData là card đang được kéo
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      // overCard là card đang tương tác trên hoặc dưới so với card đang được kéo
      const { id: overCardId } = over

      // Tìm 2 column theo CardId
      const activeColum = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)
      // console.log('activeColum:', activeColum)
      // console.log('overColumn:', overColumn)

      // Nếu 1 trong 2 ko tồn tại thì ko làm gì hết, tránh crash trang
      if (!activeColum || !overColumn) return

      // nếu activeColum và overColumn (2 cloumn khác nhau)
      // console.log('oldColumnWhenDraggingCard:', oldColumnWhenDraggingCard)
      // console.log('overColumn:', overColumn)
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        //console.log('Kéo thả card giữa 2 column khác nhau')
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColum,
          activeDraggingCardId,
          activeDraggingCardData
        )
        //
      } else { // nguoc lai kéo thả card trong cùng 1 column
        //console.log('Kéo thả card trong cùng 1 column')
        // lấy vị trí cũ từ oldColumnWhenDraggingCard
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId)
        // lấy vị trí mới từ over
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)

        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)
        setOrderesColums(prevColumns => {
          // Clone mảng OrderedColumnsState ra một cái mới để xử lí data rồi return - cập nhật lại OrderedColumnsState mới
          const nextColumns = cloneDeep(prevColumns)
          //Tìm column mà ta đang thả
          const targetColumn = nextColumns.find(column => column._id === overColumn._id)
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map(card => card._id)
          // nếu tìm thấy column thì cập nhật lại mảng cardOrderIds và cards
          return nextColumns
        })
      }
    }

    // Xử lý khi kéo thả column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      //console.log('Kéo thả column')
      // nếu vị trí kéo thả khác vị trí ban đầu
      if (active.id !== over.id) {
        // lấy vị trí cũ từ active
        const oldColumnIndex = orderesColums.findIndex(c => c._id === active.id)
        // lấy vị trí mới từ over
        const newColumnIndex = orderesColums.findIndex(c => c._id === over.id)
        // dung hàm arrayMove để sắp xếp lại vị trí của các columns
        // github: https://github.com/clauderic/dnd-kit/blob/master/packages/sortable/src/utilities/arrayMove.ts
        const dndOrderesColums = arrayMove(orderesColums, oldColumnIndex, newColumnIndex)
        // const dndOrderesColumsIds = dndOrderesColums.map(c => c._id)
        // console.log('dndOrderesColums:', dndOrderesColums)
        // console.log('dndOrderesColumsIds:', dndOrderesColumsIds)
        setOrderesColums(dndOrderesColums)
      }
    }

    // sau khi kéo thả xong thì reset lại các giá trị
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles:{ active: { opcatity: 0.5 } } })
  }

  // Custom lại thuật toán phát hiện va chạm (collision detection)
  // args = arguments = các đối số, tham số
  const collisionDetectionStrategy = useCallback((args) => {
    // Nếu đang kéo column thì dùng closestCorners, nếu không thì dùng closestCenter
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }
    const pointerIntersection = pointerWithin({ ...args })
    const intersection = !!pointerIntersection?.length ?
      pointerIntersection
      :
      rectIntersection({ ...args })
    // Tim ra phần tử đầu tiên trong mảng intersection
    let overId = getFirstCollision(intersection, 'id')
    if (overId) {
      const checkColumn = orderesColums.find(column => column._id === overId)
      if (checkColumn) {
        // console.log('overId before:', overId)
        overId = closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return (container.id !== overId) && (checkColumn?.cardOrderIds?.includes(container.id))
          })
        })[0]?.id
        // console.log('overId after:', overId)
      }
      lastOverId.current = overId
      return [{ id: overId }]
    }
    // Nếu overId là null hoặc undefined, thì trả về mảng rỗng
    return lastOverId.current ? [{ id: lastOverId.current }] : []
  }, [activeDragItemType, orderesColums] )
  return (
    <DndContext
      sensors={sensors}
      // Thuật toán phát hiện va chạm (nếu k có nó các card có cover lớn sẽ k kéo thả được)
      // Docs: https://docs.dndkit.com/api-documentation/context-provider/collision-detection-algorithms
      // Nếu chỉ dùng closestCorners thì sẽ có bug flickering, sai lệch dữ liệu và vị trí kéo thả
      // collisionDetection={closestCorners}
      // Custom nâng cao thuật toán phát hiện va chạm (video 37) collisionDetectionStrategy
      collisionDetection={collisionDetectionStrategy}
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