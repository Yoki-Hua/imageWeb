<template>
	<el-config-provider :locale="zhCn">
		<div class="w-full h-screen overflow-x-hidden overflow-y-auto">
			<el-scrollbar>
				<div
					class="w-full h-16 bg-slate-200/50 shadow-sm sticky left-0 top-0 backdrop-blur-sm z-10"
				>
					<div class="mx-auto max-w-6xl px-4 h-full flex items-center">
            <div
                :class="{

							}"
                class="px-3 py-2 rounded-md mr-2 text-gray-800 text-sm cursor-pointer"
                @click="check"
            >
              <img src="./assets/pic.png" class="w-8 h-8 block mr-2"  />
            </div>
						<div class="text-lg">
							{{ appName }}
						</div>
            <div
                v-show="flagLogOut"
                class="px-3 py-2 rounded-md mr-2 text-gray-800 text-sm cursor-pointer"
                @click="logOut"
            >
              <span  style="font-size:12px;color: grey;"> 退出登录</span>
            </div>
						<div class="flex-1"> </div>
						<div
							:class="{
								'bg-slate-300': $route.path === '/up'
							}"
							class="px-3 py-2 rounded-md mr-2 text-gray-800 text-sm cursor-pointer"
							@click="router.push('/up')"
						>
							<font-awesome-icon :icon="faUpload" />
							<span class="hidden md:inline-block ml-2">上传</span>
						</div>

						<div
							:class="{
								'bg-slate-300': $route.path === '/'
							}"
							class="px-3 py-2 rounded-md text-gray-800 text-sm cursor-pointer"
							@click="router.push('/')"
						>
							<font-awesome-icon :icon="faCog" />
							<span class="hidden md:inline-block ml-2">管理</span>
						</div>
					</div>
				</div>

				<div class="min-h-[calc(100vh-64px-64px)] overflow-auto">
					<router-view />
				</div>

				<div class="w-full h-16 flex items-center justify-center text-gray-500 text-sm">
					<a :href="repoLink" target="_blank" class="underline">
						{{ repoName }}
					</a>
				</div>
			</el-scrollbar>
		</div>
	</el-config-provider>
<!--  dialog-->
  <el-dialog center    v-model="dialogFormVisible" title="登录" >
    <el-form :model="form" label-width="60px">
      <el-form-item label="用户名">
        <el-input v-model="form.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密 码" >
        <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">返回</el-button>
        <el-button type="primary" @click="login(form)"
        >提交</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {ElNotification as elNotify} from "element-plus";
import { faCog, faUpload } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { ElScrollbar, ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import {onMounted, reactive, ref} from 'vue'
import {$ref} from "vue/macros";
import {requestLogin} from "./utils/request";
const repoLink = 'https://iimge.org'
const dialogTableVisible = ref(false)
const dialogFormVisible = ref(false)
const repoName = 'iimge.org'
const appName = 'IIMGE 图床'
const flagLogOut=ref(false)
document.title = appName
const form = reactive({
  username: '',
  password:''
})
const destroy=ref(true);
const router = useRouter()
const check=()=>{
let username=  window.localStorage.getItem("username");
if (username){
  dialogFormVisible.value=false;
  elNotify({
    title: '已经登录！',
    message: `请刷新页面`,
    type: 'warning'
  })
}else{
  dialogFormVisible.value=true ;
}
}
const login=(body: any)=>{
  dialogFormVisible.value =false;
  requestLogin(body).then(data=>{
    if (data.token && data.user){
      window.localStorage.setItem("username",data['user'].username)
      window.localStorage.setItem("token",data['token'])
      elNotify({
        title: '登录成功！',
        message: `请刷新主页面`,
        type: 'success'
      })
      form.username = '';
      form.password='';
      flagLogOut.value=true
    }

  }).catch(err=>{
    elNotify({
      title: '登录失败！',
      message: `原因：`+err.message,
      type: 'error'
    })
  })

}
const  logOut=()=>{
  ElMessageBox.confirm(
      '确认登出吗？',
      '退出登录',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
        let username= window.localStorage.getItem("username");
        let token =window.localStorage.getItem("token");
        if (username || token) {
          window.localStorage.removeItem("username");
          window.localStorage.removeItem("token");
          window.location.reload();
          elNotify({
            title: '退出成功！',
            message: `退出成功！`,
            type: 'success'
          })
        }else{
          elNotify({
            title: '尚未登录！',
            message: `请登录！`,
            type: 'warning'
          })
        }
        flagLogOut.value=false;
      })
      .catch(() => {
      })


}
onMounted(()=>{
  let username= window.localStorage.getItem("username");
  let token =window.localStorage.getItem("token");
  if (username || token) {
    flagLogOut.value=true;
  }

})


</script>
<style>
.el-button--text {
  margin-right: 15px;
}
.el-select {
  width: 300px;
}
.el-input {
  width: 300px;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}

</style>
