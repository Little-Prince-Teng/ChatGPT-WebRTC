<script setup lang="ts">
import { applyPureReactInVue } from 'veaury'
import { useRouter } from 'vue-router'
import dynamic from 'next/dynamic'
import { LocalUserChoices } from '@livekit/components-react'
import ActiveRoom from './index.vue'

const PreJoinMeeting = dynamic(
  async () => {
    return (await import('@livekit/components-react')).PreJoin
  },
  { ssr: false },
)
const PreJoinNoSSR = applyPureReactInVue(PreJoinMeeting)

const router = useRouter()
const preJoinChoices = ref()
// 获取当前房间名
const { name: roomName } = router.currentRoute.value.params

// 加入房间
function handlePreJoinSubmit(values: LocalUserChoices) {
	preJoinChoices.value = values
}

</script>

<template>
	<div class="meeting-container" data-lk-theme="default">
		<div v-if="roomName && !Array.isArray(roomName) && preJoinChoices" class="active-room-wrapper">
			<ActiveRoom
				:user-choices="preJoinChoices"
				:room-name="roomName"
				:on-leave="() => router.push('/meeting')" />
		</div>
		<div v-else class="pre-join-meeting-wrapper">
			<PreJoinNoSSR
				:defaults="{
					username: '',
					videoEnabled: true,
					audioEnabled: true,
				}"
				@error="(err: any) => console.log('error while setting up prejoin', err)"
				@submit="handlePreJoinSubmit"
			></PreJoinNoSSR>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.meeting-container {
	width: 100%;
	height: 100%;

	.active-room-wrapper {
		width: 100%;
		height: 100%;
	}

	.pre-join-meeting-wrapper {
		display: grid;
		place-items: center;
		height: 100%;
	}
}
</style>