<script setup lang="ts">
import { BubbleMenu } from '@tiptap/vue-3'
import type { Editor } from '@tiptap/core'
import { PencilIcon, TrashIcon } from '../icons'

const props = defineProps<{ editor: Editor }>()

function shouldShow() {
  return props.editor.isActive('image')
}

function editAlt() {
  const current = props.editor.getAttributes('image').alt ?? ''
  const alt = window.prompt('圖片替代文字（alt）', current)
  if (alt !== null) {
    props.editor.chain().focus().updateAttributes('image', { alt }).run()
  }
}
</script>

<template>
  <BubbleMenu
    :editor="editor"
    plugin-key="imageBubbleMenu"
    :should-show="shouldShow"
    :tippy-options="{ duration: 100, placement: 'top' }"
  >
    <div class="rte-bubble-menu">
      <button
        type="button"
        class="rte-bubble-btn"
        title="編輯替代文字"
        @mousedown.prevent="editAlt"
      >
        <PencilIcon />
      </button>
      <div class="rte-bubble-separator" />
      <button
        type="button"
        class="rte-bubble-btn rte-bubble-btn--danger"
        title="刪除圖片"
        @mousedown.prevent="editor.chain().focus().deleteSelection().run()"
      >
        <TrashIcon />
      </button>
    </div>
  </BubbleMenu>
</template>
