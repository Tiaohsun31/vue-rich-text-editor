import type { Component } from 'vue'
import type { Editor } from '@tiptap/core'

export interface ToolbarButton {
  type?: 'button'
  name: string
  icon?: Component
  label: string
  isActive?: (editor: Editor) => boolean
  isDisabled?: (editor: Editor) => boolean
  command: (editor: Editor) => void
}

export interface ToolbarSeparator {
  type: 'separator'
}

export type ToolbarItem = ToolbarButton | ToolbarSeparator
