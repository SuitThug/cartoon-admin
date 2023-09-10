<template>
  <div>
    <el-upload v-model:file-list="fileList" :action="domain" :http-request="upqiniu" list-type="picture-card"
      :on-preview="handlePictureCardPreview" :on-remove="handleRemove" ref="uploadFile" :on-error="handleFileErroe">
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
import { ref, onMounted, reactive } from 'vue'
import { Delete, Plus } from '@element-plus/icons-vue'
import { uoloadToken, reqUoloadImg, reqAddChapter ,reqChapterImg} from '@/api/comics/index'
import { comicsPage  } from '@/api/comics/type'
import { UploadFile, ElMessage } from 'element-plus'
import type { UploadProps, UploadUserFile, UploadFiles } from 'element-plus'
import comicsStore from '@/stores/comics'
const comicsIdStore = comicsStore()
const dialogVisible = ref(false)
const fileList = ref<UploadUserFile[]>([])
let newFileList = reactive<any>([])
 let $emit = defineEmits(['imgList'])

// 七牛云变量
//预览的图片地址
const imageUrl = ref()
// 七牛云的上传地址，根据自己所在地区选择，我这里是华南区
const domain = ref("https://upload-z2.qiniup.com")

// 这是七牛云空间的外链默认域名
const qiniuaddr = ref('rzgyzgxat.hn-bkt.clouddn.com')
const uploadName = ref()
const uploadFile = ref(null)

onMounted(() => {
  console.log(uploadFile.value); // <div>小猪课堂</div>
});
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
  uploadName.value = req.file.name
  // 重命名要上传的文件
  const keyname =
    "comics_" + uploadImgName + "_" + new Date().getTime();
  "." + filetype;
  // 从后端获取上传凭证token,此处在前端配置proxyTable代理进行跨域
  let res = await uoloadToken()
  // console.log(res)
  if (res.code == 200) {
    let formdata = new FormData();
    formdata.append("file", req.file);
    formdata.append("token", res.data);
    formdata.append("key", keyname);
    // 获取到凭证之后再将文件上传到七牛云空间
    try {
      let res2 = await reqUoloadImg(formdata)
      if (res2.hash) {
        imageUrl.value = "http://" + qiniuaddr.value + "/" + res2.key;
        ElMessage({
          message: '上传成功',
          type: 'success',
        })
        newFileList.push({
          url: imageUrl.value,
          chapterId:comicsIdStore.chapterId ,  //章节id
          order:newFileList.length + 1, //排序
          comicsId: comicsIdStore.comicsId
        })
        fileList.value = newFileList
        console.log(fileList.value)
        $emit('imgList',fileList.value) 
      } else {
        ElMessage({
          message: '上传失败',
          type: 'error',
        })
      }
    } catch (error) {
      console.log(error)
      ElMessage({
        message: '上传失败error',
        type: 'error',
      })
    }
  }

}

// 验证文件合法性
const beforeUpload = (file: any) => {
  const isJPG = file.type === "image/jpeg" || file.type === "image/png";
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isJPG) {
    // this.$message.error("上传头像图片只能是 JPG、png 格式!");
    console.log('上传头像图片只能是 JPG、png 格式!')
  }
  if (!isLt2M) {
    console.log('上传图片大小不能超过 2MB!')

    // this.$message.error("上传图片大小不能超过 2MB!");
  }
  return isJPG && isLt2M;
}
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  // console.log(uploadFile, uploadFiles)
  imageUrl.value = ''
}



const handlePictureCardPreview = (file: UploadFile) => {
  imageUrl.value = file.url;
  dialogVisible.value = true
}

const handleSuccess = (response: any, uploadFile: any, fileList: any) => {
    console.log('成功回调')
}
const handleFileErroe = (error: Error, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  console.log('上传错误')
 
}


</script>

<style></style>
