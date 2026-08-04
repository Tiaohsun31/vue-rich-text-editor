import type { RteMessages } from '../../i18n'
import { zhTW } from '../../i18n'
import { ColumnsIcon } from '../../icons'
import type { ToolbarButton } from '../../toolbar/types'
import type { FlexColumnsConfig } from './types'

export { FlexColumnsExtension } from './FlexColumnsExtension'
export { default as FlexColumnsNodeView } from './FlexColumnsNodeView.vue'
export type { FlexGrowSide, FlexColumnsConfig, FlexColumnsOptions } from './types'

/** 「插入彈性雙欄」toolbar 按鈕工廠。 */
export function createFlexColumnsToolbarItem(t: RteMessages = zhTW, config?: FlexColumnsConfig): ToolbarButton {
	return {
		name: 'rteFlexColumns',
		icon: ColumnsIcon,
		label: t.flexLabel,
		isActive: (editor) => editor.isActive('rteFlexColumns'),
		command: (editor) => {
			editor
				.chain()
				.focus()
				.insertFlexColumns(config ?? { growSide: 'right' })
				.run()
		},
	}
}
