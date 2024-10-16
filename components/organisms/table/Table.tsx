'use client'

import { useState, useEffect, useMemo, useRef } from "react";
import { filterData, initializeAttrsByName, sortData, updateFilter } from "./functions.ts";
import { useMediaQuery } from "@uidotdev/usehooks";


import {
  AddRounded, NavigateNextRounded,
  NavigateBeforeRounded,
  Dvr
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
  const isMobileDevice = useMediaQuery("only screen and (max-width : 768px)");

  // States
  const [attrsByName, setAttrsByName] = useState(() => {
    const storedAttrsByName = localStorage.getItem('attrsByName')
    if (storedAttrsByName) return JSON.parse(storedAttrsByName) as { [key: string]: AttrProps }
    return initializeAttrsByName(attrs, data)
  })
  const [searchString, setSearchString] = useState<string>("")
  const [tableProperties, setTableProperties] = useState<TableProperties>({
    itemsPerPage: 10,
    currentPage: 1
  })
  const [menu, setMenu] = useState<MenuState>(undefined)

  // Dependent values

  const processedDesktopData = useMemo(() => {
    let processedData = filterData(data, attrsByName)
    // Apply sorting
    Object.values(attrsByName).forEach(prop => {
      processedData = sortData(processedData, prop.name, prop.sort)
    })
    return processedData
  }, [data, attrsByName])

  const processedMobileData = useMemo(() => data.filter(item => item.name === searchString), [searchString, data])
  const startIndex = (tableProperties.currentPage - 1) * tableProperties.itemsPerPage;
  const endIndex = Math.min(startIndex + tableProperties.itemsPerPage, processedDesktopData.length);
  const paginatedData = processedDesktopData.slice(startIndex, endIndex);
  const totalPages = useMemo(() => {
    return Math.ceil(processedDesktopData.length / tableProperties.itemsPerPage);
  }, [processedDesktopData, tableProperties.itemsPerPage]);

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
    menu !== "filter" && setMenu("filter")
    const updatedAttrsByName = updateFilter(attrsByName, action)
    // Enable the filter
    setAttrsByName(updatedAttrsByName)
    setTableProperties(prev => ({ ...prev, currentPage: 1 }))
  }

  function handleColumnAppearance(columnName: string) {
    const newAttrsByName = { ...attrsByName }
    newAttrsByName[columnName] = { ...newAttrsByName[columnName], hidden: !attrsByName[columnName].hidden }
    setAttrsByName(newAttrsByName)
  }

  function handleDownload(fileType: 'json' | 'csv') {
    fileType === 'json' ? exportToJSON(data, name) : exportToCSV(Object.keys(attrsByName), data, name)
  }

  const handlePageChange = (direction: 'back' | 'next') => {
    if (direction === 'back' && tableProperties.currentPage > 1) {
      setTableProperties(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))
    }

    if (direction === 'next' && tableProperties.currentPage < totalPages) {
      setTableProperties(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))
    }
  };

  // Effects
  useEffect(() => {
    setTableProperties((prev) => ({ ...prev, currentPage: 1 }))
  }, [tableProperties.itemsPerPage])

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
          {processedMobileData.length > 0 ?
            Object.entries(processedMobileData[0]).map(([key, value]) => (
              <div className="grid grid-cols-[70px,1fr] border-b border-b-gray-300 rounded-md"
                key={key}>
                <div className="p-2 border-r border-r-gray-300">
                  {attrsByName[key].display}
                </div>
                <TableCell
                  itemId={processedMobileData[0].id}
                  attr={attrsByName[key]}
                  onUpdate={(item) => {
                    onUpdateCell(item)
                    if (key === 'name') setSearchString(item.attrValue.name)
                  }}
                  value={value}
                  suggestions={attrsByName[key].suggestions}
                />
              </div>
            )) :
            <div className="text-center italic"> No item found </div>
          }
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
            onClick={() => {
              onCreateItem()
              setSearchString("")
            }}>
            <AddRounded className={`icon`} />
            <span>New </span>
          </div>

          <div className="pagination-controls flex items-center justify-end">
            <NavigateBeforeRounded
              className="icon"
              onClick={() => handlePageChange('back')}
            />
            <span className="pagination-info">
              {(tableProperties.currentPage - 1) * tableProperties.itemsPerPage + 1} - {Math.min(tableProperties.currentPage * tableProperties.itemsPerPage, processedDesktopData.length)} of {processedDesktopData.length}
            </span>
            <NavigateNextRounded
              className="icon"
              onClick={() => handlePageChange('next')}
            />
          </div>
        </div>
      </div>
  );
}
