import { Extension, Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import FlexColumnsNodeView from './FlexColumnsNodeView.vue'
import type { FlexColumnsConfig, FlexColumnsOptions, FlexGrowSide } from './types'

function parseSide(value: unknown, fallback: FlexGrowSide): FlexGrowSide {
	return value === 'left' || value === 'right' ? value : fallback
}

// 節點名一律加 rte 前綴：Tiptap 對重複的 extension 名稱只會 console.warn，
// 之後靜默地讓陣列後者覆蓋前者——通用名（flexItem 之類）撞到宿主自訂節點會很難查。
const FlexColumn = Node.create({
	name: 'rteFlexColumn',
	content: 'block+',
	isolating: true,

	addAttributes() {
		return {
			side: {
				default: 'left',
				parseHTML: (element) => parseSide(element.getAttribute('data-side'), 'left'),
				renderHTML: (attributes) => ({ 'data-side': String(attributes.side) }),
			},
			grow: {
				default: false,
				parseHTML: (element) => element.getAttribute('data-grow') === 'true',
				renderHTML: (attributes) => ({ 'data-grow': String(attributes.grow === true) }),
			},
		}
	},

	parseHTML() {
		return [{ tag: 'div[data-rte-flex-column]' }]
	},

	renderHTML({ node, HTMLAttributes }) {
		const grows = node.attrs.grow === true
		const style = grows ? 'flex:1 1 22rem;min-width:min(100%,22rem);width:auto' : 'flex:0 1 auto;width:max-content;max-width:100%'

		return [
			'div',
			mergeAttributes(HTMLAttributes, {
				'data-rte-flex-column': '',
				class: 'rte-flex-column',
				style,
			}),
			0,
		]
	},
})

const FlexColumns = Node.create<FlexColumnsOptions>({
	name: 'rteFlexColumns',
	group: 'block',
	content: 'rteFlexColumn rteFlexColumn',
	isolating: true,
	defining: true,

	addOptions() {
		return { HTMLAttributes: {} }
	},

	addAttributes() {
		return {
			growSide: {
				default: 'right',
				parseHTML: (element) => parseSide(element.getAttribute('data-grow-side'), 'right'),
				renderHTML: (attributes) => ({ 'data-grow-side': String(attributes.growSide) }),
			},
		}
	},

	parseHTML() {
		return [{ tag: 'div[data-type="rte-flex-columns"]' }]
	},

	// 匯出 HTML 自帶版面：flex-wrap + 欄位的 min-width 達成窄容器自動換行，不依賴外部 CSS
	renderHTML({ HTMLAttributes }) {
		return [
			'div',
			mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
				'data-type': 'rte-flex-columns',
				class: 'rte-flex-columns',
				style: 'display:flex;flex-wrap:wrap;align-items:flex-start;gap:1rem',
			}),
			0,
		]
	},

	addNodeView() {
		return VueNodeViewRenderer(FlexColumnsNodeView as unknown as Parameters<typeof VueNodeViewRenderer>[0])
	},

	addCommands() {
		return {
			insertFlexColumns:
				(config: FlexColumnsConfig = {}) =>
				({ chain }) => {
					const growSide = parseSide(config.growSide, 'right')
					// 空段落，不種任何文案——避免把語系假設寫進節點
					const columns = (['left', 'right'] as const).map((side) => ({
						type: 'rteFlexColumn',
						attrs: { side, grow: side === growSide },
						content: [{ type: 'paragraph' }],
					}))

					return chain().insertContent({ type: 'rteFlexColumns', attrs: { growSide }, content: columns }).run()
				},
		}
	},
})

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		rteFlexColumns: {
			/** 插入桌面雙欄、窄容器單欄的彈性版型。 */
			insertFlexColumns: (config?: FlexColumnsConfig) => ReturnType
		}
	}
}

/** FlexColumns kit：打包 rteFlexColumns 容器與兩個 rteFlexColumn 子節點。 */
export const FlexColumnsExtension = Extension.create<FlexColumnsOptions>({
	name: 'rteFlexColumnsKit',

	addExtensions() {
		return [FlexColumns, FlexColumn]
	},
})
