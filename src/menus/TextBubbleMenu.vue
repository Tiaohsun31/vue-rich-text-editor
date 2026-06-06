<script setup lang="ts">
import { BubbleMenu } from '@tiptap/vue-3/menus'
import type { Editor } from '@tiptap/core'
import { CellSelection } from '@tiptap/pm/tables'
import { BoldIcon, ItalicIcon, UnderlineIcon, StrikeIcon, LinkIcon } from '../icons'

const props = defineProps<{ editor: Editor }>()

function shouldShow() {
  const { selection } = props.editor.state
  // 跨儲存格選取交給 TableBubbleMenu 處理
  if (selection instanceof CellSelection) return false
  return !selection.empty && !props.editor.isActive('image')
}

function toggleLink() {
  if (props.editor.isActive('link')) {
    props.editor.chain().focus().unsetLink().run()
    return
  }
  const url = window.prompt('輸入連結網址')
  if (url) {
    props.editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }
}
</script>

<template>
  <BubbleMenu
    :editor="editor"
    plugin-key="textBubbleMenu"
    :should-show="shouldShow"
    :options="{ placement: 'top' }"
  >
    <div class="rte-bubble-menu">
      <button
        type="button"
        class="rte-bubble-btn"
        :class="{ 'is-active': editor.isActive('bold') }"
        title="粗體"
        @mousedown.prevent="editor.chain().focus().toggleBold().run()"
      >
        <BoldIcon />
      </button>
      <button
        type="button"
        class="rte-bubble-btn"
        :class="{ 'is-active': editor.isActive('italic') }"
        title="斜體"
        @mousedown.prevent="editor.chain().focus().toggleItalic().run()"
      >
        <ItalicIcon />
      </button>
      <button
        type="button"
        class="rte-bubble-btn"
        :class="{ 'is-active': editor.isActive('underline') }"
        title="底線"
        @mousedown.prevent="editor.chain().focus().toggleUnderline().run()"
      >
        <UnderlineIcon />
      </button>
      <button
        type="button"
        class="rte-bubble-btn"
        :class="{ 'is-active': editor.isActive('strike') }"
        title="刪除線"
        @mousedown.prevent="editor.chain().focus().toggleStrike().run()"
      >
        <StrikeIcon />
      </button>
      <div class="rte-bubble-separator" />
      <button
        type="button"
        class="rte-bubble-btn"
        :class="{ 'is-active': editor.isActive('link') }"
        title="連結"
        @mousedown.prevent="toggleLink"
      >
        <LinkIcon />
      </button>
    </div>
  </BubbleMenu>
</template>
