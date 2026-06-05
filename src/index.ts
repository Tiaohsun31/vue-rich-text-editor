export { default as RichTextEditor } from './components/RichTextEditor.vue'

export { createDefaultExtensions } from './presets/createDefaultExtensions'
export { FontSize } from './presets/fontSize'

export { defaultToolbarItems, exportHtmlToolbarItem } from './toolbar/defaultToolbarItems'
export type {
  ToolbarItem,
  ToolbarButton,
  ToolbarSeparator,
  ToolbarDropdown,
  ToolbarDropdownOption,
} from './toolbar/types'

export type { RichTextEditorOptions, RichTextEditorContext } from './types/editor'
export type { ImageUploadHandler } from './types/upload'
export type { EditorContent } from './types/content'

// 共用 icon 元件（toolbar 一致性用）
export * from './icons'
