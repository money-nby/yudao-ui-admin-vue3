import request from '@/config/axios'

// 文章详情 VO
export interface OilArticleDetailVO {
  id: number // 文章详情id
  articleId: number // 上级id
  content: string // 文章内容
  articleIndex: number // 顺序
}

// 文章详情 API
export const OilArticleDetailApi = {
  // 查询文章详情分页
  getOilArticleDetailPage: async (params: any) => {
    return await request.get({ url: `/system/oil-article-detail/page`, params })
  },

  // 查询文章详情详情
  getOilArticleDetail: async (id: number) => {
    return await request.get({ url: `/system/oil-article-detail/get?id=` + id })
  },

  // 新增文章详情
  createOilArticleDetail: async (data: OilArticleDetailVO) => {
    return await request.post({ url: `/system/oil-article-detail/create`, data })
  },

  // 修改文章详情
  updateOilArticleDetail: async (data: OilArticleDetailVO) => {
    return await request.put({ url: `/system/oil-article-detail/update`, data })
  },

  // 删除文章详情
  deleteOilArticleDetail: async (id: number) => {
    return await request.delete({ url: `/system/oil-article-detail/delete?id=` + id })
  },

  // 导出文章详情 Excel
  exportOilArticleDetail: async (params) => {
    return await request.download({ url: `/system/oil-article-detail/export-excel`, params })
  },
}