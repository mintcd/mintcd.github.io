'use client'

import { useState, useEffect, useMemo, useRef } from "react";
import { useClickAway } from "@uidotdev/usehooks";
import './table.css'
import { filterData, initializeAttrsByName, sortData, updateFilter } from "./functions.ts";
import { exportToCSV, exportToJSON } from "@functions/document"

import { Dropdown } from "@components/molecules";
import { Checkbox, TextField } from "@components/atoms";
import TableRow from "./table-row/TableRow";

import {
  AddRounded, NavigateNextRounded,
  NavigateBeforeRounded, ViewColumnRounded,
  FilterAltRounded, Download,
  SettingsRounded,
} from '@mui/icons-material';
import TableHeaderGroup from "./table-header-group/TableHeaderGroup.tsx";
import Latex from "@components/latex/";

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
  const style = { cellMinWidth: 100, optionsColumnWidth: 75 }

  const bodyRef = useRef(null)

  // States
  // Convert attrs to object for better retrieval
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

  const menuRef = useClickAway(() => {
    setMenu(undefined)
  }) as any

  // Derived values
  const startIndex = (currentPage - 1) * tableProperties.itemsPerPage;
  const endIndex = Math.min(startIndex + tableProperties.itemsPerPage, processedData.length);
  const paginatedData = processedData.slice(startIndex, endIndex);
  const totalPages = useMemo(() => {
    return Math.ceil(processedData.length / tableProperties.itemsPerPage);
  }, [processedData]);

  // Handlers
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
    let newAttrsByName = { ...attrsByName }
    Object.values(attrsByName).forEach(attr => {
      newAttrsByName[attr.name].suggestions = Array.from(new Set(data.flatMap(item => attr.referencing
        ? item[attr.referencing]
        : item[attr.name])))
        .sort()
    })
    setAttrsByName(newAttrsByName)
  }, [data])

  useEffect(() => {
    let processedData = filterData(data, attrsByName)

    // Apply sorting
    Object.values(attrsByName).forEach(prop => {
      processedData = sortData(processedData, prop.name, prop.sort)
    })

    setProcessedData(processedData);

  }, [data, attrsByName]);

  // console.log(attrsByName)

  return (
    <div className="table-container flex flex-col shadow-md relative">

      <div className="table-extension flex justify-between h-[20px]">
        <div className="sync-state mx-[20px] italic">
          {upToDate ? "All changes saved." : "Processing..."}
        </div>

        <div className="table-menu"
          ref={menuRef}
        >
          <div className="table-menu-icons flex space-x-3">
            <ViewColumnRounded className="text-[#023e8a] text-[20px]"
              onClick={() => setMenu(menu === "column-visibility" ? undefined : "column-visibility")} />
            <Download className="text-[#023e8a] text-[20px]"
              onClick={() => setMenu(menu === "download" ? undefined : "download")} />
            <FilterAltRounded className="text-[#023e8a] text-[20px]"
              onClick={() => setMenu(menu === "filter" ? undefined : "filter")} />
            <SettingsRounded className="text-[#023e8a] text-[20px] mr-2"
              onClick={() => setMenu(menu === "settings" ? undefined : "settings")}
            />
          </div>

          <div className="table-menu-dropdown absolute top-[20px] right-0 z-10 bg-white border border-gray-300"
          >
            {menu === 'column-visibility' &&
              <div className="column-visibility-menu p-4 w-48 shadow-lg space-y-2">
                {Object.values(attrsByName).map(attr => (
                  !attr.newWindow &&
                  <div key={attr.name} className="flex justify-between items-center">
                    <span className="text-gray-800">{attrsByName[attr.name].display}</span>
                    <Checkbox
                      checked={!attrsByName[attr.name].hidden}
                      onChange={() => handleColumnAppearance(attr.name)}
                    />
                  </div>
                ))
                }
              </div>
            }
            {menu === 'download' &&
              <div className="p-4 w-48 shadow-lg space-y-2">
                <button onClick={() => exportToCSV(Object.keys(attrs), data, name)} >Export to CSV</button>
                <button onClick={() => exportToJSON(data, name)} >Export to JSON</button>
              </div>
            }
            {menu === 'filter' &&
              <div className="table-filter flex p-4 shadow-lg w-[500px] space-x-2">
                {Object.keys(attrsByName)
                  .filter(attrName => attrsByName[attrName]['filterEnabled'])
                  .map((attrName) => (
                    <Dropdown
                      key={attrName}
                      toggleButton={
                        <span className=" bg-slate-300 rounded-full py-[2px] px-[8px]">
                          {attrsByName[attrName].display}
                          {function () {
                            const candidates = Object.entries(attrsByName[attrName].filter)
                              .flatMap(([_, candidates]) => {
                                if (candidates.length === 0) return []
                                return candidates
                              })
                            return candidates.length > 0 ? ": " + candidates.join(", ") : ""
                          }()}
                        </span>
                      }
                      content={
                        <div className="filter-options">
                          {
                            attrsByName[attrName].type === 'multiselect' &&
                            <div className="p-2">
                              {attrsByName[attrName].display} <span className="italic"> is</span>
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
                          {
                            attrsByName[attrName].type === 'text' &&
                            <div className="p-2 w-[200px]">
                              {attrsByName[attrName].display} <span className="italic"> contains</span>
                              <TextField
                                type='text'
                                value={attrsByName[attrName].filter['contains'] || ""}
                                onUpdate={(value) => {
                                  handleFilter({
                                    name: attrName,
                                    predicate: "contains",
                                    candidate: value
                                  })
                                }}
                                style={{ border: '#4672b0' }}
                              />
                            </div>
                          }
                        </div>
                      }
                    />
                  ))}

              </div>
            }
            {menu === 'settings' &&
              <div className="p-4 w-48 bg-white border border-gray-300 shadow-lg flex justify-between">
                <div className="whitespace-nowrap">
                  Items per page
                </div>
                <TextField
                  type='text'
                  value={String(tableProperties.itemsPerPage)}
                  onUpdate={(value) => setTableProperties({
                    ...tableProperties,
                    itemsPerPage: function () {
                      const parsedValue = parseInt(value)
                      if (typeof parsedValue === 'number' && parsedValue > 0) {
                        return parsedValue
                      }
                      return tableProperties.itemsPerPage
                    }()
                  })}
                  style={{ width: 20, border: '#4672b0' }}
                />
              </div>
            }
          </div>
        </div>
      </div>

      <div className="table-content">
        <TableHeaderGroup
          attrsByName={attrsByName}
          setAttrsByName={setAttrsByName}
          style={style}
          setMenu={() => setMenu('filter')}
        />

        <div className="table-body flex-grow text-gray-800" ref={bodyRef}>
          {paginatedData.map((item) => (
            <TableRow
              key={item.id}
              item={item}
              attrsByName={attrsByName}
              style={style}
              onUpdate={onUpdateCell}
              onExchangeItems={onExchangeItems}

            />
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
            {(currentPage - 1) * tableProperties.itemsPerPage + 1} - {Math.min(currentPage * tableProperties.itemsPerPage, processedData.length)} of {processedData.length}
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
