import { useState } from "react";
import { useClickAway } from "@uidotdev/usehooks";
import {
  ViewColumnRounded,
  FilterAltRounded, Download,
  SettingsRounded, FormatListBulletedRounded
} from '@mui/icons-material';
import { Dropdown } from "@components/molecules";
import { Checkbox, TextField } from "@components/atoms";

export default function TableExtension({ upToDate, attrsByName, handleDownload, tableProperties, handleColumnAppearance, handleFilter, handlePagination }: {
  upToDate?: boolean,
  attrsByName: AttrsByName,
  tableProperties: TableProperties,
  setTableProperties: (newTableProperties: TableProperties) => void,
  handleDownload: (fileType: 'json' | 'csv') => void,
  handleColumnAppearance: (columnName: string) => void,
  handleFilter: (action: FilterAction) => void,
  handlePagination: (itemsPerPage: number) => void
}) {
  const [menu, setMenu] = useState<MenuState>(undefined)

  const menuRef = useClickAway(() => {
    setMenu(undefined)
  }) as any


  return (
    <div className="table-extension flex justify-between h-[20px]">
      <div className="sync-state mx-[20px] italic">
        {upToDate ? "All changes saved." : "Processing..."}
      </div>

      <div className="table-menu"
        ref={menuRef}
      >
        <div className="table-menu-icons flex space-x-3">
          <ViewColumnRounded className="icon"
            onClick={() => setMenu(menu === "column-visibility" ? undefined : "column-visibility")} />
          <FormatListBulletedRounded className="icon" />
          <FilterAltRounded className="icon"
            onClick={() => setMenu(menu === "filter" ? undefined : "filter")} />
          <SettingsRounded className="icon"
            onClick={() => setMenu(menu === "settings" ? undefined : "settings")}
          />
          <Download className="icon"
            onClick={() => setMenu(menu === "download" ? undefined : "download")} />
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
              <button onClick={() => handleDownload('csv')} >Export to CSV</button>
              <button onClick={() => handleDownload('json')} >Export to JSON</button>
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
                onUpdate={(value) => handlePagination(parseInt(value) || tableProperties.itemsPerPage)}
                style={{ width: 20, border: '#4672b0' }}
              />
            </div>
          }
        </div>
      </div>
    </div>
  )
}