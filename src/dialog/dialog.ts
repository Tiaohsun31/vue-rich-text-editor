import { reactive } from 'vue'
import type { InjectionKey } from 'vue'

export interface RtePromptOptions {
	title: string
	initialValue?: string
	placeholder?: string
}

export type PromptFn = (options: RtePromptOptions) => Promise<string | null>

/** 帶勾選框的連結輸入（例如「另開視窗」） */
export interface RteLinkPromptOptions {
	title: string
	initialValue?: string
	placeholder?: string
	checkboxLabel: string
	checkboxInitial?: boolean
}

export interface RteLinkPromptResult {
	url: string
	openInNewTab: boolean
}

export type LinkPromptFn = (options: RteLinkPromptOptions) => Promise<RteLinkPromptResult | null>

interface RteDialogState {
	open: boolean
	mode: 'prompt' | 'alert'
	title: string
	value: string
	placeholder: string
	/** 非 null 時，prompt 對話框額外顯示一個勾選框 */
	checkbox: { label: string; value: boolean } | null
}

export interface RteDialogService {
	state: RteDialogState
	/** 開啟輸入對話框；resolve 輸入值，取消為 null */
	prompt: PromptFn
	/** 開啟帶勾選框的連結對話框；resolve { url, openInNewTab }，取消為 null */
	promptLink: LinkPromptFn
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
		checkbox: null,
	})

	let pending: ((result: unknown) => void) | null = null
	let buildResult: ((confirmed: boolean) => unknown) | null = null

	function close(confirmed: boolean) {
		state.open = false
		const result = buildResult ? buildResult(confirmed) : null
		const resolve = pending
		pending = null
		buildResult = null
		resolve?.(result)
	}

	// 已有開啟中的對話框：先以取消收掉，避免 promise 懸掛
	function reset() {
		if (pending) close(false)
	}

	return {
		state,
		prompt(options) {
			reset()
			state.mode = 'prompt'
			state.title = options.title
			state.value = options.initialValue ?? ''
			state.placeholder = options.placeholder ?? ''
			state.checkbox = null
			state.open = true
			return new Promise<string | null>((resolve) => {
				pending = resolve as (result: unknown) => void
				buildResult = (confirmed) => (confirmed ? state.value : null)
			})
		},
		promptLink(options) {
			reset()
			state.mode = 'prompt'
			state.title = options.title
			state.value = options.initialValue ?? ''
			state.placeholder = options.placeholder ?? ''
			state.checkbox = { label: options.checkboxLabel, value: options.checkboxInitial ?? false }
			state.open = true
			return new Promise<RteLinkPromptResult | null>((resolve) => {
				pending = resolve as (result: unknown) => void
				buildResult = (confirmed) => (confirmed ? { url: state.value, openInNewTab: state.checkbox?.value ?? false } : null)
			})
		},
		alert(message) {
			reset()
			state.mode = 'alert'
			state.title = message
			state.value = ''
			state.placeholder = ''
			state.checkbox = null
			state.open = true
			return new Promise<void>((resolve) => {
				pending = resolve as (result: unknown) => void
				buildResult = () => undefined
			})
		},
		confirm() {
			close(true)
		},
		cancel() {
			close(false)
		},
	}
}

export const rteDialogKey: InjectionKey<RteDialogService> = Symbol('rte-dialog')

/** toolbar item / 外部使用者的安全包裝：無對話框服務時退回 window.prompt */
export function promptWithFallback(ctx: { prompt: PromptFn } | undefined | null, title: string, initialValue = ''): Promise<string | null> {
	if (ctx?.prompt) return ctx.prompt({ title, initialValue })
	return Promise.resolve(window.prompt(title, initialValue))
}

/** 同 promptWithFallback，但帶勾選框；無對話框服務時退回 window.prompt（勾選狀態沿用初始值） */
export function promptLinkWithFallback(ctx: { promptLink: LinkPromptFn } | undefined | null, options: RteLinkPromptOptions): Promise<RteLinkPromptResult | null> {
	if (ctx?.promptLink) return ctx.promptLink(options)
	const url = window.prompt(options.title, options.initialValue ?? '')
	if (url === null) return Promise.resolve(null)
	return Promise.resolve({ url, openInNewTab: options.checkboxInitial ?? false })
}

/** 同上：無對話框服務時退回 window.alert */
export function alertWithFallback(ctx: { alert: (message: string) => Promise<void> } | undefined | null, message: string): void {
	if (ctx?.alert) {
		void ctx.alert(message)
		return
	}
	window.alert(message)
}
