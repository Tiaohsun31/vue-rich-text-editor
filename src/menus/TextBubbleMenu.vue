<script setup lang="ts">
import type { Editor } from '@tiptap/core'
import { CellSelection } from '@tiptap/pm/tables'
import { BubbleMenu } from '@tiptap/vue-3/menus'
import { inject } from 'vue'

import { rteDialogKey, promptLinkWithFallback } from '../dialog/dialog'
import { rteMessagesKey, zhTW } from '../i18n'
import { BoldIcon, ItalicIcon, UnderlineIcon, StrikeIcon, LinkIcon } from '../icons'

const props = defineProps<{ editor: Editor }>()

const t = inject(rteMessagesKey, zhTW)
const dialog = inject(rteDialogKey, null)

function shouldShow() {
	const { selection } = props.editor.state
	// 跨儲存格選取交給 TableBubbleMenu 處理
	if (selection instanceof CellSelection) return false
	// 圖片 / 影片為 NodeSelection（非 empty），交給各自的 bubble menu
	return !selection.empty && !props.editor.isActive('image') && !props.editor.isActive('youtube')
}

function toggleLink() {
	if (props.editor.isActive('link')) {
		props.editor.chain().focus().unsetLink().run()
		return
	}
	void promptLinkWithFallback(dialog, { title: t.promptLinkUrl, checkboxLabel: t.openInNewTab }).then((result) => {
		if (!result?.url) return
		props.editor
			.chain()
			.focus()
			.extendMarkRange('link')
			.setLink({
				href: result.url,
				target: result.openInNewTab ? '_blank' : null,
				rel: result.openInNewTab ? 'noopener noreferrer' : null,
			})
			.run()
	})
}
</script>

<template>
	<BubbleMenu :editor="editor" plugin-key="textBubbleMenu" :should-show="shouldShow" :options="{ placement: 'top' }">
		<div class="rte-bubble-menu">
			<button
				type="button"
				class="rte-bubble-btn"
				:class="{ 'is-active': editor.isActive('bold') }"
				:title="t.bold"
				@mousedown.prevent="editor.chain().focus().toggleBold().run()">
				<BoldIcon />
			</button>
			<button
				type="button"
				class="rte-bubble-btn"
				:class="{ 'is-active': editor.isActive('italic') }"
				:title="t.italic"
				@mousedown.prevent="editor.chain().focus().toggleItalic().run()">
				<ItalicIcon />
			</button>
			<button
				type="button"
				class="rte-bubble-btn"
				:class="{ 'is-active': editor.isActive('underline') }"
				:title="t.underline"
				@mousedown.prevent="editor.chain().focus().toggleUnderline().run()">
				<UnderlineIcon />
			</button>
			<button
				type="button"
				class="rte-bubble-btn"
				:class="{ 'is-active': editor.isActive('strike') }"
				:title="t.strike"
				@mousedown.prevent="editor.chain().focus().toggleStrike().run()">
				<StrikeIcon />
			</button>
			<div class="rte-bubble-separator" />
			<button type="button" class="rte-bubble-btn" :class="{ 'is-active': editor.isActive('link') }" :title="t.link" @mousedown.prevent="toggleLink">
				<LinkIcon />
			</button>
		</div>
	</BubbleMenu>
</template>
