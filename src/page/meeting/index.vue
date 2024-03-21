<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const meetingID = ref()

const inputStyle = {
	color: '#fff',
	fontSize: '1rem'
}

function startMeeting() {
	if (!meetingID.value) {
		ElMessage({ message: '请输入会议ID', type: 'error' })
		return
	}
	router.push({ path: `/meeting/rooms/${ meetingID.value }` })
}
</script>

<template>
	<div class="start-meeting-container">
		<div class="start-meeting-wrapper">
			<div class="title">Meeting</div>
			<div class="meetingID-wrapper">
				<div class="desc">会议ID:</div>
				<el-input v-model="meetingID" :input-style="inputStyle" class="meetingID-input" placeholder="例如: room-name" />
			</div>
			<el-button color="#1e1e1e" size="large" @click="startMeeting">Start Meeting</el-button>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.start-meeting-container {
	width: 100%;
	height: 100%;
	display: grid;
	justify-items: center;
	place-content: center;
	background: #111;

	.start-meeting-wrapper {
		width: 300px;
		height: 300px;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 0.5rem;

		.title {
			text-align: center;
			font-size: 2rem;
			color: #ff6352;
		}

		.meetingID-wrapper {
			display: flex;
			align-items: center;

			.desc {
				flex: 0 0 3.5rem;
				font-size: 0.9rem;
			}

			.meetingID-input {
				::v-deep .el-input__wrapper {
					background-color: #111;
					box-shadow: 0 0 0 1px #4C4D4F inset;
				}
			}
		}
	}
}
</style>