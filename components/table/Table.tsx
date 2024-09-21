'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import './table.css'

import { getTextWidth } from "@functions/text-analysis";

import ColumnSeparator from "./ColumnSeparator";
import MenuIcon from "./MenuIcon";
import MultiselectCell from "./MultiSelectCell";
import TextCell from "./TextCell";
import SlideWindow from './SlideWindow';
import DropDown from "@components/DropDown";

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ViewColumnRoundedIcon from '@mui/icons-material/ViewColumnRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';
import Download from "@mui/icons-material/Download";
import HorizontalRuleRoundedIcon from '@mui/icons-material/HorizontalRuleRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';


export default function Table({ name, data, attrs, handleUpdateCell, handleCreateItem }:
  {
    name?: string,
    data: DataItem[],
    attrs: AttrProps[],
    handleUpdateCell: (itemId: number, attrName: string, value: number | string | string[]) => Promise<void>,
    handleCreateItem: () => Promise<void>
  }) {

  // Constants
  const cellMinWidth = 100
  const newWindowsNeeded = attrs.some((attr) => attr.newWindow)
  const itemsPerPage = 10;
  const totalPages = useMemo(() => {
    return Math.ceil(data.length / itemsPerPage);
  }, [data]);


  // States and Refs
  const [attrsByName, setAttrsByName] = useState(() => {
    const attrsByName: { [key: string]: AttrProps } = {}
    attrs.forEach((attr, index) => {
      attrsByName[attr.name] = {
        ...attr,
        width: Math.min(Math.max(Math.max(...data.map(item => getTextWidth(String(item[attr.name])))), 100), 200),
        order: index,
        hidden: false,
        display: attr.name.charAt(0).toUpperCase() + attr.name.slice(1),
        sort: 'none',
      };
    })
    return attrsByName;
  })
  const [focusedCell, setFocusedCell] = useState({ itemId: -1, attrName: '' })
  const [hoveredItem, setHoveredItem] = useState(-1)
  const [focusedHeader, setFocusedHeader] = useState(-1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<DataItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const animationFrameRef = useRef<number | null>(null);
  const resizingRef = useRef({ startX: 0, startWidth: 0, attrName: '' });

  // Derived values
  const orderedAttrs = useMemo(() => {
    return Object.keys(attrsByName)
      .map((attrName) => attrsByName[attrName])
      .filter(attr => !attr.hidden && attr.newWindow === false)
      .sort((x, y) => (x.order && y.order ? x.order - y.order : 0));
  }, [attrsByName]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  // Handlers
  function handleSort(attrName: string, currentState: 'none' | 'asc' | 'desc' | undefined) {
    let nextState: 'none' | 'asc' | 'desc' | undefined
    if (currentState === 'none')
      nextState = 'asc'
    if (currentState === 'asc')
      nextState = 'desc'
    if (currentState === 'desc')
      nextState = 'none'

    setAttrsByName({ ...attrsByName, [attrName]: { ...attrsByName[attrName], sort: nextState } })
  }

  const exportToCSV = () => {
    const headers = orderedAttrs.map(attr => attr.display).join(',');
    const rows = data.map(item => orderedAttrs.map(attr => `"${item[attr.name] || ''}"`).join(',')).join('\n');
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${name || 'data'}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  // Export data to JSON
  const exportToJSON = () => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name || 'data'}.json`;
    link.click();
  };

  function handleColumnAppearance(columnName: string) {
    const newAttrsByName = { ...attrsByName }
    newAttrsByName[columnName] = { ...newAttrsByName[columnName], hidden: !attrsByName[columnName].hidden }
    setAttrsByName(newAttrsByName)
    localStorage.setItem('attrsByName', JSON.stringify(newAttrsByName))
  }

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

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Effects

  useEffect(() => {
    const savedAttrsByName = localStorage.getItem('attrsByName');
    if (savedAttrsByName) {
      setAttrsByName(JSON.parse(savedAttrsByName))
    }
  }, []);

  useEffect(() => {
    setCurrentItem(data.find(item => currentItem && item.id === currentItem.id) as DataItem)
  }, [data]);

  // useEffect(() => {

  // }, [attrsByName]);


  return (
    <div className="table-container flex flex-col h-auto shadow-md">
      <SlideWindow
        onClose={handleCloseDrawer}
        isOpen={drawerOpen}
      >
        {attrs.filter(attr => attr.newWindow === true).map((newWindowAttr, index) =>
          <div key={index}>
            {
              currentItem &&
              <div className="bg-[#7ec7d6] my-3 rounded-md p-2 text-gray-800">
                <span className="text-[16px]">{attrsByName[newWindowAttr.name].display}</span>
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

      <div className="options-container">
        <DropDown
          toggleButton={<ViewColumnRoundedIcon className="text-[#023e8a] text-[20px]" />}
          content={
            <div className="p-4 w-48 bg-white border border-gray-300 shadow-lg space-y-2">
              {attrs.map(attr => (
                !attrsByName[attr.name].newWindow && (
                  <div key={attr.name} className="flex justify-between items-center">
                    <span className="text-gray-800">{attrsByName[attr.name].display}</span>
                    <input
                      id={`check-${attr.name}`}
                      type="checkbox"
                      checked={!attrsByName[attr.name].hidden}
                      onClick={() => handleColumnAppearance(attr.name)}
                      className={`ml-2 cursor-pointer appearance-none h-4 w-4 p-1
                        bg-white border-2 rounded-sm checked:bg-[#0077b6] checked:border-transparent relative before:content-['✔'] before:absolute before:inset-0 before:flex before:items-center before:justify-center 
                        before:text-gray-400 before:opacity-100 checked:before:text-white checked:before:opacity-100
                        transition-colors duration-300 ease-in-out`}
                    />

                  </div>
                )
              ))}
            </div>
          }
        />
        <DropDown
          toggleButton={<Download className="text-[#023e8a] text-[20px]" />}
          content={<div className="p-4 w-48 bg-white border border-gray-300 shadow-lg space-y-2">
            <button onClick={exportToCSV} >Export to CSV</button>
            <button onClick={exportToJSON} >Export to JSON</button>
          </div>} />

      </div>

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
            >
              <div className="flex-grow"
                draggable
                onDragStart={(e) => handleDragStart(e, attr.name)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, attr.name)}
              >
                {attr.display}
              </div>

              <div className="column-options flex items-center space-x-2 flex-nowrap">
                {focusedHeader === index &&
                  <div
                    className="relative w-[20px] h-[20px] hover:bg-gray-100 hover:rounded-full"
                    onClick={() => handleSort(attr.name, attr.sort)}
                  >
                    <HorizontalRuleRoundedIcon
                      className={`absolute inset-0 m-auto text-[16px] 
                        transition-transform duration-300 ease-in-out transform ${attr.sort === 'none' ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'
                        }`}
                    />
                    <ArrowDownwardRoundedIcon
                      className={`absolute inset-0 m-auto text-[16px] 
                        transition-transform duration-300 ease-in-out transform ${attr.sort === 'asc' ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'
                        }`}
                    />
                    <ArrowUpwardRoundedIcon
                      className={`absolute inset-0 m-auto text-[16px] 
                        transition-transform duration-300 ease-in-out transform ${attr.sort === 'desc' ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
                        }`}
                    />
                  </div>}
                {
                  focusedHeader === index &&
                  <DropDown
                    toggleButton={<MenuIcon />}
                    content={
                      <div className="absolute top-[10px] bg-white border shadow-md z-10 w-[150px]">
                        <div className="p-2 hover:bg-gray-200 w-full flex items-center justify-between">
                          Filter
                          <FilterAltRoundedIcon className="text-[16px]" />
                        </div>
                      </div>
                    }
                  />
                }
                <ColumnSeparator
                  className="hover:cursor-col-resize hover:font-bold hover:text-blue-400"
                  onMouseDown={(e) => handleMouseDown(e, attr.name)}
                />
              </div>
            </div>
          )
        }
      </div>

      <div className="table-body text-[14px] text-gray-800">
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
                  {
                    (attr.type === 'multiselect'
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
                      />)
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
          className="hover:cursor-pointer"
          onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : currentPage)}
        />
        <span className="pagination-info">
          {(currentPage - 1) * itemsPerPage + 1}-{currentPage * itemsPerPage} of {data.length}
        </span>

        <NavigateNextRoundedIcon
          className="hover:cursor-pointer"
          onClick={() => handlePageChange(currentPage !== totalPages ? currentPage + 1 : currentPage)}
        />
      </div>
    </div>

  );
}
