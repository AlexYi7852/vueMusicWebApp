import * as types from './mutations-types'

// 选择歌曲播放
export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list) // 设置为顺序播放列表
  commit(types.SET_PLAYLIST, list) // 设置播放歌曲列表
  commit(types.SET_CURRENT_INDEX, index) // 设置当前播放歌曲索引
  commit(types.SET_FULL_SCREEN, true) // 设置播放器展开状态
  commit(types.SET_PLATING_STATE, true) // 设置播放器播放状态
}
