import type { Component } from 'vue'
import type { Editor } from '@tiptap/core'
import type { RteMessages } from '../i18n'
import type { PromptFn } from '../dialog/dialog'

/** EditorToolbar 執行 command 時帶入：文案 + 對話框服務 */
export interface ToolbarContext {
  t: RteMessages
  prompt: PromptFn
  alert: (message: string) => Promise<void>
}

export interface ToolbarButton {
  type?: 'button'
  name: string
  icon?: Component
  label: string
  isActive?: (editor: Editor) => boolean
  isDisabled?: (editor: Editor) => boolean
  command: (editor: Editor, ctx?: ToolbarContext) => void
}

export interface ToolbarSeparator {
  type: 'separator'
}

export interface ToolbarDropdownOption {
  label: string
  value: string
}

export interface ToolbarDropdown {
  type: 'dropdown'
  name: string
  label: string
  /** 預設顯示文字（無選取時） */
  placeholder?: string
  options: ToolbarDropdownOption[]
  /** 取得目前值（對應某個 option.value，回傳空字串代表未選） */
  getValue: (editor: Editor) => string
  /** 套用所選值（空字串代表清除） */
  command: (editor: Editor, value: string) => void
  /** 下拉寬度（px） */
  width?: number
}

export type ToolbarItem = ToolbarButton | ToolbarSeparator | ToolbarDropdown
