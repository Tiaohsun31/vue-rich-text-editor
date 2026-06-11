import { Mark, mergeAttributes } from '@tiptap/core'

import type { LightboxOptions } from './types'

export interface SetLightboxAttrs {
	imageSrc: string
	alt?: string
	group?: string
}

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		lightbox: {
			/** 將選取文字標記為 lightbox 連結 */
			setLightbox: (attrs: SetLightboxAttrs) => ReturnType
			/** 移除 lightbox 標記 */
			unsetLightbox: () => ReturnType
		}
	}
}

/**
 * 文字型 lightbox：把選取文字包成 `<a data-lightbox="true" ...>`，
 * 點擊後由前台燈箱套件顯示 data-lightbox-src 指向的圖片。
 *
 * 對應原 CKEditor LightboxPlugin 的 text 模式輸出格式：
 * `<a href="#" data-lightbox="true" data-lightbox-src data-lightbox-alt data-lightbox-type="text">`
 */
export const LightboxExtension = Mark.create<LightboxOptions>({
	name: 'lightbox',
	inclusive: false,
	excludes: '_',

	addOptions() {
		return {
			defaultGroup: undefined,
			HTMLAttributes: {},
		}
	},

	addAttributes() {
		return {
			src: {
				default: null,
				parseHTML: (el) => el.getAttribute('data-lightbox-src'),
				renderHTML: (attrs) => (attrs.src ? { 'data-lightbox-src': attrs.src } : {}),
			},
			alt: {
				default: null,
				parseHTML: (el) => el.getAttribute('data-lightbox-alt'),
				renderHTML: (attrs) => (attrs.alt ? { 'data-lightbox-alt': attrs.alt } : {}),
			},
			group: {
				default: this.options.defaultGroup ?? null,
				parseHTML: (el) => el.getAttribute('data-lightbox-group'),
				renderHTML: (attrs) => (attrs.group ? { 'data-lightbox-group': attrs.group } : {}),
			},
		}
	},

	parseHTML() {
		return [{ tag: 'a[data-lightbox]' }]
	},

	renderHTML({ HTMLAttributes }) {
		return [
			'a',
			mergeAttributes({ href: '#', 'data-lightbox': 'true', 'data-lightbox-type': 'text' }, this.options.HTMLAttributes, HTMLAttributes),
			0,
		]
	},

	addCommands() {
		return {
			setLightbox:
				(attrs) =>
				({ commands }) =>
					commands.setMark(this.name, {
						src: attrs.imageSrc,
						alt: attrs.alt ?? '',
						group: attrs.group ?? this.options.defaultGroup ?? null,
					}),
			unsetLightbox:
				() =>
				({ commands }) =>
					commands.unsetMark(this.name),
		}
	},
})
