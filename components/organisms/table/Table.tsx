'use client'

import { useEffect, useMemo } from "react";
import { initializeAttrsByName, sortData, updateFilter } from "./functions.ts";
import useMediaQuery from "@hooks/useMediaQuery";
import { createFactory } from "@functions/objects";

import { AddIcon, NavigateNextIcon, NavigateBeforeIcon, LastPageIcon, FirstPageIcon } from "@public/icons/index.ts";

import TableHeaderGroup from "./table-header-group/TableHeaderGroup.tsx";
import TableBody from "./table-body/TableBody.tsx";
import TableExtension from "./table-extension/TableExtension.tsx";
import TableCell from "./table-body/table-row/table-cell/TableCell.tsx";

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

  const isMobileDevice = useMediaQuery("only screen and (max-width : 768px)");

  const factory: Factory<TableProps> = createFactory(() => {
    const storeProps = localStorage.getItem('tableProps')
    if (storeProps) return JSON.parse(storeProps) as TableProps
    return {
      name: name,
      itemsPerPage: 10,
      currentPage: 1,
      upToDate: upToDate,
      searchString: "",
      attrsByName: initializeAttrsByName(attrs, data),
      style: { cellMinWidth: 100, optionsColumnWidth: 75 },
      menu: null
    } as TableProps
  })

  const processedData = useMemo(() => {
    let processedData = data
      // Filter
      .filter(item => (
        Object.values(factory.attrsByName)
          .every((attr) =>
          (
            attr.filter.enabled === false
            || item[attr.name].length === 0
            || Object.entries(attr.filter.predicates).every(([predName, candidates]) => {
              if (predName === 'is' && attr.type === 'multiselect') {
                if (candidates === undefined || candidates.length === 0) return true;

                // Ensure item[attrName] exists and is an array before checking
                if (Array.isArray(item[attr.name])) {
                  // Return true if any value in item[attrName] is included in candidates
                  return item[attr.name].some((value: string) => candidates.includes(value));
                }

                // If item[attrName] is not an array, return false
                return false;
              }

              if (predName === 'contains' && attr.type === 'text') {
                const value = item[attr.name] as string
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

  const totalPages = useMemo(() => {
    return Math.ceil(processedData.length / factory.itemsPerPage)
  }, [processedData, factory.itemsPerPage])


  const paginatedData = useMemo(() => {
    const startIndex = (factory.currentPage - 1) * factory.itemsPerPage
    const endIndex = Math.min(startIndex + factory.itemsPerPage, processedData.length);
    return processedData.slice(startIndex, endIndex)
  }, [processedData, factory.itemsPerPage, factory.currentPage])

  // Effects
  useEffect(() => {
    //Store attrsByName every time it changes
    localStorage.setItem('tableProps', JSON.stringify(factory.get()));
  }, [factory])

  useEffect(() => {
    // Refetch suggestions every time data changes
    factory.setAttrsByName(() => {
      let newAttrsByName = { ...factory.attrsByName }
      Object.values(factory.attrsByName).filter(attr => attr.type !== 'text').forEach(attr => {
        newAttrsByName[attr.name].suggestions =
          Array.from(new Set(data.flatMap(item => attr.referencing
            ? item[attr.referencing]
            : item[attr.name])))
            .sort()
      })
      return newAttrsByName
    })
  }, [data])

  return (
    <div className="table">
      <TableExtension
        factory={factory}
        data={data}
      />
      {paginatedData.length > 0 ?
        (isMobileDevice
          ?
          <div className="mt-3">
            {paginatedData.map(item => {
              return (
                <div key={item.id}>
                  <div className="rounded-md border-2 border-gray-300">
                    {Object.entries(item).map(([key, value], index) => (
                      <div className={`grid grid-cols-[70px,1fr] 
                          ${index < Object.keys(item).length - 1 && "border-b-2"} border-b-gray-300`}
                        key={key}>
                        <div className="p-2 border-r-2 border-r-gray-300">
                          {factory.attrsByName[key].display}
                        </div>
                        <TableCell
                          itemId={item.id}
                          attr={factory.attrsByName[key]}
                          onUpdate={(item) => {
                            onUpdateCell(item)
                          }}
                          value={value}
                          suggestions={factory.attrsByName[key].suggestions}
                        />
                      </div>
                    ))}
                  </div>

                  <br />
                </div>
              )
            })}
          </div>
          :
          <div className="table-container flex flex-col relative">
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
          </div>)
        :
        <div className="text-center italic"> No item found </div>
      }

      <div className="table-footer flex items-center justify-between text-[#023e8a]">
        <div className="flex items-center rounded-md hover:bg-[#f0f0f0] py-1 px-2 cursor-pointer"
          onClick={() => {
            onCreateItem()
            factory.setSearchString("")
            factory.setCurrentPage(totalPages)
          }}>
          <AddIcon className={`icon`} />
          <span> New </span>
        </div>

        <div className="pagination-controls flex items-center justify-end">
          <FirstPageIcon
            className="icon"
            opacity={factory.currentPage > 1 ? 1 : 0.6}
            onClick={() => factory.currentPage > 1 && factory.setCurrentPage(1)}
          />
          <NavigateBeforeIcon
            className="icon"
            opacity={factory.currentPage > 1 ? 1 : 0.6}
            onClick={() => factory.currentPage > 1 && factory.setCurrentPage(factory.currentPage - 1)}
          />
          <span className="pagination-info">
            {(factory.currentPage - 1) * factory.itemsPerPage + 1} - {Math.min(factory.currentPage * factory.itemsPerPage, processedData.length)} of {processedData.length}
          </span>
          <NavigateNextIcon
            className="icon"
            opacity={factory.currentPage < totalPages ? 1 : 0.6}
            onClick={() => factory.currentPage < totalPages && factory.setCurrentPage(factory.currentPage + 1)}
          />
          <LastPageIcon
            className="icon"
            opacity={factory.currentPage < totalPages ? 1 : 0.6}
            onClick={() => factory.currentPage < totalPages && factory.setCurrentPage(totalPages)}
          />
        </div>
      </div>
    </div>
  )
}
