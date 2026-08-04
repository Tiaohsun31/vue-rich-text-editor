import { Extension, Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import GridNodeView from './GridNodeView.vue'
import type { GridConfig, GridOptions } from './types'

function clampInt(value: unknown, min: number, max: number, fallback: number): number {
	const n = Number(value)
	return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.trunc(n))) : fallback
}

// 節點名一律加 rte 前綴：Tiptap 對重複的 extension 名稱只會 console.warn，
// 之後靜默地讓陣列後者覆蓋前者——通用名（gridItem 之類）撞到宿主自訂節點會很難查。
const GridCell = Node.create({
	name: 'rteGridCell',
	content: 'block+',
	isolating: true,

	parseHTML() {
		return [{ tag: 'div[data-rte-grid-cell]' }]
	},

	renderHTML({ HTMLAttributes }) {
		return [
			'div',
			mergeAttributes(HTMLAttributes, {
				'data-rte-grid-cell': '',
				class: 'rte-grid-cell',
				style: 'min-width:0',
			}),
			0,
		]
	},
})

const Grid = Node.create<GridOptions>({
	name: 'rteGrid',
	group: 'block',
	content: 'rteGridCell+',
	isolating: true,
	defining: true,

	addOptions() {
		return { HTMLAttributes: {} }
	},

	addAttributes() {
		return {
			columns: {
				default: 2,
				parseHTML: (el) => clampInt(el.getAttribute('data-columns'), 1, 6, 2),
				renderHTML: (attrs) => ({ 'data-columns': String(attrs.columns) }),
			},
			minColumns: {
				default: 1,
				parseHTML: (el) => clampInt(el.getAttribute('data-min-columns'), 1, 3, 1),
				renderHTML: (attrs) => ({ 'data-min-columns': String(attrs.minColumns) }),
			},
		}
	},

	parseHTML() {
		return [{ tag: 'div[data-type="rte-grid"]' }]
	},

	renderHTML({ node, HTMLAttributes }) {
		// 匯出 HTML 自帶版面：inline grid + auto-fit 響應式（窄容器自動換行），
		// 不依賴外部 CSS；編輯與唯讀預覽走 NodeView，不受此影響。
		const columns = clampInt(node.attrs.columns, 1, 6, 2)
		const minColumns = clampInt(node.attrs.minColumns, 1, 3, 1)
		const minItemWidth = minColumns >= 3 ? 110 : minColumns === 2 ? 150 : 200
		const colWidth = (100 / columns).toFixed(4)
		const style =
			'display:grid;gap:0.75rem;' + `grid-template-columns:repeat(auto-fit,minmax(max(${minItemWidth}px, calc(${colWidth}% - 0.75rem)),1fr))`
		return [
			'div',
			mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
				'data-type': 'rte-grid',
				class: 'rte-grid',
				style,
			}),
			0,
		]
	},

	addNodeView() {
		return VueNodeViewRenderer(GridNodeView as unknown as Parameters<typeof VueNodeViewRenderer>[0])
	},

	addCommands() {
		return {
			insertGrid:
				(config: GridConfig = { minColumns: 1, maxColumns: 2 }) =>
				({ chain }) => {
					const columns = clampInt(config.maxColumns, 1, 6, 2)
					const minColumns = clampInt(config.minColumns, 1, Math.min(3, columns), 1)
					// 空段落，不種任何文案——避免把語系假設寫進節點
					const cells = Array.from({ length: columns }, () => ({
						type: 'rteGridCell',
						content: [{ type: 'paragraph' }],
					}))
					return chain().insertContent({ type: 'rteGrid', attrs: { columns, minColumns }, content: cells }).run()
				},
		}
	},
})

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		rteGrid: {
			/** 插入響應式網格區塊 */
			insertGrid: (config?: GridConfig) => ReturnType
		}
	}
}

/** Grid kit：打包 rteGrid 容器與 rteGridCell 子節點。 */
export const GridExtension = Extension.create<GridOptions>({
	name: 'rteGridKit',

	addExtensions() {
		return [Grid, GridCell]
	},
})
