import { readFileSync } from 'fs'
import Module from 'module'

function loader(module: Module, filename: string) {
  module.exports = readFileSync(filename)
}

for (const extname of ['.png', '.jpeg', '.jpg', '.gif', '.webp', '.avif']) {
  require.extensions[extname] = loader
}

require.extensions['.svg'] = function (module: Module, filename: string) {
  module.exports = readFileSync(filename, 'utf8')
}
