import fs from 'fs/promises'
import path from 'path'

async function fixImports(dir) {
  const files = await fs.readdir(dir, { withFileTypes: true })
  for (const file of files) {
    const fullPath = path.join(dir, file.name)
    if (file.isDirectory()) {
      await fixImports(fullPath)
    } else if (file.name.endsWith('.js')) {
      let content = await fs.readFile(fullPath, 'utf-8')
      // Improved regex to handle both ./ and ../ relative paths
      content = content.replace(
        /(import|export)([\s\S]*?from\s+['"])((?:\.\/|\.\.\/)+[^'"]*?)(['"])/g,
        (match, p1, p2, p3, p4) => {
          if (!p3.endsWith('.js')) {
            return `${p1}${p2}${p3}.js${p4}`
          }
          return match
        }
      )
      await fs.writeFile(fullPath, content, 'utf-8')
    }
  }
}

fixImports(path.resolve('./dist')).then(() => {
  console.log('Import extensions fixed in dist/')
}).catch(console.error)