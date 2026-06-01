import { useState } from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { WebView } from 'react-native-webview'
import * as WebBrowser from 'expo-web-browser'

export default function CustomWebView({ style, ...props }) {
  const [progress, setProgress] = useState(0)

  const onShouldStartLoadWithRequest = (request) => {
    const currentUrl = props.source?.uri
    if (!currentUrl) return true

    console.log('request.url', request.url)
    console.log('currentUrl', currentUrl)

    // 定义工具函数：移除url的 www 前缀，统一域名
    const normalizeUrl = (url) => {
      return url.replace(/^https?:\/\/www\./, 'https://')
    }

    const normReqUrl = normalizeUrl(request.url)
    const normCurrUrl = normalizeUrl(currentUrl)

    // 标准化后地址一致 → 内部打开
    if (normReqUrl === normCurrUrl) {
      return true
    }

    // 其他链接 → 外部浏览器打开
    void WebBrowser.openBrowserAsync(request.url)
    return false
  }
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
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
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
