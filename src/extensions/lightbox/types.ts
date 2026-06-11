export type LightboxType = 'text' | 'image' | ''

export interface LightboxConfig {
	type: LightboxType
	imageSrc: string
	alt: string
}

export interface LightboxOptions {
	/** 預設 lightbox 群組（對應 data-lightbox-group） */
	defaultGroup?: string
	/** 套用到輸出 <a> 上的額外 HTML 屬性 */
	HTMLAttributes: Record<string, unknown>
}
