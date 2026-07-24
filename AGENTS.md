<!-- ⚠️ 此檔案由 CLAUDE.md 自動同步產生，請勿直接編輯本檔。維護內容請修改 CLAUDE.md，再重新執行同步指令（見 README / 專案說明）。 -->

# @tiaohsun/vue-rich-text-editor 開發指南

> 本套件 coding agent 指南的**單一事實來源**。同目錄的 `AGENTS.md` 由 pre-commit hook 從本檔自動產生，**請勿直接編輯 `AGENTS.md`**。
>
> 本套件目前於一個 pnpm monorepo 內開發，計畫在穩定後獨立成單獨 repo，屆時由宿主專案透過 `pnpm` 安裝使用。**請以「獨立、通用套件」的心態維護**：不得帶入任何宿主專案的業務或情境假設。

## 定位（初衷，改任何東西前先回到這裡）

**一層薄薄的 Vue 3 封裝，把 Tiptap v3 包成開箱即用的編輯器元件。** 通用、框架無關、可獨立發布 npm。

核心原則（優先序）：

1. **Tiptap 有的功能優先採用**，不足才補自訂 extension——不重造輪子。
2. **向知名編輯器（CKEditor / TinyMCE / Google Docs）的預設行為看齊**，以「使用者不困惑」為準，不做冷門或帶情境假設的選項。
3. **零基礎設施依賴**：不假設宿主技術棧、不綁定特定後端 / 儲存 / CSS 框架。

## 依賴邊界（鐵律）

- `@tiptap/core`、`@tiptap/pm`、`@tiptap/vue-3`、`vue` 為 **peerDependencies**（devDependencies 僅供本地開發）。其餘 tiptap extensions 與 `@floating-ui/dom` 為 dependencies。
- **禁止** import：任何 CSS 框架（Tailwind 等）、任何宿主專案的套件、任何假設特定後端 / 儲存 / 媒體服務的程式碼。
- 樣式只用純 CSS（`src/styles/editor.css`）。
- 上傳、媒體庫等需要基礎設施的功能，只透過 **handler / configure 介面**注入（見「擴充方式」），實作留給宿主 app。

## 歸屬原則（一個功能該放哪）

| 放本套件 | 留給宿主 app |
| --- | --- |
| 輸出框架無關、零基礎設施依賴的通用功能 | 假設了特定 CSS 框架（如 Tailwind class 輸出）的節點 |
| optional extensions（image-upload / lightbox / image-lightbox） | 依賴特定儲存 / 媒體 API（如檔案上傳實作、媒體庫 picker） |
| 只定義介面（handler / configure），不含實作 | 上述介面的實際實作 |

判斷法：**只要假設了宿主的技術棧或基礎設施，就不放本套件——改成一個 configure/handler 介面，讓宿主注入。**

## 目錄結構

```
src/
  components/   RichTextEditor.vue（主入口）、EditorToolbar.vue、RteDialog.vue
  menus/        TextBubbleMenu / TableBubbleMenu / ImageBubbleMenu / LinkBubbleMenu
  presets/      createDefaultExtensions.ts（預設 extension 組合）
  extensions/   optional（subpath export）：image-upload / lightbox / image-lightbox
  nodes/        ResizableImage（縮放 + 對齊 NodeView）
  toolbar/      types.ts（ToolbarItem）、defaultToolbarItems.ts
  dialog/       dialog.ts（createRteDialog / promptWithFallback，取代 window.prompt/alert）
  i18n/         zh-TW / zh-CN / en + types.ts + index.ts
  icons/        自繪 inline SVG（統一 16px，對外匯出供宿主 toolbar 共用）
  types/        editor / upload / content
  styles/       editor.css（純 CSS）
```

## 公開 API（`src/index.ts`）

- 元件：`RichTextEditor`
- 擴充組合：`createDefaultExtensions`、`FontSize`（re-export 自 `@tiptap/extension-text-style`）
- Toolbar：`defaultToolbarItems`、`exportHtmlToolbarItem`、`createDefaultToolbarItems(t)`、`createExportHtmlToolbarItem(t)` 及型別
- i18n：`locales`、`resolveMessages`、`rteMessagesKey`、`zhTW`/`zhCN`/`en`、型別 `RteLocale`/`RteMessages`
- Dialog：`createRteDialog`、`rteDialogKey`、`promptWithFallback`、`promptLinkWithFallback`、`alertWithFallback` 及型別
- 型別：`RichTextEditorOptions`、`RichTextEditorContext`、`ImageUploadHandler`、`EditorContent`
- Icons：`export * from './icons'`

Optional extensions 走 subpath：`@tiaohsun/vue-rich-text-editor/extensions/{image-upload|lightbox|image-lightbox}`、樣式走 `/styles`。

## 核心設計要點

### `RichTextEditor.vue` props

`modelValue`（v-model）、`extensions`（追加）、`resolveExtensions`（完全接管預設組合）、`toolbarItems`、`placeholder`、`readonly`、`outputFormat: 'html'（預設）| 'json'`、`locale`（預設 `zh-TW`）、`messages`（覆寫個別文案）。

- extensions 組法：`props.resolveExtensions ? resolveExtensions({ extensions: defaultExts }) : [...defaultExts, ...(props.extensions ?? [])]`。
- `readonly` 時不掛 toolbar / bubble menus / dialog。

### `createDefaultExtensions`

