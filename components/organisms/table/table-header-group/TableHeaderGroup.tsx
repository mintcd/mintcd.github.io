import { useCallback, useRef, useState } from "react"
import { updateFilter } from "../functions";
import { Dropdown } from "@components/molecules";

import { ArrowDownIcon, ArrowUpIcon, FilterIcon, AdjustmentsIcon } from "@public/icons"

export default function TableHeaderGroup({ factory }: {
  factory: Factory<TableProps>
}) {

  const animationFrameRef = useRef<number | null>(null);
  const resizingRef = useRef({ startX: 0, startWidth: 0, attrName: '' });
  const [dragColumns, setDragColumns] = useState<{ source: string | null, target: string | null }>({
    source: null,
    target: null
  })

  const normalAttrs = Object.values(factory.attrsByName)
    .filter(attr => !attr.hidden && !attr.newWindow)
    .sort((x, y) => x.order - y.order)

  const options = [{
    name: "Sort ascending",
    icon: <ArrowUpIcon className="icon" />,
    handler: (attr: AttrProps) => handleSort(attr, factory.attrsByName[attr.name].sort === 'asc' ? 'none' : 'asc'),
  },
  {
    name: "Sort descending",
    icon: <ArrowDownIcon className="icon" />,
    handler: (attr: AttrProps) => handleSort(attr, factory.attrsByName[attr.name].sort === 'desc' ? 'none' : 'desc'),
  },
  {
    name: "Filter",
    icon: <FilterIcon className="icon" />,
    handler: (attr: AttrProps) => {
      factory.setMenu('filter')
      factory.setAttrsByName(updateFilter(factory.attrsByName, { name: attr.name }))
    }
  },
  {
    name: "Edit property",
    icon: <AdjustmentsIcon className="icon" />,
    handler: (attr: AttrProps) => {
    }
  },
  ]

  const resizeListeners = useCallback((attr: AttrProps) => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(() => {
          const { startX, startWidth, attrName } = resizingRef.current;
          if (attrName) {
            const delta = e.clientX - startX;
            const newWidth = Math.max(factory.style?.cellMinWidth || 100, startWidth + delta);
            factory.setAttrsByName({
              ...factory.attrsByName,
              [attrName]: { ...factory.attrsByName[attrName], width: newWidth },
            });
          }
          animationFrameRef.current = null;
        });
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      resizingRef.current.attrName = "";
    };
    return {
      onMouseDown: (e: React.MouseEvent) => {
        resizingRef.current = {
          startX: e.clientX,
          startWidth: factory.attrsByName[attr.name]?.width || 150,
          attrName: attr.name,
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      }
    }
  }, [factory]);

  const dragListeners = (attr: AttrProps) => ({
    onDragStart: (e: React.DragEvent<HTMLDivElement>) => {
      console.log(dragColumns)
      setDragColumns({ source: attr.name, target: null })
    },
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragColumns((prev) => ({ ...prev, target: attr.name }));
    },
    onDragEnd: (e: React.DragEvent<HTMLDivElement>) => {
      console.log(dragColumns)
      if (dragColumns.source === null || dragColumns.target === null) return
      if (dragColumns.source !== dragColumns.target) {
        const newAttrsByName = { ...factory.attrsByName };
        const sourceOrder = newAttrsByName[dragColumns.source].order;
        const targetOrder = newAttrsByName[dragColumns.target].order;

        if (sourceOrder < targetOrder) {
          Object.keys(newAttrsByName).forEach((key) => {
            const attr = newAttrsByName[key]
            if (attr && attr.order
              && attr.order > sourceOrder
              && attr.order <= targetOrder) {
              attr.order -= 1;
            }
          });
        } else {
          Object.keys(newAttrsByName).forEach((key) => {
            const attr = newAttrsByName[key]
            if (attr && attr.order
              && attr.order < sourceOrder
              && attr.order >= targetOrder) {
              attr.order += 1;
            }
          });
        }
        newAttrsByName[dragColumns.source].order = targetOrder;
        factory.setAttrsByName(newAttrsByName);
      }
      setDragColumns({ source: null, target: null })
    }
  })

  const handleSort = (attr: AttrProps, order: Order | undefined = undefined) => {
    let nextOrder: Order
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

    factory.setAttrsByName({
      ...factory.attrsByName,
      [attr.name]: { ...attr, sort: nextOrder }
    })
  }

  return (
    <div className="header-group flex mt-2">
      <div className={`option-column`} style={{ width: factory.style.optionsColumnWidth || 100 }}></div>
      {
        normalAttrs.map((attr, index) =>
          <div className={`header-cell-${attr.name} flex`} key={index}>
            <Dropdown>
              <Dropdown.Toggler>
                <div
                  className={`py-1 flex justify-between items-center pl-2 text-[16px]
                                hover:cursor-pointer hover:bg-blue-100`}
                  style={{ width: attr.width }}
                  draggable
                  {...dragListeners(attr)}
                >
                  {attr.display}
                </div>
              </Dropdown.Toggler>
              <Dropdown.Content>
                <div className="w-[175px]">
                  {options.map(option => (
                    <div className="p-3 hover:bg-gray-200 flex items-center cursor-pointer"
                      key={option.name}
                      onClick={() => option.handler(attr)}
                    >
                      {option.icon}
                      <span className="pl-2">
                        {option.name}
                      </span>

                    </div>
                  ))}
                </div>
              </Dropdown.Content>
            </Dropdown>
            <div className={`column-separator w-[3px] hover:cursor-col-resize hover:bg-[#4672b0]
            ${attr.name === dragColumns.target && 'bg-[#4672b0]'}`}
              {...resizeListeners(attr)}
            />
            <div className="bottom-separator h-[1px] bg-gray-300">
            </div>
          </div>
        )}
    </div>
  )
}