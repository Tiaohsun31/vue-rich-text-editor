import { promptWithFallback, alertWithFallback } from '../../dialog/dialog'
import type { RteMessages } from '../../i18n'
import { zhTW } from '../../i18n'
import { LightboxIcon } from '../../icons'
import type { ToolbarButton, ToolbarContext } from '../../toolbar/types'

export { LightboxExtension } from './LightboxExtension'
export { default as LightboxBubbleMenu } from './LightboxBubbleMenu.vue'
export type { LightboxType, LightboxConfig, LightboxOptions } from './types'
export type { SetLightboxAttrs } from './LightboxExtension'

/** 「燈箱」toolbar 按鈕工廠：將選取文字標記為 lightbox。 */
export function createLightboxToolbarItem(t: RteMessages = zhTW): ToolbarButton {
	return {
		name: 'lightbox',
		icon: LightboxIcon,
		label: t.lightbox,
		isActive: (editor) => editor.isActive('lightbox'),
		command: (editor, ctx?: ToolbarContext) => {
			if (editor.isActive('lightbox')) {
				editor.chain().focus().extendMarkRange('lightbox').unsetLightbox().run()
				return
			}
			if (editor.state.selection.empty) {
				alertWithFallback(ctx, t.lightboxSelectTextFirst)
				return
			}
			void promptWithFallback(ctx, t.promptLightboxUrl).then((url) => {
				if (url) {
					editor.chain().focus().setLightbox({ imageSrc: url }).run()
				}
			})
		},
	}
}

/** 預設（zh-TW）按鈕，向下相容既有用法。 */
export const lightboxToolbarItem: ToolbarButton = createLightboxToolbarItem(zhTW)
