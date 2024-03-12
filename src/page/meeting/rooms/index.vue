<script setup lang="ts">
import { applyPureReactInVue } from 'veaury'
import dynamic from 'next/dynamic'

// import {
// 	LiveKitRoom,
//   VideoConference,
//   formatChatMessageLinks
// } from '@livekit/components-react'

// import {
//   Room,
// 	RoomOptions
// } from 'livekit-client'

const PreJoinMeeting = dynamic(
  async () => {
    return (await import('@livekit/components-react')).PreJoin
  },
  { ssr: false },
)

const PreJoinNoSSR = applyPureReactInVue(PreJoinMeeting)

function handlePreJoinSubmit() {}

</script>

<template>
	<div class="meeting-container" data-lk-theme="default">
		<div class="pre-join-meeting-wrapper">
			<PreJoinNoSSR
				:onError="err => console.log('error while setting up prejoin', err)"
				:defaults="{
					username: '',
					videoEnabled: true,
					audioEnabled: true,
				}"
				@onSubmit="handlePreJoinSubmit"
			></PreJoinNoSSR>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.meeting-container {
	width: 100%;
	height: 100%;
	.pre-join-meeting-wrapper {
		display: grid;
		place-items: center;
		height: 100%;
	}
}
</style>