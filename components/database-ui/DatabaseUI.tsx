'use client'

import Table from '@components/table'
import { createItem, exchangeItems, fetchData, updateItem } from '@functions/database';
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

  async function handleExchange(id1: number, id2: number) {
    if (!authorized) return;

    await exchangeItems(table, id1, id2).then(() => {
      setData(prevData => {
        const newData = prevData.map(item => {
          if (item.id === id1) {
            return { ...item, id: id2 }; // Update item with id1 to have id2
          }
          if (item.id === id2) {
            return { ...item, id: id1 }; // Update item with id2 to have id1
          }
          return item; // Return item unchanged if neither id matches
        });
        return newData.sort((x, y) => x.id - y.id);
      });
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
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Table
      name={table}
      data={data}
      attrs={attrs}
      onUpdateCell={handleUpdate}
      onCreateItem={handleCreate}
      onExchangeItems={handleExchange} />
  );
}
