'use client'

import { useEffect, useMemo } from "react";
import { initializeAttrsByName, sortData, updateFilter } from "./functions.ts";
import { useMediaQuery } from "@uidotdev/usehooks";
import { createFactory } from "@functions/objects.ts";


import {
  AddRounded, NavigateNextRounded,
  NavigateBeforeRounded,
} from '@mui/icons-material';
import TableHeaderGroup from "./table-header-group/TableHeaderGroup.tsx";
import TableBody from "./table-body/TableBody.tsx";
import TableExtension from "./table-extension/TableExtension.tsx";


export default function Table({ name, upToDate, data, attrs, onUpdateCell, onCreateItem, onReorder }:
  {
    name: string,
    upToDate: boolean,
    data: DataItem[],
    attrs: AttrProps[],
    onUpdateCell: (items: UpdatedItem | UpdatedItem[]) => Promise<void>,
    onCreateItem: () => void,
    onReorder: (rangedItems: DataItem[], direction: 'up' | 'down') => void,
  }) {

  const handlePageChange = (direction: 'back' | 'next') => {
    if (direction === 'back') {
      tableProps.currentPage > 1
        ? factory.set("currentPage", factory.currentPage - 1)
        : factory.set("currentPage", totalPages)
    }

    if (direction === 'next') {
      tableProps.currentPage < totalPages
        ? factory.set("currentPage", factory.currentPage + 1)
        : factory.set("currentPage", 1)
    }
  };

  // Constants
  const isMobileDevice = useMediaQuery("only screen and (max-width : 768px)");

  // States
  const tableProps: TableProps = function () {
    const storeProps = localStorage.getItem('tableProps')
    return storeProps
      ? JSON.parse(storeProps)
      : {
        name: name,
        itemsPerPage: 10,
        currentPage: 1,
        upToDate: upToDate,
        searchString: "",
        attrsByName: initializeAttrsByName(attrs, data),
        style: { cellMinWidth: 100, optionsColumnWidth: 75 }
      }
  }()
  const factory = createFactory(tableProps)

  const processedDesktopData = useMemo(() => {
    let processedData = data
      // Filter
      .filter(item => (
        Object.entries(factory.attrsByName)
          .every(([attrName, attrProps]) =>
          (
            attrProps.filter.enabled === false
            || item[attrName].length === 0
            || Object.entries(attrProps.filter.predicates).every(([predName, candidates]) => {
              if (predName === 'is' && factory.attrsByName[attrName].type === 'multiselect') {
                if (candidates === undefined || candidates.length === 0) return true;

                // Ensure item[attrName] exists and is an array before checking
                if (Array.isArray(item[attrName])) {
                  // Return true if any value in item[attrName] is included in candidates
                  return item[attrName].some((value: string) => candidates.includes(value));
                }

                // If item[attrName] is not an array, return false
                return false;
              }

              if (predName === 'contains' && factory.attrsByName[attrName].type === 'text') {
                const value = item[attrName] as string
                const candidate = candidates as string

                return value.toLowerCase().includes(candidate.toLowerCase())
              }
              return true; // Default return true if no predicates are matched
            })
          )
          )
      ))
      // Search
      .filter(item => Object.values(factory.attrsByName).some(attr => {
        const value = item[attr.name]
        if (typeof value === 'string') {
          return value.includes(factory.searchString)
        }

        if (Array.isArray(value)) {
          return value.flatMap(x => x).includes(factory.searchString)
        }
      }))
    // Apply sorting
    Object.values(factory.attrsByName).forEach(prop => {
      processedData = sortData(processedData, prop.name, prop.sort)
    })
    return processedData
  }, [data, factory.attrsByName, factory.searchString])

  // const processedMobileData = useMemo(() => data.filter(item => item.name === searchString), [searchString, data])
  const startIndex = (tableProps.currentPage - 1) * tableProps.itemsPerPage;
  const endIndex = Math.min(startIndex + tableProps.itemsPerPage, processedDesktopData.length);
  const paginatedData = processedDesktopData.slice(startIndex, endIndex);
  const totalPages = useMemo(() => {
    return Math.ceil(processedDesktopData.length / tableProps.itemsPerPage);
  }, [processedDesktopData, tableProps.itemsPerPage]);

  // Effects
  useEffect(() => {
    factory.set('currentPage', 1)
  }, [tableProps.itemsPerPage])

  useEffect(() => {
    //Store attrsByName every time it changes
    localStorage.setItem('tableProps', JSON.stringify(tableProps));
  }, [tableProps])

  useEffect(() => {
    // Refetch suggestions every time data changes
    factory.set('attrsByName', function () {
      let newAttrsByName = { ...factory.attrsByName }
      Object.values(factory.attrsByName).forEach(attr => {
        newAttrsByName[attr.name].suggestions = Array.from(new Set(data.flatMap(item => attr.referencing
          ? item[attr.referencing]
          : item[attr.name])))
          .sort()
      })
      return newAttrsByName
    }())
  }, [data])

  return (
    isMobileDevice
      ?
      <div>
        {/* <TableExtension
          factory={factory}
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
        </div> */}

      </div>
      :
      <div className="table-container flex flex-col relative">
        <TableExtension
          factory={factory}
          data={data}
        />

        <div className="table-content rounded-md shadow-md">
          <TableHeaderGroup
            factory={factory}
          />

          <TableBody
            data={paginatedData}
            factory={factory}
            handlers={{
              updateCell: onUpdateCell,
              reorder: onReorder
            }}
          />
        </div>

        <div className="table-footer flex items-center justify-between text-[#023e8a]">
          <div className="flex items-center rounded-md hover:bg-[#f0f0f0] py-1 px-2 cursor-pointer"
            onClick={() => {
              onCreateItem()
              factory.set("searchString", "")
            }}>
            <AddRounded className={`icon`} />
            <span> New </span>
          </div>

          <div className="pagination-controls flex items-center justify-end">
            <NavigateBeforeRounded
              className="icon"
              onClick={() => handlePageChange('back')}
            />
            <span className="pagination-info">
              {(tableProps.currentPage - 1) * tableProps.itemsPerPage + 1} - {Math.min(tableProps.currentPage * tableProps.itemsPerPage, processedDesktopData.length)} of {processedDesktopData.length}
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
