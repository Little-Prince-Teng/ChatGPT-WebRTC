<script setup>
// @ts-ignore
import IMenu from '@/layout/Menu.tsx'

const route = useRoute()
</script>

<template>
	<div class="page-container">
		<el-container>
			<el-header><IMenu /></el-header>
			<el-main>
				<div id="content" class="content">
					<router-view :key="route.path" />
				</div>
			</el-main>
		</el-container>
	</div>
</template>

<style scoped lang="scss">
.page-container {
  user-select: none;
  display: flex;
  flex-direction: column;

  // height: 100vh;

  .el-header {
    padding: 0;
    height: 58px;
  }

  .el-main {
    flex: 1;
    padding: 0;

    .content {
      overflow: auto;
      height: calc(100vh - 58px);
      width: 100%;
      position: relative;
			background-color: #111;
    }
  }
}
</style>