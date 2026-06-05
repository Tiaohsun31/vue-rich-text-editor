import type { ToolbarButton } from '../../toolbar/types'
import { LightboxIcon } from '../../icons'

export { LightboxExtension } from './LightboxExtension'
export { default as LightboxBubbleMenu } from './LightboxBubbleMenu.vue'
export type { LightboxType, LightboxConfig, LightboxOptions } from './types'
export type { SetLightboxAttrs } from './LightboxExtension'

/** 可附加到 toolbar 的「燈箱」按鈕：將選取文字標記為 lightbox。 */
export const lightboxToolbarItem: ToolbarButton = {
  name: 'lightbox',
  icon: LightboxIcon,
  label: '燈箱',
  isActive: (editor) => editor.isActive('lightbox'),
  command: (editor) => {
    if (editor.isActive('lightbox')) {
      editor.chain().focus().extendMarkRange('lightbox').unsetLightbox().run()
      return
    }
    if (editor.state.selection.empty) {
      window.alert('請先選取要套用燈箱的文字')
      return
    }
    const url = window.prompt('輸入燈箱要顯示的圖片網址')
    if (url) {
      editor.chain().focus().setLightbox({ imageSrc: url }).run()
    }
  },
}
