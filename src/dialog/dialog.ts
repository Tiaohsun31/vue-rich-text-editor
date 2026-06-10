import { reactive } from 'vue'
import type { InjectionKey } from 'vue'

export interface RtePromptOptions {
  title: string
  initialValue?: string
  placeholder?: string
}

export type PromptFn = (options: RtePromptOptions) => Promise<string | null>

interface RteDialogState {
  open: boolean
  mode: 'prompt' | 'alert'
  title: string
  value: string
  placeholder: string
}

export interface RteDialogService {
  state: RteDialogState
  /** 開啟輸入對話框；resolve 輸入值，取消為 null */
  prompt: PromptFn
  /** 開啟訊息對話框；按下確定後 resolve */
  alert: (message: string) => Promise<void>
  /** RteDialog 元件內部使用 */
  confirm: () => void
  /** RteDialog 元件內部使用 */
  cancel: () => void
}

export function createRteDialog(): RteDialogService {
  const state = reactive<RteDialogState>({
    open: false,
    mode: 'prompt',
    title: '',
    value: '',
    placeholder: '',
  })

  let pending: ((value: string | null) => void) | null = null

  function close(result: string | null) {
    state.open = false
    pending?.(result)
    pending = null
  }

  return {
    state,
    prompt(options) {
      // 已有開啟中的對話框：先以取消收掉，避免 promise 懸掛
      if (pending) close(null)
      state.mode = 'prompt'
      state.title = options.title
      state.value = options.initialValue ?? ''
      state.placeholder = options.placeholder ?? ''
      state.open = true
      return new Promise<string | null>((resolve) => {
        pending = resolve
      })
    },
    alert(message) {
      if (pending) close(null)
      state.mode = 'alert'
      state.title = message
      state.value = ''
      state.placeholder = ''
      state.open = true
      return new Promise<void>((resolve) => {
        pending = () => resolve()
      })
    },
    confirm() {
      close(state.mode === 'prompt' ? state.value : '')
    },
    cancel() {
      close(null)
    },
  }
}

export const rteDialogKey: InjectionKey<RteDialogService> = Symbol('rte-dialog')

/** toolbar item / 外部使用者的安全包裝：無對話框服務時退回 window.prompt */
export function promptWithFallback(
  ctx: { prompt: PromptFn } | undefined | null,
  title: string,
  initialValue = '',
): Promise<string | null> {
  if (ctx?.prompt) return ctx.prompt({ title, initialValue })
  return Promise.resolve(window.prompt(title, initialValue))
}

/** 同上：無對話框服務時退回 window.alert */
export function alertWithFallback(
  ctx: { alert: (message: string) => Promise<void> } | undefined | null,
  message: string,
): void {
  if (ctx?.alert) {
    void ctx.alert(message)
    return
  }
  window.alert(message)
}
