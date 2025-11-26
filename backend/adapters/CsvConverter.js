// Esta classe tem sua própria interface e lógica para converter JSON para CSV.
class CsvConverter {
  convertToCsv(jsonData) {
    console.log('CsvConverter: Convertendo JSON para CSV...');
    if (!jsonData || jsonData.length === 0) {
      return '';
    }

    // Pega os cabeçalhos da primeira linha do JSON
    const headers = Object.keys(jsonData[0]);
    const csvRows = [headers.join(',')];

    // Converte cada objeto JSON em uma linha CSV
    for (const row of jsonData) {
      const values = headers.map(header => {
        const escaped = ('' + row[header]).replace(/"/g, '""'); // Lida com aspas
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  }
}

export default CsvConverter;