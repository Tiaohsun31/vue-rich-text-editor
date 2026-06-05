import type { Extensions } from '@tiptap/core'
import type { ImageUploadHandler } from './upload'

export interface RichTextEditorContext {
  extensions: Extensions
}

export interface RichTextEditorOptions {
  uploadImage?: ImageUploadHandler
  extensions?: Extensions
  resolveExtensions?: (context: RichTextEditorContext) => Extensions
}
