import { useLocalSearchParams } from 'expo-router'
import { useEvent } from 'expo'
import { View, Text, Button, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { useVideoPlayer, VideoView } from 'expo-video'
import ProgressWebView from '../../components/ProgressWebView'
import Ionicons from '@expo/vector-icons/Ionicons'
import SideMenu from 'react-native-side-menu-updated'
import { useState } from 'react'
import ChaptersMenu from '../../components/chaptersMenu'
import response from '../../mock/chapter'
import VideoPlayer from '@components/VideoPlayer'

const ChapterDetail = () => {
  const { id } = useLocalSearchParams()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [URL, setURL] = useState(`/chapters/${id}`)
  const [infoURI, setInfoURI] = useState('https://clwy.cn/chapters/fullstack-node-intro/info')
  const { course, chapter, chapters } = response.data
  const [selectedChapter, setSelectedChapter] = useState(chapter)

  // const player = useVideoPlayer(chapter.video, (player) => {
  //   player.loop = false
  //   // player.play()
  // })

  const onSelectedChapter = (chapterItem) => {
    setURL(`/chapters/${chapterItem.slug}`)
    setInfoURI(`https://clwy.cn/chapters/${chapterItem.slug}/info`)
    setSelectedChapter(chapterItem)
    setIsMenuOpen(false)
  }
  // const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing })

  return (
    <SideMenu
      menu={
        <ChaptersMenu
          course={course}
          chapter={selectedChapter}
          chapters={chapters}
          onItemSelected={onSelectedChapter}
        />
      }
      // 禁用侧滑菜单的侧滑手势
      disableGestures={true}
      isOpen={isMenuOpen}
      onChange={(menuState) => setIsMenuOpen(menuState)}
    >
      <View style={styles.container}>
        {/* 视频播放器 - 固定高度或 flex 占比 */}
        <View style={styles.videoPlayerWrapper}>
          <VideoPlayer videoUrl={chapter.video} />
        </View>

        {/* 切换展开按钮 */}
        <TouchableWithoutFeedback onPress={() => setIsMenuOpen(!isMenuOpen)}>
          <View style={styles.sideBarButtonWrapper}>
            <View style={styles.sideBarButton}>
              <Ionicons name={'list'} size={16} color={'#434D58'} style={styles.chaptersIcon} />
              <Text style={styles.chapters}>课程列表</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>

        {/* 章节内容 */}
        <ProgressWebView source={{ uri: infoURI }} />
      </View>
    </SideMenu>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
  },
  videoPlayerWrapper: {
    height: 240,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  sideBarButton: {
    width: 80,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sideBarButtonWrapper: {
    backgroundColor: '#fff',
    padding: 6,
  },
  sideBarButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#D4D1D9',
    width: 95,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
  },
  chapters: {
    textAlign: 'center',
    lineHeight: 32,
    marginLeft: 3,
    fontSize: 12,
  },
  chaptersIcon: {
    textAlign: 'center',
    lineHeight: 32,
  },
  webview: {
    flex: 1,
    backgroundColor: '#fff',
  },
})

export default ChapterDetail
