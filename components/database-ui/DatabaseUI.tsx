'use client'

import Table from '@components/table'
import { createItem, fetchData, updateItem } from '@functions/database';
import { useCallback, useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';


export default function DatabaseUI({ table }: {
  table: string
}) {
  const [data, setData] = useState<DataItem[]>([]);
  const [attrs, setAttrs] = useState<AttrProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  async function handleCreate() {
    await createItem(table, data, attrs).then((createdItem) => {
      setData([...data, createdItem])
      console.log([...data, createdItem])
    })
  }


  const handleUpdate = useCallback(async (itemId: number, attrName: string, value: number | string | string[]) => {
    if (!authorized) return;

    console.log(itemId, value)

    await updateItem(table, itemId, { [attrName]: value }).then(() => {
      const index = data.findIndex(item => item.id === itemId); // Find the correct index based on itemId

      if (index !== -1) {
        // Create a new array with the updated item
        const updatedData = data.map((item, i) =>
          i === index ? { ...item, [attrName]: value } : item
        );
        setData(updatedData); // Update the state with the new array
      }
    });

  }, [authorized, data, table]);


  console.log("Table called")

  useEffect(() => {
    if (window.localStorage.getItem("timeKeyGot")) setAuthorized(true);

    Promise.all([
      fetchData({ table: table }),
      fetchData({ table: `${table}_attr` })
    ]).then(([fetchedData, fetchedAttrs]) => {

      const adjustedData = fetchedData.map(item => {
        const adjustedItem: DataItem = {}
        for (const attr of fetchedAttrs) {
          adjustedItem[attr.name] = item[attr.name]
        }
        return adjustedItem
      })
      setData(adjustedData)
      setAttrs(fetchedAttrs as AttrProps[])
      setLoading(false)

    })
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Table
      name={table}
      data={data}
      attrs={attrs}
      handleUpdateCell={handleUpdate}
      handleCreateItem={handleCreate} />
  );
}
