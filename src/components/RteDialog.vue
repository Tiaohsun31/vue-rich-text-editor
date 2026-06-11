<script setup lang="ts">
import { ref, watch, nextTick, inject } from 'vue'

import type { RteDialogService } from '../dialog/dialog'
import { rteMessagesKey, zhTW } from '../i18n'

const props = defineProps<{ service: RteDialogService }>()

const t = inject(rteMessagesKey, zhTW)
const inputRef = ref<HTMLInputElement | null>(null)

watch(
	() => props.service.state.open,
	(open) => {
		if (open && props.service.state.mode === 'prompt') {
			void nextTick(() => inputRef.value?.focus())
		}
	},
)
</script>

<template>
	<div v-if="service.state.open" class="rte-dialog" @mousedown.self="service.cancel()">
		<div class="rte-dialog__panel" role="dialog" :aria-label="service.state.title">
			<div class="rte-dialog__title">{{ service.state.title }}</div>
			<input
				v-if="service.state.mode === 'prompt'"
				ref="inputRef"
				v-model="service.state.value"
				class="rte-dialog__input"
				type="text"
				:placeholder="service.state.placeholder"
				@keydown.enter.prevent="service.confirm()"
				@keydown.esc.prevent="service.cancel()" />
			<div class="rte-dialog__actions">
				<button v-if="service.state.mode === 'prompt'" type="button" class="rte-dialog__btn" @click="service.cancel()">
					{{ t.cancel }}
				</button>
				<button type="button" class="rte-dialog__btn rte-dialog__btn--primary" @click="service.confirm()">
					{{ t.ok }}
				</button>
			</div>
		</div>
	</div>
</template>
