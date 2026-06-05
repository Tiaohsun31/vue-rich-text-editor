import type { Editor } from '@tiptap/core'
import type { ToolbarItem } from './types'
import {
  UndoIcon,
  RedoIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  BulletListIcon,
  OrderedListIcon,
  BlockquoteIcon,
  HorizontalRuleIcon,
  LinkIcon,
  ImageIcon,
  TableIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  AlignJustifyIcon,
  HighlighterIcon,
  TextColorIcon,
} from '../icons'

const sep: ToolbarItem = { type: 'separator' }

export const defaultToolbarItems: ToolbarItem[] = [
  {
    name: 'undo',
    icon: UndoIcon,
    label: '復原',
    isDisabled: (e: Editor) => !e.can().undo(),
    command: (e: Editor) => e.chain().focus().undo().run(),
  },
  {
    name: 'redo',
    icon: RedoIcon,
    label: '重做',
    isDisabled: (e: Editor) => !e.can().redo(),
    command: (e: Editor) => e.chain().focus().redo().run(),
  },
  sep,
  {
    name: 'heading1',
    icon: Heading1Icon,
    label: '標題 1',
    isActive: (e: Editor) => e.isActive('heading', { level: 1 }),
    command: (e: Editor) => e.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    name: 'heading2',
    icon: Heading2Icon,
    label: '標題 2',
    isActive: (e: Editor) => e.isActive('heading', { level: 2 }),
    command: (e: Editor) => e.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    name: 'heading3',
    icon: Heading3Icon,
    label: '標題 3',
    isActive: (e: Editor) => e.isActive('heading', { level: 3 }),
    command: (e: Editor) => e.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  sep,
  {
    name: 'bold',
    icon: BoldIcon,
    label: '粗體',
    isActive: (e: Editor) => e.isActive('bold'),
    command: (e: Editor) => e.chain().focus().toggleBold().run(),
  },
  {
    name: 'italic',
    icon: ItalicIcon,
    label: '斜體',
    isActive: (e: Editor) => e.isActive('italic'),
    command: (e: Editor) => e.chain().focus().toggleItalic().run(),
  },
  {
    name: 'underline',
    icon: UnderlineIcon,
    label: '底線',
    isActive: (e: Editor) => e.isActive('underline'),
    command: (e: Editor) => e.chain().focus().toggleUnderline().run(),
  },
  {
    name: 'strike',
    icon: StrikeIcon,
    label: '刪除線',
    isActive: (e: Editor) => e.isActive('strike'),
    command: (e: Editor) => e.chain().focus().toggleStrike().run(),
  },
  {
    name: 'highlight',
    icon: HighlighterIcon,
    label: '螢光標記',
    isActive: (e: Editor) => e.isActive('highlight'),
    command: (e: Editor) => e.chain().focus().toggleHighlight({ color: '#fef08a' }).run(),
  },
  {
    name: 'color',
    icon: TextColorIcon,
    label: '文字顏色',
    command: (e: Editor) => {
      const input = document.createElement('input')
      input.type = 'color'
      input.value = (e.getAttributes('textStyle').color as string) || '#000000'
      input.style.position = 'fixed'
      input.style.opacity = '0'
      input.addEventListener('input', () => {
        e.chain().focus().setColor(input.value).run()
      })
      input.addEventListener('change', () => input.remove())
      document.body.appendChild(input)
      input.click()
    },
  },
  sep,
  {
    name: 'alignLeft',
    icon: AlignLeftIcon,
    label: '靠左對齊',
    isActive: (e: Editor) => e.isActive({ textAlign: 'left' }),
    command: (e: Editor) => e.chain().focus().setTextAlign('left').run(),
  },
  {
    name: 'alignCenter',
    icon: AlignCenterIcon,
    label: '置中對齊',
    isActive: (e: Editor) => e.isActive({ textAlign: 'center' }),
    command: (e: Editor) => e.chain().focus().setTextAlign('center').run(),
  },
  {
    name: 'alignRight',
    icon: AlignRightIcon,
    label: '靠右對齊',
    isActive: (e: Editor) => e.isActive({ textAlign: 'right' }),
    command: (e: Editor) => e.chain().focus().setTextAlign('right').run(),
  },
  {
    name: 'alignJustify',
    icon: AlignJustifyIcon,
    label: '兩端對齊',
    isActive: (e: Editor) => e.isActive({ textAlign: 'justify' }),
    command: (e: Editor) => e.chain().focus().setTextAlign('justify').run(),
  },
  sep,
  {
    name: 'bulletList',
    icon: BulletListIcon,
    label: '項目清單',
    isActive: (e: Editor) => e.isActive('bulletList'),
    command: (e: Editor) => e.chain().focus().toggleBulletList().run(),
  },
  {
    name: 'orderedList',
    icon: OrderedListIcon,
    label: '編號清單',
    isActive: (e: Editor) => e.isActive('orderedList'),
    command: (e: Editor) => e.chain().focus().toggleOrderedList().run(),
  },
  {
    name: 'blockquote',
    icon: BlockquoteIcon,
    label: '引用',
    isActive: (e: Editor) => e.isActive('blockquote'),
    command: (e: Editor) => e.chain().focus().toggleBlockquote().run(),
  },
  sep,
  {
    name: 'link',
    icon: LinkIcon,
    label: '連結',
    isActive: (e: Editor) => e.isActive('link'),
    command: (e: Editor) => {
      if (e.isActive('link')) {
        e.chain().focus().unsetLink().run()
        return
      }
      const url = window.prompt('輸入連結網址')
      if (url) {
        e.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
      }
    },
  },
  {
    name: 'image',
    icon: ImageIcon,
    label: '插入圖片',
    command: (e: Editor) => {
      const src = window.prompt('輸入圖片網址')
      if (src) {
        e.chain().focus().setImage({ src }).run()
      }
    },
  },
  sep,
  {
    name: 'table',
    icon: TableIcon,
    label: '插入表格',
    command: (e: Editor) =>
      e.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
  },
  sep,
  {
    name: 'horizontalRule',
    icon: HorizontalRuleIcon,
    label: '分隔線',
    command: (e: Editor) => e.chain().focus().setHorizontalRule().run(),
  },
]
