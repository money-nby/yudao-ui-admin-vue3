<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
<!--      <el-form-item label="上级id" prop="fthId">-->
<!--        <el-input-->
<!--          v-model="queryParams.fthId"-->
<!--          placeholder="请输入上级id"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="文章标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入文章标题"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="文章来源" prop="source">
        <el-input
          v-model="queryParams.source"
          placeholder="请输入文章来源"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="发布时间" prop="publishTime">
        <el-date-picker
          v-model="queryParams.publishTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
<!--      <el-form-item label="点击数" prop="clickCount">-->
<!--        <el-input-->
<!--          v-model="queryParams.clickCount"-->
<!--          placeholder="请输入点击数"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="创建时间" prop="createTime">-->
<!--        <el-date-picker-->
<!--          v-model="queryParams.createTime"-->
<!--          value-format="YYYY-MM-DD HH:mm:ss"-->
<!--          type="daterange"-->
<!--          start-placeholder="开始日期"-->
<!--          end-placeholder="结束日期"-->
<!--          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"-->
<!--          class="!w-220px"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="上级分类" prop="fthId">
        <el-select
          v-model="queryParams.fthId"
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
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['system:oil-article:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['system:oil-article:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
<!--      <el-table-column label="文章id" align="center" prop="id" />-->
      <el-table-column label="上级分类" align="center" prop="fthName" />
<!--      <el-table-column label="上级id" align="center" prop="fthId" />-->
      <el-table-column label="文章标题" align="center" prop="title" />
<!--      <el-table-column label="文章来源" align="center" prop="source" />-->
      <el-table-column
        label="发布时间"
        align="center"
        prop="publishTime"
        :formatter="dateFormatter2"
        width="180px"
      />
      <el-table-column label="点击数" align="center" prop="clickCount" />
      <el-table-column label="审核状态" align="center" prop="status" :formatter="statusFormatter"/>
<!--      <el-table-column-->
<!--        label="创建时间"-->
<!--        align="center"-->
<!--        prop="createTime"-->
<!--        :formatter="dateFormatter"-->
<!--        width="180px"-->
<!--      />-->
      <el-table-column label="操作" align="center" min-width="120px">
        <template #default="scope">
          <el-button
            link
            type="success"
            @click="handleAccess(scope.row.id)"
            v-hasPermi="['system:oil-article:update']"
          >
            通过
          </el-button>
          <el-button
            link
            type="warning"
            @click="handleDeny(scope.row.id)"
            v-hasPermi="['system:oil-article:update']"
          >
            拒绝
          </el-button>
          <el-button
            link
            type="danger"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['system:oil-article:update']"
          >
            修改
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['system:oil-article:delete']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <OilArticleForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter, dateFormatter2 } from '@/utils/formatTime'
import download from '@/utils/download'
import { OilArticleApi, OilArticleVO } from '@/api/system/oilarticle'
import OilArticleForm from './OilArticleForm.vue'
import { ArticleCommentApi, ArticleCommentVO } from '@/api/system/articlecomment'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

/** 文章 列表 */
defineOptions({ name: 'OilArticle' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<OilArticleVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  fthId: undefined,
  title: undefined,
  source: undefined,
  publishTime: [],
  clickCount: undefined,
  createTime: [],
  fthName: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await OilArticleApi.getOilArticlePage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await OilArticleApi.deleteOilArticle(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

const handleAccess = async (id: number) => {
  try {
    // 修改的二次确认
    await message.confirm(`确认审核通过`)
    console.log(id)
    // 发起更改
    const data = {
      status: 1,
      id
    }
    await OilArticleApi.updateOilArticleStatus(data as unknown as OilArticleVO)
    message.success(t('common.updateSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

const handleDeny = async (id: number) => {
  try {
    // 删除的二次确认
    await message.confirm(`确认审核拒绝`)
    console.log(id)
    // 发起更改
    const data = {
      status: 2,
      id
    }
    await OilArticleApi.updateOilArticleStatus(data as unknown as OilArticleVO)
    message.success(t('common.updateSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await OilArticleApi.exportOilArticle(queryParams)
    download.excel(data, '文章.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 格式化状态 */
const statusFormatter = (row) => {
  console.log(row)
  switch (row.status) {
    case 0:
      return '待审核'
    case 1:
      return '通过'
    case 2:
      return '拒绝'
    default:
      return '-'
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
