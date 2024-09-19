'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import ColumnSeparator from "./ColumnSeparator";
import MenuIcon from "./MenuIcon";
import { LiaSortAlphaDownSolid } from "react-icons/lia";
import { CiFilter } from "react-icons/ci";
import MultiselectCell from "./MultiSelectCell";
import TextCell from "./TextCell";
import { debounce, divide } from 'lodash'
import './table.css'
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SlideWindow from './SlideWindow';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';


export default function Table({
  name,
  data,
  attrs,
  handleUpdateCell,
  handleCreateItem
}: {
  name?: string,
  data: DataItem[],
  attrs: AttrProps[],
  handleUpdateCell: (itemId: number, attrName: string, value: number | string | string[]) => Promise<void>,
  handleCreateItem: () => Promise<void>
}) {

  const cellMinWidth = 150
  const [attrsByName, setAttrsByName] = useState(() => {
    const attrsByName: { [key: string]: AttrProps } = {}
    attrs.forEach((attr, index) => {
      attrsByName[attr.name] = attr
      attrsByName[attr.name].width = 150
      attrsByName[attr.name].order = index
    })
    return attrsByName;
  })

  const [focusedCell, setFocusedCell] = useState({ itemId: -1, attrName: '' })
  const newWindowsNeeded = attrs.some((attr) => attr.newWindow)
  const [hoveredItem, setHoveredItem] = useState(-1)

  const [menuOpen, setMenuOpen] = useState<number>(-1);
  const [focusedHeader, setFocusedHeader] = useState(-1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<DataItem | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const animationFrameRef = useRef<number | null>(null);
  const resizingRef = useRef({ startX: 0, startWidth: 0, attrName: '' });



  const handleOpenWindow = (itemId: number) => {
    const selectedItem = data.find(item => item.id === itemId);
    if (selectedItem) {
      setCurrentItem(selectedItem);
      setDrawerOpen(true);
    }
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };


  const handleMouseDown = (e: React.MouseEvent, attrName: string) => {
    resizingRef.current.startX = e.clientX;
    resizingRef.current.startWidth = attrsByName[attrName].width || 150;
    resizingRef.current.attrName = attrName;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(() => {
        const { startX, startWidth, attrName } = resizingRef.current;
        if (attrName !== '') {
          const delta = e.clientX - startX;
          const newWidth = Math.max(cellMinWidth, startWidth + delta);
          const newAttrsByName = { ...attrsByName };
          newAttrsByName[attrName].width = newWidth;
          setAttrsByName(newAttrsByName);
        }
        animationFrameRef.current = null;
      });
    }
  };

  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    resizingRef.current.attrName = '';

    localStorage.setItem('attrsByName', JSON.stringify(attrsByName));

  }, []);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, draggedName: string) => {
    e.dataTransfer.setData('text/plain', draggedName);

    const img = document.createElement('img');
    img.src = 'path/to/custom-image.png';
    img.style.width = '100px';
    e.dataTransfer.setDragImage(img, 50, 50);

    e.currentTarget.classList.add('dragging');
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragging');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetName: string) => {
    e.preventDefault();
    const draggedName = e.dataTransfer.getData('text/plain');

    if (draggedName !== targetName) {
      const newAttrsByName = { ...attrsByName };
      const draggedOrder = newAttrsByName[draggedName].order;
      const targetOrder = newAttrsByName[targetName].order;

      if (!draggedOrder || !targetOrder) return;

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
      localStorage.setItem('attrsByName', JSON.stringify(newAttrsByName));
    }
  };


  const orderedAttrs = useMemo(() => {
    console.log(attrsByName)
    return Object.keys(attrsByName)
      .map((attrName) => attrsByName[attrName])
      .filter(attr => attr.newWindow === false)
      .sort((x, y) => (x.order && y.order ? x.order - y.order : 0));
  }, [attrsByName]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  const totalPages = useMemo(() => {
    return Math.ceil(data.length / itemsPerPage);
  }, [data]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  useEffect(() => {
    const savedAttrsByName = localStorage.getItem('attrsByName');
    if (savedAttrsByName) {
      setAttrsByName(JSON.parse(savedAttrsByName))
    }
  }, []);

  useEffect(() => {
    setCurrentItem(data.find(item => currentItem && item.id === currentItem.id) as DataItem)
  }, [data]);


  return (
    <div className="table-container flex flex-col h-auto shadow-md">
      <SlideWindow
        onClose={handleCloseDrawer}
        isOpen={drawerOpen}
      >
        {attrs.filter(attr => attr.newWindow === true).map((newWindowAttr, index) =>
          <div key={index}>
            {
              currentItem
              &&
              <div className="bg-blue-200 my-3 rounded-md p-2">
                <span className="text-[16px]">{newWindowAttr.name.charAt(0).toUpperCase() + newWindowAttr.name.slice(1)}</span>
                <TextCell
                  itemId={currentItem.id}
                  attr={newWindowAttr.name}
                  value={currentItem[newWindowAttr.name]}
                  handleUpdate={handleUpdateCell}
                />
              </div>

            }
          </div>
        )}
      </SlideWindow>

      <div className="table-header grid text-[15px] p-1 border-b-[1px]"
        style={{
          gridTemplateColumns: orderedAttrs
            .map((attr) => `${attr.width}px`)
            .join(' ')
        }}>
        {
          orderedAttrs.map((attr, index) =>
            <div
              key={index}
              className="table-header-cell py-2 flex justify-between items-center relative"
              style={{ width: `${Math.max(attr.width || 0, cellMinWidth)}px` }}
              onMouseEnter={() => setFocusedHeader(index)}
              onMouseLeave={() => setFocusedHeader(-1)}
            >
              <div className="flex-grow"
                draggable
                onDragStart={(e) => handleDragStart(e, attr.name)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, attr.name)}
              >
                {attr.name.charAt(0).toUpperCase() + attr.name.slice(1)}
              </div>

              <div className="icon-group flex items-center space-x-2 flex-nowrap">
                {focusedHeader === index && (
                  <>
                    <MenuIcon
                      onClick={() => setMenuOpen(index)}
                      onMouseLeave={() => setMenuOpen(-1)}
                    />
                    {menuOpen === index && (
                      <div className="absolute top-[10px] bg-white border shadow-md mt-2 z-10 w-[100px]"
                        onMouseEnter={() => setMenuOpen(index)}
                        onMouseLeave={() => setMenuOpen(-1)}
                      >
                        <div className="p-2 hover:bg-gray-200 w-full flex items-center justify-between">
                          Sort
                          <LiaSortAlphaDownSolid className="m-2" />
                        </div>
                        <div className="p-2 hover:bg-gray-200 w-full flex items-center justify-between">
                          Filter
                          <CiFilter className="m-2" />
                        </div>
                      </div>
                    )}
                  </>
                )}
                <ColumnSeparator
                  className="hover:cursor-col-resize hover:font-bold hover:text-blue-400"
                  onMouseDown={(e) => handleMouseDown(e, attr.name)}
                />
              </div>
            </div>
          )
        }
      </div>
      <div className="table-body text-[14px]">
        {paginatedData.map((item) =>
          <div key={item.id}
            className={`table-item grid py-[10px]`}
            style={{
              gridTemplateColumns: orderedAttrs
                .map((attr) => `${attr.width}px`)
                .join(' ')
            }}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(-1)}
          >
            {
              orderedAttrs.map((attr, cellIndex) =>
                <div
                  key={cellIndex}
                  className={`cell-container px-3 flex items-center justify-between 
                w-${Math.max(attr.width || 0, cellMinWidth)}px 
                transition duration-200
                ${focusedCell.itemId === item.id && focusedCell.attrName === attr.name ? 'border-2 border-blue-400 shadow-lg' : 'border border-transparent'}`}
                  onClick={() => setFocusedCell({ itemId: item.id, attrName: attr.name })}
                >
                  {attr.type === 'multiselect'
                    ?
                    <MultiselectCell
                      itemId={item.id}
                      attr={attr.name}
                      values={item[attr.name]}
                      autocompleteItems={Array.from(new Set(data.flatMap(item => attr.referencing ? item[attr.referencing] : item[attr.name])))}
                      handleUpdate={handleUpdateCell}
                    />
                    :
                    <TextCell
                      itemId={item.id}
                      attr={attr.name}
                      value={item[attr.name]}
                      handleUpdate={handleUpdateCell}
                    />
                  }
                  {
                    attr.name === 'id' && hoveredItem === item.id &&
                    <span>
                      <DragIndicatorIcon
                        className="text-[18px] hover:cursor-pointer"
                      />
                      {newWindowsNeeded &&
                        <OpenInNewIcon
                          className="text-[18px] hover:cursor-pointer"
                          onClick={() => handleOpenWindow(item.id)}
                        />
                      }
                    </span>
                  }


                </div>
              )
            }

          </div>
        )}
        <AddRoundedIcon sx={{ fontSize: 25, cursor: 'pointer' }} onClick={handleCreateItem} />
      </div>
      <div className="pagination-controls flex items-center justify-end mt-4">
        <NavigateBeforeRoundedIcon
          onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : currentPage)}
        />
        <span className="pagination-info">
          {(currentPage - 1) * itemsPerPage + 1}-{currentPage * itemsPerPage} of {data.length}
        </span>


        <NavigateNextRoundedIcon
          onClick={() => handlePageChange(currentPage !== totalPages ? currentPage + 1 : currentPage)}
        />
      </div>
    </div>

  );
}
