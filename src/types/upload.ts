export type ImageUploadHandler = (file: File) => Promise<{
	url: string
	alt?: string
	width?: number
	height?: number
}>
