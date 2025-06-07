import request from '@/config/axios'

// 文章 VO
export interface OilArticleVO {
  id: number // 文章id
  fthId: number // 上级id
  title: string // 文章标题
  source: string // 文章来源
  publishTime: Date // 发布时间
  clickCount: string // 点击数
  fthName: string // 上级名称
}

// 文章 API
export const OilArticleApi = {
  // 查询文章分页
  getOilArticlePage: async (params: any) => {
    return await request.get({ url: `/system/oil-article/page`, params })
  },

  // 查询文章详情
  getOilArticle: async (id: number) => {
    return await request.get({ url: `/system/oil-article/get?id=` + id })
  },

  // 新增文章
  createOilArticle: async (data: OilArticleVO) => {
    return await request.post({ url: `/system/oil-article/create`, data })
  },

  // 修改文章
  updateOilArticle: async (data: OilArticleVO) => {
    return await request.put({ url: `/system/oil-article/update`, data })
  },

  // 删除文章
  deleteOilArticle: async (id: number) => {
    return await request.delete({ url: `/system/oil-article/delete?id=` + id })
  },

  // 导出文章 Excel
  exportOilArticle: async (params) => {
    return await request.download({ url: `/system/oil-article/export-excel`, params })
  },
}