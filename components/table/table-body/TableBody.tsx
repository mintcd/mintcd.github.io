// import { useRef, useState } from "react"
// import TableRow from "../table-row/TableRow"

// export default function TableBody({ paginatedData, attrsByName, style, onUpdateCell, onExchangeItems }: {
//   paginatedData: DataItem[]
//   attrsByName: AttrsByName
//   style: TableStyle,
//   onUpdateCell: (itemId: number, attr: string, value: number | string | string[]) => Promise<void>
//   onExchangeItems: (id1: number, id2: number) => void
// }) {
//   const bodyRef = useRef(null)

//   const [draggedOver, setDraggedOver] = useState(false);
//   const [draggingItemId, setDraggingItemId] = useState(-1); // Track which item is being dragged

//   const handleDragStart = (e: React.DragEvent<HTMLElement>, id: number) => {
//     setDraggingItemId(id);
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
//     e.preventDefault(); // Allow the drop event to occur
//     if (!draggedOver) {
//       setDraggedOver(true); // Set drag-over state only when it's not already set
//     }
//   };

//   const handleDragEnd = () => {
//     setDraggingItemId(-1); // Reset dragging item when drag ends
//     setDraggedOver(false); // Reset the drag-over state
//   };

//   const handleDrop = (e: React.DragEvent<HTMLElement>, targetId: number) => {
//     e.preventDefault();
//     setDraggedOver(false);
//     const draggedItemId = parseInt(e.dataTransfer.getData('draggedItemId'), 10); // Retrieve the dragged item's id
//     if (draggedItemId !== targetId) {
//       onExchangeItems(draggedItemId, targetId); // Call the provided function to exchange items
//     }
//   };

//   return (
//     <div className="table-body flex-grow text-gray-800" ref={bodyRef}>
//       {paginatedData.map((item) => (
//         <div
//           onDrop={(e) => handleDrop(e, item.id)}
//           onDragOver={handleDragOver}
//           onDragLeave={() => setDraggedOver(false)}
//         >
//           <TableRow
//             key={item.id}
//             item={item}
//             attrsByName={attrsByName}
//             style={style}
//             onUpdate={onUpdateCell}
//           />
//         </div>
//       ))}
//     </div>
//   )
// }