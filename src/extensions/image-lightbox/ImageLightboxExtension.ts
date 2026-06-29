import { Extension } from '@tiptap/core'

export interface ImageLightboxOptions {
	/** 套用此燈箱屬性的 node 名稱（預設只有 image） */
	types: string[]
}

/**
 * 圖片燈箱（opt-in）：在 image node 上加 `lightbox` 屬性，
 * 標記為 true 時輸出 `data-lightbox` / `data-lightbox-src` / `data-lightbox-alt`，
 * 供前台燈箱套件（GLightbox / Fancybox 等）讀取後綁定點擊放大行為。
 *
 * 此擴充本身「不顯示」任何燈箱——只負責產生標記契約。
 * 未載入此擴充時，image 不會有 lightbox 屬性，BubbleMenu 的燈箱按鈕與
 * 圖片右上角的標記 badge 都不會出現。
 */
export const ImageLightbox = Extension.create<ImageLightboxOptions>({
	name: 'imageLightbox',

	addOptions() {
		return {
			types: ['image'],
		}
	},

	addGlobalAttributes() {
		return [
			{
				types: this.options.types,
				attributes: {
					lightbox: {
						default: false,
						parseHTML: (el) => (el as HTMLElement).getAttribute('data-lightbox') === 'true',
						renderHTML: (attrs) =>
							attrs.lightbox
								? {
										'data-lightbox': 'true',
										'data-lightbox-src': (attrs.src as string) ?? '',
										'data-lightbox-alt': (attrs.alt as string) ?? '',
									}
								: {},
					},
				},
			},
		]
	},
})
