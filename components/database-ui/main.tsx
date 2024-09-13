'use client'

import { update, fetchData, initiateAttrProps, createItem } from "@components/database-ui/functions";
import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useEffect, useState, useCallback, useMemo } from 'react';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import "./styles.css";
import UndoRoundedIcon from '@mui/icons-material/UndoRounded';
import RedoRoundedIcon from '@mui/icons-material/RedoRounded';

import ArrayCell from "./array-cell";
import TextCell from "./text-cell";

type Cell = {
  id: number
  attr: string
  content: number | string | string[]
  [key: string]: any;
}

export default function DatabaseUI({ table, columns }: { table: string; columns?: AttrProps }) {
  const [data, setData] = useState<DataItem[]>([]);
  const [attrProps, setAttrProps] = useState<AttrProps>({});
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>({});
  const [authorized, setAuthorized] = useState(false);

  async function handleCreate() {
    await createItem(table, data, attrProps).then((createdItem) => {
      console.log([...data, createdItem])
      setData([...data, createdItem])
    })
  }

  const handleUpdate = useCallback(async (itemId: number, attrProps: JsonObject<any>) => {
    if (!authorized) return;
    await update(table, itemId, attrProps);

  }, [authorized, table]);

  // Save column width to localStorage on resize
  const handleColumnResize = useCallback((newWidth: number | undefined, colId: string) => {
    const updatedWidths = { ...columnWidths, [colId]: newWidth || 150 };
    setColumnWidths(updatedWidths);
    localStorage.setItem(`${table}-columnWidths`, JSON.stringify(updatedWidths));
  }, [columnWidths, table]);

  useEffect(() => {
    if (window.localStorage.getItem("timeKeyGot")) setAuthorized(true);
    const savedColumnWidths = JSON.parse(localStorage.getItem(`${table}-columnWidths`) || '{}');
    setColumnWidths(savedColumnWidths);

    fetchData({ table: table, attrs: columns ? Object.keys(columns) : undefined })
      .then((data) => {
        console.log(data)
        const attrProps = initiateAttrProps(data, columns);
        setData(data);
        setAttrProps(attrProps);
      });
  }, [table, columns]);

  return (
    <div>
      {Object.keys(attrProps).length === 0 ? (
        <p>Loading...</p>
      ) : (
        <Paper sx={{ display: 'flex', flexDirection: 'column', width: 'auto' }}>
          <DataGrid
            sx={{
              flex: 1,
              border: 0,
              '& .MuiDataGrid-row:hover': {
                backgroundColor: 'inherit',
              },
              '& .MuiDataGrid-cell': {
                paddingLeft: 0,
                paddingRight: 0,
                display: 'flex'
              }
            }}
            rows={data}
            getRowHeight={() => 'auto'}
            columns={Object.keys(attrProps).map((col) => ({
              field: col,
              headerName: col[0].toUpperCase() + col.slice(1),
              width: columnWidths[col],
              renderCell: (params) => {
                const attr = col;
                const itemId = params.row.id;
                const value = params.value;

                return (
                  <div className="hover:bg-blue-50 h-full w-full">
                    {
                      attrProps[attr].type === 'array' ?
                        <ArrayCell
                          itemId={itemId}
                          attr={attr}
                          values={value}
                          state="noEdit"
                          autocompleteItems={
                            attrProps[attr].referencing !== undefined
                              ? [...new Set(data.map((item) => item[attrProps[attr].referencing as string]))]
                              : [...new Set(data.flatMap((item) => item[attr]))]
                          }
                          handleUpdate={handleUpdate}
                        />
                        :
                        <TextCell
                          itemId={itemId}
                          attr={attr}
                          value={value}
                          state="noEdit"
                          handleUpdate={handleUpdate}
                        />
                    }
                  </div>
                )


              },
            }))}

            disableRowSelectionOnClick
            checkboxSelection={false}

            initialState={{ pagination: { paginationModel: { page: 0, pageSize: 20 } } }}
            onColumnWidthChange={(params) => {
              const { field, width } = params.colDef;
              handleColumnResize(width, field);
            }}
          />
          <AddRoundedIcon sx={{ fontSize: 25, cursor: 'pointer' }} onClick={handleCreate} />
        </Paper>
      )}
    </div>
  );
}
