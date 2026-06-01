import { useState } from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { WebView } from 'react-native-webview'

export default function CustomWebView({ style, ...props }) {
  const [progress, setProgress] = useState(0)

  return (
    <View style={[styles.container, style]}>
      {/* 顶部进度条 */}
      {progress < 1 && (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
        </View>
      )}

      <WebView
        // 官方必选：开启加载状态
        startInLoadingState={true}
        // 保留你原来的 loading 组件
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1f99b0" />
          </View>
        )}
        // 官方：监听加载进度
        onLoadProgress={({ nativeEvent }) => {
          setProgress(nativeEvent.progress)
        }}
        // 优化配置
        textZoom={100}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        {...props}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // 进度条样式
  progressContainer: {
    height: 2,
    width: '100%',
    backgroundColor: '#ECECEC',
  },
  progressBar: {
    height: 2,
    backgroundColor: '#1f99b0',
  },
  // 保留你原来的 loading 样式
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
})
