import { mergeAttributes } from '@tiptap/core'
import Image from '@tiptap/extension-image'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import ResizableImageNodeView from './ResizableImageNodeView.vue'

/**
 * 可縮放 / 可對齊圖片：在核心 Image 上加 width + align 屬性與 Vue NodeView。
 * 輸出以 inline style 表達（width 百分比 + max-width:100% 達成 RWD），不依賴 Tailwind。
 */
export const ResizableImage = Image.extend({
	addAttributes() {
		return {
			...this.parent?.(),
			width: {
				default: null,
				parseHTML: (el) => (el as HTMLElement).style.width || el.getAttribute('width') || null,
				renderHTML: () => ({}),
			},
			align: {
				default: 'left',
				parseHTML: (el) => el.getAttribute('data-align') || 'left',
				renderHTML: () => ({}),
			},
		}
	},

	// 注意：lightbox 屬性與其 data-* 輸出由 opt-in 的 ImageLightbox 擴充
	// （extensions/image-lightbox）透過 addGlobalAttributes 掛上，核心不耦合。
	renderHTML({ HTMLAttributes, node }) {
		const width = node.attrs.width as string | null
		const align = (node.attrs.align as string) ?? 'left'
		const style: string[] = ['max-width:100%']
		if (width) style.push(`width:${width}`)
		if (align === 'center') style.push('display:block', 'margin-left:auto', 'margin-right:auto')
		else if (align === 'right') style.push('display:block', 'margin-left:auto')

		return [
			'img',
			mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
				style: style.join(';'),
				'data-align': align,
			}),
		]
	},

	addNodeView() {
		return VueNodeViewRenderer(ResizableImageNodeView as unknown as Parameters<typeof VueNodeViewRenderer>[0])
	},
})
