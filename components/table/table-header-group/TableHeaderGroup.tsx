import { Dropdown } from "@components/molecules";
import { ArrowDownwardRounded, ArrowUpwardRounded, FilterAltRounded, HorizontalRuleRounded, MoreVertRounded } from "@mui/icons-material";
import { useCallback, useRef, useState } from "react"
import { TbMinusVertical } from "react-icons/tb";
import { updateFilter } from "../functions";

export default function TableHeaderGroup({ style, attrsByName, setAttrsByName }: {
  style?: {
    cellMinWidth?: number,
    optionsColumnWidth?: number
  },
  attrsByName: AttrsByName,
  setAttrsByName: (newAttrsByName: AttrsByName) => void
}) {

  const animationFrameRef = useRef<number | null>(null);
  const resizingRef = useRef({ startX: 0, startWidth: 0, attrName: '' });
  const [focusedIndex, setFocusedIndex] = useState(-1)

  const handleColumnDragStart = (e: React.DragEvent<HTMLDivElement>, draggedName: string) => {
    e.dataTransfer.setData('text/plain', draggedName);
  };

  const handleColumnDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleColumnDrop = (e: React.DragEvent<HTMLDivElement>, targetName: string) => {
    e.preventDefault();
    const draggedName = e.dataTransfer.getData('text/plain');

    if (draggedName !== targetName) {
      const newAttrsByName = { ...attrsByName };
      const draggedOrder = newAttrsByName[draggedName].order;
      const targetOrder = newAttrsByName[targetName].order;

      if (draggedOrder < targetOrder) {
        Object.keys(newAttrsByName).forEach((key) => {
          const attr = newAttrsByName[key]
          if (attr && attr.order
            && attr.order > draggedOrder
            && attr.order <= targetOrder) {
            attr.order -= 1;
          }
        });
      } else {
        Object.keys(newAttrsByName).forEach((key) => {
          const attr = newAttrsByName[key]
          if (attr && attr.order
            && attr.order < draggedOrder
            && attr.order >= targetOrder) {
            attr.order += 1;
          }
        });
      }
      newAttrsByName[draggedName].order = targetOrder;
      setAttrsByName(newAttrsByName);
    }
  };

  const handleMouseDown = (e: React.MouseEvent, attrName: string) => {
    resizingRef.current.startX = e.clientX;
    resizingRef.current.startWidth = attrsByName[attrName].width || 150;
    resizingRef.current.attrName = attrName;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(() => {
        const { startX, startWidth, attrName } = resizingRef.current;
        if (attrName !== '') {
          const delta = e.clientX - startX;
          const newWidth = Math.max(style?.cellMinWidth || 100, startWidth + delta);
          const newAttrsByName = { ...attrsByName };
          newAttrsByName[attrName].width = newWidth;
          setAttrsByName(newAttrsByName);
        }
        animationFrameRef.current = null;
      });
    }
  }, [attrsByName, setAttrsByName, style]);

  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    resizingRef.current.attrName = '';

  }, [handleMouseMove]);

  return (
    <div className="header-group grid p-1 border-b-[1px]"
      style={{
        gridTemplateColumns: [`${style?.optionsColumnWidth || 100}px`,
        ...Object.values(attrsByName)
          .sort((x, y) => x.order - y.order)
          .map((attr) => `${attr.width}px`)]
          .join(' ')
      }}>
      <div className="options-header"></div>
      {
        Object.values(attrsByName).sort((x, y) => x.order - y.order).map((attr, index) =>
          <div
            key={index}
            className={`header-cell-${attr.name} py-2 flex justify-between items-center relative pl-2`}
            onMouseEnter={() => setFocusedIndex(index)}
          >
            <div className="header-name flex-grow text-[16px] hover:cursor-grab"
              draggable
              onDragStart={(e) => handleColumnDragStart(e, attr.name)}
              onDragOver={handleColumnDragOver}
              onDrop={(e) => handleColumnDrop(e, attr.name)}
            >
              {attr.display}
            </div>

            <div className="column-option flex items-center flex-nowrap">
              {focusedIndex === index &&
                <div
                  className="relative size-[20px] hover:bg-gray-100 hover:rounded-full"
                  onClick={() => {
                    if (attr.sort === 'none') {
                      setAttrsByName({ ...attrsByName, [attr.name]: { ...attrsByName[attr.name], sort: 'asc' } })
                    }
                    if (attr.sort === 'asc') {
                      setAttrsByName({ ...attrsByName, [attr.name]: { ...attrsByName[attr.name], sort: 'desc' } })
                    }
                    if (attr.sort === 'desc') {
                      setAttrsByName({ ...attrsByName, [attr.name]: { ...attrsByName[attr.name], sort: 'none' } })
                    }

                  }}
                >
                  <HorizontalRuleRounded
                    className={`absolute inset-0 m-auto
                                transition-transform duration-300 ease-in-out transform ${attr.sort === 'none' ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'
                      }`}
                    style={{
                      fontSize: '16px'
                    }}
                  />
                  <ArrowDownwardRounded
                    className={`absolute inset-0 m-auto
             transition-transform duration-300 ease-in-out transform ${attr.sort === 'asc' ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'
                      }`}
                    style={{
                      fontSize: '16px'
                    }}
                  />
                  <ArrowUpwardRounded
                    className={`absolute inset-0 m-auto
             transition-transform duration-300 ease-in-out transform ${attr.sort === 'desc' ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
                      }`}
                    style={{
                      fontSize: '16px'
                    }}
                  />
                </div>
              }
              {
                focusedIndex === index &&
                <Dropdown
                  toggleButton={<MoreVertRounded className="size-[18px]" />}
                  content={
                    <div className="absolute top-[10px] bg-white border shadow-md w-[150px]">
                      <div className="p-2 hover:bg-gray-200 w-full flex items-center"
                        onClick={() => setAttrsByName({ ...attrsByName, [attr.name]: { ...attrsByName[attr.name], sort: 'asc' } })}
                      >
                        <ArrowDownwardRounded className="size-[16px] mr-3" />
                        Sort ascending
                      </div>
                      <div className="p-2 hover:bg-gray-200 w-full flex items-center"
                        onClick={() => setAttrsByName({ ...attrsByName, [attr.name]: { ...attrsByName[attr.name], sort: 'desc' } })}
                      >
                        <ArrowUpwardRounded className="size-[16px] mr-3" />
                        Sort descending
                      </div>
                      <div className="p-2 hover:bg-gray-200 w-full flex items-center"
                        onClick={() => setAttrsByName(updateFilter(attrsByName, { name: attr.name }))}
                      >
                        <FilterAltRounded className="size-[16px] mr-3" />
                        Filter
                      </div>
                    </div>
                  }
                />
              }
              <TbMinusVertical
                className="hover:cursor-col-resize hover:font-bold hover:text-blue-400 text-[25px]"
                onMouseDown={(e) => handleMouseDown(e, attr.name)}
              />
            </div>
          </div>
        )
      }
    </div>
  )
}