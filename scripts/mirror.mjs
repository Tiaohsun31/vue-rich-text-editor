// 把本套件的子目錄歷史，從 monorepo 用 git subtree 推到它的獨立公開鏡像 repo。
// 可從 monorepo 內任意位置執行：
//   pnpm mirror        （等同 node scripts/mirror.mjs）
//
// 方向是「monorepo -> 鏡像」單向。請一律在 monorepo 改、再推；不要直接改鏡像 repo。
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, relative, sep } from 'node:path'

const REMOTE_NAME = 'rte-mirror'
const REMOTE_URL = 'https://github.com/Tiaohsun31/vue-rich-text-editor.git'
const BRANCH = 'main'

const pkgDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function sh(cmd, opts = {}) {
  return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts }).trim()
}

let gitRoot
try {
  gitRoot = sh('git rev-parse --show-toplevel', { cwd: pkgDir })
} catch {
  console.error('✗ 不在 git repository 內。')
  process.exit(1)
}

// prefix = 套件相對於 git root 的路徑（用正斜線）
const prefix = relative(gitRoot, pkgDir).split(sep).join('/')
if (!prefix) {
  console.log('偵測到目前就是獨立鏡像 repo（套件位於 git root），mirror 只在 monorepo 內執行，無動作。')
  process.exit(0)
}

// 確保鏡像 remote 存在
const remotes = sh('git remote', { cwd: gitRoot }).split(/\s+/).filter(Boolean)
if (!remotes.includes(REMOTE_NAME)) {
  console.log(`+ 新增 remote ${REMOTE_NAME} -> ${REMOTE_URL}`)
  sh(`git remote add ${REMOTE_NAME} ${REMOTE_URL}`, { cwd: gitRoot })
}

// subtree 只推「已 commit」的歷史；有未提交變更先擋下
const dirty = sh(`git status --porcelain -- ${prefix}`, { cwd: gitRoot })
if (dirty) {
  console.error('\n⚠ 套件內有未提交變更，請先 commit，否則不會被鏡像：\n')
  console.error(dirty + '\n')
  process.exit(1)
}

// split 出「套件在 root」的歷史 SHA，再 push 到鏡像 main（首次/後續皆適用，正常為 fast-forward）
console.log(`• git subtree split --prefix=${prefix} ...`)
const splitOut = sh(`git subtree split --prefix=${prefix}`, { cwd: gitRoot })
const sha = splitOut.split(/\r?\n/).filter(Boolean).pop()
console.log(`• 推送 ${sha.slice(0, 12)} -> ${REMOTE_NAME}/${BRANCH}`)

try {
  execSync(`git push ${REMOTE_NAME} ${sha}:refs/heads/${BRANCH}`, { cwd: gitRoot, stdio: 'inherit' })
  console.log('\n✓ 鏡像已更新。')
} catch {
  console.error(
    '\n✗ push 被拒（通常是鏡像端被直接改過、歷史分岔）。' +
      '\n  請確認沒有人直接在鏡像 repo 改 code；必要時手動處理後再重跑。',
  )
  process.exit(1)
}
