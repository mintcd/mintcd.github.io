'use client'

import Table from '@components/table'
import { createItem, fetchData, updateItem } from '@functions/database';
import { useCallback, useEffect, useState } from 'react';

export default function Test() {
  const [data, setData] = useState<DataItem[]>([]);
  const [attrs, setAttrs] = useState<AttrProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const table = "statement"

  async function handleCreate() {
    await createItem(table, data, attrs).then((createdItem) => {
      setData([...data, createdItem])
      console.log([...data, createdItem])
    })
  }


  const handleUpdate = useCallback(async (itemId: number, attrName: string, value: number | string | string[]) => {
    if (!authorized) return;

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
      fetchData({ table: "statement" }),
      fetchData({ table: `${table}_attr` })
    ]).then(([fetchedData, fetchedAttrs]) => {
      // Filter data based on attributes


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
    return <div>Loading...</div>;
  }

  return (
    <Table
      data={data}
      attrs={attrs}
      handleUpdateCell={handleUpdate}
      handleCreateItem={handleCreate} />
  );
}
