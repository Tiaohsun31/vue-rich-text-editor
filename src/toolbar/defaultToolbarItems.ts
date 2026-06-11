import type { Editor } from '@tiptap/core'

import { promptWithFallback, alertWithFallback } from '../dialog/dialog'
import type { RteMessages } from '../i18n'
import { zhTW } from '../i18n'
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
	YoutubeIcon,
	AlignLeftIcon,
	AlignCenterIcon,
	AlignRightIcon,
	AlignJustifyIcon,
	HighlighterIcon,
	TextColorIcon,
	CodeIcon,
} from '../icons'
import type { ToolbarItem, ToolbarButton, ToolbarContext } from './types'

const sep: ToolbarItem = { type: 'separator' }

/** 「匯出 HTML」按鈕工廠：複製 getHTML() 結果到剪貼簿。 */
export function createExportHtmlToolbarItem(t: RteMessages = zhTW): ToolbarButton {
	return {
		name: 'exportHtml',
		icon: CodeIcon,
		label: t.exportHtml,
		command: (e: Editor, ctx?: ToolbarContext) => {
			const html = e.getHTML()
			void navigator.clipboard?.writeText(html).then(
				() => alertWithFallback(ctx, t.htmlCopied),
				() => void promptWithFallback(ctx, t.htmlCopyManual, html),
			)
		},
	}
}

