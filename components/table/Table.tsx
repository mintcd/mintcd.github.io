'use client'

import { useState, useEffect, useMemo } from "react";
import { useClickAway } from "@uidotdev/usehooks";
import './table.css'
import { filterData, initializeAttrsByName, sortData, updateFilter } from "./functions.ts";
import { exportToCSV, exportToJSON } from "@functions/document"

import { Dropdown } from "@components/molecules";
import { Checkbox } from "@components/atoms";
import TableRow from "./table-row/TableRow";

import {
  AddRounded, NavigateNextRounded,
  NavigateBeforeRounded, ViewColumnRounded,
  FilterAltRounded, Download,
  SettingsRounded,
} from '@mui/icons-material';
import TableHeaderGroup from "./table-header-group/TableHeaderGroup.tsx";
import { filterObject } from "@functions/array.ts";

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
  const itemsPerPage = 10;
  const style = { cellMinWidth: 100, optionsColumnWidth: 75 }

  // States
  // Convert attrs to object for better retrieval
  const [attrsByName, setAttrsByName] = useState(() => {
    const storedAttrsByName = localStorage.getItem('attrsByName')
    if (storedAttrsByName) return JSON.parse(storedAttrsByName) as { [key: string]: AttrProps }
    return initializeAttrsByName(attrs, data)
  })

  const [currentPage, setCurrentPage] = useState(1);
  const [processedData, setProcessedData] = useState(data)
  const [menu, setMenu] = useState<MenuState>("")

  const menuRef = useClickAway(() => {
    setMenu("")
  }) as any

  // Derived values
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = processedData.slice(startIndex, endIndex);
  const totalPages = useMemo(() => {
    return Math.ceil(processedData.length / itemsPerPage);
  }, [processedData]);

  // Handlers
  function handleFilter(action: FilterAction) {
    menu !== "filter" && setMenu("filter")
    const updatedAttrsByName = updateFilter(attrsByName, action)
    // Enable the filter
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
    localStorage.setItem('attrsByName', JSON.stringify(attrsByName));
    let processedData = filterData(data, attrsByName)

    // Apply sorting
    Object.values(attrsByName).forEach(prop => {
      processedData = sortData(processedData, prop.name, prop.sort)
    })

    setProcessedData(processedData);

  }, [data, attrsByName]);

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
                        const candidates = Object.values(attrsByName[attrName]['filter']).flat()
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
        <TableHeaderGroup
          attrsByName={filterObject(attrsByName, (_, value) => value.newWindow === false)}
          setAttrsByName={setAttrsByName}
          style={style} />

        <div className="table-body flex-grow text-[14px] text-gray-800">
          {paginatedData.map((item) => (
            <TableRow
              key={item.id}
              item={item}
              attrs={Object.keys(attrsByName).map(attrName => attrsByName[attrName])}
              style={style}
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
