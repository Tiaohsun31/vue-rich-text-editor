import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import { Extension } from '@tiptap/core'
import { TextSelection } from '@tiptap/pm/state'

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
      // HardBreak (Shift+Enter) 已內建，不需額外設定
    }),
    Underline,
    Link.configure({
      openOnClick: false,
      autolink: true,
    }),
    Image.configure({
      inline: false,
      allowBase64: false,
    }),
    Table.configure({
      resizable: true,
    }),
    TableRow,
    TableCell,
    TableHeader,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true }),
    Placeholder.configure({
      placeholder: options.placeholder ?? '開始輸入內容…',
    }),
    ExitBlock,
  ]
}
