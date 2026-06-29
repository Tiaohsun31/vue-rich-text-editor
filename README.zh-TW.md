# @tiaohsun/vue-rich-text-editor

> [English](https://github.com/Tiaohsun31/vue-rich-text-editor/blob/main/README.md) · **繁體中文**

一個基於 [Tiptap](https://tiptap.dev) v3 的輕量 Vue 3 封裝，開箱即用。

**本套件的所有功能皆來自 Tiptap。** 我們只是把官方擴充整併成一個現成的編輯器元件
（內含 toolbar 與 bubble menu），讓你不必自己接線就能放進一個富文字編輯器。

> 本套件**刻意不另外撰寫技術文件**。凡是超出本頁範圍的需求 —— 新增 node/mark、自訂
> 命令、快捷鍵、node view、schema 等 —— 請直接使用 Tiptap，並查閱
> [Tiptap 官方文件](https://tiptap.dev/docs)。本套件不發明自己的外掛系統；擴充方式
> 與你擴充任何 Tiptap 編輯器**完全一致**。

---

## 功能

以下全部由 Tiptap 提供，這裡只是預先接好：

- 標題、粗體/斜體/底線/刪除線、引用、清單、行內碼與程式碼區塊、分隔線
- 連結（附連結 bubble menu）
- 表格（插入/合併/拆分，附表格 bubble menu）
- 圖片 —— 可縮放/可對齊的 node view，附圖片 bubble menu
- YouTube 內嵌
- 文字對齊、文字顏色、字型、字級、螢光標記
- 折疊區塊：採官方 `Details` 擴充（輸出原生 `<details>`）
- Placeholder，及 `Ctrl/Cmd+Shift+Enter` 跳出引用/表格
- 可設定的 toolbar 與 文字/表格/圖片/連結 bubble menu
- 輸出為 **HTML** 或 **Tiptap JSON**

選用（需自行載入）擴充：圖片上傳 handler、文字燈箱、圖片燈箱。

---

## 安裝

```bash
npm i @tiaohsun/vue-rich-text-editor
# 或：pnpm add @tiaohsun/vue-rich-text-editor
```

以下 peer 依賴需一併安裝（刻意維持單一份，避免重複的 ProseMirror/Tiptap 實例）：

```bash
npm i vue@^3.5 @tiptap/core@^3 @tiptap/pm@^3 @tiptap/vue-3@^3
```

---

## 快速開始

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { RichTextEditor } from '@tiaohsun/vue-rich-text-editor'
import '@tiaohsun/vue-rich-text-editor/styles'

const content = ref('') // 預設為 HTML 字串
</script>

<template>
  <RichTextEditor v-model="content" placeholder="開始輸入…" />
</template>
```

改以 Tiptap JSON 儲存（建議）：

```vue
<RichTextEditor v-model="doc" output-format="json" />
```

唯讀渲染（例如顯示已儲存內容）：

```vue
<RichTextEditor :model-value="content" readonly />
```

---

## `<RichTextEditor>` props

| Prop                | 型別                                            | 預設     | 說明                                                  |
| ------------------- | ----------------------------------------------- | -------- | ----------------------------------------------------- |
| `modelValue`        | `string \| JSONContent \| null`                 | `''`     | `v-model`。HTML 字串，或當 `output-format="json"` 時為 Tiptap JSON。 |
| `outputFormat`      | `'html' \| 'json'`                              | `'html'` | `update:modelValue` 送出的格式。                      |
| `extensions`        | `Extensions`                                    | `[]`     | 追加在預設集之後的 Tiptap 擴充。                      |
| `resolveExtensions` | `(ctx) => Extensions`                           | —        | 完全取代預設擴充集。                                  |
| `toolbarItems`      | `ToolbarItem[]`                                 | 預設     | 覆寫 toolbar（見下方）。                              |
| `placeholder`       | `string`                                        | —        | placeholder 文字。                                    |
| `readonly`          | `boolean`                                       | `false`  | 停用編輯；隱藏 toolbar 與 bubble menu。               |

---

## 擴充（Tiptap 原生作法）

`extensions` 就是一個原生 Tiptap 擴充陣列，會追加在內建集之後：

```vue
<script setup lang="ts">
import { RichTextEditor } from '@tiaohsun/vue-rich-text-editor'
import MyExtension from './MyExtension' // 一般的 Node/Mark/Extension.create(...)
</script>

<template>
  <RichTextEditor v-model="content" :extensions="[MyExtension]" />
</template>
```

需要完全掌控預設集？用 `resolveExtensions`：

```ts
import { createDefaultExtensions } from '@tiaohsun/vue-rich-text-editor'

const resolve = () => [
  ...createDefaultExtensions({ placeholder: '…' }),
  // 自行增刪、調整順序
]
```

> 撰寫擴充本身（node、mark、命令、node view）就是純 Tiptap ——
> 請見 [Tiptap 文件](https://tiptap.dev/docs/editor/extensions/custom-extensions)。

---

## 選用擴充

以 subpath 匯入，在你選用之前不會進入核心 bundle。

### 圖片上傳

```ts
import { ImageUploadExtension, imageUploadToolbarItem } from '@tiaohsun/vue-rich-text-editor/extensions/image-upload'
import type { ImageUploadHandler } from '@tiaohsun/vue-rich-text-editor/extensions/image-upload'

const upload: ImageUploadHandler = async (file) => {
  const url = await uploadSomewhere(file) // 你的儲存（R2、S3…）
  return { url }
}
```

```vue
<RichTextEditor
  v-model="content"
  :extensions="[ImageUploadExtension.configure({ upload })]"
  :toolbar-items="[...defaultToolbarItems, imageUploadToolbarItem]"
/>
```

### 文字燈箱（Text lightbox）

把選取的文字包成 `<a data-lightbox="true" data-lightbox-type="text" …>`。

```ts
import { LightboxExtension, lightboxToolbarItem } from '@tiaohsun/vue-rich-text-editor/extensions/lightbox'
```

```vue
<RichTextEditor
  v-model="content"
  :extensions="[LightboxExtension.configure({})]"
  :toolbar-items="[...defaultToolbarItems, lightboxToolbarItem]"
/>
```

### 圖片燈箱（Image lightbox）

在圖片上加 `lightbox` 屬性。標記開啟後，圖片會輸出 `data-lightbox="true"` /
`data-lightbox-src` / `data-lightbox-alt`，供前台燈箱套件讀取。

此擴充只產生「標記契約」，本身不會顯示燈箱。**屬於 opt-in**：未載入時，圖片
BubbleMenu 的燈箱開關按鈕與編輯器內的 🔍 標記都不會出現。請僅在前台確實接了
燈箱檢視器時才載入。

```ts
import { ImageLightbox } from '@tiaohsun/vue-rich-text-editor/extensions/image-lightbox'
```

```vue
<RichTextEditor v-model="content" :extensions="[ImageLightbox]" />
```

---

## Toolbar

Toolbar 是一個扁平的項目清單，可從預設組合出自己的版本：

```ts
import { defaultToolbarItems, exportHtmlToolbarItem } from '@tiaohsun/vue-rich-text-editor'
import type { ToolbarItem } from '@tiaohsun/vue-rich-text-editor'

const toolbarItems: ToolbarItem[] = [
  ...defaultToolbarItems,
  { type: 'separator' },
  exportHtmlToolbarItem,
  myCustomButton,
]
```

`ToolbarItem` 為下列其一：

- **Button** —— `{ name, icon, label, command(editor), isActive?, isDisabled? }`
- **Dropdown** —— `{ type: 'dropdown', name, options, getValue(editor), command(editor, value) }`
- **Separator** —— `{ type: 'separator' }`

內建 SVG icon 皆有匯出（如 `BoldIcon`、`ImageIcon`…），方便維持一致風格。

---

## 輸出格式

- **HTML**（`output-format="html"`，預設）—— 方便，但匯出標記可能含表現用 class，
  適合同技術棧渲染。
- **Tiptap JSON**（`output-format="json"`）—— 建議的儲存格式。無損、穩定，且不綁定
  HTML 序列化。

---

## 授權

MIT —— 見 [`LICENSE`](https://github.com/Tiaohsun31/vue-rich-text-editor/blob/main/LICENSE)。

所有編輯能力均由 [Tiptap](https://tiptap.dev)（MIT）提供並沿用其授權；Tiptap 為 peer 依賴、不打包進本套件。內建 SVG icon path 衍生自 Lucide（ISC）。第三方授權聲明見 [`THIRD_PARTY_NOTICES.md`](https://github.com/Tiaohsun31/vue-rich-text-editor/blob/main/THIRD_PARTY_NOTICES.md)。
