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

export async function getAttrTypes(table: string, attrs?: string[]) {
  const data = await fetchData({ table: table, attrs: attrs, limit: 1 }) as DataItem;

  const columnTypes = attrs ? attrs : Object.keys(data[0] || {});

  const typeDict: AttrProps = {};

  columnTypes.forEach((attr) => {
    let type: string;
    if (Array.isArray(data[0][attr])) {
      type = 'array';
    } else {
      type = typeof data[0][attr];
    }

    typeDict[attr] = { type: type, width: '10%' };
  });

  return typeDict;
}


export async function update(table: string, itemId: number, attrs: JsonObject<any>) {
  await supabase.from(table).select().then(({ data }) => console.log(data))


  const { data, error } = await supabase
    .from(table)
    .update(attrs)
    .match({ id: itemId })
    .select()

  console.log(data)

  if (error) {
    throw new Error(error.message);
  }

}

export function createItem(table: string) {

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

  // Estimate width
  let totalLength = 0;

  Object.keys(attrProps).forEach((attr) => {
    let maxContentLength = 0;

    data.forEach((row) => {
      const content = row[attr];
      if (attrProps[attr].type === 'array') {
        const contentLength = content.join(', ').length;
        maxContentLength = Math.max(maxContentLength, contentLength);
      } else if (typeof content === 'string' || typeof content === 'number') {
        maxContentLength = Math.max(maxContentLength, String(content).length);
      }
    });

    attrProps[attr] = {
      ...attrProps[attr],
      maxLength: maxContentLength
    };

    totalLength += maxContentLength;
  });
  console.log(totalLength)
  Object.keys(attrProps).forEach((attr) => {
    attrProps[attr] = {
      ...attrProps[attr],
      width: `${Math.max(attrProps[attr].maxLength! / totalLength * 100, 4)}%`
    };
  });

  return attrProps
}
