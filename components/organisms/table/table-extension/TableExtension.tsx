import { useState } from "react";
import { useClickAway } from "@uidotdev/usehooks";
import { updateFilter } from "../functions";

import { FaAngleDown } from "react-icons/fa";
import { HiMiniViewColumns } from "react-icons/hi2";
import { MdFilterAlt } from "react-icons/md";
import { IoMdSettings, IoMdDownload, IoIosSearch, IoIosClose } from "react-icons/io";

import { Dropdown } from "@components/molecules";
import { Checkbox, TextField } from "@components/nuclears";
import Autocomplete from "@components/molecules/autocomplete/Autocomplete";
import Latex from "@components/atoms/latex";
import { exportToCSV, exportToJSON } from "@functions/document.ts";

export default function TableExtension({
  factory,
  data,
  options = {
    filter: true,
    pagination: true,
    columnVisibility: true,
    download: true,
    search: true,
  }
}: {
  factory: Factory<TableProps>,
  data: DataItem[],
  options?: {
    filter?: boolean,
    pagination?: boolean,
    columnVisibility?: boolean,
    download?: boolean,
    search?: boolean,
  }
}) {

  const [searchValue, setSearchValue] = useState("")

  const menuRef = useClickAway(() => factory.set('menu', undefined)) as any

  function handleDeleteFilter(attr: AttrProps) {
    console.log(attr)
    factory.set('attrsByName', {
      ...factory.attrsByName,
      [attr.name]: {
        ...attr,
        filter: {
          enabled: false,
          predicates: {
            contained: "",
            is: [],
          }
        }
      }
    })
  }

  function handleFilter(action: FilterAction) {
    factory.menu !== "filter" && factory.set("menu", "filter")
    factory.set('attrsByName', updateFilter(factory.attrsByName, action))
  }

  function handleSearch(searchString: string) {
    factory.set('searchString', searchString)
    factory.set("currentPage", 1)
  }

  function handlePagination(itemsPerPage: number) {
    factory.set('itemsPerPage', itemsPerPage)
    factory.set('currentPage', 1)
  }

  function handleColumnVisibility(columnName: string) {
    const newAttrsByName = { ...factory.attrsByName }
    newAttrsByName[columnName] = { ...newAttrsByName[columnName], hidden: !factory.attrsByName[columnName].hidden }
    factory.set('attrsByName', newAttrsByName)
  }

  function handleDownload(fileType: 'json' | 'csv') {
    fileType === 'json' ? exportToJSON(data ?? [], factory.name)
      : exportToCSV(Object.keys(factory.attrsByName), data ?? [], factory.name)
  }

  return (
    <div className="table-extension flex justify-between">
      <span className="sync-state italic flex items-center w-[150px]">
        {factory.upToDate ? "All changes saved." : "Processing..."}
      </span>

      {
        options.search &&
        <div className="search-box border border-gray-700 h-auto py-1 px-2 rounded-full flex items-center">
          <IoIosSearch className="icon" />
          <Autocomplete
            value={searchValue}
            suggestions={data.map(item => item.name)}
            onSubmit={(value) => {
              console.log(value)
              setSearchValue(value)
              handleSearch(value)
            }}
            addable={false}
            style={{ width: 150, height: 21 }}
            maxDisplay={5}
            renderSuggestion={(suggestion) => <Latex>{String(suggestion)}</Latex>}
            renderDropper={(value) => <Latex style={{ width: 150, height: 21 }}>{String(value)}</Latex>}
          />
        </div>
      }

      <div className="table-menu"
        ref={menuRef}
      >
        <div className="table-menu-icons flex space-x-3">
          {options.columnVisibility && <HiMiniViewColumns
            className="icon"
            onClick={() => factory.set("menu", factory.menu === "columnVisibility" ? undefined : "columnVisibility")}
          />}
          {options.filter && <MdFilterAlt className="icon"
            onClick={() => factory.set("menu", factory.menu === "filter" ? undefined : "filter")} />}
          {options.pagination && <IoMdSettings className="icon"
            onClick={() => factory.set("menu", factory.menu === "settings" ? undefined : "settings")}
          />}
          {options.download && <IoMdDownload className="icon"
            onClick={() => factory.set("menu", factory.menu === "download" ? undefined : "download")}
          />}
        </div>

        <div className="menu absolute top-[120px] right-[40px] z-10 bg-white border border-gray-300 rounded-md">
          {factory.menu === 'columnVisibility' &&
            <div className="column-visibility-menu p-4 w-48 shadow-lg space-y-2">
              {Object.values(factory.attrsByName).map(attr => (
                !attr.newWindow &&
                <div key={attr.name} className="flex justify-between items-center">
                  <span className="text-gray-800">{factory.attrsByName[attr.name].display}</span>
                  <Checkbox
                    checked={!factory.attrsByName[attr.name].hidden}
                    onChange={() => handleColumnVisibility(attr.name)}
                  />
                </div>
              ))
              }
            </div>
          }
          {factory.menu === 'download' &&
            <div className="p-4 w-48 shadow-lg space-y-2">
              <button onClick={() => handleDownload('csv')} >Export to CSV</button>
              <button onClick={() => handleDownload('json')} >Export to JSON</button>
            </div>
          }
          {factory.menu === 'filter' &&
            <div className="filter flex p-4 w-[500px] space-x-2">
              {Object.values(factory.attrsByName).every(attr => attr.filter.enabled === false)
                ? <span className="italic">
                  No filter applied
                </span>
                : Object.values(factory.attrsByName)
                  .filter(attr => factory.attrsByName[attr.name].filter.enabled)
                  .map((attr) => (
                    <Dropdown
                      key={attr.name}
                      toggler={
                        <span className=" bg-slate-300 rounded-full py-[2px] px-[8px] flex items-center justify-between">
                          <span>
                            {factory.attrsByName[attr.name].display}
                            {function () {
                              const candidates = Object.entries(factory.attrsByName[attr.name].filter.predicates)
                                .flatMap(([_, candidates]) => {
                                  if (candidates.length === 0) return []
                                  return candidates
                                })
                              return candidates.length > 0 ? ": " + candidates.join(", ") : ""
                            }()}
                          </span>

                          <FaAngleDown fontSize={14} />
                        </span>
                      }
                      content={
                        <div className="filter-options">
                          {
                            factory.attrsByName[attr.name].type === 'multiselect' &&
                            <div className="p-2">
                              <div className="flex items-center justify-between">
                                <span>
                                  {factory.attrsByName[attr.name].display} <span className="italic"> is</span>
                                </span>
                                <IoIosClose fontSize={20} cursor="pointer" onClick={() => handleDeleteFilter(attr)} />
                              </div>

                              {factory.attrsByName[attr.name].suggestions?.map(suggestion => (
                                <div key={suggestion} className="w-[200px]">
                                  <Checkbox checked={Boolean(factory.attrsByName[attr.name].filter.predicates.is?.includes(suggestion))}
                                    onChange={() => handleFilter({
                                      name: attr.name,
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
                            factory.attrsByName[attr.name].type === 'text' &&
                            <div className="p-2 w-[200px]">
                              <div className="flex items-center justify-between">
                                <span>
                                  {factory.attrsByName[attr.name].display} <span className="italic"> contains</span>
                                </span>
                                <IoIosClose fontSize={14} />
                              </div>

                              <TextField
                                value={factory.attrsByName[attr.name].filter.predicates.contains || ""}
                                onUpdate={(value) => {
                                  handleFilter({
                                    name: attr.name,
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
          {factory.menu === 'settings' && handlePagination &&
            <div className="p-4 w-48 bg-white border border-gray-300 shadow-lg flex justify-between">
              <div className="whitespace-nowrap">
                Items per page
              </div>
              <TextField
                value={String(factory.itemsPerPage)}
                onUpdate={(value) => handlePagination(parseInt(value) || factory.itemsPerPage)}
                style={{ width: 20, border: '#4672b0' }}
              />
            </div>
          }
        </div>
      </div>
    </div>
  )
}