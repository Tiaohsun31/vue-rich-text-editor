<script setup lang="ts">
import { computed } from 'vue'
import { BubbleMenu } from '@tiptap/vue-3/menus'
import type { Editor } from '@tiptap/core'
import { PencilIcon, TrashIcon } from '../../icons'

const props = defineProps<{ editor: Editor }>()

const src = computed(() => (props.editor.getAttributes('lightbox').src as string) ?? '')

// 游標停在 lightbox 標記內（collapsed）時顯示，避免與 TextBubbleMenu 衝突
function shouldShow({ from, to }: { from: number; to: number }) {
  if (from !== to) return false
  return props.editor.isActive('lightbox')
}

function editLightbox() {
  const url = window.prompt('編輯燈箱圖片網址', src.value)
  if (url === null) return
  if (url === '') {
    props.editor.chain().focus().unsetLightbox().run()
  } else {
    props.editor.chain().focus().extendMarkRange('lightbox').setLightbox({ imageSrc: url }).run()
  }
}

function removeLightbox() {
  props.editor.chain().focus().extendMarkRange('lightbox').unsetLightbox().run()
}
</script>

<template>
  <BubbleMenu
    :editor="editor"
    plugin-key="lightboxBubbleMenu"
    :should-show="shouldShow"
    :options="{ placement: 'bottom' }"
  >
    <div class="rte-bubble-menu rte-bubble-menu--link">
      <span class="rte-bubble-link-href" :title="src">🔍 {{ src || '（未設定圖片）' }}</span>
      <div class="rte-bubble-separator" />
      <button type="button" class="rte-bubble-btn" title="編輯燈箱" @mousedown.prevent="editLightbox">
        <PencilIcon />
      </button>
      <button
        type="button"
        class="rte-bubble-btn rte-bubble-btn--danger"
        title="移除燈箱"
        @mousedown.prevent="removeLightbox"
      >
        <TrashIcon />
      </button>
    </div>
  </BubbleMenu>
</template>
