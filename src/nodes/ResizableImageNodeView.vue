<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { computed, ref } from 'vue'

const props = defineProps(nodeViewProps)

const editable = computed<boolean>(() => props.editor.isEditable)
const width = computed<string | null>(() => props.node.attrs.width)
const align = computed<string>(() => props.node.attrs.align ?? 'left')
const lightbox = computed<boolean>(() => props.node.attrs.lightbox === true)

// 對齊用 text-align（wrapper 為整列 block），框由 frame 控制寬度
const wrapperStyle = computed(() => ({ textAlign: align.value as 'left' | 'center' | 'right' }))

// frame 帶寬度：% 對「編輯器寬度」解析，避免 inline-block 縮放造成的循環佈局
const frameStyle = computed(() => ({
	width: width.value || 'auto',
	maxWidth: '100%',
}))

const imgRef = ref<HTMLImageElement | null>(null)
let startX = 0
let startW = 0

function onResizeStart(e: PointerEvent) {
	if (!editable.value || !imgRef.value) return
	e.preventDefault()
	startX = e.clientX
	startW = imgRef.value.offsetWidth
	window.addEventListener('pointermove', onResizeMove)
	window.addEventListener('pointerup', onResizeEnd)
}

function onResizeMove(e: PointerEvent) {
	const img = imgRef.value
	if (!img) return
	const editorWidth = img.closest('.ProseMirror')?.clientWidth ?? img.parentElement?.clientWidth ?? startW
	const newW = Math.max(40, startW + (e.clientX - startX))
	const pct = Math.min(100, Math.round((newW / editorWidth) * 100))
	props.updateAttributes({ width: `${pct}%` })
}

function onResizeEnd() {
	window.removeEventListener('pointermove', onResizeMove)
	window.removeEventListener('pointerup', onResizeEnd)
}
</script>

<template>
	<NodeViewWrapper class="rte-image" :style="wrapperStyle">
		<span class="rte-image__frame" :class="{ 'rte-image__frame--editable': editable, 'is-selected': selected }" :style="frameStyle">
			<img
				ref="imgRef"
				:src="node.attrs.src"
				:alt="node.attrs.alt"
				class="rte-image__img"
				:class="{ 'rte-image__img--lightbox': lightbox && !editable }"
				:data-lightbox="lightbox ? 'true' : undefined"
				:data-lightbox-src="lightbox ? node.attrs.src : undefined"
				:data-lightbox-alt="lightbox ? node.attrs.alt : undefined" />
			<span v-if="editable" class="rte-image__handle" @pointerdown="onResizeStart"></span>
			<span v-if="editable && lightbox" class="rte-image__badge" title="點圖開燈箱">🔍</span>
		</span>
	</NodeViewWrapper>
</template>
