<template>
  <div>
    <el-upload list-type="picture-card" :auto-upload="true" :http-request="upqiniu" :limit="limit"
      :before-upload="beforeUpload" :action="domain" v-model:file-list="fileList" :on-success="handleSuccess"
      :class="{ hide: hideUpload() }" :on-preview="handlePictureCardPreview" :on-remove="handleRemove"
      :on-error="handleFileErroe" :on-change="handleChange">
      <el-icon class="avatar-uploader-icon">
        <Plus />
      </el-icon>
    </el-upload>
    <!-- 预览图片 -->
    <el-dialog v-model="dialogVisible">
      <img w-full :src="imageUrl" alt="Preview Image" style="width: 500px;height: 500px;" />
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { uoloadToken, reqUoloadImg } from '@/api/comics/index'
import { UploadFile, ElMessage } from 'element-plus'
import type { UploadFiles } from 'element-plus'
import comicsStore from '@/stores/comics'
const comicsIdStore = comicsStore()
const dialogVisible = ref(false)
const fileList = ref([])
const limit = ref(1)
// 七牛云变量
//预览的图片地址
const imageUrl = ref()
// 七牛云的上传地址，根据自己所在地区选择，我这里是华南区
const domain = ref("https://upload-z2.qiniup.com")

// 这是七牛云空间的外链默认域名
const qiniuaddr = ref('rzgyzgxat.hn-bkt.clouddn.com')

let $emit = defineEmits(['data-imageUrl'])

// onMounted(() => {
//    imageUrl.value =comicsIdStore.editORAdd.imageUrl
// })

const handleChange = () => {
  console.log('文件改变')
}
const upqiniu = async (req: any) => {
  const config = {
    headers: { "Content-Type": "multipart/form-data" }
  };
  let filetype = "";
  if (req.file.type === "image/png") {
    filetype = "png";
  } else {
    filetype = "jpg";
  }
  //取得图片名
  let uploadImgName = req.file.name.substring(
    0,
    req.file.name.indexOf(".")
  );
  // 重命名要上传的文件
  const keyname =
    "comics_" + uploadImgName + "_" + new Date().getTime();
  "." + filetype;
  // 从后端获取上传凭证token,此处在前端配置proxyTable代理进行跨域
  let res = await uoloadToken()
  console.log(res)
  if (res.code == 200) {
    let formdata = new FormData();
    formdata.append("file", req.file);
    formdata.append("token", res.data);
    formdata.append("key", keyname);
    // 获取到凭证之后再将文件上传到七牛云空间
    try {
      let res2 = await reqUoloadImg(formdata)
      imageUrl.value = "http://" + qiniuaddr.value + "/" + res2.key;
      // 发送数据给父组件
      $emit('data-imageUrl', imageUrl.value)
      ElMessage({
        message: '上传成功',
        type: 'success',
      })
      handleRemove()
      console.log(imageUrl.value)
    } catch (error) {
      fileList.value = []
      ElMessage({
        message: '上传失败~',
        type: 'error',
      })
      console.log(error)
    }
  }

}

// 验证文件合法性
const beforeUpload = (file: any) => {
  const isJPG = file.type === "image/jpeg" || file.type === "image/png";
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isJPG) {
    ElMessage({
      message: '上传头像图片只能是 JPG、png 格式!',
      type: 'error',
    })
    console.log('上传头像图片只能是 JPG、png 格式!')
  }
  if (!isLt2M) {
    ElMessage({
      message: '上传图片大小不能超过 2MB!',
      type: 'error',
    })

  }
  return isJPG && isLt2M;
}

const handleRemove = () => {
  imageUrl.value = ''
}


const handlePictureCardPreview = (file: UploadFile) => {
  imageUrl.value = file.url;
  dialogVisible.value = true
}

const handleSuccess = (response: any, uploadFile: any, fileList: any) => {
  fileList.value = [...fileList];


}
const hideUpload = () => {
  return fileList.value.length >= limit.value;
}

const handleFileErroe = (error: Error, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  console.log('上传错误')
  console.log(error)
  console.log(uploadFile)
  console.log(uploadFiles)
}
</script>

<style>
.hide .el-upload--picture-card {
  display: none;
}
</style>
