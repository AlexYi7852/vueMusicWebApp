// 根级别的 mutation

import * as types from './mutations-type.js'

const mutations = {
  [types.SET_SINGER] (state, singer) {
    state.singer = singer
  }
}

export default mutations
