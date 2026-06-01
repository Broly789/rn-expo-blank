import { View, Text, StyleSheet } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { WebView } from 'react-native-webview' // 必须先安装

export default function NotificationDetail() {
  const { id } = useLocalSearchParams()

  // 干净无错误的 HTML
  const htmlContent = `
    <div style="padding:15px; font-size:16px; line-height:1.8;">
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
  `

  return (
    <View style={styles.container}>
      {/* 顶部标题 */}
      <View style={styles.header}>
        <Text style={styles.title}>通知详情</Text>
        <Text style={styles.idText}>ID：{id}</Text>
      </View>

      {/* WebView 独占剩余空间 */}
      <WebView
        style={styles.webview}
        source={{ html: htmlContent }}
        originWhitelist={['*']}
        scrollEnabled={true}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  idText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  webview: {
    flex: 1, // 关键！让 WebView 占满剩下屏幕
  },
})
