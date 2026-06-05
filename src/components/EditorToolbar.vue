<script setup lang="ts">
import type { Editor } from '@tiptap/core'
import type { ToolbarItem } from '../toolbar/types'
import { defaultToolbarItems } from '../toolbar/defaultToolbarItems'

const props = defineProps<{
  editor: Editor
  items?: ToolbarItem[]
}>()

const items = props.items ?? defaultToolbarItems

function onDropdownChange(
  item: Extract<ToolbarItem, { type: 'dropdown' }>,
  event: Event,
) {
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
        @mousedown.prevent="item.command(editor)"
      >
        <component :is="item.icon" v-if="item.icon" />
        <span v-else style="font-size: 11px; font-weight: 700">{{ item.label }}</span>
      </button>
    </template>
  </div>
</template>
