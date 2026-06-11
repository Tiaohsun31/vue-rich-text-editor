<script setup lang="ts">
import type { Editor } from '@tiptap/core'
import { BubbleMenu } from '@tiptap/vue-3/menus'
import { computed, inject } from 'vue'

import { rteDialogKey, promptWithFallback } from '../dialog/dialog'
import { rteMessagesKey, zhTW } from '../i18n'
import { ExternalLinkIcon, PencilIcon, UnlinkIcon } from '../icons'

const props = defineProps<{ editor: Editor }>()

const t = inject(rteMessagesKey, zhTW)
const dialog = inject(rteDialogKey, null)

const href = computed(() => (props.editor.getAttributes('link').href as string) ?? '')

function shouldShow({ from, to }: { from: number; to: number }) {
	if (from !== to) return false
	return props.editor.isActive('link')
}

function editLink() {
	void promptWithFallback(dialog, t.promptEditLinkUrl, href.value).then((url) => {
		if (url === null) return
		if (url === '') {
			props.editor.chain().focus().unsetLink().run()
		} else {
			props.editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
		}
	})
}

function openLink() {
	if (href.value) window.open(href.value, '_blank', 'noopener,noreferrer')
}
</script>

<template>
	<BubbleMenu :editor="editor" plugin-key="linkBubbleMenu" :should-show="shouldShow" :options="{ placement: 'bottom' }">
		<div class="rte-bubble-menu rte-bubble-menu--link">
			<span class="rte-bubble-link-href" :title="href">{{ href }}</span>
			<div class="rte-bubble-separator" />
			<button type="button" class="rte-bubble-btn" :title="t.openInNewTab" @mousedown.prevent="openLink">
				<ExternalLinkIcon />
			</button>
			<button type="button" class="rte-bubble-btn" :title="t.editLink" @mousedown.prevent="editLink">
				<PencilIcon />
			</button>
			<button
				type="button"
				class="rte-bubble-btn rte-bubble-btn--danger"
				:title="t.removeLink"
				@mousedown.prevent="editor.chain().focus().extendMarkRange('link').unsetLink().run()">
				<UnlinkIcon />
			</button>
		</div>
	</BubbleMenu>
</template>
