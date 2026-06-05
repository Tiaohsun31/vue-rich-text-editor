import type { ImageUploadHandler } from '../../types/upload'

export type { ImageUploadHandler }

export interface ImageUploadOptions {
  /** 上傳處理器；未提供時 extension 不啟用拖拉/貼上上傳 */
  upload: ImageUploadHandler | null
  /** 允許的圖片 MIME 類型 */
  acceptMimes: string[]
  /** 上傳失敗時的回呼 */
  onError?: (error: unknown, file: File) => void
}
