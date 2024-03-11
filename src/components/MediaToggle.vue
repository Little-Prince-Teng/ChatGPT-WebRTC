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
	},
	open: {
		type: Boolean,
		default: true
	}
})

const emit = defineEmits(['toggle', 'select'])

function toggle() {
	emit('toggle')
}

function select(value) {
	emit('select', value)
}
</script>

<template>
	<div class="media-toggle-container">
		<!-- <el-check-tag :checked="open" @change="toggle">
      <slot>
				<div class="toggle-btn-wrapper">
					<el-icon class="media-icon"><component :is="mediaIcon"></component></el-icon>
					<span>{{ mediaDefaultText }}</span>
				</div>
			</slot>
    </el-check-tag> -->
	
		<el-dropdown split-button trigger="click" @click="toggle" @command="select">
			<div class="toggle-btn-wrapper">
				<el-icon class="media-icon"><component :is="mediaIcon"></component></el-icon>
				<span>{{ mediaDefaultText }}</span>
			</div>
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item
						v-for="{ deviceId, label } in mediaList"
						:key="deviceId"
						:command="deviceId"
						class="media-item"
						:class="{ active: deviceId === currentMediaId }"
					>{{ label }}</el-dropdown-item>
				</el-dropdown-menu>
			</template>
		</el-dropdown>
	</div>
</template>

<style lang="scss" scoped>
.media-toggle-container {
	margin-right: 1rem;
	.toggle-btn-wrapper {
		display: flex;
		align-items: center;

		.media-icon {
			font-size: 1.125rem;
		}
	}
}
</style>

<style lang="scss">
.media-item {
	&.active {
		background-color: #ECF5FF;
		color: #409EFF;
	}
}
</style>