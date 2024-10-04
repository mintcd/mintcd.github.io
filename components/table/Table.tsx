'use client'

import { useState, useRef, useEffect, useCallback, useMemo, useReducer } from "react";
import { useClickAway } from "@uidotdev/usehooks";
import './table.css'
import { FilterAction, menuState, AttrProps } from './types.ts'
import { filterData, initializeAttrsByName, sortData, updateFilter } from "./functions.ts";
import { exportToCSV, exportToJSON } from "@functions/document"

import ColumnSeparator from "./ColumnSeparator";
import { Dropdown } from "@components/molecules";
import { Checkbox } from "@components/atoms";
import TableRow from "./table-row/TableRow";

import {
  AddRounded, NavigateNextRounded,
  NavigateBeforeRounded, ViewColumnRounded, ArrowDownwardRounded,
  FilterAltRounded, Download, HorizontalRuleRounded, ArrowUpwardRounded,
  SettingsRounded, MoreVertRounded,
} from '@mui/icons-material';

export default function Table({ name, upToDate, data, attrs, onUpdateCell, onCreateItem, onExchangeItems }:
  {
    name?: string,
    upToDate?: boolean,
    data: DataItem[],
    attrs: AttrProps[],
    onUpdateCell: (itemId: number, attrName: string, value: number | string | string[]) => void,
    onCreateItem: () => void,
    onExchangeItems: (id1: number, id2: number) => void
  }) {

  // Constants
  const cellMinWidth = 100
  const itemsPerPage = 10;
  const optionsColumnWidth = 75

  // States
  const [attrsByName, setAttrsByName] = useState(() => {
    const storedAttrsByName = localStorage.getItem('attrsByName')
    if (storedAttrsByName) return JSON.parse(storedAttrsByName) as { [key: string]: AttrProps }
    return initializeAttrsByName(attrs, data)
  })

  const [focusedHeader, setFocusedHeader] = useState(-1);
  const [currentPage, setCurrentPage] = useState(1);
  const [processedData, setProcessedData] = useState(data)
  const [sorting, setSorting] = useState<{ attrName: string, direction: 'asc' | 'desc' | 'none' }>({
    attrName: '',
    direction: 'none',
  });
  const [menu, setMenu] = useState<menuState>("")

  const menuRef = useClickAway(() => {
    setMenu("")
  }) as any

  // Derived values
  const orderedAttrs = useMemo(() => {
    return Object.keys(attrsByName)
      .map((attrName) => attrsByName[attrName])
      .filter(attr => !attr.hidden && !attr.newWindow)
      .sort((x, y) => (x.order && y.order ? x.order - y.order : 0));
  }, [attrsByName]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = processedData.slice(startIndex, endIndex);
  const totalPages = useMemo(() => {
    return Math.ceil(processedData.length / itemsPerPage);
  }, [processedData]);

  const animationFrameRef = useRef<number | null>(null);
  const resizingRef = useRef({ startX: 0, startWidth: 0, attrName: '' });

  // Handlers
  function handleFilter(action: FilterAction) {
    menu !== "filter" && setMenu("filter")
    const updatedAttrsByName = updateFilter(attrsByName, action)
    // Enable the filter
    setAttrsByName(updatedAttrsByName)
  }

  function handleSort(attrName: string, direction: 'none' | 'asc' | 'desc') {
    setAttrsByName({ ...attrsByName, [attrName]: { ...attrsByName[attrName], sort: direction } });
    setSorting({ attrName, direction: direction });
  }

  function handleColumnAppearance(columnName: string) {
    const newAttrsByName = { ...attrsByName }
    newAttrsByName[columnName] = { ...newAttrsByName[columnName], hidden: !attrsByName[columnName].hidden }
    setAttrsByName(newAttrsByName)
  }

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
          const newWidth = Math.max(cellMinWidth, startWidth + delta);
          const newAttrsByName = { ...attrsByName };
          newAttrsByName[attrName].width = newWidth;
          setAttrsByName(newAttrsByName);
        }
        animationFrameRef.current = null;
      });
    }
  }, [attrsByName]);

  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    resizingRef.current.attrName = '';

  }, [attrsByName, handleMouseMove]);

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
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };


  // Effects
  useEffect(() => {
    localStorage.setItem('attrsByName', JSON.stringify(attrsByName));
    const processedData = filterData(data, attrsByName)

    // Apply sorting
    setProcessedData(sortData(processedData, sorting.attrName, sorting.direction));

  }, [data, sorting, attrsByName]);

  return (
    <div className="table-container flex flex-col overflow-auto shadow-md relative">

      <div className="table-menu absolute top-[20px] right-0 z-10 bg-white border border-gray-300" ref={menuRef}>
        {menu === 'column-visibility' &&
          <div className="column-visibility-menu p-4 w-48 shadow-lg space-y-2">
            {attrs.map(attr => (
              !attrsByName[attr.name].newWindow && (
                <div key={attr.name} className="flex justify-between items-center">
                  <span className="text-gray-800">{attrsByName[attr.name].display}</span>
                  <Checkbox
                    checked={!attrsByName[attr.name].hidden}
                    onChange={() => handleColumnAppearance(attr.name)}
                  />
                </div>
              )
            ))}
          </div>
        }
        {menu === 'download' &&
          <div className="p-4 w-48 shadow-lg space-y-2">
            <button onClick={() => exportToCSV(Object.keys(attrs), data, name)} >Export to CSV</button>
            <button onClick={() => exportToJSON(data, name)} >Export to JSON</button>
          </div>
        }
        {menu === 'filter' &&
          <div className="p-4 shadow-lg space-y-2 w-[500px]">
            {Object.keys(attrsByName)
              .filter(attrName => attrsByName[attrName]['filterEnabled'])
              .map((attrName) => (
                <Dropdown
                  key={attrName}
                  toggleButton={
                    <span className=" bg-slate-300 rounded-full py-[2px] px-[8px]">
                      {attrsByName[attrName].display}
                      {function () {
                        const candidates = Object.values(attrsByName[attrName]['filter']).flat()
                        return candidates.length > 0 ? ": " + candidates.join(", ") : ""
                      }()}
                    </span>
                  }
                  content={
                    <div className="filter-options">
                      {
                        attrsByName[attrName].type === 'multiselect' &&
                        <div>
                          {attrsByName[attrName].display} is
                          {attrsByName[attrName].suggestions?.map(suggestion => (
                            <div key={suggestion} className="w-[200px]">
                              <Checkbox checked={Boolean(attrsByName[attrName]['filter']['is']?.includes(suggestion))}
                                onChange={() => handleFilter({
                                  name: attrName,
                                  predicate: "is",
                                  candidate: suggestion
                                })} />
                              <span className="mx-2">
                                {suggestion}
                              </span>

                            </div>
                          ))}
                        </div>
                      }
                      {/* {
                      attrsByName[filter.name].type === 'text' &&
                      <div>
                        {attrsByName[filter.name].display} contains
                        {attrsByName[filter.name].suggestions?.map(suggestion => (
                          <div key={suggestion} className="w-[200px]">
                            <Checkbox checked={filter.actions.some((action) => action.criteria.includes(suggestion))}
                              onChange={() => dispatchFilters({
                                name: filter.name,
                                actions:
                                  [{
                                    predicate: "contains",
                                    criteria: [suggestion]
                                  }]

                              })} />
                            <span className="mx-2">
                              {suggestion}
                            </span>

                          </div>
                        ))}
                      </div>
                    } */}
                    </div>
                  }
                />
              ))}

          </div>
        }
        {menu === 'settings' &&
          <div className="p-4 w-48 bg-white border border-gray-300 shadow-lg space-y-2">

          </div>
        }
      </div>

      <div className="table-extension flex justify-between h-[20px]">
        <div className="sync-state mx-[20px] italic">
          {upToDate ? "All changes saved." : "Processing..."}
        </div>

        <div className="option-icons flex space-x-3">
          <ViewColumnRounded className="text-[#023e8a] text-[20px]"
            onClick={() => setMenu("column-visibility")} />
          <Download className="text-[#023e8a] text-[20px]"
            onClick={() => setMenu("download")} />
          <FilterAltRounded className="text-[#023e8a] text-[20px]"
            onClick={() => setMenu("filter")}
          />
          <SettingsRounded className="text-[#023e8a] text-[20px]"
            onClick={() => setMenu("settings")}
          />
        </div>
      </div>

      <div className="table-content">
        <div className="header-group grid p-1 border-b-[1px]"
          style={{
            gridTemplateColumns: [`${optionsColumnWidth}px`, ...orderedAttrs
              .map((attr) => `${attr.width}px`)]
              .join(' ')
          }}>
          <div className="options-header"></div>
          {
            orderedAttrs.map((attr, index) =>
              <div
                key={index}
                className={`header-cell-${attr.name} py-2 flex justify-between items-center relative`}
                onMouseEnter={() => setFocusedHeader(index)}
              >
                <div className="header-name flex-grow text-[16px] "
                  draggable
                  onDragStart={(e) => handleColumnDragStart(e, attr.name)}
                  onDragOver={handleColumnDragOver}
                  onDrop={(e) => handleColumnDrop(e, attr.name)}
                >
                  {attr.display}
                </div>

                <div className="column-option flex items-center flex-nowrap">
                  {focusedHeader === index &&
                    <div
                      className="relative w-[20px] h-[20px] hover:bg-gray-100 hover:rounded-full"
                      onClick={() => {
                        if (sorting.attrName !== attr.name) {
                          handleSort(attr.name, 'asc')
                        } else {
                          if (sorting.direction === 'none') {
                            handleSort(attr.name, 'asc')
                          }
                          if (sorting.direction === 'asc') {
                            handleSort(attr.name, 'desc')
                          }
                          if (sorting.direction === 'desc') {
                            handleSort(attr.name, 'none')
                          }
                        }
                      }}
                    >
                      <HorizontalRuleRounded
                        className={`absolute inset-0 m-auto text-[16px]
                     transition-transform duration-300 ease-in-out transform ${attr.sort === 'none' ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'
                          }`}
                      />
                      <ArrowDownwardRounded
                        className={`absolute inset-0 m-auto text-[16px]
                     transition-transform duration-300 ease-in-out transform ${attr.sort === 'asc' ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'
                          }`}
                      />
                      <ArrowUpwardRounded
                        className={`absolute inset-0 m-auto text-[16px]
                     transition-transform duration-300 ease-in-out transform ${attr.sort === 'desc' ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
                          }`}
                      />
                    </div>
                  }
                  {
                    focusedHeader === index &&
                    <Dropdown
                      toggleButton={<MoreVertRounded />}
                      content={
                        <div className="absolute top-[10px] bg-white border shadow-md w-[150px]">
                          <div className="p-2 hover:bg-gray-200 w-full flex items-center"
                            onClick={() => handleSort(attr.name, 'asc')}
                          >
                            <ArrowDownwardRounded className="text-[16px] mr-3" />
                            Sort ascending
                          </div>
                          <div className="p-2 hover:bg-gray-200 w-full flex items-center"
                            onClick={() => handleSort(attr.name, 'desc')}
                          >
                            <ArrowUpwardRounded className="text-[16px] mr-3" />
                            Sort descending
                          </div>
                          <div className="p-2 hover:bg-gray-200 w-full flex items-center"
                            onClick={() => handleFilter(
                              {
                                name: attr.name,
                              })}
                          >
                            <FilterAltRounded className="text-[16px] mr-3" />
                            Filter
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

        <div className="table-body flex-grow text-[14px] text-gray-800">
          {paginatedData.map((item) => (
            <TableRow
              key={item.id}
              item={item}
              attrs={Object.keys(attrsByName).map(attrName => attrsByName[attrName])}
              optionsColumnWidth={optionsColumnWidth}
              onUpdate={onUpdateCell}
              onExchangeItems={onExchangeItems} />
          ))}
        </div>
      </div>

      <div className="table-footer flex items-center justify-between text-[#023e8a]">
        <AddRounded className={` cursor-pointer text-[20px]`}
          onClick={onCreateItem} />
        <div className="pagination-controls flex items-center justify-end">
          <NavigateBeforeRounded
            className="hover:cursor-pointer"
            onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : currentPage)}
          />
          <span className="pagination-info">
            {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, processedData.length)} of {processedData.length}
          </span>

          <NavigateNextRounded
            className="hover:cursor-pointer"
            onClick={() => handlePageChange(currentPage !== totalPages ? currentPage + 1 : currentPage)}
          />
        </div>
      </div>
    </div>
  );
}
