<script setup lang="ts">
import type { Editor } from '@tiptap/core'
import { isValidYoutubeUrl } from '@tiptap/extension-youtube'
import { BubbleMenu } from '@tiptap/vue-3/menus'
import { inject } from 'vue'

import { rteDialogKey, promptWithFallback, alertWithFallback } from '../dialog/dialog'
import { rteMessagesKey, zhTW } from '../i18n'
import { PencilIcon, TrashIcon, AlignLeftIcon, AlignCenterIcon, AlignRightIcon } from '../icons'

const props = defineProps<{ editor: Editor }>()

const t = inject(rteMessagesKey, zhTW)
const dialog = inject(rteDialogKey, null)

function shouldShow() {
	return props.editor.isActive('youtube')
}

function currentAlign(): string {
	return (props.editor.getAttributes('youtube').align as string) ?? 'left'
}

function setAlign(align: 'left' | 'center' | 'right') {
	props.editor.chain().focus().updateAttributes('youtube', { align }).run()
}

function editUrl() {
	const current = (props.editor.getAttributes('youtube').src as string) ?? ''
	void promptWithFallback(dialog, t.promptEditYoutubeUrl, current).then((src) => {
		if (src === null || src === current) return
		if (!isValidYoutubeUrl(src)) {
			alertWithFallback(dialog, t.invalidYoutubeUrl)
			return
		}
		props.editor.chain().focus().updateAttributes('youtube', { src }).run()
	})
}
</script>

<template>
	<BubbleMenu :editor="editor" plugin-key="youtubeBubbleMenu" :should-show="shouldShow" :options="{ placement: 'top' }">
		<div class="rte-bubble-menu">
			<button
				type="button"
				class="rte-bubble-btn"
				:class="{ 'is-active': currentAlign() === 'left' }"
				:title="t.alignLeft"
				@mousedown.prevent="setAlign('left')">
				<AlignLeftIcon />
			</button>
			<button
				type="button"
				class="rte-bubble-btn"
				:class="{ 'is-active': currentAlign() === 'center' }"
				:title="t.alignCenter"
				@mousedown.prevent="setAlign('center')">
				<AlignCenterIcon />
			</button>
			<button
				type="button"
				class="rte-bubble-btn"
				:class="{ 'is-active': currentAlign() === 'right' }"
				:title="t.alignRight"
				@mousedown.prevent="setAlign('right')">
				<AlignRightIcon />
			</button>

			<div class="rte-bubble-separator" />

			<button type="button" class="rte-bubble-btn" :title="t.editYoutubeUrl" @mousedown.prevent="editUrl">
				<PencilIcon />
			</button>
			<button
				type="button"
				class="rte-bubble-btn rte-bubble-btn--danger"
				:title="t.deleteYoutube"
				@mousedown.prevent="editor.chain().focus().deleteSelection().run()">
				<TrashIcon />
			</button>
		</div>
	</BubbleMenu>
</template>
