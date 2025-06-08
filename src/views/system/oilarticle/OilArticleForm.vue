<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
<!--      <el-form-item label="上级id" prop="fthId">-->
<!--        <el-input v-model="formData.fthId" placeholder="请输入上级id" />-->
<!--      </el-form-item>-->
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入文章标题" />
      </el-form-item>
      <el-form-item label="文章来源" prop="source">
        <el-input v-model="formData.source" placeholder="请输入文章来源" />
      </el-form-item>
      <el-form-item label="发布时间" prop="publishTime">
        <el-date-picker
          v-model="formData.publishTime"
          type="date"
          value-format="x"
          placeholder="选择发布时间"
        />
      </el-form-item>
<!--      <el-form-item label="点击数" prop="clickCount">-->
<!--        <el-input v-model="formData.clickCount" placeholder="请输入点击数" />-->
<!--      </el-form-item>-->
      <el-form-item label="上级名称" prop="fthName">
        <el-input v-model="formData.fthName" placeholder="请输入上级名称" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { OilArticleApi, OilArticleVO } from '@/api/system/oilarticle'

/** 文章 表单 */
defineOptions({ name: 'OilArticleForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  fthId: undefined,
  title: undefined,
  source: undefined,
  publishTime: undefined,
  clickCount: undefined,
  fthName: undefined,
})
const formRules = reactive({
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await OilArticleApi.getOilArticle(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as OilArticleVO
    if (formType.value === 'create') {
      await OilArticleApi.createOilArticle(data)
      message.success(t('common.createSuccess'))
    } else {
      await OilArticleApi.updateOilArticle(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    fthId: undefined,
    title: undefined,
    source: undefined,
    publishTime: undefined,
    clickCount: undefined,
    fthName: undefined,
  }
  formRef.value?.resetFields()
}
</script>
