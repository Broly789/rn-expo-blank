import { useState, useEffect } from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { WebView } from 'react-native-webview'
import * as WebBrowser from 'expo-web-browser'

export default function CustomWebView({ style, onExternalBrowserDismiss, ...props }) {
  const [progress, setProgress] = useState(0)
  const [currentUrl, setCurrentUrl] = useState(() => props.source?.uri)

  useEffect(() => {
    setCurrentUrl(props.source?.uri)
  }, [props.source?.uri])

  const handleExternalLink = async (url) => {
    const result = await WebBrowser.openBrowserAsync(url)
    if (typeof onExternalBrowserDismiss === 'function') {
      onExternalBrowserDismiss(result)
    }
  }

  // WebView 请求拦截处理：判断当前请求是否允许在 WebView 内加载
  // 返回 true 表示在 WebView 内部加载，返回 false 表示阻止加载
  const onShouldStartLoadWithRequest = (request) => {
    // 当前 WebView 的主 URL，按最近导航状态判断
    if (!currentUrl) return true
    // 允许 about:blank 空白页加载（WebView 默认初始页）
    if (request.url === 'about:blank') return true

    // 处理特殊 scheme（mailto、tel、javascript 等）并使用外部处理
    const specialSchemes = ['mailto:', 'tel:', 'sms:', 'javascript:']
    if (specialSchemes.some((s) => request.url.startsWith(s))) {
      void handleExternalLink(request.url)
      return false
    }

    // 尝试解析 URL 并比较主机名。对于相对 URL，使用 currentUrl 作为 base 解析。
    try {
      const reqUrlObj = new URL(request.url, currentUrl)
      const currUrlObj = new URL(currentUrl)

      const normalizeHostname = (hostname) => hostname.replace(/^www\./, '')
      const sameHost =
        normalizeHostname(reqUrlObj.hostname) === normalizeHostname(currUrlObj.hostname)

      // 如果与主页面属于同一主机，允许在 WebView 内打开
      if (sameHost) {
        return true
      }
    } catch (e) {
      // 解析失败时保守允许（避免误阻断相对链接）
      return true
    }

    // 非同源链接使用外部浏览器处理
    void handleExternalLink(request.url)
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
        onNavigationStateChange={({ url }) => {
          if (url && url !== currentUrl) {
            setCurrentUrl(url)
          }
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
