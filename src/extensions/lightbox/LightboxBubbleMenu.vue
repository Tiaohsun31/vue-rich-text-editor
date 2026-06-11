<script setup lang="ts">
import type { Editor } from '@tiptap/core'
import { BubbleMenu } from '@tiptap/vue-3/menus'
import { computed, inject } from 'vue'

import { rteDialogKey, promptWithFallback } from '../../dialog/dialog'
import { rteMessagesKey, zhTW } from '../../i18n'
import { PencilIcon, TrashIcon } from '../../icons'

const props = defineProps<{ editor: Editor }>()

const t = inject(rteMessagesKey, zhTW)
const dialog = inject(rteDialogKey, null)

const src = computed(() => (props.editor.getAttributes('lightbox').src as string) ?? '')

// 游標停在 lightbox 標記內（collapsed）時顯示，避免與 TextBubbleMenu 衝突
function shouldShow({ from, to }: { from: number; to: number }) {
	if (from !== to) return false
	return props.editor.isActive('lightbox')
}

function editLightbox() {
	void promptWithFallback(dialog, t.promptEditLightboxUrl, src.value).then((url) => {
		if (url === null) return
		if (url === '') {
			props.editor.chain().focus().unsetLightbox().run()
		} else {
			props.editor.chain().focus().extendMarkRange('lightbox').setLightbox({ imageSrc: url }).run()
		}
	})
}

function removeLightbox() {
	props.editor.chain().focus().extendMarkRange('lightbox').unsetLightbox().run()
}
</script>

<template>
	<BubbleMenu :editor="editor" plugin-key="lightboxBubbleMenu" :should-show="shouldShow" :options="{ placement: 'bottom' }">
		<div class="rte-bubble-menu rte-bubble-menu--link">
			<span class="rte-bubble-link-href" :title="src">🔍 {{ src || t.lightboxNotSet }}</span>
			<div class="rte-bubble-separator" />
			<button type="button" class="rte-bubble-btn" :title="t.editLightbox" @mousedown.prevent="editLightbox">
				<PencilIcon />
			</button>
			<button type="button" class="rte-bubble-btn rte-bubble-btn--danger" :title="t.removeLightbox" @mousedown.prevent="removeLightbox">
				<TrashIcon />
			</button>
		</div>
	</BubbleMenu>
</template>
