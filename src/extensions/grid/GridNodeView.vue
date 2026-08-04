<script setup lang="ts">
import { NodeViewWrapper, NodeViewContent, nodeViewProps } from '@tiptap/vue-3'
import { computed, inject, onBeforeUnmount, ref } from 'vue'

import { rteMessagesKey, zhTW } from '../../i18n'
import { MinusIcon, PlusIcon, TrashIcon } from '../../icons'

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

const columns = computed<number>(() => props.node.attrs.columns ?? 1)
const minColumns = computed<number>(() => props.node.attrs.minColumns ?? 1)

// 欄數以 CSS 變數傳入，版面交由樣式表處理（編輯/唯讀共用同一份 CSS）
const contentStyle = computed(() => ({
	'--rte-cols': String(columns.value),
	'--rte-min-cols': String(minColumns.value),
}))

function setColumns(value: number) {
	const next = Math.min(6, Math.max(1, value))
	props.updateAttributes({ columns: next, minColumns: Math.min(minColumns.value, next) })
}

function setMinColumns(value: number) {
	const next = Math.min(3, Math.max(1, Math.min(value, columns.value)))
	props.updateAttributes({ minColumns: next })
}

function addCell() {
	if (typeof props.getPos !== 'function') return
	const pos = props.getPos()
	if (typeof pos !== 'number') return
	const insertAt = pos + props.node.nodeSize - 1
	props.editor
		.chain()
		.focus()
		.insertContentAt(insertAt, { type: 'rteGridCell', content: [{ type: 'paragraph' }] })
		.run()
}

function deleteGrid() {
	props.deleteNode()
}
</script>

<template>
	<NodeViewWrapper class="rte-grid" :class="{ 'rte-grid--readonly': !editable }">
		<div v-if="editable" class="rte-grid__bar" contenteditable="false">
			<span class="rte-grid__label">{{ t.gridLabel }}</span>
			<div class="rte-grid__ctrl">
				<span class="rte-grid__ctrl-label">{{ t.gridDesktop }}</span>
				<button type="button" :title="t.gridDecreaseColumns" @mousedown.prevent="setColumns(columns - 1)">
					<MinusIcon class="rte-grid__icon" />
				</button>
				<span class="rte-grid__num">{{ columns }}</span>
				<button type="button" :title="t.gridIncreaseColumns" @mousedown.prevent="setColumns(columns + 1)">
					<PlusIcon class="rte-grid__icon" />
				</button>
			</div>
			<div class="rte-grid__ctrl">
				<span class="rte-grid__ctrl-label">{{ t.gridMobile }}</span>
				<button type="button" :title="t.gridDecreaseColumns" @mousedown.prevent="setMinColumns(minColumns - 1)">
					<MinusIcon class="rte-grid__icon" />
				</button>
				<span class="rte-grid__num">{{ minColumns }}</span>
				<button type="button" :title="t.gridIncreaseColumns" @mousedown.prevent="setMinColumns(minColumns + 1)">
					<PlusIcon class="rte-grid__icon" />
				</button>
			</div>
			<button type="button" class="rte-grid__add" :title="t.gridAddCell" @mousedown.prevent="addCell">
				<PlusIcon class="rte-grid__icon" />
				<span>{{ t.gridAddCellShort }}</span>
			</button>
			<button type="button" class="rte-grid__delete" :title="t.gridDelete" :aria-label="t.gridDelete" @mousedown.prevent="deleteGrid">
				<TrashIcon class="rte-grid__icon" />
				<span>{{ t.gridDeleteShort }}</span>
			</button>
		</div>
		<NodeViewContent class="rte-grid__content" :style="contentStyle" />
	</NodeViewWrapper>
</template>
