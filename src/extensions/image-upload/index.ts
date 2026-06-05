import type { ToolbarButton } from '../../toolbar/types'
import { UploadIcon } from '../../icons'

export { ImageUploadExtension } from './ImageUploadExtension'
export type { ImageUploadHandler, ImageUploadOptions } from './types'

/** 可附加到 toolbar 的「上傳圖片」按鈕（開啟檔案選擇器）。 */
export const imageUploadToolbarItem: ToolbarButton = {
  name: 'imageUpload',
  icon: UploadIcon,
  label: '上傳圖片',
  command: (editor) => {
    editor.chain().focus().openImageUpload().run()
  },
}
