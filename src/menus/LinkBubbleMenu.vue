<script setup lang="ts">
import { computed } from 'vue'
import { BubbleMenu } from '@tiptap/vue-3/menus'
import type { Editor } from '@tiptap/core'
import { ExternalLinkIcon, PencilIcon, UnlinkIcon } from '../icons'

const props = defineProps<{ editor: Editor }>()

const href = computed(() => (props.editor.getAttributes('link').href as string) ?? '')

function shouldShow({ from, to }: { from: number; to: number }) {
  if (from !== to) return false
  return props.editor.isActive('link')
}

function editLink() {
  const url = window.prompt('編輯連結網址', href.value)
  if (url === null) return
  if (url === '') {
    props.editor.chain().focus().unsetLink().run()
  } else {
    props.editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }
}

function openLink() {
  if (href.value) window.open(href.value, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <BubbleMenu
    :editor="editor"
    plugin-key="linkBubbleMenu"
    :should-show="shouldShow"
    :options="{ placement: 'bottom' }"
  >
    <div class="rte-bubble-menu rte-bubble-menu--link">
      <span class="rte-bubble-link-href" :title="href">{{ href }}</span>
      <div class="rte-bubble-separator" />
      <button
        type="button"
        class="rte-bubble-btn"
        title="在新分頁開啟"
        @mousedown.prevent="openLink"
      >
        <ExternalLinkIcon />
      </button>
      <button
        type="button"
        class="rte-bubble-btn"
        title="編輯連結"
        @mousedown.prevent="editLink"
      >
        <PencilIcon />
      </button>
      <button
        type="button"
        class="rte-bubble-btn rte-bubble-btn--danger"
        title="移除連結"
        @mousedown.prevent="editor.chain().focus().extendMarkRange('link').unsetLink().run()"
      >
        <UnlinkIcon />
      </button>
    </div>
  </BubbleMenu>
</template>
