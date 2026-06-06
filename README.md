# @eshop/rich-text-editor

> **English** · [繁體中文](./README.zh-TW.md)

A thin, batteries-included Vue 3 wrapper around [Tiptap](https://tiptap.dev) v3.

**Every feature in this package comes from Tiptap.** We only bundle the official
extensions into a ready-to-use editor component with a toolbar and bubble menus,
so you can drop in a rich text editor without wiring everything up yourself.

> There is intentionally **no separate technical documentation**. For anything
> beyond what is shown here — adding nodes/marks, custom commands, keyboard
> shortcuts, node views, schema, etc. — use Tiptap directly and read the
> [official Tiptap docs](https://tiptap.dev/docs). This package does not invent
> its own plugin system; you extend it the exact same way you extend any Tiptap editor.

---

## Features

All provided by Tiptap, pre-wired here:

- Headings, bold/italic/underline/strike, blockquote, lists, code & code block, horizontal rule
- Links (with a link bubble menu)
- Tables (insert/merge/split via a table bubble menu)
- Images — resizable & alignable node view, with an image bubble menu
- YouTube embeds
- Text alignment, text color, font family, font size, highlight
- Collapsible blocks via the official `Details` extension (native `<details>`)
- Placeholder, and `Ctrl/Cmd+Shift+Enter` to exit a blockquote/table
- A configurable toolbar and text/table/image/link bubble menus
- Output as **HTML** or **Tiptap JSON**

Optional (opt-in) extensions: image upload handler, lightbox.

---

## Install

This is a workspace package (not yet published to npm):

```jsonc
// package.json
{
  "dependencies": {
    "@eshop/rich-text-editor": "workspace:*"
  }
}
```

Peer dependency: `vue@^3.5`.

---

## Quick start

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { RichTextEditor } from '@eshop/rich-text-editor'
import '@eshop/rich-text-editor/styles'

const content = ref('') // HTML string by default
</script>

<template>
  <RichTextEditor v-model="content" placeholder="Start typing…" />
</template>
```

Store as Tiptap JSON instead of HTML:

```vue
<RichTextEditor v-model="doc" output-format="json" />
```

Read-only rendering (e.g. to display saved content):

```vue
<RichTextEditor :model-value="content" readonly />
```

---

## `<RichTextEditor>` props

| Prop                | Type                                            | Default  | Description                                              |
| ------------------- | ----------------------------------------------- | -------- | ------------------------------------------------------- |
| `modelValue`        | `string \| JSONContent \| null`                 | `''`     | `v-model`. HTML string, or Tiptap JSON when `output-format="json"`. |
| `outputFormat`      | `'html' \| 'json'`                              | `'html'` | What `update:modelValue` emits.                         |
| `extensions`        | `Extensions`                                    | `[]`     | Extra Tiptap extensions appended to the defaults.       |
| `resolveExtensions` | `(ctx) => Extensions`                           | —        | Fully replace the default extension set.                |
| `toolbarItems`      | `ToolbarItem[]`                                 | defaults | Override the toolbar (see below).                       |
| `placeholder`       | `string`                                        | —        | Placeholder text.                                       |
| `readonly`          | `boolean`                                       | `false`  | Disable editing; hides the toolbar and bubble menus.    |

---

## Extending (the Tiptap way)

`extensions` is just an array of native Tiptap extensions appended to the built-in set:

```vue
<script setup lang="ts">
import { RichTextEditor } from '@eshop/rich-text-editor'
import MyExtension from './MyExtension' // a normal Node/Mark/Extension.create(...)
</script>

<template>
  <RichTextEditor v-model="content" :extensions="[MyExtension]" />
</template>
```

Need full control over the default set? Use `resolveExtensions`:

```ts
import { createDefaultExtensions } from '@eshop/rich-text-editor'

const resolve = () => [
  ...createDefaultExtensions({ placeholder: '…' }),
  // add / remove / reorder as you like
]
```

> Writing the extension itself (nodes, marks, commands, node views) is plain
> Tiptap — see the [Tiptap docs](https://tiptap.dev/docs/editor/extensions/custom-extensions).

---

## Optional extensions

Imported from subpaths so they stay out of the core bundle until you opt in.

### Image upload

```ts
import { ImageUploadExtension, imageUploadToolbarItem } from '@eshop/rich-text-editor/extensions/image-upload'
import type { ImageUploadHandler } from '@eshop/rich-text-editor/extensions/image-upload'

const upload: ImageUploadHandler = async (file) => {
  const url = await uploadSomewhere(file) // your storage (R2, S3, …)
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

### Lightbox

```ts
import { LightboxExtension, lightboxToolbarItem } from '@eshop/rich-text-editor/extensions/lightbox'
```

```vue
<RichTextEditor
  v-model="content"
  :extensions="[LightboxExtension.configure({})]"
  :toolbar-items="[...defaultToolbarItems, lightboxToolbarItem]"
/>
```

---

## Toolbar

The toolbar is a flat list of items. Compose your own from the defaults:

```ts
import { defaultToolbarItems, exportHtmlToolbarItem } from '@eshop/rich-text-editor'
import type { ToolbarItem } from '@eshop/rich-text-editor'

const toolbarItems: ToolbarItem[] = [
  ...defaultToolbarItems,
  { type: 'separator' },
  exportHtmlToolbarItem,
  myCustomButton,
]
```

A `ToolbarItem` is one of:

- **Button** — `{ name, icon, label, command(editor), isActive?, isDisabled? }`
- **Dropdown** — `{ type: 'dropdown', name, options, getValue(editor), command(editor, value) }`
- **Separator** — `{ type: 'separator' }`

Built-in SVG icons are exported (e.g. `BoldIcon`, `ImageIcon`, …) for consistent styling.

---

## Output format

- **HTML** (`output-format="html"`, default) — convenient, but the exported markup
  may include presentational classes; best for same-stack rendering.
- **Tiptap JSON** (`output-format="json"`) — the recommended storage format. Lossless,
  stable, and not coupled to HTML serialization.

---

## License / status

Internal workspace package, not yet published to npm. All editor capabilities are
Tiptap's and remain under Tiptap's licensing.
