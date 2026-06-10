<script setup lang="ts">
import { computed, inject } from 'vue'
import type { Editor } from '@tiptap/core'
import type { ToolbarItem, ToolbarContext } from '../toolbar/types'
import { createDefaultToolbarItems } from '../toolbar/defaultToolbarItems'
import { rteMessagesKey, zhTW } from '../i18n'
import { rteDialogKey } from '../dialog/dialog'

const props = defineProps<{
  editor: Editor
  items?: ToolbarItem[]
}>()

const t = inject(rteMessagesKey, zhTW)
const dialog = inject(rteDialogKey, null)

const items = computed<ToolbarItem[]>(() => props.items ?? createDefaultToolbarItems(t))

const ctx: ToolbarContext = {
  t,
  prompt: dialog
    ? dialog.prompt
    : (o) => Promise.resolve(window.prompt(o.title, o.initialValue ?? '')),
  alert: dialog
    ? dialog.alert
    : (message) => {
        window.alert(message)
        return Promise.resolve()
      },
}

function onDropdownChange(item: Extract<ToolbarItem, { type: 'dropdown' }>, event: Event) {
  item.command(props.editor, (event.target as HTMLSelectElement).value)
}
</script>

<template>
  <div class="rte-toolbar">
    <template v-for="(item, index) in items" :key="index">
      <div v-if="item.type === 'separator'" class="rte-toolbar-separator" />

      <select
        v-else-if="item.type === 'dropdown'"
        class="rte-toolbar-select"
        :title="item.label"
        :style="item.width ? { width: `${item.width}px` } : undefined"
        :value="item.getValue(editor)"
        @change="onDropdownChange(item, $event)"
      >
        <option value="">{{ item.placeholder ?? item.label }}</option>
        <option v-for="opt in item.options" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>

      <button
        v-else
        type="button"
        class="rte-toolbar-btn"
        :class="{ 'is-active': item.isActive?.(editor) }"
        :disabled="item.isDisabled?.(editor) ?? false"
        :title="item.label"
        @mousedown.prevent="item.command(editor, ctx)"
      >
        <component :is="item.icon" v-if="item.icon" />
        <span v-else style="font-size: 11px; font-weight: 700">{{ item.label }}</span>
      </button>
    </template>
  </div>
</template>
