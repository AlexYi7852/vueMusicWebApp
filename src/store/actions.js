import * as types from './mutations-types'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/utils'

// 选择歌曲播放
export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list) // 设置为顺序播放列表
  commit(types.SET_PLAYLIST, list) // 设置播放歌曲列表
  commit(types.SET_CURRENT_INDEX, index) // 设置当前播放歌曲索引
  commit(types.SET_FULL_SCREEN, true) // 设置播放器展开状态
  commit(types.SET_PLATING_STATE, true) // 设置播放器播放状态
}

// 随机播放全部
export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random) // 设置播放模式
  commit(types.SET_SEQUENCE_LIST, list) // 设置为顺序播放列表
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList) // 设置播放歌曲列表
  commit(types.SET_CURRENT_INDEX, 0) // 设置当前播放歌曲索引
  commit(types.SET_FULL_SCREEN, true) // 设置播放器展开状态
  commit(types.SET_PLATING_STATE, true) // 设置播放器播放状态
}
