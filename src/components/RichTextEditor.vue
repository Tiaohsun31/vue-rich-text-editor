<script setup lang="ts">
import type { Extensions, JSONContent } from '@tiptap/core'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { watch, onBeforeUnmount, provide } from 'vue'

import { createRteDialog, rteDialogKey } from '../dialog/dialog'
import { resolveMessages, rteMessagesKey, type RteLocale, type RteMessages } from '../i18n'
import ImageBubbleMenu from '../menus/ImageBubbleMenu.vue'
import LinkBubbleMenu from '../menus/LinkBubbleMenu.vue'
import TableBubbleMenu from '../menus/TableBubbleMenu.vue'
import TextBubbleMenu from '../menus/TextBubbleMenu.vue'
import { createDefaultExtensions } from '../presets/createDefaultExtensions'
import type { ToolbarItem } from '../toolbar/types'
import type { EditorContent as EditorContentType } from '../types/content'
import type { RichTextEditorContext } from '../types/editor'
import EditorToolbar from './EditorToolbar.vue'
import RteDialog from './RteDialog.vue'

const props = withDefaults(
	defineProps<{
		modelValue?: EditorContentType
		extensions?: Extensions
		resolveExtensions?: (context: RichTextEditorContext) => Extensions
		toolbarItems?: ToolbarItem[]
		placeholder?: string
		readonly?: boolean
		/** 'html'（預設）emit HTML 字串；'json' emit Tiptap JSONContent 物件 */
		outputFormat?: 'html' | 'json'
		/** UI 語系（預設 zh-TW） */
		locale?: RteLocale
		/** 覆寫個別文案 */
		messages?: Partial<RteMessages>
	}>(),
	{ outputFormat: 'html', locale: 'zh-TW' },
)

const emit = defineEmits<{
	'update:modelValue': [value: EditorContentType]
}>()

const t = resolveMessages(props.locale, props.messages)
provide(rteMessagesKey, t)

const dialog = createRteDialog()
provide(rteDialogKey, dialog)

const defaultExts = createDefaultExtensions({ placeholder: props.placeholder ?? t.placeholder })
const allExtensions: Extensions = props.resolveExtensions
	? props.resolveExtensions({ extensions: defaultExts })
	: [...defaultExts, ...(props.extensions ?? [])]

function readContent(): EditorContentType {
	if (!editor.value) return null
	return props.outputFormat === 'json' ? editor.value.getJSON() : editor.value.getHTML()
}

const editor = useEditor({
	content: props.modelValue ?? '',
	editable: !props.readonly,
	extensions: allExtensions,
	onUpdate: () => {
		emit('update:modelValue', readContent())
	},
})

watch(
	() => props.modelValue,
	(value) => {
		if (!editor.value) return
		const current = props.outputFormat === 'json' ? JSON.stringify(editor.value.getJSON()) : editor.value.getHTML()
		const incoming = props.outputFormat === 'json' ? JSON.stringify(value ?? {}) : (value ?? '')
		if (current === incoming) return
		editor.value.commands.setContent((value ?? '') as string | JSONContent, {
			emitUpdate: false,
		})
	},
)

watch(
	() => props.readonly,
	(value) => {
		editor.value?.setEditable(!value)
	},
)

onBeforeUnmount(() => {
	editor.value?.destroy()
})
</script>

<template>
	<div class="rte-editor">
		<template v-if="editor && !readonly">
			<TextBubbleMenu :editor="editor" />
			<TableBubbleMenu :editor="editor" />
			<ImageBubbleMenu :editor="editor" />
			<LinkBubbleMenu :editor="editor" />
			<EditorToolbar :editor="editor" :items="toolbarItems" />
		</template>
		<EditorContent :editor="editor" class="rte-content" />
		<RteDialog v-if="!readonly" :service="dialog" />
	</div>
</template>
