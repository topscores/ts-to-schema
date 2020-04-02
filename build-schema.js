const fs = require('fs')
const { resolve } = require('path')
const tjs = require('typescript-json-schema')

fs.readdir('src/types', (err, files) => {
  const _files = files.map(file => resolve(`src/types/${file}`))
  // optionally pass argument to schema generator
  const settings = {
    required: true,
  }

  // optionally pass ts compiler options
  const compilerOptions = {
    strictNullChecks: true,
  }
  const program = tjs.getProgramFromFiles(_files, compilerOptions)
  const generator = tjs.buildGenerator(program, settings)
  const interfaces = ['Person']
  interfaces.forEach(interface => {
    const symbol = generator.getSchemaForSymbol(interface)
    const exportSchema = `
    const schema = ${JSON.stringify(symbol)}
    module.exports = schema
    `
    fs.writeFileSync(
      `schemas/${interface.toLowerCase()}-schema.js`,
      exportSchema
    )
  })
})
