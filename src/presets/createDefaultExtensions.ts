import { Extension } from '@tiptap/core'
import { Details, DetailsSummary, DetailsContent } from '@tiptap/extension-details'
import Highlight from '@tiptap/extension-highlight'
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table'
import TextAlign from '@tiptap/extension-text-align'
// v3 起 TextStyle 家族（Color / FontFamily / FontSize）整併於 extension-text-style
import { TextStyle, Color, FontFamily, FontSize } from '@tiptap/extension-text-style'
import { Placeholder } from '@tiptap/extensions'
import { TextSelection } from '@tiptap/pm/state'
import StarterKit from '@tiptap/starter-kit'

import { ResizableImage } from '../nodes/ResizableImage'
import { ResizableYoutube } from '../nodes/ResizableYoutube'

export interface DefaultExtensionsOptions {
	placeholder?: string
}

// Ctrl+Shift+Enter: 跳出目前的 blockquote 或 table，在後方插入新段落
const ExitBlock = Extension.create({
	name: 'exitBlock',
	addKeyboardShortcuts() {
		return {
			'Mod-Shift-Enter': () => {
				const { state, view } = this.editor
				const { $from } = state.selection
				const { blockquote, table } = state.schema.nodes

				const targets = [blockquote, table].filter(Boolean)

				for (let depth = $from.depth; depth >= 1; depth--) {
					if (targets.includes($from.node(depth).type)) {
						const after = $from.after(depth)
						if (after > state.doc.content.size) return false
						const tr = state.tr.insert(after, state.schema.nodes.paragraph.create())
						tr.setSelection(TextSelection.near(tr.doc.resolve(after + 1)))
						view.dispatch(tr)
						return true
					}
				}

				return false
			},
		}
	},
})

export function createDefaultExtensions(options: DefaultExtensionsOptions = {}) {
	return [
		StarterKit.configure({
			// v3 StarterKit 已內建 Underline / Link / HardBreak；Link 在此設定
			link: {
				openOnClick: false,
				autolink: true,
				// 沒有協定的網址預設補 https（mailto:/tel: 等已帶 scheme 者不受影響）
				defaultProtocol: 'https',
				// 預設同頁開啟、不強加 nofollow（對齊主流編輯器的中性預設）；
				// 「另開視窗」改由連結逐條在勾選時補 target=_blank + rel=noopener noreferrer
				HTMLAttributes: {
					target: null,
					rel: null,
				},
			},
		}),
		ResizableImage.configure({
			inline: false,
			allowBase64: false,
		}),
		Table.configure({
			resizable: true,
		}),
		TableRow,
		TableCell,
		TableHeader,
		ResizableYoutube.configure({
			controls: true,
			nocookie: true,
			HTMLAttributes: { class: 'rte-youtube' },
		}),
		TextAlign.configure({
			types: ['heading', 'paragraph'],
		}),
		TextStyle,
		Color,
		FontFamily,
		FontSize,
		Highlight.configure({ multicolor: true }),
		// 折疊區塊：官方 Details（v3 起 MIT），輸出原生 <details>；persist:false → 不把展開狀態寫進文件
		Details.configure({
			persist: false,
			openClassName: 'is-open',
			HTMLAttributes: { class: 'rte-details' },
			renderToggleButton: ({ element, isOpen }) => {
				element.classList.add('rte-details__toggle')
				element.setAttribute('aria-label', isOpen ? '收合' : '展開')
				element.setAttribute('aria-expanded', isOpen ? 'true' : 'false')
			},
		}),
		DetailsSummary,
		DetailsContent,
		Placeholder.configure({
			placeholder: options.placeholder ?? '開始輸入內容…',
		}),
		ExitBlock,
	]
}
