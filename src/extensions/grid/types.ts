export interface GridConfig {
	/** 窄容器（手機）欄數，1–3 */
	minColumns?: number
	/** 寬容器（桌面）欄數，1–6 */
	maxColumns?: number
}

export interface GridOptions {
	HTMLAttributes: Record<string, unknown>
}
