/**
 * @file 评论数据状态
 * @module store/comment
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module, MutationTree, ActionTree } from 'vuex'
import { SortType } from '/@/constants/state'
import { fetchDelay } from '/@/utils/fetch-delay'
import { IRootState } from '.'
import http from '/@/services/http'

export const COMMENT_API_PATH = '/comment'
export const LIKE_COMMENT_API_PATH = '/like/comment'

export enum CommentModuleListMutations {
  // list
  SetListFetchig = 'setListFetchig',
  SetListData = 'setListData',
  ClearListData = 'clearListData',
  // item
  SetPostFetchig = 'setPostFetchig',
  IncrementCommentLikes = 'incrementCommentLikes',
  AddNewComment = 'addNewComment'
}

export enum CommentModuleActions {
  FetchList = 'fetchList',
  PostComment = 'postComment',
  PostCommentLike = 'postCommentLike'
}

const getDefaultListData = () => {
  return {
    data: [] as Array<$TODO>,
    pagination: null as $TODO
  }
}

export const state = () => ({
  fetching: false,
  posting: false,
  comments: getDefaultListData()
})

export const mutations: MutationTree<CommentState> = {
  // 请求列表
  [CommentModuleListMutations.SetListFetchig](state, fetching: boolean) {
    state.fetching = fetching
  },
  [CommentModuleListMutations.SetListData](state, comments) {
    state.comments = comments
  },
  [CommentModuleListMutations.ClearListData](state) {
    state.comments = getDefaultListData()
  },

  // 发布评论
  [CommentModuleListMutations.SetPostFetchig](state, posting: boolean) {
    state.posting = posting
  },
  [CommentModuleListMutations.AddNewComment](state, comment) {
    state.comments.data.push(comment)
    if (state.comments.pagination) {
      state.comments.pagination.total++
    }
  },

  // 喜欢某条评论
  [CommentModuleListMutations.IncrementCommentLikes](state, commentId) {
    const comment = state.comments.data.find(
      comment => comment.id === commentId
    )
    if (comment) {
      comment.likes++
    }
  }
}

export const actions: ActionTree<CommentState, IRootState> = {
  [CommentModuleActions.FetchList]({ commit }, params = {}) {
    // 修正参数
    params = {
      page: 1,
      per_page: 88,
      sort: SortType.Desc,
      ...params
    }

    const isRestart = params.page === 1
    const isDescSort = params.sort === SortType.Desc

    // 清空数据
    if (isRestart) {
      commit(CommentModuleListMutations.ClearListData)
    }
    commit(CommentModuleListMutations.SetListFetchig, true)

    return http
      .get(COMMENT_API_PATH, { params })
      .then(response => {
        return new Promise(resolve => {
          fetchDelay()(() => {
            if (isDescSort) {
              response.result.data.reverse()
            }
            commit(CommentModuleListMutations.SetListData, response.result)
            resolve(response)
          })
        })
      })
      .finally(() => commit(CommentModuleListMutations.SetListFetchig, false))
  },

  // 发布评论
  [CommentModuleActions.PostComment]({ commit }, comment) {
    commit(CommentModuleListMutations.SetPostFetchig, true)
    return http
      .post(COMMENT_API_PATH, comment)
      .then(response => {
        commit(CommentModuleListMutations.AddNewComment, response.result)
        return response
      })
      .finally(() => {
        commit(CommentModuleListMutations.SetPostFetchig, false)
      })
  },

  // 喜欢评论
  [CommentModuleActions.PostCommentLike]({ commit }, comment) {
    return http
      .patch(LIKE_COMMENT_API_PATH, { comment_id: comment.id })
      .then(response => {
        commit(CommentModuleListMutations.IncrementCommentLikes, comment.id)
        return response
      })
  }
}

const commentModule: Module<CommentState, IRootState> = {
  namespaced: true,
  state,
  mutations,
  actions
}

export type CommentState = ReturnType<typeof state>
export default commentModule