<script setup lang="ts">
import type { Editor } from '@tiptap/core'
import { BubbleMenu } from '@tiptap/vue-3/menus'
import { inject } from 'vue'

import { rteDialogKey, promptWithFallback } from '../dialog/dialog'
import { rteMessagesKey, zhTW } from '../i18n'
import { PencilIcon, TrashIcon, AlignLeftIcon, AlignCenterIcon, AlignRightIcon, LightboxIcon } from '../icons'

const props = defineProps<{ editor: Editor }>()

const t = inject(rteMessagesKey, zhTW)
const dialog = inject(rteDialogKey, null)

function shouldShow() {
	return props.editor.isActive('image')
}

function currentAlign(): string {
	return (props.editor.getAttributes('image').align as string) ?? 'left'
}

function isLightbox(): boolean {
	return props.editor.getAttributes('image').lightbox === true
}

function setAlign(align: 'left' | 'center' | 'right') {
	props.editor.chain().focus().updateAttributes('image', { align }).run()
}

function toggleLightbox() {
	props.editor.chain().focus().updateAttributes('image', { lightbox: !isLightbox() }).run()
}

function editAlt() {
	const current = (props.editor.getAttributes('image').alt as string) ?? ''
	void promptWithFallback(dialog, t.promptImageAlt, current).then((alt) => {
		if (alt !== null) {
			props.editor.chain().focus().updateAttributes('image', { alt }).run()
		}
	})
}
</script>

<template>
	<BubbleMenu :editor="editor" plugin-key="imageBubbleMenu" :should-show="shouldShow" :options="{ placement: 'top' }">
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

			<button
				type="button"
				class="rte-bubble-btn"
				:class="{ 'is-active': isLightbox() }"
				:title="t.toggleImageLightbox"
				@mousedown.prevent="toggleLightbox">
				<LightboxIcon />
			</button>
			<button type="button" class="rte-bubble-btn" :title="t.editAlt" @mousedown.prevent="editAlt">
				<PencilIcon />
			</button>
			<button
				type="button"
				class="rte-bubble-btn rte-bubble-btn--danger"
				:title="t.deleteImage"
				@mousedown.prevent="editor.chain().focus().deleteSelection().run()">
				<TrashIcon />
			</button>
		</div>
	</BubbleMenu>
</template>
