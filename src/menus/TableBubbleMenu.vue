<script setup lang="ts">
import { BubbleMenu } from '@tiptap/vue-3'
import type { Editor } from '@tiptap/core'
import { CellSelection } from '@tiptap/pm/tables'

const props = defineProps<{ editor: Editor }>()

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
  <BubbleMenu
    :editor="editor"
    plugin-key="tableBubbleMenu"
    :should-show="shouldShow"
    :tippy-options="{ duration: 100, placement: 'bottom', maxWidth: 'none' }"
  >
    <div class="rte-bubble-menu rte-bubble-menu--table">
      <!-- 列操作 -->
      <button
        type="button"
        class="rte-bubble-btn rte-bubble-btn--text"
        title="上方插入列"
        @mousedown.prevent="editor.chain().focus().insertRowBefore().run()"
      >
        ↑列
      </button>
      <button
        type="button"
        class="rte-bubble-btn rte-bubble-btn--text"
        title="下方插入列"
        @mousedown.prevent="editor.chain().focus().insertRowAfter().run()"
      >
        ↓列
      </button>
      <button
        type="button"
        class="rte-bubble-btn rte-bubble-btn--text rte-bubble-btn--danger"
        title="刪除列"
        @mousedown.prevent="editor.chain().focus().deleteRow().run()"
      >
        ×列
      </button>

      <div class="rte-bubble-separator" />

      <!-- 欄操作 -->
      <button
        type="button"
        class="rte-bubble-btn rte-bubble-btn--text"
        title="左側插入欄"
        @mousedown.prevent="editor.chain().focus().insertColumnBefore().run()"
      >
        ←欄
      </button>
      <button
        type="button"
        class="rte-bubble-btn rte-bubble-btn--text"
        title="右側插入欄"
        @mousedown.prevent="editor.chain().focus().insertColumnAfter().run()"
      >
        →欄
      </button>
      <button
        type="button"
        class="rte-bubble-btn rte-bubble-btn--text rte-bubble-btn--danger"
        title="刪除欄"
        @mousedown.prevent="editor.chain().focus().deleteColumn().run()"
      >
        ×欄
      </button>

      <div class="rte-bubble-separator" />

      <!-- 儲存格操作 -->
      <button
        type="button"
        class="rte-bubble-btn rte-bubble-btn--text"
        :disabled="!editor.can().mergeCells()"
        title="合併儲存格"
        @mousedown.prevent="editor.chain().focus().mergeCells().run()"
      >
        合併
      </button>
      <button
        type="button"
        class="rte-bubble-btn rte-bubble-btn--text"
        :disabled="!editor.can().splitCell()"
        title="拆分儲存格"
        @mousedown.prevent="editor.chain().focus().splitCell().run()"
      >
        拆分
      </button>

      <div class="rte-bubble-separator" />

      <button
        type="button"
        class="rte-bubble-btn rte-bubble-btn--text"
        title="切換標題列"
        @mousedown.prevent="editor.chain().focus().toggleHeaderRow().run()"
      >
        標題
      </button>
      <button
        type="button"
        class="rte-bubble-btn rte-bubble-btn--text rte-bubble-btn--danger"
        title="刪除表格"
        @mousedown.prevent="editor.chain().focus().deleteTable().run()"
      >
        ×表格
      </button>
    </div>
  </BubbleMenu>
</template>
