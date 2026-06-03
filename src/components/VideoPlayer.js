import React, { useState, useRef, useEffect, useMemo } from 'react'
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
  BackHandler,
} from 'react-native'
import { useVideoPlayer, VideoView } from 'expo-video'
import * as ScreenOrientation from 'expo-screen-orientation'
import * as NavigationBar from 'expo-navigation-bar'
import Slider from '@react-native-community/slider'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from 'expo-router'

export default function VideoPlayer({ videoUrl }) {
  const navigation = useNavigation()
  const safeArea = useSafeAreaFrame()
  const screenDim = Dimensions.get('window')
  const screenDimRef = useRef(screenDim)

  const [showControls, setShowControls] = useState(true)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isBuffering, setIsBuffering] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [errorMsg, setErrorMsg] = useState(null)

  const controlsTimeout = useRef(null)
  const isPlayingRef = useRef(false)
  const durationRef = useRef(0)
  const hasLoadedRef = useRef(false)

  // ✅ 用于在全屏切换时冻结和恢复状态
  const savedStateRef = useRef({ time: 0, wasPlaying: false })
  const needRestoreRef = useRef(false)

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      screenDimRef.current = window
    })
    return () => subscription?.remove?.()
  }, [])

  useEffect(() => {
    isPlayingRef.current = isPlaying
  }, [isPlaying])
  useEffect(() => {
    durationRef.current = duration
  }, [duration])
  useEffect(() => {
    hasLoadedRef.current = false
  }, [videoUrl])

  const width = safeArea?.width || screenDim.width || 375

  const videoSource = useMemo(() => {
    return videoUrl ? { uri: videoUrl, useCaching: true } : null
  }, [videoUrl])

  const player = useVideoPlayer(videoSource, (instance) => {
    instance.loop = false
    instance.timeUpdateEventInterval = 0.1 // ✅ 改小一点，时间更新更平滑
  })

  useEffect(() => {
    if (!videoUrl) {
      setErrorMsg('未提供视频 URL')
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    setIsBuffering(false)
    setDuration(0)
    setCurrentTime(0)
    setErrorMsg(null)
  }, [videoUrl])

  useEffect(() => {
    if (!player) return

    const onPlayingChange = (event) => {
      setIsPlaying(event.isPlaying)
      if (event.isPlaying) setIsBuffering(false)
    }

    // ✅ 核心修复：直接读取 player 实例的属性，不依赖 event payload，确保 100% 获取到最新时间
    const onTimeUpdate = () => {
      setCurrentTime(player.currentTime)
      // 顺便更新 duration，解决某些视频初始 duration 为 0 或 Infinity 的问题
      if (player.duration > 0 && Number.isFinite(player.duration)) {
        setDuration(player.duration)
      }
    }

    const onStatusChange = (event) => {
      if (event.status === 'readyToPlay') {
        hasLoadedRef.current = true
        // 强制获取一次 duration
        if (player.duration > 0 && Number.isFinite(player.duration)) {
          setDuration(player.duration)
        }
        setIsLoading(false)
        setIsBuffering(false)
        setErrorMsg(null)
      } else if (event.status === 'error') {
        setIsLoading(false)
        setIsBuffering(false)
        setErrorMsg(event.error?.message || '视频加载失败')
      } else if (event.status === 'loading') {
        if (hasLoadedRef.current || duration > 0) {
          setIsBuffering(true)
        }
      }
    }

    const s1 = player.addListener('playingChange', onPlayingChange)
    const s2 = player.addListener('timeUpdate', onTimeUpdate)
    const s3 = player.addListener('statusChange', onStatusChange)

    // 初始同步一次状态
    setIsPlaying(player.playing)
    if (player.duration > 0 && Number.isFinite(player.duration)) {
      setDuration(player.duration)
    }

    return () => {
      s1?.remove()
      s2?.remove()
      s3?.remove()
    }
  }, [player, duration])

  // 处理安卓物理返回键
  useEffect(() => {
    const backAction = () => {
      if (isFullScreen) {
        exitFullScreen()
        return true
      }
      return false
    }
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)
    return () => backHandler.remove()
  }, [isFullScreen])

  // ✅ 核心修复：彻底重写 formatTime，修复了之前 seconds / 60 没有取余数的致命 Bug
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds) || seconds < 0 || !Number.isFinite(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60) // <--- 这里必须 % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const resetControlsTimer = () => {
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current)
    controlsTimeout.current = setTimeout(() => {
      if (isPlayingRef.current && durationRef.current > 0) setShowControls(false)
    }, 5000)
  }

  const toggleControls = () => {
    setShowControls(!showControls)
    if (!showControls && duration > 0 && isPlaying) resetControlsTimer()
  }

  const togglePlayPause = () => {
    if (!player) return
    resetControlsTimer()

    if (!player.playing && currentTime >= duration && duration > 0) {
      player.currentTime = 0
      player.play()
      setIsPlaying(true)
      return
    }

    if (player.playing) {
      player.pause()
      setIsPlaying(false)
    } else {
      player.play()
      setIsPlaying(true)
    }
  }

  const onSlidingComplete = (value) => {
    if (!player || isNaN(value)) return
    resetControlsTimer()
    const maxDuration = durationRef.current || 1
    const safeValue = Math.max(0, Math.min(value, maxDuration))

    player.currentTime = safeValue

    if (isPlayingRef.current) {
      player.play()
    }
  }

  // ✅ 核心修复：进入全屏时，只负责“冻结”状态和切换 UI
  const enterFullScreen = async () => {
    resetControlsTimer()
    savedStateRef.current.time = player.currentTime
    savedStateRef.current.wasPlaying = player.playing
    if (player.playing) player.pause()
    needRestoreRef.current = true

    try {
      navigation.setOptions({ headerShown: false })
      StatusBar.setHidden(true, 'fade')
      if (Platform.OS === 'android')
        await NavigationBar.setVisibilityAsync(NavigationBar.Visibility.HIDDEN)
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT)
      setIsFullScreen(true)
    } catch (error) {
      console.log('进入全屏失败:', error)
    }
  }

  // ✅ 核心修复：退出全屏时，只负责“冻结”状态和切换 UI
  const exitFullScreen = async () => {
    resetControlsTimer()
    savedStateRef.current.time = player.currentTime
    savedStateRef.current.wasPlaying = player.playing
    if (player.playing) player.pause()
    needRestoreRef.current = true

    try {
      navigation.setOptions({ headerShown: true })
      StatusBar.setHidden(false, 'fade')
      if (Platform.OS === 'android')
        await NavigationBar.setVisibilityAsync(NavigationBar.Visibility.VISIBLE)
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
      setIsFullScreen(false)
    } catch (error) {
      console.log('退出全屏失败:', error)
    }
  }

  // ✅ 核心修复：监听退出全屏状态，在 Modal 完全关闭后恢复播放
  useEffect(() => {
    if (!isFullScreen && needRestoreRef.current) {
      const timer = setTimeout(() => {
        if (player) {
          player.currentTime = savedStateRef.current.time
          if (savedStateRef.current.wasPlaying) player.play()
        }
        needRestoreRef.current = false
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isFullScreen, player])

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', async (e) => {
      if (isFullScreen) {
        e.preventDefault()
        try {
          await exitFullScreen()
          setTimeout(() => navigation.goBack(), 300)
        } catch (error) {
          navigation.goBack()
        }
      }
    })
    return () => unsubscribe()
  }, [navigation, isFullScreen])

  useEffect(() => {
    if (showControls && duration > 0) resetControlsTimer()
    return () => {
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current)
    }
  }, [showControls, isPlaying, duration])

  useEffect(() => {
    return () => {
      try {
        navigation.setOptions({ headerShown: true })
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
        if (Platform.OS === 'android')
          NavigationBar.setVisibilityAsync(NavigationBar.Visibility.VISIBLE)
        StatusBar.setHidden(false)
      } catch (error) {}
    }
  }, [navigation])

  const renderVideoContent = (isFullscreenMode) => {
    const containerStyle = isFullscreenMode
      ? styles.fullscreenModalContainer
      : [styles.screenContainer, { height: width * 0.5625 }]

    return (
      <View style={containerStyle}>
        <View style={styles.videoWrapper}>
          {videoUrl && (
            <VideoView
              style={styles.video}
              player={player}
              nativeControls={false}
              allowsPictureInPicture
              contentFit="cover"
            />
          )}
        </View>

        <TouchableOpacity style={styles.touchOverlay} activeOpacity={1} onPress={toggleControls} />

        {isFullscreenMode && !errorMsg && (
          <View style={[styles.fullscreenBackButton, { opacity: showControls ? 1 : 0 }]}>
            <TouchableOpacity onPress={exitFullScreen} style={styles.backButtonTouch}>
              <Ionicons name="chevron-back" size={28} color="white" />
            </TouchableOpacity>
          </View>
        )}

        {isLoading && !errorMsg && (
          <View style={styles.earlyLoadingOverlay}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        )}

        {isBuffering && !isLoading && !errorMsg && (
          <View style={styles.centerPlayButton}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        )}

        {!errorMsg && !isLoading && !isBuffering && (
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

        {errorMsg && (
          <View style={styles.errorOverlay}>
            <Ionicons name="alert-circle" size={40} color="#ff6b6b" />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}

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
            <TouchableOpacity
              onPress={isFullscreenMode ? exitFullScreen : enterFullScreen}
              style={styles.controlButton}
            >
              <Ionicons name={isFullscreenMode ? 'contract' : 'expand'} size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    )
  }

  return (
    <>
      {!isFullScreen && renderVideoContent(false)}
      {isFullScreen && (
        <Modal
          visible={isFullScreen}
          animationType="fade"
          supportedOrientations={['landscape']}
          onRequestClose={exitFullScreen}
          statusBarTranslucent
          // ✅ 核心修复：利用 Modal 的 onShow 回调，在 Modal 完全显示后再恢复播放状态
          onShow={() => {
            if (needRestoreRef.current) {
              setTimeout(() => {
                if (player) {
                  player.currentTime = savedStateRef.current.time
                  if (savedStateRef.current.wasPlaying) player.play()
                }
                needRestoreRef.current = false
              }, 50)
            }
          }}
        >
          {renderVideoContent(true)}
        </Modal>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: '#000',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  fullscreenModalContainer: { flex: 1, backgroundColor: '#000', width: '100%', height: '100%' },
  video: { width: '100%', height: '100%', backgroundColor: '#000' },
  videoWrapper: { ...StyleSheet.absoluteFillObject },
  earlyLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 15,
  },
  touchOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 },
  fullscreenBackButton: { position: 'absolute', top: 12, left: 12, zIndex: 30 },
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
  controlButton: { padding: 5 },
  slider: { flex: 1, marginHorizontal: 10, height: 40 },
  timeText: {
    color: 'white',
    fontSize: 12,
    marginHorizontal: 5,
    minWidth: 40,
    textAlign: 'center',
  },
})
