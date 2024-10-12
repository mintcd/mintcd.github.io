'use client'

import { useState, useEffect, useMemo, useRef } from "react";
import './table.css'
import { filterData, initializeAttrsByName, sortData, updateFilter } from "./functions.ts";
import { useMediaQuery } from "@uidotdev/usehooks";


import {
  AddRounded, NavigateNextRounded,
  NavigateBeforeRounded
} from '@mui/icons-material';
import TableHeaderGroup from "./table-header-group/TableHeaderGroup.tsx";
import TableBody from "./table-body/TableBody.tsx";
import TableExtension from "./table-extension/TableExtension.tsx";
import { exportToCSV, exportToJSON } from "@functions/document.ts";
import TableCell from "./table-body/table-row/table-cell/TableCell.tsx";

export default function Table({ name, upToDate, data, attrs, onUpdateCell, onCreateItem, onReorder }:
  {
    name: string,
    upToDate?: boolean,
    data: DataItem[],
    attrs: AttrProps[],
    onUpdateCell: (items: UpdatedItem | UpdatedItem[]) => Promise<void>,
    onCreateItem: () => void,
    onReorder: (rangedItems: DataItem[], direction: 'up' | 'down') => void,
  }) {

  // Constants
  const style = { cellMinWidth: 100, optionsColumnWidth: 75 }

  // States
  // Convert attrs to object for better retrieval
  const isMobileDevice = useMediaQuery("only screen and (max-width : 768px)");

  const [attrsByName, setAttrsByName] = useState(() => {
    const storedAttrsByName = localStorage.getItem('attrsByName')
    if (storedAttrsByName) return JSON.parse(storedAttrsByName) as { [key: string]: AttrProps }
    return initializeAttrsByName(attrs, data)
  })

  const [tableProperties, setTableProperties] = useState<TableProperties>({
    itemsPerPage: 10
  })
  const [currentPage, setCurrentPage] = useState(1);
  const [processedData, setProcessedData] = useState(data)
  const [menu, setMenu] = useState<MenuState>(undefined)
  const [searchString, setSearchString] = useState<string | undefined>(undefined)

  // Derived values
  const startIndex = (currentPage - 1) * tableProperties.itemsPerPage;
  const endIndex = Math.min(startIndex + tableProperties.itemsPerPage, processedData.length);
  const paginatedData = processedData.slice(startIndex, endIndex);
  const totalPages = useMemo(() => {
    return Math.ceil(processedData.length / tableProperties.itemsPerPage);
  }, [processedData, tableProperties.itemsPerPage]);

  // Handlers
  function handleSearch(searchString: string) {
    setSearchString(searchString)
  }

  function handlePagination(itemsPerPage: number) {
    setTableProperties({
      ...tableProperties,
      itemsPerPage: itemsPerPage
    })
  }
  function handleFilter(action: FilterAction) {
    console.log(action)
    menu !== "filter" && setMenu("filter")
    const updatedAttrsByName = updateFilter(attrsByName, action)
    // Enable the filter
    console.log(updatedAttrsByName)
    setAttrsByName(updatedAttrsByName)
  }

  function handleColumnAppearance(columnName: string) {
    const newAttrsByName = { ...attrsByName }
    newAttrsByName[columnName] = { ...newAttrsByName[columnName], hidden: !attrsByName[columnName].hidden }
    setAttrsByName(newAttrsByName)
  }

  function handleDownload(fileType: 'json' | 'csv') {
    fileType === 'json' ? exportToJSON(data, name) : exportToCSV(Object.keys(attrsByName), data, name)
  }

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Effects
  useEffect(() => {
    //Store attrsByName every time it changes
    localStorage.setItem('attrsByName', JSON.stringify(attrsByName));
  }, [attrsByName])

  useEffect(() => {
    // Refetch suggestions every time data changes
    setAttrsByName(attrsByName => {
      let newAttrsByName = { ...attrsByName }
      Object.values(attrsByName).forEach(attr => {
        newAttrsByName[attr.name].suggestions = Array.from(new Set(data.flatMap(item => attr.referencing
          ? item[attr.referencing]
          : item[attr.name])))
          .sort()
      })
      return newAttrsByName
    })
  }, [data])

  useEffect(() => {
    let processedData = filterData(data, attrsByName)

    if (searchString !== undefined)
      processedData = processedData.filter(item => item.name === searchString)

    console.log(processedData)

    // Apply sorting
    Object.values(attrsByName).forEach(prop => {
      processedData = sortData(processedData, prop.name, prop.sort)
    })

    setProcessedData(processedData);

  }, [data, attrsByName, searchString]);

  return (
    isMobileDevice
      ?
      <div>
        <TableExtension
          upToDate={upToDate}
          attrsByName={attrsByName}
          tableProperties={tableProperties}
          handleSearch={handleSearch}
        />
        <div>
          {Object.entries(processedData[0]).map(([key, value]) => (
            <div className="grid grid-cols-[55px,1fr] border-b border-b-gray-300"
              key={key}>
              <div className="p-2">
                {attrsByName[key].display}
              </div>
              <TableCell
                itemId={processedData[0].id}
                attr={attrsByName[key]}
                onUpdate={onUpdateCell}
                value={value}
              />
            </div>
          ))}
        </div>
        <div className="flex items-center rounded-md hover:bg-[#f0f0f0] py-1 px-2 cursor-pointer"
          onClick={onCreateItem}>
          <AddRounded className={`icon`} />
          <span>New </span>
        </div>

      </div>
      :
      <div className="table-container flex flex-col relative">
        <TableExtension
          upToDate={upToDate}
          attrsByName={attrsByName}
          handleDownload={handleDownload}
          handleColumnAppearance={handleColumnAppearance}
          handleFilter={handleFilter}
          tableProperties={tableProperties}
          handlePagination={handlePagination}
        // handleSearch={handleSearch}
        />

        <div className="table-content rounded-md shadow-md">
          <TableHeaderGroup
            attrsByName={attrsByName}
            setAttrsByName={setAttrsByName}
            style={style}
            setMenu={() => setMenu('filter')}
          />

          <TableBody
            paginatedData={paginatedData}
            attrsByName={attrsByName}
            onUpdateCell={onUpdateCell}
            style={style}
            onReorder={onReorder}
          />
        </div>

        <div className="table-footer flex items-center justify-between text-[#023e8a]">
          <div className="flex items-center rounded-md hover:bg-[#f0f0f0] py-1 px-2 cursor-pointer"
            onClick={onCreateItem}>
            <AddRounded className={`icon`} />
            <span>New </span>
          </div>

          <div className="pagination-controls flex items-center justify-end">
            <NavigateBeforeRounded
              className="icon"
              onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : currentPage)}
            />
            <span className="pagination-info">
              {(currentPage - 1) * tableProperties.itemsPerPage + 1} - {Math.min(currentPage * tableProperties.itemsPerPage, processedData.length)} of {processedData.length}
            </span>
            <NavigateNextRounded
              className="icon"
              onClick={() => handlePageChange(currentPage !== totalPages ? currentPage + 1 : currentPage)}
            />
          </div>
        </div>
      </div>
  );
}
