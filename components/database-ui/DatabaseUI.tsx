'use client'

import Table from '@components/table'
import { createItem, exchangeItems, fetchData, update, updateOne } from '@functions/database';
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
