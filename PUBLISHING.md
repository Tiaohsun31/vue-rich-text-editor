# 發布流程（Release Runbook）

本套件以 **monorepo（`eShop.ClientApp`）為單一事實來源**開發，發布到兩個地方：

1. **npm**：`@tiaohsun/vue-rich-text-editor`
2. **公開鏡像 repo**：<https://github.com/Tiaohsun31/vue-rich-text-editor>（套件位於該 repo root，分支 `main`，由 `git subtree` 從 monorepo 單向同步）

> 規則：**一律在 monorepo 改、再同步出去**。不要直接在鏡像 repo 改 code，否則歷史會分岔。

---

## 一次性設定（首次才需要）

1. 在 GitHub 建立 **空的、公開的** repo `Tiaohsun31/vue-rich-text-editor`（不要勾 README / LICENSE / .gitignore，否則首推會衝突）。
2. `npm login`，並確認擁有 `@tiaohsun` scope。

`pnpm mirror`（見下）會自動把鏡像 remote（`rte-mirror`）加好，不需手動 `git remote add`。

---

## 每次發新版

於 monorepo 內 `packages/rich-text-editor/` 執行：

### 1. 改版號

`npm` 不允許重發同版號。依語意化版本調整 `package.json` 的 `version`：

```bash
# 擇一（patch / minor / major）；--no-git-tag-version 避免在 feature 分支自動打 tag/commit
npm version patch --no-git-tag-version
```

### 2. 提交

```bash
# 於 git root：C:\VisualStudio\eShop\eShop.ClientApp
git add packages/rich-text-editor
git commit -m "release(rte): vX.Y.Z"
```

### 3. 發布到 npm

```bash
cd packages/rich-text-editor
pnpm publish --no-git-checks
```

- `prepack` 會自動 `pnpm build`（vite 打包 + vue-tsc 產 `.d.ts` + 複製 css）。
- `publishConfig` 會在發布時把 `exports` / `main` / `types` 切到 `dist/`（本地開發仍指 `src/`）。
- `--no-git-checks` 跳過「publish-branch 不是 main/master」的警告（目前在 feature 分支）。
- scoped 公開套件的 `--access public` 已設在 `publishConfig.access`。

### 4. 同步到公開鏡像 repo

```bash
# 於 packages/rich-text-editor/（或 monorepo 內任一處）
pnpm mirror
```

`scripts/mirror.mjs` 會：自動算出 subtree prefix、確保 `rte-mirror` remote 存在、擋下未提交變更、`git subtree split` 後 push 到鏡像 `main`（首次/後續皆適用）。

---

## 驗收檢查

- npm 頁面：README 的「繁體中文 / LICENSE / THIRD_PARTY_NOTICES」連結能跳到 GitHub（用絕對 URL，不再 404）、右側出現 Repository 連結。
- 安裝測試：在一個乾淨專案 `npm i @tiaohsun/vue-rich-text-editor vue @tiptap/core @tiptap/pm @tiptap/vue-3`，`import { RichTextEditor } from '@tiaohsun/vue-rich-text-editor'` 型別與執行正常。
- 鏡像 repo：根目錄即套件本體（`package.json` 在 root），README 正常顯示。

---

## 備註

- `dist/` 為產生物，已被 git 忽略；不進 monorepo、也不進鏡像 repo（發布時由 `prepack` 重建）。
- `@tiptap/*` 與 `vue` 為 **peerDependencies**（避免消費端出現重複的 ProseMirror/Tiptap 實例）。
- Tiptap 透過 npm 依賴、build externalize，**未內嵌**，故無需在 `THIRD_PARTY_NOTICES.md` 列出；Lucide 因內嵌 SVG path 才需列。
