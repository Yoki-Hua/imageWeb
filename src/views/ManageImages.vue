<template>
	<div class="mx-auto max-w-6xl my-4 px-4 relative">
		<loading-overlay :loading="loading" />

		<div class="flex items-center justify-between mb-4">
			<div>
				<div class="text-gray-800 text-lg">管理图片</div>
				<div class="text-sm text-gray-500">
					已上传 {{ uploadedImages.length }} 张图片，共 {{ formatBytes(imagesTotalSize) }}
				</div>
			</div>
			<font-awesome-icon
				:icon="faRedoAlt"
				class="text-xl cursor-pointer"
				@click="listImages"
			/>
		</div>

		<div class="grid gap-4 grid-cols-3">
			<transition-group name="el-fade-in-linear">
				<div
					class="col-span-3 md:col-span-1"
					v-for="item in uploadedImages"
					:key="item.src"
				>
					<image-box
						:src="item.src"
						:size="item.fileSize"
						:name="item.fileName"
						@delete="deleteImage(item.fileName)"
						mode="uploaded"
						:uploaded-at="item.createDate"

					/>

<!--          :expires-at="item.expiresAt"-->
				</div>
			</transition-group>

		</div>
    <div style="text-align: center">
      <el-button-group >
        <el-button type="info" @click="changePage(-1)" :disabled="preDisabled">上一页</el-button>
        <el-button type="info" @click="changePage(1)" :disabled="nextDisabled">下一页</el-button>
      </el-button-group>
    </div>
	</div>

</template>

<script setup lang="ts">

import { requestListImages, requestDeleteImage } from '../utils/request'
import LoadingOverlay from '../components/LoadingOverlay.vue'
import formatBytes from '../utils/format-bytes'
import { computed, onMounted, ref } from 'vue'
import type { UploadedImage } from '../utils/types'
import ImageBox from '../components/ImageBox.vue'
import { faRedoAlt } from '@fortawesome/free-solid-svg-icons'
import {ElNotification as elNotify} from "element-plus";
//上一页第一个
const preOnePic=ref<string[]>([""]);
const preDisabled=ref(true);
const nextDisabled=ref(false);
const loading = ref(false)
let nextMarker = ref("");
const uploadedImages = ref<UploadedImage[]>([])
const imagesTotalSize = computed(() =>{
       return uploadedImages.value.reduce((total, item) => {
         let sizes = 1024;
         if(item.fileSize.indexOf("M")!==-1) {
           sizes*=1024;
         }
         if(item.fileSize.indexOf("G")!==-1) {
           sizes*=(1024*1024);
         }
        let size = Number(item.fileSize.replace(/\w(KB|M|G)/i,""))*sizes;
        let count = total + size;
        return count;
      }, 0)

    }
	//
)
const changePage=(num:number)=>{
  let src = "";
  if (num<0){
    src = preOnePic.value[preOnePic.value.length-2]?preOnePic.value[preOnePic.value.length-2]:"";
    preOnePic.value.pop();
    if (preOnePic.value[preOnePic.value.length-1]===''){
      preDisabled.value=true;
    }
  }
    if (num>0){
      console.log(preOnePic.value)
      src = uploadedImages.value[uploadedImages.value.length-1].fileName;
      preOnePic.value.push(src)
      preDisabled.value = preOnePic.value[preOnePic.value.length - 1].length==0;
    }
  console.log(preOnePic.value)
  nextMarker.value=src;
  listImages();
}

const listImages = () => {
  var reg = /\.(png|jpg|jpeg)$/g;
  let param = {
    nextMarker:"img/"+ nextMarker.value
  }
	loading.value = true
  let token = {};
  let tokenString = window.localStorage.getItem("token");
  token={
    "token":tokenString
  }
	requestListImages(param,token)
		.then((data) => {
      let imgArr = data.map(item => {
        let obj = {
          src: (item.fileName.match(reg)!=null) ? ("https://image-islery.obs.cn-south-1.myhuaweicloud.com/img/"+item.fileName+"?x-image-process=style/style-webp"):("https://image-islery.obs.cn-south-1.myhuaweicloud.com/img/"+item.fileName),
          fileSize: item.fileSize,
          createDate: item.createDate,
          fileName: item.fileName
        }
        return obj;
      });
      if (imgArr.length != 0) {

        nextDisabled.value=false;
        uploadedImages.value = imgArr;
      } else {
        nextDisabled.value=true;
      }
      //不要排序  否则翻页会乱
      // uploadedImages.value = uploadedImages.value.sort((a, b) =>
      //     new Date(a.createDate) > new Date(b.createDate)  ? -1 : new Date(b.createDate) >  new Date(a.createDate) ? 1 : 0
      // )
		})
		.catch(() => {})
		.finally(() => {
			loading.value = false
		})
}

onMounted(() => {
  listImages()
})

const deleteImage = (fileName: string) => {
  let token = {};
  let tokenString = window.localStorage.getItem("token");
  token={
    "token":tokenString
  }
	const absFileName = "img/"+fileName;
	requestDeleteImage(absFileName,token).then((res) => {
		uploadedImages.value = uploadedImages.value.filter((item) => item.fileName !== absFileName)
    if (res){
      elNotify({
        title: '删除成功！',
        message: `请刷新主页面`,
        type: 'success'
      })
    }
	})
}
</script>
