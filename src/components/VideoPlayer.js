import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StatusBar,
  Platform,
  Dimensions,
  Modal,
} from 'react-native'
import { useVideoPlayer, VideoView } from 'expo-video'
import * as ScreenOrientation from 'expo-screen-orientation'
import * as NavigationBar from 'expo-navigation-bar'
import * as Device from 'expo-device'
import Slider from '@react-native-community/slider'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from 'expo-router'

export default function VideoPlayer({ videoUrl }) {
  const navigation = useNavigation()
  const safeArea = useSafeAreaFrame()
  const screenDim = Dimensions.get('window')
  const screenDimRef = useRef(screenDim)

  // 状态管理
  const [showControls, setShowControls] = useState(true)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [errorMsg, setErrorMsg] = useState(null)
  const controlsTimeout = useRef(null)

  // 监听屏幕尺寸变化（用于全屏旋转）
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      console.log('[VideoPlayer] screen dimension changed:', window.width, 'x', window.height)
      screenDimRef.current = window
    })

    return () => subscription?.remove?.()
  }, [])

  // 确保 width 有有效值（使用 safeArea 或屏幕尺寸）
  const width = safeArea?.width || screenDim.width || 375
  const height = safeArea?.height || screenDim.height || 812
  const isTablet = Device.deviceType === Device.DeviceType.TABLET

  // ✅ Expo 54 expo-video v3 官方标准写法
  const player = useVideoPlayer(videoUrl, (instance) => {
    instance.loop = false
    instance.timeUpdateEventInterval = 0.5
    console.log('[VideoPlayer] player initialized with URL:', videoUrl)
  })

  // 立即检查 URL
  useEffect(() => {
    if (!videoUrl) {
      setErrorMsg('未提供视频 URL')
      setIsLoading(false)
    } else {
      // URL 改变时，重置状态重新加载
      setIsLoading(true)
      setDuration(0)
      setErrorMsg(null)
      console.log('[VideoPlayer] URL changed:', videoUrl)
    }
  }, [videoUrl])

  // 监听 player.duration 的变化（属性可能异步更新）
  useEffect(() => {
    if (player?.duration > 0 && !duration) {
      console.log('[VideoPlayer] detected duration:', player.duration)
      setDuration(player.duration)
      setIsLoading(false)
    }
  }, [player?.duration])

  // 用 ref 跟踪最新值，避免闭包过期问题
  const isPlayingRef = useRef(false)
  const durationRef = useRef(0)
  const hasLoadedRef = useRef(false)
  useEffect(() => {
    isPlayingRef.current = isPlaying
  }, [isPlaying])
  useEffect(() => {
    durationRef.current = duration
  }, [duration])
  useEffect(() => {
    hasLoadedRef.current = false
  }, [videoUrl])

  // ✅ 使用 player.addListener（原生事件）替代不可靠的 useEvent
  useEffect(() => {
    if (!player) return
    const onPlayingChange = (event) => {
      console.log('[VideoPlayer] playingChange:', event.isPlaying)
      setIsPlaying(event.isPlaying)
    }
    const onTimeUpdate = (event) => {
      setCurrentTime(event.currentTime ?? 0)
    }
    const onStatusChange = (event) => {
      console.log('[VideoPlayer] statusChange:', event.status, 'error:', event.error)
      if (event.status === 'readyToPlay') {
        hasLoadedRef.current = true
        if (player.duration > 0) setDuration(player.duration)
        setIsLoading(false)
        setErrorMsg(null)
      } else if (event.status === 'error') {
        setIsLoading(false)
        setErrorMsg(event.error?.message || '视频加载失败')
      } else if (event.status === 'loading') {
        if (!hasLoadedRef.current) setIsLoading(true)
      }
    }
    const s1 = player.addListener('playingChange', onPlayingChange)
    const s2 = player.addListener('timeUpdate', onTimeUpdate)
    const s3 = player.addListener('statusChange', onStatusChange)
    // 同步初始状态
    setIsPlaying(player.playing)
    return () => {
      s1?.remove()
      s2?.remove()
      s3?.remove()
    }
  }, [player])

  // 格式化时间
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds) || seconds < 0) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  // 重置控制条隐藏倒计时（使用 ref 避免闭包过期）
  const resetControlsTimer = () => {
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current)
    }
    controlsTimeout.current = setTimeout(() => {
      if (isPlayingRef.current && durationRef.current > 0) {
        setShowControls(false)
      }
    }, 5000)
  }

  // 切换控制条显示/隐藏
  const toggleControls = () => {
    console.log('[VideoPlayer] toggleControls - showControls:', showControls)
    setShowControls(!showControls)
    if (!showControls && duration > 0 && isPlaying) {
      resetControlsTimer()
    }
  }

  // 播放/暂停切换
  const togglePlayPause = () => {
    if (!player) return
    console.log(
      '[VideoPlayer] togglePlayPause - isPlaying:',
      isPlaying,
      'player.playing:',
      player.playing,
      'duration:',
      duration,
    )
    resetControlsTimer()
    // 如果视频已播放结束，重新开始播放
    if (!player.playing && currentTime >= duration && duration > 0) {
      console.log('[VideoPlayer] replay from beginning')
      player.currentTime = 0
      player.play()
      setIsPlaying(true)
      return
    }
    if (player.playing) {
      player.pause()
      setIsPlaying(false) // 手动更新兜底
      console.log('[VideoPlayer] paused')
    } else {
      player.play()
      setIsPlaying(true) // 手动更新兜底
      console.log('[VideoPlayer] playing')
    }
  }

  // 进度条跳转
  const onSlidingComplete = (value) => {
    if (!player || isNaN(value)) return
    console.log('[VideoPlayer] seek to:', value, 'duration:', durationRef.current)
    resetControlsTimer()
    const maxDuration = durationRef.current || 1
    const safeValue = Math.max(0, Math.min(value, maxDuration))
    const wasPlaying = player.playing
    // 先暂停，避免 seek 和播放中的内部状态冲突导致卡死
    player.pause()
    // seek 到目标位置
    player.currentTime = safeValue
    console.log('[VideoPlayer] seeked to:', safeValue, 'wasPlaying:', wasPlaying)
    // 如果之前在播放，等缓冲稳定后恢复播放
    if (wasPlaying) {
      setTimeout(() => {
        console.log('[VideoPlayer] resuming play after seek')
        player.play()
        setIsPlaying(true)
      }, 100)
    }
  }

  // 进入全屏
  const enterFullScreen = async () => {
    resetControlsTimer()
    try {
      console.log('[VideoPlayer] entering fullscreen')
      // 隐藏导航栏的 header
      navigation.setOptions({ headerShown: false })
      StatusBar.setHidden(true, 'fade')
      if (Platform.OS === 'android') {
        await NavigationBar.setVisibilityAsync(NavigationBar.Visibility.HIDDEN)
      }
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT)
      setIsFullScreen(true)
    } catch (error) {
      console.log('进入全屏失败:', error)
    }
  }

  // 退出全屏
  const exitFullScreen = async () => {
    resetControlsTimer()
    try {
      console.log('[VideoPlayer] exiting fullscreen')
      // 显示导航栏的 header
      navigation.setOptions({ headerShown: true })
      StatusBar.setHidden(false, 'fade')
      if (Platform.OS === 'android') {
        await NavigationBar.setVisibilityAsync(NavigationBar.Visibility.VISIBLE)
      }
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
      setIsFullScreen(false)
    } catch (error) {
      console.log('退出全屏失败:', error)
    }
  }

  // 修复全屏返回bug 和导航清理
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', async (e) => {
      if (isFullScreen) {
        console.log('[VideoPlayer] beforeRemove triggered while fullscreen')
        e.preventDefault()
        try {
          await exitFullScreen()
          // 延迟后再返回，确保状态更新
          setTimeout(() => {
            navigation.goBack()
          }, 300)
        } catch (error) {
          console.error('[VideoPlayer] beforeRemove error:', error)
          navigation.goBack()
        }
      }
    })

    return () => {
      unsubscribe()
    }
  }, [navigation, isFullScreen])

  // 控制条自动隐藏逻辑
  useEffect(() => {
    if (showControls && duration > 0) {
      resetControlsTimer()
    }
    return () => {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current)
      }
    }
  }, [showControls, isPlaying, duration])

  // 组件卸载强制恢复系统状态
  useEffect(() => {
    return () => {
      console.log('[VideoPlayer] component unmounting - restoring state')
      try {
        // 恢复 header
        navigation.setOptions({ headerShown: true })
        // 恢复屏幕方向
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
        if (Platform.OS === 'android') {
          NavigationBar.setVisibilityAsync(NavigationBar.Visibility.VISIBLE)
        }
        StatusBar.setHidden(false)
      } catch (error) {
        console.error('[VideoPlayer] unmount cleanup error:', error)
      }
    }
  }, [navigation])

  return (
    <>
      {/* 非全屏模式 - 内联渲染 */}
      {!isFullScreen && (
        <View style={styles.screenContainer}>
          {/* 视频层 - pointerEvents="none" 防止原生 VideoView 独占触摸 */}
          <View style={styles.videoWrapper} pointerEvents="none">
            {videoUrl && (
              <VideoView
                style={styles.video}
                player={player}
                nativeControls={false}
                allowsPictureInPicture
                contentFit="contain"
                onFirstFrameRender={() => {
                  console.log('[VideoPlayer] onFirstFrameRender - video is rendering')
                  if (player?.duration > 0) setDuration(player.duration)
                  setIsLoading(false)
                }}
              />
            )}
          </View>

          {/* 触摸层：点击显示/隐藏控制条 */}
          <TouchableOpacity
            style={styles.touchOverlay}
            activeOpacity={1}
            onPress={toggleControls}
          />

          {/* 中央播放按钮 */}
          {!errorMsg && !isLoading && (
            <View style={[styles.centerPlayButton, { opacity: showControls ? 1 : 0 }]}>
              <TouchableOpacity
                onPress={togglePlayPause}
                style={styles.centerPlayTouch}
                activeOpacity={0.6}
              >
                <Ionicons
                  name={isPlaying ? 'pause-circle' : 'play-circle'}
                  size={70}
                  color="rgba(255,255,255,0.85)"
                />
              </TouchableOpacity>
            </View>
          )}

          {/* 加载遮罩 */}
          {isLoading && !errorMsg && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#ffffff" />
              <Text style={{ color: '#ffffff', marginTop: 10 }}>加载中...</Text>
            </View>
          )}

          {/* 错误提示 */}
          {errorMsg && (
            <View style={styles.errorOverlay}>
              <Ionicons name="alert-circle" size={40} color="#ff6b6b" />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

          {/* 底部控制条 */}
          {!errorMsg && (
            <View style={[styles.controls, { opacity: showControls ? 1 : 0 }]}>
              <TouchableOpacity onPress={togglePlayPause} style={styles.controlButton}>
                <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={duration || 1}
                value={currentTime}
                onSlidingComplete={onSlidingComplete}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#666666"
                thumbTintColor="#FFFFFF"
                tapToSeek={true}
                disabled={duration === 0}
              />
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
              <TouchableOpacity onPress={enterFullScreen} style={styles.controlButton}>
                <Ionicons name="expand" size={24} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* 全屏模式 - 通过 Modal 覆盖整个屏幕 */}
      {isFullScreen && (
        <Modal
          visible={isFullScreen}
          animationType="fade"
          supportedOrientations={['landscape']}
          onRequestClose={exitFullScreen}
          statusBarTranslucent
        >
          <View style={styles.fullscreenModalContainer}>
            {/* 视频层 - pointerEvents="none" 防止原生 VideoView 独占触摸 */}
            <View style={styles.videoWrapper} pointerEvents="none">
              {videoUrl && (
                <VideoView
                  style={styles.video}
                  player={player}
                  nativeControls={false}
                  allowsPictureInPicture
                  contentFit="contain"
                />
              )}
            </View>

            {/* 触摸层 */}
            <TouchableOpacity
              style={styles.touchOverlay}
              activeOpacity={1}
              onPress={toggleControls}
            />

            {/* 左上角返回按钮 */}
            {!errorMsg && (
              <View style={[styles.fullscreenBackButton, { opacity: showControls ? 1 : 0 }]}>
                <TouchableOpacity onPress={exitFullScreen} style={styles.backButtonTouch}>
                  <Ionicons name="chevron-back" size={28} color="white" />
                </TouchableOpacity>
              </View>
            )}

            {/* 中央播放按钮 */}
            {!errorMsg && !isLoading && (
              <View style={[styles.centerPlayButton, { opacity: showControls ? 1 : 0 }]}>
                <TouchableOpacity
                  onPress={togglePlayPause}
                  style={styles.centerPlayTouch}
                  activeOpacity={0.6}
                >
                  <Ionicons
                    name={isPlaying ? 'pause-circle' : 'play-circle'}
                    size={70}
                    color="rgba(255,255,255,0.85)"
                  />
                </TouchableOpacity>
              </View>
            )}

            {/* 加载遮罩 */}
            {isLoading && !errorMsg && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#ffffff" />
                <Text style={{ color: '#ffffff', marginTop: 10 }}>加载中...</Text>
              </View>
            )}

            {/* 错误提示 */}
            {errorMsg && (
              <View style={styles.errorOverlay}>
                <Ionicons name="alert-circle" size={40} color="#ff6b6b" />
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            )}

            {/* 底部控制条 */}
            {!errorMsg && (
              <View style={[styles.controls, { opacity: showControls ? 1 : 0 }]}>
                <TouchableOpacity onPress={togglePlayPause} style={styles.controlButton}>
                  <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={duration || 1}
                  value={currentTime}
                  onSlidingComplete={onSlidingComplete}
                  minimumTrackTintColor="#FFFFFF"
                  maximumTrackTintColor="#666666"
                  thumbTintColor="#FFFFFF"
                  tapToSeek={true}
                  disabled={duration === 0}
                />
                <Text style={styles.timeText}>{formatTime(duration)}</Text>
                <TouchableOpacity onPress={exitFullScreen} style={styles.controlButton}>
                  <Ionicons name="contract" size={24} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </Modal>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#000',
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  fullscreenModalContainer: {
    flex: 1,
    backgroundColor: '#000',
    width: '100%',
    height: '100%',
  },
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  videoWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  touchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  fullscreenBackButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 30,
  },
  backButtonTouch: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerPlayButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  centerPlayTouch: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 50,
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 50,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    zIndex: 25,
  },
  controlButton: {
    padding: 5,
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
    height: 40,
  },
  timeText: {
    color: 'white',
    fontSize: 12,
    marginHorizontal: 5,
    minWidth: 40,
    textAlign: 'center',
  },
})
