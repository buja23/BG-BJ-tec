import path from 'path'

const patthAbsolute = new URL ('.' , import.meta.url).pathname
const __dirname = path.dirname(patthAbsolute).slice(1)

export default __dirname;