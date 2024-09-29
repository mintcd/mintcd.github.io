'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import './table.css'

import { getTextWidth, capitalizeFirstLetter } from "@functions/text-analysis";
import { sortData } from "@functions/database";
import { exportToCSV, exportToJSON } from "@functions/document"

import ColumnSeparator from "./ColumnSeparator";
import MenuIcon from "./MenuIcon";
import DropDown from "@components/DropDown";
import Autocomplete from "@components/autocomplete/Autocomplete";
import Checkbox from "@components/checkbox/Checkbox";
import TableRow from "./table-row/TableRow";

import {
  AddRounded, SearchRounded, NavigateNextRounded,
  NavigateBeforeRounded, ViewColumnRounded, ArrowDownwardRounded,
  FilterAltRounded, Download, HorizontalRuleRounded, ArrowUpwardRounded,
  SettingsRounded, PlayArrowRounded, ClearRounded, PlayArrowOutlined
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

  // States and Refs
  const [attrsByName, setAttrsByName] = useState(() => {
    const storedAttrsByName = localStorage.getItem('attrsByName')
    if (storedAttrsByName) return JSON.parse(storedAttrsByName)

    const attrsByName: { [key: string]: AttrProps } = {}
    attrs.forEach((attr, index) => {
      attrsByName[attr.name] = {
        ...attr,
        width: Math.min(Math.max(Math.max(...data.map(item => getTextWidth(String(item[attr.name])))), 100), 200),
        order: index,
        hidden: false,
        display: capitalizeFirstLetter(attr.name),
        sort: 'none',
        suggestions: Array.from(new Set(data.flatMap(item => attr.referencing
          ? item[attr.referencing]
          : item[attr.name])))
          .sort()
      }
    })
    return attrsByName;
  })

  const [focusedHeader, setFocusedHeader] = useState(-1);
  const [currentItem, setCurrentItem] = useState<DataItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [processedData, setProcessedData] = useState(data)
  const [sorting, setSorting] = useState<{ attrName: string, direction: 'asc' | 'desc' | 'none' }>({
    attrName: '',
    direction: 'none',
  });

  const [filters, setFilters] = useState<FilterProp[]>(() => {
    const storedFilters = localStorage.getItem('filters')
    if (storedFilters) return JSON.parse(storedFilters)
    return []
  })

  const [addingFilter, setAddingFilter] = useState<FilterProp>({})
  const [filterError, setFilterError] = useState("")

  const animationFrameRef = useRef<number | null>(null);
  const resizingRef = useRef({ startX: 0, startWidth: 0, attrName: '' });

  // Derived values
  const orderedAttrs = useMemo(() => {
    return Object.keys(attrsByName)
      .map((attrName) => attrsByName[attrName])
      .filter(attr => !attr.hidden)
      .sort((x, y) => (x.order && y.order ? x.order - y.order : 0));
  }, [attrsByName]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = processedData.slice(startIndex, endIndex);
  const totalPages = useMemo(() => {
    return Math.ceil(processedData.length / itemsPerPage);
  }, [processedData]);

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
    localStorage.setItem('filters', JSON.stringify(newFilters))
  }

  function handleClearFilter(filterIndex: number) {
    const newFilters = filters.filter((_, index) => index !== filterIndex); // Remove the filter at filterIndex
    setFilters(newFilters); // Update state with the new filters array
    localStorage.setItem('filters', JSON.stringify(newFilters))
  }

  function handleApplyFilter(filterIndex: number) {
    const newFilters = [...filters]
    newFilters[filterIndex].applied = !newFilters[filterIndex].applied
    setFilters(newFilters);
    localStorage.setItem('filters', JSON.stringify(newFilters))
    setCurrentPage(1)
  }


  function handleSort(attrName: string, currentState: 'none' | 'asc' | 'desc' | undefined) {

    let nextState: 'none' | 'asc' | 'desc' = 'none';

    if (currentState === 'none') nextState = 'asc';
    else if (currentState === 'asc') nextState = 'desc';
    else if (currentState === 'desc') nextState = 'none';

    setAttrsByName({ ...attrsByName, [attrName]: { ...attrsByName[attrName], sort: nextState } });
    setSorting({ attrName, direction: nextState });

    setProcessedData(sortData(processedData, attrName, nextState));
  }

  function handleColumnAppearance(columnName: string) {
    const newAttrsByName = { ...attrsByName }
    newAttrsByName[columnName] = { ...newAttrsByName[columnName], hidden: !attrsByName[columnName].hidden }
    setAttrsByName(newAttrsByName)
    localStorage.setItem('attrsByName', JSON.stringify(newAttrsByName))
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

    localStorage.setItem('attrsByName', JSON.stringify(attrsByName));

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
  }, [data, currentItem, sorting, filters]);

  return (
    <div className="table-container flex flex-col h-[80vh] overflow-auto shadow-md">
      <div className="table-meta-header flex justify-between">
        <div className="table-option-container flex space-x-3">
          <DropDown
            key="column-visibility"
            toggleButton={<ViewColumnRounded className="text-[#023e8a] text-[20px]" />}
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
            key="download"
            toggleButton={<Download className="text-[#023e8a] text-[20px]" />}
            content={<div className="p-4 w-48 bg-white border border-gray-300 shadow-lg space-y-2">
              <button onClick={() => exportToCSV(Object.keys(orderedAttrs), data, name)} >Export to CSV</button>
              <button onClick={() => exportToJSON(data, name)} >Export to JSON</button>
            </div>
            }
          />
          <DropDown
            key="filter"
            toggleButton={<FilterAltRounded className="text-[#023e8a] text-[20px]" />}
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
                        suggestions={[...new Set(data.flatMap(item => item[filter.attrName ? filter.attrName : 0]))].sort()}
                        style={{ width: 150, marginLeft: 5 }}
                        onSubmit={(value) => handleModifyFilter(index, { option: value })}
                        maxDisplay={5}
                      />
                    </div>

                    <div >
                      {
                        filter.applied
                          ? <PlayArrowRounded onClick={() => handleApplyFilter(index)} />
                          : <PlayArrowOutlined onClick={() => handleApplyFilter(index)} />
                      }
                      <ClearRounded onClick={() => handleClearFilter(index)} />
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

                  <AddRounded onClick={() => {
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

                    const newFilters = [...filters, { ...addingFilter, applied: true }]
                    setFilters(newFilters);
                    localStorage.setItem('filters', JSON.stringify(newFilters))
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
            toggleButton={<SettingsRounded className="text-[#023e8a] text-[20px]" />}
            content={<div className="p-4 w-48 bg-white border border-gray-300 shadow-lg space-y-2">

            </div>
            }
          />

          <SearchRounded className="text-[#023e8a] text-[20px]" />


        </div>
        <div className="mx-[20px] italic">
          {upToDate ? "All changes saved." : "Processing..."}
        </div>
      </div>

      <div className="table-header-group grid text-[16px] p-1 border-b-[1px]"
        style={{
          gridTemplateColumns: [`${optionsColumnWidth}px`, ...orderedAttrs
            .map((attr) => `${attr.width}px`)]
            .join(' ')
        }}>
        <div className="options-header"></div>
        {
          orderedAttrs.filter(attr => attr.newWindow === false).map((attr, index) =>
            <div
              key={index}
              className="table-header-cell py-2 flex justify-between items-center relative"
              onMouseEnter={() => setFocusedHeader(index)}
            >
              <div className="flex-grow"
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
                    onClick={() => handleSort(attr.name, attr.sort)}
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
                  <DropDown
                    toggleButton={<MenuIcon />}
                    content={
                      <div className="absolute top-[10px] bg-white border shadow-md w-[150px]">
                        <div className="p-2 hover:bg-gray-200 w-full flex items-center justify-between">
                          Filter
                          <FilterAltRounded className="text-[16px]" />
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
            attrs={orderedAttrs}
            optionsColumnWidth={optionsColumnWidth}
            onUpdate={onUpdateCell}
            onExchangeItems={onExchangeItems} />
        ))}
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
