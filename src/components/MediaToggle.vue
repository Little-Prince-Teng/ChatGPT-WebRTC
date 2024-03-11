<script setup lang="ts">
defineProps({
	// mediaText: {
	// 	type: String,
	// 	required: false,
	// 	default: ''
	// },
	currentMediaId: {
		type: String,
		required: true
	},
	mediaDefaultText: {
		type: String,
		required: true
	},
	mediaIcon: {
		type: Object,
		required: true
	},
	mediaList: {
		type: Array,
		required: true
	}
})
</script>

<template>
	<div class="media-toggle-container">
		<el-dropdown split-button trigger="click">
			<div>
				<el-icon><component :is="mediaIcon"></component></el-icon>
				<!-- <i-ep-microphone /> -->
				<span>{{ mediaDefaultText }}</span>
			</div>
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item
						v-for="{ deviceId, label } in mediaList"
						:key="deviceId"
						:disabled="deviceId === currentMediaId"
					>{{ label }}-{{ deviceId }}-{{ currentMediaId }}</el-dropdown-item>
				</el-dropdown-menu>
			</template>
		</el-dropdown>
	</div>
</template>