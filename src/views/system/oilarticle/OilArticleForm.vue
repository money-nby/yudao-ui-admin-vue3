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
      <el-form-item label="上级分类" prop="fthId">
<!--        <el-input v-model="formData.fthId" placeholder="请输入上级分类" />-->
        <el-select
          v-model="formData.fthId"
          placeholder="请选择上级分类"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions('article_type')"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="公开部分一" prop="pubText1">
        <div style="border: 1px solid #ccc">
          <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="editorRef1"
            :defaultConfig="toolbarConfig1"
            :mode="mode1"
          />
          <Editor
            style="height: 200px; overflow-y: hidden;"
            v-model="formData.pubText1"
            :defaultConfig="editorConfig1"
            :mode="mode1"
            @on-created="handleCreated1"
          />
        </div>
      </el-form-item>

      <el-form-item label="加密部分" prop="fthName">
        <div style="border: 1px solid #ccc">
          <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="editorRef2"
            :defaultConfig="toolbarConfig2"
            :mode="mode2"
          />
          <Editor
            style="height: 200px; overflow-y: hidden;"
            v-model="formData.priText1"
            :defaultConfig="editorConfig2"
            :mode="mode2"
            @on-created="handleCreated2"
          />
        </div>
      </el-form-item>

      <el-form-item label="公开部分二" prop="fthName">
        <div style="border: 1px solid #ccc">
          <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="editorRef3"
            :defaultConfig="toolbarConfig3"
            :mode="mode3"
          />
          <Editor
            style="height: 200px; overflow-y: hidden;"
            v-model="formData.pubText2"
            :defaultConfig="editorConfig3"
            :mode="mode3"
            @on-created="handleCreated3"
          />
        </div>
      </el-form-item>

<!--      <el-form-item label="公开部分3" prop="fthName">-->
<!--        <div style="border: 1px solid #ccc">-->
<!--          <Toolbar-->
<!--            style="border-bottom: 1px solid #ccc"-->
<!--            :editor="editorRef"-->
<!--            :defaultConfig="toolbarConfig"-->
<!--            :mode="mode"-->
<!--          />-->
<!--          <Editor-->
<!--            style="height: 300px; overflow-y: hidden;"-->
<!--            v-model="valueHtml3"-->
<!--            :defaultConfig="editorConfig"-->
<!--            :mode="mode"-->
<!--            @on-created="handleCreated"-->
<!--          />-->
<!--        </div>-->
<!--      </el-form-item>-->
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { OilArticleApi, OilArticleVO } from '@/api/system/oilarticle'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { ref, shallowRef, onBeforeUnmount, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { getIntDictOptions } from '@/utils/dict'

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
  pubText1: undefined,
  priText1: undefined,
  pubText2: undefined,
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
    pubText1: undefined,
    priText1: undefined,
    pubText2: undefined,
  }
  formRef.value?.resetFields()
}

// 富文本编辑器
const editorRef1 = shallowRef()
const editorRef2 = shallowRef()
const editorRef3 = shallowRef()
const valueHtml1 = ref(formData.value.pubText1)
const valueHtml2 = ref(formData.value.priText1)
const valueHtml3 = ref(formData.value.pubText2)
const toolbarConfig1 = {}
const toolbarConfig2 = {}
const toolbarConfig3 = {}
const editorConfig1 = { placeholder: '请输入公开内容...' }
const editorConfig2 = { placeholder: '请输入加密内容，没有则可不写...' }
const editorConfig3 = { placeholder: '请输入公开内容，没有则可不写...' }
// 模拟 ajax 异步获取内容
onMounted(() => {
  setTimeout(() => {
    valueHtml1.value = formData.value.pubText1
    valueHtml2.value = formData.value.priText1
    valueHtml3.value = formData.value.pubText2
  }, 200)
})
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor1 = editorRef1.value
  const editor2 = editorRef2.value
  const editor3 = editorRef3.value
  if (editor1 == null){

  } else{
    editor1.destroy()
  }
  if (editor2 == null){

  } else{
    editor2.destroy()
  }
  if (editor3 == null){

  } else{
    editor3.destroy()
  }
})
const handleCreated1 = (editor) => {
  editorRef1.value = editor // 记录 editor 实例，重要！
}
const handleCreated2 = (editor) => {
  editorRef2.value = editor // 记录 editor 实例，重要！
}
const handleCreated3 = (editor) => {
  editorRef3.value = editor // 记录 editor 实例，重要！
}

const mode1 = 'default'
const mode2 = 'default'
const mode3 = 'default'
</script>
