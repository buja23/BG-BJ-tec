// A classe base que representa nosso formato de exportação nativo.
class JsonExporter {
  export(data) {
    console.log('Exportando dados como JSON nativo...');
    // A "exportação" JSON é simplesmente retornar os dados como uma string JSON.
    return JSON.stringify(data, null, 2);
  }
}

export default JsonExporter;