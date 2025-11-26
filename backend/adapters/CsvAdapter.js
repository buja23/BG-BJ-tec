import JsonExporter from './JsonExporter.js';
import CsvConverter from './CsvConverter.js';

// O Adapter que "veste" a interface do JsonExporter, mas usa o CsvConverter por dentro.
class CsvAdapter extends JsonExporter {
  constructor() {
    super();
    // O Adapter contém uma instância da classe que ele está adaptando.
    this.csvConverter = new CsvConverter();
  }

  export(data) {
    console.log('CsvAdapter: Chamando o conversor para gerar CSV...');
    return this.csvConverter.convertToCsv(data);
  }
}

export default CsvAdapter;
