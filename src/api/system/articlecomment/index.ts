import request from '@/config/axios'

// 文章评论 VO
export interface ArticleCommentVO {
  id: number // id
  name: string // 评论人名称
  userId: number // 评论人id
  commentTime: Date // 用户id
  commentContent: string // 评论内容
  status: number // 审核状态：0未审核，1已通过，2已拒绝
  articleId: number // 文章id
}

// 文章评论 API
export const ArticleCommentApi = {
  // 查询文章评论分页
  getArticleCommentPage: async (params: any) => {
    return await request.get({ url: `/system/article-comment/page`, params })
  },

  // 查询文章评论详情
  getArticleComment: async (id: number) => {
    return await request.get({ url: `/system/article-comment/get?id=` + id })
  },

  // 新增文章评论
  createArticleComment: async (data: ArticleCommentVO) => {
    return await request.post({ url: `/system/article-comment/create`, data })
  },

  // 修改文章评论
  updateArticleComment: async (data: ArticleCommentVO) => {
    return await request.put({ url: `/system/article-comment/update`, data })
  },

  // 删除文章评论
  deleteArticleComment: async (id: number) => {
    return await request.delete({ url: `/system/article-comment/delete?id=` + id })
  },

  // 导出文章评论 Excel
  exportArticleComment: async (params) => {
    return await request.download({ url: `/system/article-comment/export-excel`, params })
  },
}