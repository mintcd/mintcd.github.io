'use client'

import Table from '@components/table'
import { createItem, exchangeItems, fetchData, update, supabase } from '@functions/database';
import { useCallback, useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { toObject } from '@functions/array';


export default function DatabaseUI({ table }: {
  table: string
}) {

  const [upToDate, setUpToDate] = useState(true)
  const [data, setData] = useState<DataItem[]>([]);
  const [attrs, setAttrs] = useState<AttrProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);


  async function handleCreate() {
    setUpToDate(false)
    const currentIds = data.map(item => item.id).sort((x: number, y: number) => x - y);
    let newId = 1;

    // Find the first gap or use the next sequential ID
    for (let i = 0; i < currentIds.length; i++) {
      if (currentIds[i] > newId) break
      newId += 1
    }

    const createdItem: DataItem = { id: newId }
    for (const attr of attrs) {
      if (attr.name == 'id') continue
      createdItem[attr.name] = attr.type === 'multiselect' ? [] : ''
    }
    setData([...data, createdItem])

    await createItem(table, data).then(() => {
      setUpToDate(true)
    })
  }

  const handleUpdate = useCallback(async (items: UpdatedItem | UpdatedItem[]) => {
    setUpToDate(false)
    if (!authorized) return;
    let updatedData: DataItem[]

    if (Array.isArray(items)) {
      const updatedItemIds = new Set(items.map(item => item.id))
      const updatedItemsById = toObject(items, 'id')

      updatedData = data.map((item) => {
        if (updatedItemIds.has(item.id)) {
          const updatedFields = updatedItemsById[item.id].attrValue
          return { ...item, [Object.keys(updatedFields)[0]]: Object.values(updatedFields)[0] }
        }
        return item
      });
    } else {
      updatedData = data.map((item) => {
        if (item.id === items.id) {
          return { ...item, [Object.keys(items.attrValue)[0]]: Object.values(items.attrValue)[0] }
        }
        return item
      });

    }

    setData(updatedData);

    await update(table, items).then(() => {
      setUpToDate(true)
    });

  }, [authorized, data, table]);

  function handleReorder(rangedItems: DataItem[], direction: 'up' | 'down') {
    // Create a new array to store updated data
    setUpToDate(false)

    const newRangedItems = [...rangedItems] as DataItem[]
    if (direction === 'up') {
      const { id, ...sourceData } = rangedItems[0]
      newRangedItems.forEach((item, index) => {
        if (index === rangedItems.length - 1) {
          // Update the target item with the source data
          newRangedItems[index] = { id: item.id, ...sourceData };
        } else {
          // Shift attributes up
          const { id, ...nextData } = rangedItems[index + 1];
          newRangedItems[index] = { id: item.id, ...nextData };
        }
      })
    } else {
      const { id, ...sourceData } = rangedItems[rangedItems.length - 1]

      newRangedItems.forEach((item, index) => {
        console.log(item, index)
        if (index === 0) {
          // Update the target item with the source data
          newRangedItems[index] = { id: item.id, ...sourceData };
        } else {
          // Shift attributes up
          const { id, ...prevData } = rangedItems[index - 1];
          newRangedItems[index] = { id: item.id, ...prevData };
        }
      });
    }

    setData(data.map(item => {
      const updatedItem = newRangedItems.find(newRangedItem => newRangedItem.id === item.id)
      return updatedItem ? { id: item.id, ...updatedItem } : item
    }))

    Promise.all(newRangedItems.map((item) => {
      const { id, ...attributes } = item;
      return supabase.from(table).update(attributes).eq('id', id); // Return the promise
    }))
      .then((results) => {
        setUpToDate(true)
      })
      .catch((error) => {
        // Handle the error properly here
        throw new Error(error.message);
      });
  }


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
  }, [table]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Table
      name={table}
      data={data}
      upToDate={upToDate}
      attrs={attrs}
      onUpdateCell={handleUpdate}
      onCreateItem={handleCreate}
      onReorder={handleReorder} />
  );
}
