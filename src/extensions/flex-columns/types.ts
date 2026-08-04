export type FlexGrowSide = 'left' | 'right'

export interface FlexColumnsConfig {
	/** 哪一側佔滿剩餘寬度，預設 right */
	growSide?: FlexGrowSide
}

export interface FlexColumnsOptions {
	HTMLAttributes: Record<string, unknown>
}
