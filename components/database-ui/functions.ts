// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

export const supabase =
  createClient(
    'https://xckcvifprcbdrsiqsenh.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhja2N2aWZwcmNiZHJzaXFzZW5oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNTcyMzQyOCwiZXhwIjoyMDQxMjk5NDI4fQ.SaYcPR7pya7dW8bXD_tQr_mpY6sWKg-FZ00y8laLlQc'
  )

export async function fetchData({
  table,
  attrs,
  limit,
}: {
  table: string;
  attrs?: string[];
  limit?: number;
}) {
  const query = supabase.from(table).select(attrs ? attrs.join(", ") : "*");

  if (limit) {
    query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  if (data.length === 0) {
    throw new Error("Table is empty");
  }

  return data.sort((x: DataItem, y: DataItem) => x.id - y.id);
}

export async function updateItem(table: string, itemId: number, attrValue: JsonObject<any>) {
  const { data, error } = await supabase
    .from(table)
    .update(attrValue)
    .match({ id: itemId })
    .select()
  if (error) {
    throw new Error(error.message);
  }
  return data
}

export async function createItem(table: string, data: DataItem[], attrProps: AttrProps) {
  // Find the smallest available ID
  const currentIds = data.map(item => item.id).sort();
  let newId = 1;

  // Find the first gap or use the next sequential ID
  for (let i = 0; i < data.map(item => item.id).sort().length; i++) {
    if (currentIds[i] > newId) break
    newId += 1
  }

  const createdItem: DataItem = { id: newId }
  for (const attr of Object.keys(attrProps)) {
    if (attr == 'id') continue
    createdItem[attr] = attrProps[attr].type === 'array' ? [] : ''
  }

  // Insert the new item with the smallest available ID
  const { error } = await supabase.from(table).insert(createdItem);

  if (error) {
    console.error('Error inserting item:', error);
  }

  return createdItem
}

export function initiateAttrProps(data: DataItem[], attrOptions?: AttrProps) {
  // Get types
  const attrProps: AttrProps = attrOptions ? attrOptions : {};

  Object.keys(data[0]).forEach((attr) => {
    let type: string;
    if (Array.isArray(data[0][attr])) {
      type = 'array';
    } else {
      type = typeof data[0][attr];
    }

    attrProps[attr].type = type;
  });


  return attrProps
}
