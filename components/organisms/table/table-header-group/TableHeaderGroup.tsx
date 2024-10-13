import { Dropdown } from "@components/molecules";
import { ArrowDownwardRounded, ArrowUpwardRounded, AtmRounded, FilterAltRounded, HorizontalRuleRounded, MoreVertRounded } from "@mui/icons-material";
import { useCallback, useRef, useState } from "react"
import { updateFilter } from "../functions";

export default function TableHeaderGroup({ style, attrsByName, setAttrsByName, setMenu }: {
  style?: {
    cellMinWidth?: number,
    optionsColumnWidth?: number
  },
  attrsByName: AttrsByName,
  setAttrsByName: (newAttrsByName: AttrsByName) => void,
  setMenu: () => void
}) {

  const animationFrameRef = useRef<number | null>(null);
  const resizingRef = useRef({ startX: 0, startWidth: 0, attrName: '' });
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [resizeIndex, setResizeIndex] = useState(-1)

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
    <div className="header-group grid pb-[1px] border-b-[1px]"
      style={{
        gridTemplateColumns: [`${style?.optionsColumnWidth || 100}px`,
        ...Object.values(attrsByName)
          .sort((x, y) => x.order - y.order)
          .map((attr) => `${attr.width}px`)]
          .join(' ')
      }}>
      <div className="options-header"></div>
      {
        Object.values(attrsByName)
          .filter(attr => !attr.hidden && !attr.newWindow)
          .sort((x, y) => x.order - y.order)
          .map((attr, index) =>
            <div
              key={index}
              className={`header-cell-${attr.name} py-2 flex justify-between items-center  pl-2`}
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
                  <>
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
                        className={`absolute inset-[4px]
                              transition-transform duration-300 ease-in-out transform ${attr.sort === 'none' ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'
                          }`}
                        style={{
                          fontSize: '16px'
                        }}
                      />
                      <ArrowDownwardRounded
                        className={`absolute inset-[4px]
                                  transition-transform duration-300 ease-in-out 
                                  transform ${attr.sort === 'asc' ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'
                          }`}
                        style={{
                          fontSize: '16px'
                        }}
                      />
                      <ArrowUpwardRounded
                        className={`absolute inset-[4px]
                                    transition-transform duration-300 ease-in-out transform ${attr.sort === 'desc' ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
                          }`}
                        style={{
                          fontSize: '16px'
                        }}
                      />
                    </div>
                    <Dropdown
                      toggleButton={<MoreVertRounded style={{ fontSize: '18px' }} />}
                      content={
                        <div className="w-[175px]">
                          <div className="p-2 hover:bg-gray-200 flex items-center"
                            onClick={() => setAttrsByName({
                              ...attrsByName,
                              [attr.name]:
                              {
                                ...attrsByName[attr.name],
                                sort: attrsByName[attr.name].sort === 'asc' ? 'none' : 'asc'
                              }
                            })}
                          >
                            <ArrowDownwardRounded className="mr-3" style={{ fontSize: '16px' }} />
                            Sort ascending
                          </div>
                          <div className="p-2 hover:bg-gray-200 flex items-center"
                            onClick={() => setAttrsByName({
                              ...attrsByName, [attr.name]: {
                                ...attrsByName[attr.name],
                                sort: attrsByName[attr.name].sort === 'desc' ? 'none' : 'desc'
                              }
                            })}
                          >
                            <ArrowUpwardRounded className="mr-3" style={{ fontSize: '16px' }} />
                            Sort descending
                          </div>

                          <div className="p-2 hover:bg-gray-200 flex items-center"
                            onClick={() => {
                              setMenu()
                              setAttrsByName(updateFilter(attrsByName, { name: attr.name }))
                            }}
                          >
                            <FilterAltRounded className="mr-3" style={{ fontSize: '16px' }} />
                            Filter
                          </div>
                        </div>
                      }
                    />
                  </>}
              </div>

              <div className={`column-separator h-full w-[5px] hover:cursor-col-resize hover:bg-[#4672b0] rounded-full flex items-center justify-center`}
                onMouseDown={(e) => handleMouseDown(e, attr.name)}
                onMouseEnter={() => setResizeIndex(index)}
                onMouseLeave={() => setResizeIndex(-1)}
              >
                <div className={`h-full w-[1px] ${resizeIndex === index ? 'bg-transparent' : 'bg-gray-300'}`} />

              </div>

            </div>
          )
      }
    </div>
  )
}