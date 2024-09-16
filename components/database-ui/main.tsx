'use client'

import { updateItem, fetchData, initiateAttrProps, createItem } from "@components/database-ui/functions";
import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useEffect, useState, useCallback, useMemo } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import AddRoundedIcon from '@mui/icons-material/AddRounded';

import UndoRoundedIcon from '@mui/icons-material/UndoRounded';
import RedoRoundedIcon from '@mui/icons-material/RedoRounded';

import ArrayCell from "./array-cell";
import TextCell from "./text-cell";

import "./styles.css";

type Cell = {
  id: number
  attr: string
  content: number | string | string[]
  [key: string]: any;
}

export default function DatabaseUI({ table, columns }: { table: string; columns?: any }) {
  const [data, setData] = useState<DataItem[]>([]);
  const [attrProps, setAttrProps] = useState<any>({});
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>({});
  const [authorized, setAuthorized] = useState(false);

  async function handleCreate() {
    await createItem(table, data, attrProps).then((createdItem) => {
      setData([...data, createdItem])
    })
  }

  const handleUpdate = useCallback(async (itemId: number, attrValue: JsonObject<any>) => {
    if (!authorized) return;

    await updateItem(table, itemId, attrValue).then(() => {
      const attr = Object.keys(attrValue)[0];
      const index = data.findIndex(item => item.id === itemId); // Find the correct index based on itemId

      if (index !== -1) {
        // Create a new array with the updated item
        const updatedData = data.map((item, i) =>
          i === index ? { ...item, [attr]: attrValue[attr] } : item
        );
        setData(updatedData); // Update the state with the new array
      }
    });

  }, [authorized, data, table]);


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
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ width: '100%' }}>
          <DataGrid
            slots={{ toolbar: GridToolbar }}
            sx={{
              flex: 1,
              border: 0,
              '& .MuiDataGrid-row:hover': {
                backgroundColor: 'inherit',
              },
              '& .MuiDataGrid-cell': {
                paddingLeft: 0,
                paddingRight: 0,
                display: 'flex',
              }
            }}
            rows={data as any}
            scrollbarSize={0}
            getRowHeight={() => 'auto'}
            columns={Object.keys(attrProps).map((col) => ({
              field: col,
              headerName: col[0].toUpperCase() + col.slice(1),
              width: columnWidths[col] || 150,
              renderCell: (params) => {
                const attr = col;
                const itemId = params.row.id;
                const value = params.value;

                return (
                  <div className="hover:bg-blue-50 h-full w-full"
                    onKeyDown={(e) => {
                      if ([' ', "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
                        e.stopPropagation()
                      }
                    }
                    }>
                    {
                      attrProps[attr].type === 'array' ?
                        <ArrayCell
                          itemId={itemId}
                          attr={attr}
                          values={value}
                          state="noEdit"
                          autocompleteItems={
                            attrProps[attr].referencing
                              ? [...new Set(data.map((item) => item[attrProps[attr].referencing as string])
                                .filter((referenced) => referenced.length > 0))]
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
              }
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
