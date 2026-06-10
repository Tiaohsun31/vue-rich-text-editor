import type { InjectionKey } from 'vue'
import type { RteMessages } from './types'
import { zhTW } from './zh-TW'
import { zhCN } from './zh-CN'
import { en } from './en'

export type { RteMessages }
export { zhTW, zhCN, en }

export type RteLocale = 'zh-TW' | 'zh-CN' | 'en'

export const locales: Record<RteLocale, RteMessages> = {
  'zh-TW': zhTW,
  'zh-CN': zhCN,
  en,
}

/** 取得完整文案：內建語系 + 呼叫端覆寫 */
export function resolveMessages(
  locale: RteLocale = 'zh-TW',
  overrides?: Partial<RteMessages>,
): RteMessages {
  return overrides ? { ...locales[locale], ...overrides } : locales[locale]
}

/** RichTextEditor 向下提供文案給 toolbar / bubble menus */
export const rteMessagesKey: InjectionKey<RteMessages> = Symbol('rte-messages')
