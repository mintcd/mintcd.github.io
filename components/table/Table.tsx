'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import './table.css'

import { getTextWidth, capitalizeFirstLetter } from "@functions/text-analysis";
import { sortData } from "@functions/database";

import ColumnSeparator from "./ColumnSeparator";
import MenuIcon from "./MenuIcon";
import MultiselectCell from "./MultiSelectCell";
import TextCell from "./TextCell";
import SlideWindow from './SlideWindow';
import DropDown from "@components/DropDown";
import Autocomplete from "@components/autocomplete/Autocomplete";
import Checkbox from "@components/checkbox/Checkbox";

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
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';

type FilterProp = {
  attrName?: string,
  action?: "contains" | '',
  option?: string,
  applied?: boolean
}

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

  // States and Refs
  const [attrsByName, setAttrsByName] = useState(() => {
    const attrsByName: { [key: string]: AttrProps } = {}
    attrs.forEach((attr, index) => {
      attrsByName[attr.name] = {
        ...attr,
        width: Math.min(Math.max(Math.max(...data.map(item => getTextWidth(String(item[attr.name])))), 100), 200),
        order: index,
        hidden: false,
        display: capitalizeFirstLetter(attr.name),
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
  const [processedData, setProcessedData] = useState(data)
  const [sorting, setSorting] = useState<{ attrName: string, direction: 'asc' | 'desc' | 'none' }>({
    attrName: '',
    direction: 'none',
  });
  const [filters, setFilters] = useState<FilterProp[]>([])
  const [addingFilter, setAddingFilter] = useState<FilterProp>({})
  const [filterError, setFilterError] = useState("")

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
  const paginatedData = processedData.slice(startIndex, endIndex);
  const totalPages = useMemo(() => {
    return Math.ceil(processedData.length / itemsPerPage);
  }, [data]);

  // Handlers
  function handleModifyFilter(
    filterIndex: number,
    attr: { attrName?: string; option?: string; action?: string; applied?: boolean }
  ) {
    const newFilters = [...filters] as FilterProp[];
    const key = Object.keys(attr)[0] as keyof FilterProp; // assert the type here
    if (key) {
      // Type assertion to ensure compatibility
      newFilters[filterIndex][key] = attr[key] as any; // Use 'as any' to bypass strict type checking
      setFilters(newFilters);
    }
  }

  function handleClearFilter(filterIndex: number) {
    const newFilters = filters.filter((_, index) => index !== filterIndex); // Remove the filter at filterIndex
    setFilters(newFilters); // Update state with the new filters array
  }

  function handleApplyFilter(filterIndex: number) {
    const newFilters = [...filters]
    newFilters[filterIndex].applied = !newFilters[filterIndex].applied
    setFilters(newFilters);
  }

  function handleSort(attrName: string, currentState: 'none' | 'asc' | 'desc' | undefined) {

    let nextState: 'none' | 'asc' | 'desc' = 'none';

    if (currentState === 'none') nextState = 'asc';
    else if (currentState === 'asc') nextState = 'desc';
    else if (currentState === 'desc') nextState = 'none';

    setAttrsByName({ ...attrsByName, [attrName]: { ...attrsByName[attrName], sort: nextState } });
    setSorting({ attrName, direction: nextState });

    setProcessedData(sortData(data, attrName, nextState));
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
    let processedData = [...data]
    filters.forEach((filter) => {
      if (!filter.applied) return
      const filteredAttr = filter.attrName as string
      processedData = processedData.filter(item => item[filteredAttr].includes(filter.option) || item[filteredAttr].length === 0)
    })
    setProcessedData(sortData(processedData, sorting.attrName, sorting.direction));
    setCurrentItem(data.find(item => currentItem && item.id === currentItem.id) as DataItem);
  }, [data, sorting, filters]);

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
              <div className="bg-[#6ca0e5] my-3 rounded-md p-2 text-gray-800">
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

      <div className="option-container flex space-x-3">
        <DropDown
          toggleButton={<ViewColumnRoundedIcon className="text-[#023e8a] text-[20px]" />}
          content={
            <div className="p-4 w-48 bg-white border border-gray-300 shadow-lg space-y-2">
              {attrs.map(attr => (
                !attrsByName[attr.name].newWindow && (
                  <div key={attr.name} className="flex justify-between items-center">
                    <span className="text-gray-800">{attrsByName[attr.name].display}</span>
                    <Checkbox
                      value={!attrsByName[attr.name].hidden}
                      onChange={() => handleColumnAppearance(attr.name)}
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
          </div>
          }
        />
        <DropDown
          toggleButton={<FilterAltRoundedIcon className="text-[#023e8a] text-[20px]" />}
          content={
            <div className="p-4 w-[700px] bg-white border border-gray-300 shadow-lg space-y-2">
              {filters.map((filter, index) => (
                <div key={`filter-${index}`} className="flex justify-between items-center">
                  <div className="flex space-x-3">
                    <Autocomplete
                      value={capitalizeFirstLetter(filter.attrName || '')}
                      suggestions={Object.keys(attrsByName).map(attrName => attrsByName[attrName].display)}
                      style={{ width: 150, marginLeft: 5 }}
                      onSubmit={(value) => handleModifyFilter(index, { attrName: value })}
                    />
                    <Autocomplete
                      value={filter.action}
                      suggestions={['contains']}
                      style={{ width: 150, marginLeft: 5 }}
                      onSubmit={(value) => handleModifyFilter(index, { action: value })}
                    />
                    <Autocomplete
                      value={filter.option}
                      suggestions={[...new Set(data.flatMap(item => item[filter.attrName ? filter.attrName : 0]))]}
                      style={{ width: 150, marginLeft: 5 }}
                      onSubmit={(value) => handleModifyFilter(index, { option: value })}
                    />
                  </div>
                  <div>
                  </div>
                  <div >
                    {
                      filter.applied
                        ? <PlayArrowRoundedIcon onClick={() => handleApplyFilter(index)} />
                        : <PlayArrowOutlinedIcon onClick={() => handleApplyFilter(index)} />
                    }
                    <ClearRoundedIcon onClick={() => handleClearFilter(index)} />
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center">
                <div className="flex">
                  <Autocomplete
                    placeholder="column"
                    value={capitalizeFirstLetter(addingFilter.attrName || '')}
                    suggestions={Object.keys(attrsByName).map(attrName => attrsByName[attrName].display)}
                    style={{ width: 150, marginLeft: 5 }}
                    onSubmit={(value) => {
                      setAddingFilter({ ...addingFilter, attrName: value.toLowerCase() })
                    }}
                  />
                  <Autocomplete
                    placeholder="action"
                    value={addingFilter.action}
                    suggestions={['contains']}
                    style={{ width: 150, marginLeft: 5 }}
                    onSubmit={(value) => {
                      setAddingFilter({ ...addingFilter, action: value as "contains" })
                    }}
                  />
                  <Autocomplete
                    placeholder="option"
                    value={addingFilter.option}
                    suggestions={
                      addingFilter.attrName
                        ? [...new Set(data.flatMap(item => {
                          const attrName = addingFilter.attrName as string
                          const key = item[attrName];
                          return key !== undefined && key !== null ? key : [];
                        }))]
                        : []
                    }
                    style={{ width: 150, marginLeft: 5 }}
                    onSubmit={(value) => {
                      setAddingFilter({ ...addingFilter, option: value });
                    }}
                  />
                </div>

                <AddRoundedIcon onClick={() => {
                  if (!addingFilter.attrName) {
                    setFilterError("Please add a filtered column");
                    return;
                  }

                  if (filters.find(filter => (
                    filter.attrName === addingFilter.attrName &&
                    filter.action === addingFilter.action &&
                    filter.option === addingFilter.option
                  ))) {

                    setFilterError("Already added this filter");
                    return;
                  }

                  setFilters([...filters, { ...addingFilter, applied: true }]);
                  setAddingFilter({ attrName: '', action: '', option: '' });
                  setFilterError("");
                }} />

              </div>
              <div className="filter-error text-red-500">
                {filterError}
              </div>
            </div>
          }
        />

        <DropDown
          toggleButton={<SettingsRoundedIcon className="text-[#023e8a] text-[20px]" />}
          content={<div className="p-4 w-48 bg-white border border-gray-300 shadow-lg space-y-2">
            <button onClick={exportToCSV} >Export to CSV</button>
            <button onClick={exportToJSON} >Export to JSON</button>
          </div>
          }
        />


      </div>

      <div className="table-header grid text-[16px] p-1 border-b-[1px]"
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

              <div className="column-option flex items-center flex-nowrap">
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
                  </div>
                }
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
                        attr={attr}
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
      </div>
      <div className="flex items-center justify-between text-[#023e8a]">
        <AddRoundedIcon className={` cursor-pointer text-[20px]`}
          onClick={handleCreateItem} />
        <div className="pagination-controls flex items-center justify-end">
          <NavigateBeforeRoundedIcon
            className="hover:cursor-pointer"
            onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : currentPage)}
          />
          <span className="pagination-info">
            {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, processedData.length)} of {processedData.length}
          </span>

          <NavigateNextRoundedIcon
            className="hover:cursor-pointer"
            onClick={() => handlePageChange(currentPage !== totalPages ? currentPage + 1 : currentPage)}
          />
        </div>
      </div>

    </div>

  );
}
