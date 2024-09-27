'use client'

import Table from '@components/table'
import { createItem, exchangeItems, fetchData, updateItem } from '@functions/database';
import { useCallback, useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';


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

    await createItem(table, data, attrs).then(() => {
      setUpToDate(true)
    })
  }

  const handleUpdate = useCallback(async (itemId: number, attrName: string, value: number | string | string[]) => {
    setUpToDate(false)
    if (!authorized) return;
    const index = data.findIndex(item => item.id === itemId); // Find the correct index based on itemId

    if (index !== -1) {
      // Create a new array with the updated item
      const updatedData = data.map((item, i) =>
        i === index ? { ...item, [attrName]: value } : item
      );
      setData(updatedData); // Update the state with the new array
    }
    await updateItem(table, itemId, { [attrName]: value }).then(() => {
      setUpToDate(true)
    });

  }, [authorized, data, table]);

  async function handleExchange(id1: number, id2: number) {
    setUpToDate(false)
    if (!authorized) return;
    setData(prevData => {
      const newData = prevData.map(item => {
        if (item.id === id1) {
          return { ...item, id: id2 };
        }
        if (item.id === id2) {
          return { ...item, id: id1 };
        }
        return item;
      });
      return newData.sort((x, y) => x.id - y.id);
    });

    await exchangeItems(table, id1, id2).then(() => {
      setUpToDate(true)
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
      onExchangeItems={handleExchange} />
  );
}
