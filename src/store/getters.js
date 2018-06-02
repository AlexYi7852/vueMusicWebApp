// 映射及计算

// 歌手信息
export const singer = state => state.singer
// 播放器播放状态
export const playing = state => state.playing
// 播放器展开状态
export const fullScreen = state => state.fullScreen
// 播放歌曲列表
export const playList = state => state.playList
// 顺序播放列表
export const sequenceList = state => state.sequenceList
// 播放模式
export const mode = state => state.mode
// 当前播放的歌曲的索引
export const currentIndex = state => state.currentIndex
// 当前播放的歌曲
export const currentSong = (state) => state.playList[state.currentIndex] || {}
