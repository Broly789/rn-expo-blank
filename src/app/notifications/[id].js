import { View, StyleSheet } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import ProcessWebView from '../../components/ProgressWebView'

export default function NotificationDetail() {
  const { id } = useLocalSearchParams()
  const router = useRouter()

  // 干净无错误的 HTML
  const htmlContent = `
   <!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  </head>
  <body>
    <div style="padding: 0 15px 15px; font-size:16px; line-height:1.8;">
      <h2>人工智能如何改变未来生活</h2>
      <p>随着技术的快速发展，人工智能已经逐渐渗透到我们生活的方方面面。</p>
      <h3>一、智能家居</h3>
      <p>现在的家庭设备可以通过语音控制，自动调节温度、灯光、窗帘，让生活更加便捷。</p>
      <img src="https://picsum.photos/600/300" style="width:100%; border-radius:12px;" />
      <h3>二、智能教育</h3>
      <p>AI 可以根据每个人的学习习惯，自动推荐学习内容，提高学习效率。</p>
      <ul>
        <li>个性化学习路径</li>
        <li>智能作业批改</li>
        <li>实时学习反馈</li>
      </ul>
      <p>未来，人工智能将进一步提升生活品质，成为人类最可靠的助手。</p>
    </div>
     </body>
  </html>
  `

  const source = id % 2 === 0 ? { html: htmlContent } : { uri: 'https://xw.qq.com/' }
  return (
    <View style={styles.container}>
      {/* WebView 独占剩余空间 */}
      <ProcessWebView
        style={styles.webview}
        source={source}
        originWhitelist={['*']}
        scrollEnabled={true}
        onExternalBrowserDismiss={() => {
          // router.back()
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1, // 关键！让 WebView 占满剩下屏幕
  },
})
