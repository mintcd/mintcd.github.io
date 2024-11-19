import { useCallback, useRef, useState } from "react"
import { updateFilter } from "../functions";
import { Dropdown } from "@components/molecules";

import { MdFilterAlt } from "react-icons/md";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { MdOutlineHorizontalRule, MdMoreVert } from "react-icons/md";
import { IoMdColorWand } from "react-icons/io";


export default function TableHeaderGroup({ factory }: {
  factory: Factory<TableProps>
}) {

  const animationFrameRef = useRef<number | null>(null);
  const resizingRef = useRef({ startX: 0, startWidth: 0, attrName: '' });
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [resizeIndex, setResizeIndex] = useState(-1)

  const iconStyle = {
    marginRight: 12,
    fontSize: 14,
    cursor: "pointer",
    color: "#023e8a"
  }

  const options = [{
    name: "Sort ascending",
    icon: <FaArrowUp style={iconStyle} />,
    handler: (attr: AttrProps) => handleSort(attr, factory.attrsByName[attr.name].sort === 'asc' ? 'none' : 'asc'),
  },
  {
    name: "Sort descending",
    icon: <FaArrowUp style={iconStyle} />,
    handler: (attr: AttrProps) => handleSort(attr, factory.attrsByName[attr.name].sort === 'asc' ? 'none' : 'asc'),
  },
  {
    name: "Filter",
    icon: <MdFilterAlt style={iconStyle} />,
    handler: (attr: AttrProps) => {
      factory.set('menu', 'filter')
      factory.set('attrsByName', updateFilter(factory.attrsByName, { name: attr.name }))
    }
  },
  {
    name: "Customize",
    icon: <IoMdColorWand style={iconStyle} />,
    handler: (attr: AttrProps) => {
    }
  },
  ]

  const resizeListeners = {
    onMouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, attr: AttrProps) => {
      resizingRef.current.startX = e.clientX;
      resizingRef.current.startWidth = factory.attrsByName[attr.name].width || 150;
      resizingRef.current.attrName = attr.name;

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    onMouseEnter: (index: number) => setResizeIndex(index),
    onMouseLeave: () => setResizeIndex(-1)
  }

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
      const newAttrsByName = { ...factory.attrsByName };
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
      factory.set('attrsByName', newAttrsByName);
    }
  };

  const handleMouseDown = (e: React.MouseEvent, attrName: string) => {
    resizingRef.current.startX = e.clientX;
    resizingRef.current.startWidth = factory.attrsByName[attrName].width || 150;
    resizingRef.current.attrName = attrName;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleSort = (attr: AttrProps, order: string | undefined = undefined) => {
    let nextOrder: string
    if (order) {
      nextOrder = order
    } else {
      if (attr.sort === 'none') {
        nextOrder = 'asc'
      }
      else if (attr.sort === 'asc') {
        nextOrder = 'desc'
      } else {
        nextOrder = 'none'
      }
    }

    factory.set('attrsByName', ({
      ...factory.attrsByName,
      [attr.name]: { ...attr, sort: nextOrder }
    }))
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(() => {
        const { startX, startWidth, attrName } = resizingRef.current;
        if (attrName !== '') {
          const delta = e.clientX - startX;
          const newWidth = Math.max(factory.style?.cellMinWidth as number || 100, startWidth + delta);
          const newAttrsByName = { ...factory.attrsByName };
          newAttrsByName[attrName].width = newWidth;
          factory.set('attrsByName', newAttrsByName);
        }
        animationFrameRef.current = null;
      });
    }
  }, [factory.attrsByName]);

  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    resizingRef.current.attrName = '';

  }, [handleMouseMove]);

  return (
    <div className="header-group grid pb-[1px] border-b-[1px]"
      style={{
        gridTemplateColumns: [`${factory.style.optionsColumnWidth || 100}px`,
        ...Object.values(factory.attrsByName)
          .sort((x, y) => x.order - y.order)
          .map((attr) => `${attr.width}px`)]
          .join(' ')
      }}>
      <div className="options-header"></div>
      {
        Object.values(factory.attrsByName)
          .filter(attr => !attr.hidden && !attr.newWindow)
          .sort((x, y) => x.order - y.order)
          .map((attr, index) =>
            <div
              key={index}
              className={`header-cell-${attr.name} py-2 flex justify-between items-center pl-2`}
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
                      onClick={() => handleSort(attr)}
                    >
                      <MdOutlineHorizontalRule
                        className={`absolute inset-[4px]
                              transition-transform duration-300 ease-in-out 
                              transform ${attr.sort === 'none' ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'
                          }`}
                        fontSize={14}
                        color="#023e8a"
                      />
                      <FaArrowUp
                        className={`absolute inset-[4px]
                                  transition-transform duration-300 ease-in-out 
                                  transform ${attr.sort === 'asc' ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'
                          }`}
                        {...iconStyle}
                      />
                      <FaArrowDown
                        className={`absolute inset-[4px]
                                    transition-transform duration-300 ease-in-out 
                                    transform ${attr.sort === 'desc' ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
                          }`}
                        {...iconStyle}
                      />
                    </div>

                    <Dropdown
                      toggler={<MdMoreVert {...iconStyle} fontSize={18} />}
                      content={
                        <div className="w-[175px]">
                          {options.map(option => (
                            <div className="p-2 hover:bg-gray-200 flex items-center cursor-pointer"
                              key={option.name}
                              onClick={() => option.handler(attr)}
                            >
                              {option.icon}
                              {option.name}
                            </div>
                          ))}
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