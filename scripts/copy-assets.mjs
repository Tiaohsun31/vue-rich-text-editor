// build 後處理：複製 CSS 與 styles 型別到 dist（editor.css 非由 JS import，vite 不會產出）
import { copyFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

mkdirSync(resolve(root, 'dist/styles'), { recursive: true })

copyFileSync(resolve(root, 'src/styles/editor.css'), resolve(root, 'dist/editor.css'))
copyFileSync(resolve(root, 'src/styles/index.d.ts'), resolve(root, 'dist/styles/index.d.ts'))

console.log('[copy-assets] editor.css + styles/index.d.ts -> dist')
