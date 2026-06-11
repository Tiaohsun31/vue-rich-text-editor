import { Extension, type Editor } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import type { EditorView } from '@tiptap/pm/view'

import type { ImageUploadHandler, ImageUploadOptions } from './types'

const uploadKey = new PluginKey<DecorationSet>('rte-image-upload')

interface AddMeta {
	add: { id: object; pos: number }
}
interface RemoveMeta {
	remove: { id: object }
}
type UploadMeta = AddMeta | RemoveMeta

function isImageFile(file: File, acceptMimes: string[]): boolean {
	return acceptMimes.includes(file.type)
}

/** 由 placeholder id 找出目前位置（內容可能在上傳期間被編輯而位移） */
function findPlaceholder(editor: Editor, id: object): number | null {
	const decos = uploadKey.getState(editor.state)
	if (!decos) return null
	const found = decos.find(undefined, undefined, (spec) => spec.id === id)
	return found.length ? found[0].from : null
}

function createPlaceholder(): HTMLElement {
	const el = document.createElement('span')
	el.className = 'rte-image-uploading'
	return el
}

/** 上傳單一檔案：先插入 placeholder，完成後以 image node 取代 */
async function uploadAndInsert(
	editor: Editor,
	file: File,
	pos: number,
	upload: ImageUploadHandler,
	onError?: (error: unknown, file: File) => void,
): Promise<void> {
	const id = {}

	// 1. 插入 placeholder decoration
	const addTr = editor.state.tr
	addTr.setMeta(uploadKey, { add: { id, pos } } satisfies AddMeta)
	editor.view.dispatch(addTr)

	try {
		// 2. 執行上傳
		const result = await upload(file)

		// 3. 找回 placeholder 目前位置並替換為 image node
		const placeholderPos = findPlaceholder(editor, id)
		if (placeholderPos == null) return

		const imageType = editor.state.schema.nodes.image
		if (!imageType) return

		const node = imageType.create({ src: result.url, alt: result.alt ?? null })
		const tr = editor.state.tr.replaceWith(placeholderPos, placeholderPos, node).setMeta(uploadKey, { remove: { id } } satisfies RemoveMeta)
		editor.view.dispatch(tr)
	} catch (error) {
		// 4. 移除 placeholder
		editor.view.dispatch(editor.state.tr.setMeta(uploadKey, { remove: { id } } satisfies RemoveMeta))
		onError?.(error, file)
	}
}

function handleFilesAt(editor: Editor, files: File[], pos: number, options: ImageUploadOptions): void {
	if (!options.upload) return
	const images = files.filter((f) => isImageFile(f, options.acceptMimes))
	let insertPos = pos
	for (const file of images) {
		void uploadAndInsert(editor, file, insertPos, options.upload, options.onError)
		insertPos += 1
	}
}

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		imageUpload: {
			/** 開啟檔案選擇器並上傳所選圖片 */
			openImageUpload: () => ReturnType
		}
	}
}

export const ImageUploadExtension = Extension.create<ImageUploadOptions>({
	name: 'imageUpload',

	addOptions() {
		return {
			upload: null,
			acceptMimes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'],
			onError: undefined,
		}
	},

	addCommands() {
		return {
			openImageUpload:
				() =>
				({ editor }) => {
					const options = this.options
					if (!options.upload) return false

					const input = document.createElement('input')
					input.type = 'file'
					input.accept = options.acceptMimes.join(',')
					input.multiple = true
					input.style.display = 'none'
					input.addEventListener('change', () => {
						const files = Array.from(input.files ?? [])
						if (files.length) {
							handleFilesAt(editor, files, editor.state.selection.from, options)
						}
						input.remove()
					})
					document.body.appendChild(input)
					input.click()
					return true
				},
		}
	},

	addProseMirrorPlugins() {
		const editor = this.editor
		const options = this.options

		return [
			new Plugin<DecorationSet>({
				key: uploadKey,
				state: {
					init() {
						return DecorationSet.empty
					},
					apply(tr, set) {
						set = set.map(tr.mapping, tr.doc)
						const meta = tr.getMeta(uploadKey) as UploadMeta | undefined
						if (meta && 'add' in meta) {
							const deco = Decoration.widget(meta.add.pos, createPlaceholder(), {
								id: meta.add.id,
							})
							set = set.add(tr.doc, [deco])
						} else if (meta && 'remove' in meta) {
							set = set.remove(set.find(undefined, undefined, (spec) => spec.id === meta.remove.id))
						}
						return set
					},
				},
				props: {
					decorations(state) {
						return uploadKey.getState(state)
					},
					handlePaste(view: EditorView, event: ClipboardEvent) {
						if (!options.upload) return false
						const files = Array.from(event.clipboardData?.files ?? [])
						const images = files.filter((f) => isImageFile(f, options.acceptMimes))
						if (!images.length) return false
						event.preventDefault()
						handleFilesAt(editor, images, view.state.selection.from, options)
						return true
					},
					handleDrop(view: EditorView, event: DragEvent) {
						if (!options.upload) return false
						const files = Array.from(event.dataTransfer?.files ?? [])
						const images = files.filter((f) => isImageFile(f, options.acceptMimes))
						if (!images.length) return false
						event.preventDefault()
						const coords = view.posAtCoords({ left: event.clientX, top: event.clientY })
						const pos = coords?.pos ?? view.state.selection.from
						handleFilesAt(editor, images, pos, options)
						return true
					},
				},
			}),
		]
	},
})
