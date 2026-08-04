<script setup lang="ts">
import type { Editor } from '@tiptap/core'
import { CellSelection } from '@tiptap/pm/tables'
import { BubbleMenu } from '@tiptap/vue-3/menus'
import { inject } from 'vue'

import { rteMessagesKey, zhTW } from '../i18n'

const props = defineProps<{ editor: Editor }>()

const t = inject(rteMessagesKey, zhTW)

function shouldShow() {
	const { selection } = props.editor.state
	// 跨儲存格選取一律顯示表格選單
	if (selection instanceof CellSelection) return true
	// 游標停在單一儲存格內（無文字選取）也顯示
	if (!selection.empty) return false
	return props.editor.isActive('tableCell') || props.editor.isActive('tableHeader')
}
</script>

<template>
	<BubbleMenu class="rte-bubble-root" :editor="editor" plugin-key="tableBubbleMenu" :should-show="shouldShow" :options="{ placement: 'bottom' }">
		<div class="rte-bubble-menu rte-bubble-menu--table">
			<!-- 列操作 -->
			<button
				type="button"
				class="rte-bubble-btn rte-bubble-btn--text"
				:title="t.rowAbove"
				@mousedown.prevent="editor.chain().focus().addRowBefore().run()">
				{{ t.rowAboveShort }}
			</button>
			<button
				type="button"
				class="rte-bubble-btn rte-bubble-btn--text"
				:title="t.rowBelow"
				@mousedown.prevent="editor.chain().focus().addRowAfter().run()">
				{{ t.rowBelowShort }}
			</button>
			<button
				type="button"
				class="rte-bubble-btn rte-bubble-btn--text rte-bubble-btn--danger"
				:title="t.rowDelete"
				@mousedown.prevent="editor.chain().focus().deleteRow().run()">
				{{ t.rowDeleteShort }}
			</button>

			<div class="rte-bubble-separator" />

			<!-- 欄操作 -->
			<button
				type="button"
				class="rte-bubble-btn rte-bubble-btn--text"
				:title="t.colLeft"
				@mousedown.prevent="editor.chain().focus().addColumnBefore().run()">
				{{ t.colLeftShort }}
			</button>
			<button
				type="button"
				class="rte-bubble-btn rte-bubble-btn--text"
				:title="t.colRight"
				@mousedown.prevent="editor.chain().focus().addColumnAfter().run()">
				{{ t.colRightShort }}
			</button>
			<button
				type="button"
				class="rte-bubble-btn rte-bubble-btn--text rte-bubble-btn--danger"
				:title="t.colDelete"
				@mousedown.prevent="editor.chain().focus().deleteColumn().run()">
				{{ t.colDeleteShort }}
			</button>

			<div class="rte-bubble-separator" />

			<!-- 儲存格操作 -->
			<button
				type="button"
				class="rte-bubble-btn rte-bubble-btn--text"
				:disabled="!editor.can().mergeCells()"
				:title="t.mergeCells"
				@mousedown.prevent="editor.chain().focus().mergeCells().run()">
				{{ t.mergeCellsShort }}
			</button>
			<button
				type="button"
				class="rte-bubble-btn rte-bubble-btn--text"
				:disabled="!editor.can().splitCell()"
				:title="t.splitCell"
				@mousedown.prevent="editor.chain().focus().splitCell().run()">
				{{ t.splitCellShort }}
			</button>

			<div class="rte-bubble-separator" />

			<button
				type="button"
				class="rte-bubble-btn rte-bubble-btn--text"
				:title="t.toggleHeaderRow"
				@mousedown.prevent="editor.chain().focus().toggleHeaderRow().run()">
				{{ t.headerShort }}
			</button>
			<button
				type="button"
				class="rte-bubble-btn rte-bubble-btn--text rte-bubble-btn--danger"
				:title="t.deleteTable"
				@mousedown.prevent="editor.chain().focus().deleteTable().run()">
				{{ t.deleteTableShort }}
			</button>
		</div>
	</BubbleMenu>
</template>