StarterKit（v3 內建 Underline / Link）、ResizableImage、Table 家族、Youtube、TextAlign、TextStyle/Color/FontFamily/FontSize、Highlight、Details（官方折疊，`persist:false`）、Placeholder、ExitBlock（Ctrl+Shift+Enter 跳出 blockquote/table）。

**Link 設定**：`openOnClick:false`、`autolink:true`、`defaultProtocol:'https'`、`HTMLAttributes:{ target:null, rel:null }`。預設**同頁開啟、不加 nofollow**（中性預設）；「另開視窗」為逐條 opt-in，勾選時由連結 UI 補 `target=_blank` + `rel=noopener noreferrer`（見「連結行為」）。

### Toolbar registry

`ToolbarItem = ToolbarButton | ToolbarSeparator | ToolbarDropdown`。command 簽章 `(editor, ctx?: ToolbarContext)`，`ctx` 帶 `{ t, prompt, promptLink, alert }`。工具列文案一律走 i18n（用 `createDefaultToolbarItems(t)` 工廠，別寫死字串）。

### Bubble menus（Text / Table / Image / Link）

v3 改用 `@tiptap/vue-3/menus`（Floating UI），prop 用 `:options`（非舊 `:tippy-options`），依賴 `@floating-ui/dom`。

### 連結行為（新建與編輯一致）

三個入口——工具列 link 鈕、`TextBubbleMenu`、`LinkBubbleMenu`——都走 `promptLinkWithFallback`，彈出帶「另開視窗」勾選框的對話框，統一以下列方式寫入：

```ts
setLink({
  href,
  target: openInNewTab ? '_blank' : null,
  rel: openInNewTab ? 'noopener noreferrer' : null,
})
```

`rel` 不對使用者暴露、也不提供 `nofollow`（對齊 CKEditor `openInNewTab` decorator / TinyMCE）。`mailto:` / `tel:` 不特別處理——Tiptap 預設協定白名單已含,貼上 / 輸入即可用。

### i18n

三語系 `zh-TW`/`zh-CN`/`en`，`resolveMessages(locale, overrides)` 合併覆寫，經 `rteMessagesKey` provide 給 toolbar 與 bubble menus。
**新增任何 UI 文字時：`i18n/types.ts` 加 key，且 `zh-TW`/`zh-CN`/`en` 三個檔都要補**，否則 type-check 會擋。

### Dialog

`RteDialog.vue`（editor 內覆蓋層，Enter/Esc）取代所有 `window.prompt/alert`。三種開法：`prompt`（純文字）、`promptLink`（文字 + 勾選框，回傳 `{ url, openInNewTab }`）、`alert`。外部 / toolbar item 用 `promptWithFallback` / `promptLinkWithFallback` / `alertWithFallback`（無服務時退回原生）。

### Icons

全用自繪 inline SVG，CSS 強制 16px，對外匯出讓宿主 toolbar 共用，**不混用第三方 icon set**。

## 儲存格式

- 主格式 **Tiptap JSON**（`outputFormat: 'json'`）；HTML 僅供匯出（`exportHtmlToolbarItem` → `getHTML()`）。
- NodeView 不影響儲存：文件只見 `type + attrs + content`。

## 擴充方式

寫**原生** Tiptap `Node.create` / `Mark.create` / `Extension.create`（或 `X.extend`），透過 `:extensions` 追加或 `:resolveExtensions` 完全接管。不自造封閉 plugin 系統。需要基礎設施的功能一律以 `configure({ handler })` 注入介面（例如 `ImageUploadHandler`）。

## Tiptap v3 已知地雷

- StarterKit 已內建 Underline / Link；Placeholder 改自 `@tiptap/extensions`。
- `setContent(content, { emitUpdate: false })` 是 options 物件簽章（非 boolean）。
- `@tiptap/extension-table`、`@tiptap/extension-text-style` 只有 named export。
- `NodeViewContent` 會多包一層 `<div data-node-view-content-vue>`；需要子節點當版面項目的容器要用 `display: contents` 攤平。

## 建置與發布

- **本地 dev 不需 build**：top-level `exports`/`main` 指向 `src/`；`publishConfig` 於 pack/publish 時切到 `dist/`。
- scripts：`build`（`vite build` + `vue-tsc --emitDeclarationOnly` + copy-assets）、`lint`（oxlint）、`format`（oxfmt）。
- **SFC 型別用 `vue-tsc`**（純 `tsc` 不檢 SFC 內部）。改完跑 `pnpm lint` 與 `pnpm exec vue-tsc -p tsconfig.build.json --noEmit` 確認。
- 發布與（現階段的）鏡像同步流程見 [`PUBLISHING.md`](./PUBLISHING.md)。**鐵律：改動一律在來源 repo 進行，不要直接改公開鏡像 repo（歷史會分岔）。**
- README（`README.md` / `README.zh-TW.md`）內連結用**絕對 GitHub URL**（npm 會把相對連結解析到 npmjs.com → 404）。

## 修改本套件時的守則

- 加功能前先問：Tiptap 原生有沒有？知名編輯器怎麼做？會不會帶入基礎設施依賴或情境假設？三者任一不過就重新設計。
- 新增 UI 文字 → 三語系 + `types.ts` 一起補。
- 改樣式 → 純 CSS，不用 CSS 框架、不混第三方 icon。
- 別編輯 `AGENTS.md`（自動產生）。
