export const exportToCSV = (headers: string[], data: JsonObject<any>[], fileName?: string) => {
  const headersString = headers.join(',');
  const rows = data.map(item => headers.map(attr => `"${item[attr] || ''}"`).join(',')).join('\n');
  const csvContent = `data:text/csv;charset=utf-8,${headersString}\n${rows}`;
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${fileName || 'data'}.csv`);
  document.body.appendChild(link);
  link.click();
};

export const exportToJSON = (data: JsonObject<any>[], fileName?: string) => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName || 'data'}.json`;
  link.click();
};