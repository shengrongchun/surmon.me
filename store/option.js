/*
*
* 全局设置数据状态
*
*/

export const state = {

  // 页面的栏目展示类型（3栏/2栏）
  fullColumn: false,
  errorColumn: false,

  // 服务端博主信息
  adminInfo: {
    fetching: false,
    data: {}
  },

  globalOption: {
    fetching: false,
    data: {
      meta: {
        likes: 0
      }
    }
  }
}

export const mutations = {

	// 设置栏目结构
  SET_FULL_COLUMU(state, action) {
    state.fullColumn = action
  },

  // 设置错误页面模板
  SET_ERROR_COLUMU(state, action) {
    state.errorColumn = action
  },

  // 获取服务端配置的管理员信息
  REQUEST_ADMIN_INFO(state) {
    state.adminInfo.fetching = true
  },
  REQUEST_ADMIN_INFO_SUCCESS(state, action) {
    state.adminInfo.fetching = false
    state.adminInfo.data = action.result
  },
  REQUEST_ADMIN_INFO_FAILURE(state) {
    state.adminInfo.fetching = false
    state.adminInfo.data = {}
  },

  // 获取服务端配置
  REQUEST_GLOBAL_OPTIONS(state) {
    state.globalOption.fetching = true
  },
  REQUEST_GLOBAL_OPTIONS_SUCCESS(state, action) {
    state.globalOption.fetching = false
    state.globalOption.data = action.result
  },
  REQUEST_GLOBAL_OPTIONS_FAILURE(state) {
    state.globalOption.fetching = false
    state.globalOption.data = {}
  }
}
