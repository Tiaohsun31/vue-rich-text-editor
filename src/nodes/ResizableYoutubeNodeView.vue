<script setup lang="ts">
import { getEmbedUrlFromYoutubeUrl, type YoutubeOptions } from '@tiptap/extension-youtube'
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { computed, onBeforeUnmount, ref } from 'vue'

import { normalizeYoutubeAlign } from './ResizableYoutube'

const props = defineProps(nodeViewProps)

const options = computed(() => props.extension.options as YoutubeOptions)

// editor.isEditable 不是響應式來源，但影片必須在唯讀時恢復可播放，
// 因此改用 ref + setEditable() 發出的 update 事件同步（computed 會停在建立當下的值）
const editable = ref<boolean>(props.editor.isEditable)
function syncEditable() {
	editable.value = props.editor.isEditable
}
props.editor.on('update', syncEditable)
onBeforeUnmount(() => props.editor.off('update', syncEditable))
const align = computed(() => normalizeYoutubeAlign(props.node.attrs.align))
const size = computed<string>(() => (props.node.attrs.size as string | null) ?? `${options.value.width}px`)

// 對齊用 text-align（wrapper 為整列 block），寬度由 frame 控制
const wrapperStyle = computed(() => ({ textAlign: align.value }))
const frameStyle = computed(() => ({ width: size.value, maxWidth: '100%' }))

const embedUrl = computed(() => {
	const o = options.value
	return (
		getEmbedUrlFromYoutubeUrl({
			url: (props.node.attrs.src as string) ?? '',
			allowFullscreen: o.allowFullscreen,
			autoplay: o.autoplay,
			ccLanguage: o.ccLanguage,
			ccLoadPolicy: o.ccLoadPolicy,
			controls: o.controls,
			disableKBcontrols: o.disableKBcontrols,
			enableIFrameApi: o.enableIFrameApi,
			endTime: o.endTime,
			interfaceLanguage: o.interfaceLanguage,
			ivLoadPolicy: o.ivLoadPolicy,
			loop: o.loop,
			modestBranding: o.modestBranding,
			nocookie: o.nocookie,
			origin: o.origin,
			playlist: o.playlist,
			progressBarColor: o.progressBarColor,
			startAt: (props.node.attrs.start as number) || 0,
			rel: o.rel,
		}) ?? ''
	)
})

const frameRef = ref<HTMLElement | null>(null)
let startX = 0
let startW = 0

function onResizeStart(e: PointerEvent) {
	if (!editable.value || !frameRef.value) return
	e.preventDefault()
	startX = e.clientX
	startW = frameRef.value.offsetWidth
	window.addEventListener('pointermove', onResizeMove)
	window.addEventListener('pointerup', onResizeEnd)
}

function onResizeMove(e: PointerEvent) {
	const frame = frameRef.value
	if (!frame) return
	const editorWidth = frame.closest('.ProseMirror')?.clientWidth ?? frame.parentElement?.clientWidth ?? startW
	// 靠右對齊時把手在右下角，往左拖才是放大
	const delta = align.value === 'right' ? startX - e.clientX : e.clientX - startX
	const newW = Math.max(160, startW + delta)
	const pct = Math.min(100, Math.round((newW / editorWidth) * 100))
	props.updateAttributes({ size: `${pct}%` })
}

function onResizeEnd() {
	window.removeEventListener('pointermove', onResizeMove)
	window.removeEventListener('pointerup', onResizeEnd)
}
</script>

<template>
	<NodeViewWrapper class="rte-video" :style="wrapperStyle">
		<span ref="frameRef" class="rte-video__frame" :class="{ 'rte-video__frame--editable': editable, 'is-selected': selected }" :style="frameStyle">
			<iframe class="rte-video__iframe" :src="embedUrl" allowfullscreen></iframe>
			<span v-if="editable" class="rte-video__handle" :class="{ 'rte-video__handle--flip': align === 'right' }" @pointerdown="onResizeStart"></span>
		</span>
	</NodeViewWrapper>
</template>
