import Youtube from '@tiptap/extension-youtube'
import type { DOMOutputSpec } from '@tiptap/pm/model'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import ResizableYoutubeNodeView from './ResizableYoutubeNodeView.vue'

export type YoutubeAlign = 'left' | 'center' | 'right'

/** 外層容器的 inline style：寬度（RWD 上限 100%）+ 以 margin 表達對齊 */
export function youtubeWrapperStyle(align: YoutubeAlign, size: string): string {
	const style = [`width:${size}`, 'max-width:100%']
	if (align === 'center') style.push('margin-left:auto', 'margin-right:auto')
	else if (align === 'right') style.push('margin-left:auto', 'margin-right:0')
	else style.push('margin-left:0', 'margin-right:auto')
	return style.join(';')
}

/** iframe 的 inline style：填滿容器並固定 16:9，讓匯出的 HTML 不依賴編輯器 CSS */
const IFRAME_STYLE = 'display:block;width:100%;height:auto;aspect-ratio:16/9;border:0'

export function normalizeYoutubeAlign(value: unknown): YoutubeAlign {
	return value === 'center' || value === 'right' ? value : 'left'
}

/**
 * 可縮放 / 可對齊的 YouTube 影片：在官方 Youtube 上加 align + size 屬性與 Vue NodeView。
 *
 * 官方 extension 只輸出 div[data-youtube-video] > iframe，沒有對齊屬性，也沒有 NodeView——
 * iframe 會吃掉 mousedown，導致點擊只會播放、選不到節點（BubbleMenu 因此無法觸發）。
 * 這裡補上兩者：對齊寫進外層 div 的 inline style（不依賴 CSS 框架），
 * 編輯時由 NodeView 讓 iframe 不接事件，點擊即選取節點。
 */
export const ResizableYoutube = Youtube.extend({
	addAttributes() {
		return {
			...this.parent?.(),
			align: {
				default: 'left',
				parseHTML: (el) => normalizeYoutubeAlign(el.parentElement?.getAttribute('data-align')),
				renderHTML: () => ({}),
			},
			// 顯示寬度（百分比字串，例如 '60%'）；null 代表沿用 options.width
			size: {
				default: null,
				parseHTML: (el) => el.parentElement?.style.width || null,
				renderHTML: () => ({}),
			},
		}
	},

	renderHTML(props) {
		const align = normalizeYoutubeAlign(props.node.attrs.align)
		const size = (props.node.attrs.size as string | null) ?? `${this.options.width}px`

		// 沿用 parent 的 embed URL 組裝邏輯，只加工外層 div 與 iframe 的 style
		const parentSpec = this.parent?.(props) as [string, Record<string, string>, [string, Record<string, string>]] | undefined
		if (!parentSpec) return ['div', { 'data-youtube-video': '' }] as DOMOutputSpec

		const [tag, wrapperAttrs, [iframeTag, iframeAttrs]] = parentSpec

		return [
			tag,
			{ ...wrapperAttrs, 'data-align': align, style: youtubeWrapperStyle(align, size) },
			[iframeTag, { ...iframeAttrs, style: IFRAME_STYLE }],
		] as DOMOutputSpec
	},

	addNodeView() {
		return VueNodeViewRenderer(ResizableYoutubeNodeView as unknown as Parameters<typeof VueNodeViewRenderer>[0])
	},
})
