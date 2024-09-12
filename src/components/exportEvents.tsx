export const exportEvents = (data: { title: string; type: string; date: string; }[], filename: string) => {
  // Prepare CSV content
  const csvContent = data.map(event => `${event.title},${event.type},${event.date}`).join('\n');
  const csvHeader = 'Title,Type,Date\n';
  const csvData = csvHeader + csvContent;

  // Create a Blob with the CSV data
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  // Create a link element to trigger download
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();

  // Clean up the link element after download
  document.body.removeChild(link);
};
