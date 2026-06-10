export { default as RichTextEditor } from './components/RichTextEditor.vue'

export { createDefaultExtensions } from './presets/createDefaultExtensions'
// v3 起 FontSize 為官方擴充（整併於 extension-text-style），再匯出供向下相容
export { FontSize } from '@tiptap/extension-text-style'

export {
  defaultToolbarItems,
  exportHtmlToolbarItem,
  createDefaultToolbarItems,
  createExportHtmlToolbarItem,
} from './toolbar/defaultToolbarItems'
export type {
  ToolbarItem,
  ToolbarButton,
  ToolbarSeparator,
  ToolbarDropdown,
  ToolbarDropdownOption,
  ToolbarContext,
} from './toolbar/types'

// i18n
export { locales, resolveMessages, rteMessagesKey, zhTW, zhCN, en } from './i18n'
export type { RteLocale, RteMessages } from './i18n'

// Dialog（取代 window.prompt/alert）
export {
  createRteDialog,
  rteDialogKey,
  promptWithFallback,
  alertWithFallback,
} from './dialog/dialog'
export type { RteDialogService, RtePromptOptions, PromptFn } from './dialog/dialog'

export type { RichTextEditorOptions, RichTextEditorContext } from './types/editor'
export type { ImageUploadHandler } from './types/upload'
export type { EditorContent } from './types/content'

// 共用 icon 元件（toolbar 一致性用）
export * from './icons'
