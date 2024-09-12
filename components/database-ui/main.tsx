'use client'

import { supabase, getAttrTypes, update, fetchData, initiateAttrProps } from "@components/database-ui/functions";
import { useEffect, useState } from 'react';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

import UndoRoundedIcon from '@mui/icons-material/UndoRounded';
import RedoRoundedIcon from '@mui/icons-material/RedoRounded';
import CloseIcon from '@mui/icons-material/Close';

import { getTextWidth } from "@functions/text-analysis";
import ArrayCell from "./array-cell";
import TextCell from "./text-cell";

const CustomCaret = ({ text }: { text: string }) => {
  const left = getTextWidth(text)
  return (<div
    style={{
      position: 'absolute',
      left: `${left}px`, // Set the position of the caret
      top: '3px',
      width: '1px',
      height: '1em',
      backgroundColor: 'black',
      pointerEvents: 'none',
    }}
  />)
};

type Cell = {
  id: number
  attr: string
  content: number | string | string[]
  [key: string]: any;
}

type StackItem = {
  action: 'delete' | 'update',
  item: DataItem
}

type EditAction = {
  cell: Cell,
  editing?: boolean
}

export default function DatabaseUI({ table, columns }:
  {
    table: string;
    columns?: AttrProps
  }) {

  const [authorized, setAuthorized] = useState(false);
  const [fetched, setFetched] = useState(false)
  const [loading, setLoading] = useState(true);
  const [widthSet, setWidthSet] = useState(false)

  const [data, setData] = useState<DataItem[]>([]);
  const [attrProps, setAttrProps] = useState<AttrProps>({});
  const [tableChanged, setTableChanged] = useState(0);

  const [focusedItemId, setFocusedItemId] = useState<number | null>(null);


  const [error, setError] = useState<string | null>(null);

  // Undo and Redo
  const [undoStack, setUndoStack] = useState<StackItem[]>([]);
  const [redoStack, setRedoStack] = useState<StackItem[]>([]);

  function handleItemFocus(id: number) {
    setFocusedItemId(id)
  }

  async function handleCreate() {
    if (!authorized) return;

    let adjustedItem: DataItem = {}

    function getAvailableId() {
      const existingIds = new Set(data.map((dataItem) => dataItem.id));

      let smallestMissingId = 1;
      while (existingIds.has(smallestMissingId)) {
        smallestMissingId++;
      }
      return smallestMissingId;
    }


    for (const attr of Object.keys(attrProps)) {
      // Array process
      if (attrProps[attr].type === 'array') {
        adjustedItem[attr] = []
      }
      else {
        adjustedItem[attr] = attr === 'id' ? getAvailableId() : ""
      }
    }

    console.log(adjustedItem);

    const { data: insertData, error } = await supabase.from(table).insert([adjustedItem]);

    if (error) {
      setError('Error inserting data: ' + error.message);
      return;
    }

    setTableChanged(tableChanged + 1);
  };

  async function handleUpdate(itemId: number, attrProps: JsonObject<any>) {
    if (!authorized) return;

    console.log(itemId, attrProps)
    await update(table, itemId, attrProps)


    // setUndoStack((prev) => [...prev, {
    //   action: 'update',
    //   item: editedItem
    // }])
    setTableChanged(tableChanged + 1);
  };

  async function handleDelete(id: number) {
    if (!authorized) return;

    const { data: deleteData, error } = await supabase
      .from(table)
      .delete()
      .match({ id });

    if (error) {
      setError('Error deleting data: ' + error.message);
      return;
    }

    const deletedItem = data.find((item) => item.id === id) as DataItem

    setUndoStack((prev) => [...prev, {
      action: 'delete',
      item: deletedItem
    }])
    // Remove deleted item from state
    setData(prevData => prevData.filter(item => item.id !== id));
    setLoading(false);
  };

  async function handleUndo() {
    if (undoStack.length === 0) return;
    const undo = undoStack.pop() as StackItem

    if (undo.action === 'delete') {
      await supabase.from(table).insert([undo.item])
    }

    setUndoStack(undoStack)
    setRedoStack([...redoStack, undo])
    setTableChanged(tableChanged + 1)
  };

  async function handleRedo() {
    if (redoStack.length === 0) return;
    console.log(redoStack)

    const redo = redoStack.pop() as StackItem

    if (redo.action === 'delete') {
      await supabase.from(table).delete().match({ id: redo.item.id });
    }


    setRedoStack(redoStack)
    setUndoStack([...undoStack, redo])
    setTableChanged(tableChanged + 1)
  };

  useEffect(() => {
    if (window.localStorage.getItem("timeKeyGot")) setAuthorized(true);

    fetchData({ table: table, attrs: columns ? Object.keys(columns) : undefined })
      .then((data) => {
        setData(data)
        setAttrProps(initiateAttrProps(data, columns))
        setFetched(true);
      })
  }, [tableChanged]);

  return (
    <div>
      {
        Object.keys(attrProps).length == 0
          ?
          <p>Loading...</p>
          :
          <div>
            {error && <p className="text-red">{error}</p>}
            <div className="flex justify-between mb-2">
              <UndoRoundedIcon
                onClick={handleUndo}
                sx={{ fontSize: 30 }}
                style={{ cursor: 'pointer' }} />
              <RedoRoundedIcon
                onClick={handleRedo}
                sx={{ fontSize: 30 }}
                style={{ cursor: 'pointer' }} />
            </div>
            <div className="table w-full border-collapse">
              <div className="table-header-group">
                <div className="table-row">
                  <div></div>
                  {data[0] && Object.keys(data[0]).map((attr, index) => (
                    <div className={`table-cell px-3 py-2 
                      border-2 border-l-0 border-t-0 ${index === Object.keys(data[0]).length - 1 && 'border-r-0'}  
                    bg-[#97C3DB] 
                      w-[${attrProps[attr].width !== undefined ? attrProps[attr].width : "10%"}]`
                    }
                      key={index}
                    >
                      {attr.charAt(0).toUpperCase() + attr.slice(1)}
                    </div>
                  ))}
                </div>
              </div>

              <div className="table-row-group">
                {data.map((item: JsonObject<any>) => (
                  <div className="table-row" key={item.id}
                    onMouseEnter={() => handleItemFocus(item.id)}>
                    <div className="text-left w-min"
                    >
                      {focusedItemId && focusedItemId === item.id &&
                        <DeleteRoundedIcon
                          onClick={() => handleDelete(item.id)}
                          style={{ cursor: 'pointer' }}
                          sx={{ fontSize: 20 }}
                        />
                      }
                    </div>
                    {
                      Object.keys(item).map((attr, index) => (
                        <div className={`table-cell
                           w-[${attrProps[attr].width !== undefined ? attrProps[attr].width : "10%"}]`}
                          key={index}>
                          {attrProps[attr].type === 'array'
                            ?
                            <ArrayCell itemId={item.id} attr={attr} values={item[attr]} state='noEdit'
                              handleUpdate={handleUpdate}
                              autocompleteItems={attrProps[attr].referencing !== undefined
                                ? [...new Set(data.map((item) => item[attrProps[attr].referencing as string]))]
                                : [...new Set(data.flatMap((item) => item[attr]))]}
                            />
                            : <TextCell itemId={item.id} attr={attr} value={item[attr]} state='noEdit'
                              handleUpdate={handleUpdate} />}
                        </div>
                      ))
                    }

                  </div>
                ))}

                <div className="table-row">
                  <div className="table-cell">
                    <AddRoundedIcon
                      onClick={handleCreate}
                      width={20}
                      height={20}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
      }
    </div >
  );
}
