import type { RteMessages } from '../../i18n'
import { zhTW } from '../../i18n'
import { UploadIcon } from '../../icons'
import type { ToolbarButton } from '../../toolbar/types'

export { ImageUploadExtension } from './ImageUploadExtension'
export type { ImageUploadHandler, ImageUploadOptions } from './types'

/** 「上傳圖片」toolbar 按鈕工廠（開啟檔案選擇器）。 */
export function createImageUploadToolbarItem(t: RteMessages = zhTW): ToolbarButton {
	return {
		name: 'imageUpload',
		icon: UploadIcon,
		label: t.uploadImage,
		command: (editor) => {
			editor.chain().focus().openImageUpload().run()
		},
	}
}

/** 預設（zh-TW）按鈕，向下相容既有用法。 */
export const imageUploadToolbarItem: ToolbarButton = createImageUploadToolbarItem(zhTW)
