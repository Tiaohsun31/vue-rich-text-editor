<script setup lang="ts">
import { NodeViewContent, NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { computed, inject, onBeforeUnmount, ref } from 'vue'

import { rteMessagesKey, zhTW } from '../../i18n'
import { ArrowLeftIcon, ArrowRightIcon, TrashIcon } from '../../icons'
import type { FlexGrowSide } from './types'

const props = defineProps(nodeViewProps)

const t = inject(rteMessagesKey, zhTW)

// editor.isEditable 不是響應式來源（computed 會停在建立當下的值），
// 改用 ref + setEditable() 發出的 update 事件同步
const editable = ref<boolean>(props.editor.isEditable)
function syncEditable() {
	editable.value = props.editor.isEditable
}
props.editor.on('update', syncEditable)
onBeforeUnmount(() => props.editor.off('update', syncEditable))

const growSide = computed<FlexGrowSide>(() => (props.node.attrs.growSide === 'left' ? 'left' : 'right'))

function setGrowSide(side: FlexGrowSide) {
	if (typeof props.getPos !== 'function') return

	const position = props.getPos()
	if (typeof position !== 'number') return

	props.editor.commands.command(({ tr }) => {
		tr.setNodeMarkup(position, undefined, { ...props.node.attrs, growSide: side })
		props.node.forEach((child, offset) => {
			tr.setNodeMarkup(position + offset + 1, undefined, {
				...child.attrs,
				grow: child.attrs.side === side,
			})
		})
		return true
	})
}

function deleteFlexColumns() {
	props.deleteNode()
}
</script>

<template>
	<NodeViewWrapper class="rte-flex-columns" :class="{ 'rte-flex-columns--readonly': !editable }" :data-grow-side="growSide">
		<div v-if="editable" class="rte-flex-columns__bar" contenteditable="false">
			<span class="rte-flex-columns__label">{{ t.flexLabel }}</span>
			<span class="rte-flex-columns__hint">{{ t.flexHint }}</span>
			<div class="rte-flex-columns__actions">
				<div class="rte-flex-columns__options" :aria-label="t.flexGrowSideGroup">
					<button
						type="button"
						:class="{ 'is-active': growSide === 'left' }"
						:aria-pressed="growSide === 'left'"
						@mousedown.prevent="setGrowSide('left')">
						<ArrowLeftIcon class="rte-flex-columns__icon" />
						<span>{{ t.flexGrowLeft }}</span>
					</button>
					<button
						type="button"
						:class="{ 'is-active': growSide === 'right' }"
						:aria-pressed="growSide === 'right'"
						@mousedown.prevent="setGrowSide('right')">
						<span>{{ t.flexGrowRight }}</span>
						<ArrowRightIcon class="rte-flex-columns__icon" />
					</button>
				</div>
				<button
					type="button"
					class="rte-flex-columns__delete"
					:title="t.flexDelete"
					:aria-label="t.flexDelete"
					@mousedown.prevent="deleteFlexColumns">
					<TrashIcon class="rte-flex-columns__icon" />
					<span>{{ t.flexDeleteShort }}</span>
				</button>
			</div>
		</div>
		<NodeViewContent class="rte-flex-columns__content" />
	</NodeViewWrapper>
</template>