/** 預設 toolbar 工廠（依語系產生）。 */
export function createDefaultToolbarItems(t: RteMessages = zhTW): ToolbarItem[] {
	return [
		{
			name: 'undo',
			icon: UndoIcon,
			label: t.undo,
			isDisabled: (e: Editor) => !e.can().undo(),
			command: (e: Editor) => e.chain().focus().undo().run(),
		},
		{
			name: 'redo',
			icon: RedoIcon,
			label: t.redo,
			isDisabled: (e: Editor) => !e.can().redo(),
			command: (e: Editor) => e.chain().focus().redo().run(),
		},
		sep,
		{
			name: 'heading1',
			icon: Heading1Icon,
			label: t.heading1,
			isActive: (e: Editor) => e.isActive('heading', { level: 1 }),
			command: (e: Editor) => e.chain().focus().toggleHeading({ level: 1 }).run(),
		},
		{
			name: 'heading2',
			icon: Heading2Icon,
			label: t.heading2,
			isActive: (e: Editor) => e.isActive('heading', { level: 2 }),
			command: (e: Editor) => e.chain().focus().toggleHeading({ level: 2 }).run(),
		},
		{
			name: 'heading3',
			icon: Heading3Icon,
			label: t.heading3,
			isActive: (e: Editor) => e.isActive('heading', { level: 3 }),
			command: (e: Editor) => e.chain().focus().toggleHeading({ level: 3 }).run(),
		},
		sep,
		{
			type: 'dropdown',
			name: 'fontFamily',
			label: t.fontFamily,
			placeholder: t.fontFamily,
			width: 96,
			options: [
				{ label: 'Sans Serif', value: '"Noto Sans TC", system-ui, sans-serif' },
				{ label: '微軟正黑體', value: '"Microsoft JhengHei", sans-serif' },
				{ label: 'Arial', value: 'Arial, sans-serif' },
				{ label: 'Georgia', value: 'Georgia, serif' },
				{ label: 'Times New Roman', value: '"Times New Roman", serif' },
				{ label: 'Courier', value: '"Courier New", monospace' },
			],
			getValue: (e: Editor) => (e.getAttributes('textStyle').fontFamily as string) ?? '',
			command: (e: Editor, value: string) => (value ? e.chain().focus().setFontFamily(value).run() : e.chain().focus().unsetFontFamily().run()),
		},
		{
			type: 'dropdown',
			name: 'fontSize',
			label: t.fontSize,
			placeholder: t.fontSize,
			width: 72,
			options: [
				{ label: '12', value: '12px' },
				{ label: '14', value: '14px' },
				{ label: '16', value: '16px' },
				{ label: '18', value: '18px' },
				{ label: '20', value: '20px' },
				{ label: '24', value: '24px' },
				{ label: '30', value: '30px' },
				{ label: '36', value: '36px' },
			],
			getValue: (e: Editor) => (e.getAttributes('textStyle').fontSize as string) ?? '',
			command: (e: Editor, value: string) => (value ? e.chain().focus().setFontSize(value).run() : e.chain().focus().unsetFontSize().run()),
		},
		sep,
		{
			name: 'bold',
			icon: BoldIcon,
			label: t.bold,
			isActive: (e: Editor) => e.isActive('bold'),
			command: (e: Editor) => e.chain().focus().toggleBold().run(),
		},
		{
			name: 'italic',
			icon: ItalicIcon,
			label: t.italic,
			isActive: (e: Editor) => e.isActive('italic'),
			command: (e: Editor) => e.chain().focus().toggleItalic().run(),
		},
		{
			name: 'underline',
			icon: UnderlineIcon,
			label: t.underline,
			isActive: (e: Editor) => e.isActive('underline'),
			command: (e: Editor) => e.chain().focus().toggleUnderline().run(),
		},
		{
			name: 'strike',
			icon: StrikeIcon,
			label: t.strike,
			isActive: (e: Editor) => e.isActive('strike'),
			command: (e: Editor) => e.chain().focus().toggleStrike().run(),
		},
		{
			name: 'highlight',
			icon: HighlighterIcon,
			label: t.highlight,
			isActive: (e: Editor) => e.isActive('highlight'),
			command: (e: Editor) => e.chain().focus().toggleHighlight({ color: '#fef08a' }).run(),
		},
		{
			name: 'color',
			icon: TextColorIcon,
			label: t.textColor,
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
			label: t.alignLeft,
			isActive: (e: Editor) => e.isActive({ textAlign: 'left' }),
			command: (e: Editor) => e.chain().focus().setTextAlign('left').run(),
		},
		{
			name: 'alignCenter',
			icon: AlignCenterIcon,
			label: t.alignCenter,
			isActive: (e: Editor) => e.isActive({ textAlign: 'center' }),
			command: (e: Editor) => e.chain().focus().setTextAlign('center').run(),
		},
		{
			name: 'alignRight',
			icon: AlignRightIcon,
			label: t.alignRight,
			isActive: (e: Editor) => e.isActive({ textAlign: 'right' }),
			command: (e: Editor) => e.chain().focus().setTextAlign('right').run(),
		},
		{
			name: 'alignJustify',
			icon: AlignJustifyIcon,
			label: t.alignJustify,
			isActive: (e: Editor) => e.isActive({ textAlign: 'justify' }),
			command: (e: Editor) => e.chain().focus().setTextAlign('justify').run(),
		},
		sep,
		{
			name: 'bulletList',
			icon: BulletListIcon,
			label: t.bulletList,
			isActive: (e: Editor) => e.isActive('bulletList'),
			command: (e: Editor) => e.chain().focus().toggleBulletList().run(),
		},
		{
			name: 'orderedList',
			icon: OrderedListIcon,
			label: t.orderedList,
			isActive: (e: Editor) => e.isActive('orderedList'),
			command: (e: Editor) => e.chain().focus().toggleOrderedList().run(),
		},
		{
			name: 'blockquote',
			icon: BlockquoteIcon,
			label: t.blockquote,
			isActive: (e: Editor) => e.isActive('blockquote'),
			command: (e: Editor) => e.chain().focus().toggleBlockquote().run(),
		},
		sep,
		{
			name: 'link',
			icon: LinkIcon,
			label: t.link,
			isActive: (e: Editor) => e.isActive('link'),
			command: (e: Editor, ctx?: ToolbarContext) => {
				if (e.isActive('link')) {
					e.chain().focus().unsetLink().run()
					return
				}
				void promptWithFallback(ctx, t.promptLinkUrl).then((url) => {
					if (url) e.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
				})
			},
		},
		{
			name: 'image',
			icon: ImageIcon,
			label: t.insertImage,
			command: (e: Editor, ctx?: ToolbarContext) => {
				void promptWithFallback(ctx, t.promptImageUrl).then((src) => {
					if (src) e.chain().focus().setImage({ src }).run()
				})
			},
		},
		sep,
		{
			name: 'table',
			icon: TableIcon,
			label: t.insertTable,
			command: (e: Editor) => e.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
		},
		{
			name: 'youtube',
			icon: YoutubeIcon,
			label: t.insertYoutube,
			command: (e: Editor, ctx?: ToolbarContext) => {
				void promptWithFallback(ctx, t.promptYoutubeUrl).then((url) => {
					if (url) e.chain().focus().setYoutubeVideo({ src: url }).run()
				})
			},
		},
		sep,
		{
			name: 'horizontalRule',
			icon: HorizontalRuleIcon,
			label: t.horizontalRule,
			command: (e: Editor) => e.chain().focus().setHorizontalRule().run(),
		},
	]
}

/** 預設（zh-TW）items，向下相容既有用法。 */
export const defaultToolbarItems: ToolbarItem[] = createDefaultToolbarItems(zhTW)

/** 預設（zh-TW）匯出 HTML 按鈕，向下相容既有用法。 */
export const exportHtmlToolbarItem: ToolbarButton = createExportHtmlToolbarItem(zhTW)
