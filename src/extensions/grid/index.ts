import type { RteMessages } from '../../i18n'
import { zhTW } from '../../i18n'
import { GridIcon } from '../../icons'
import type { ToolbarButton } from '../../toolbar/types'
import type { GridConfig } from './types'

export { GridExtension } from './GridExtension'
export { default as GridNodeView } from './GridNodeView.vue'
export type { GridConfig, GridOptions } from './types'

/** 「插入響應式網格」toolbar 按鈕工廠。 */
export function createGridToolbarItem(t: RteMessages = zhTW, config?: GridConfig): ToolbarButton {
	return {
		name: 'rteGrid',
		icon: GridIcon,
		label: t.gridLabel,
		isActive: (editor) => editor.isActive('rteGrid'),
		command: (editor) => {
			editor
				.chain()
				.focus()
				.insertGrid(config ?? { minColumns: 1, maxColumns: 2 })
				.run()
		},
	}
}
