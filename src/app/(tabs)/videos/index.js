import { Link } from 'expo-router'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'

export default function Videos() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* 关键：加 contentContainerStyle 撑满 */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>My Videos</Text>
          <Link href="/detail">Jump to Detail</Link>
          <Ionicons name="home" size={32} color="red" />

          {/* 多放一些内容，就能滚动了 */}
          {Array(30)
            .fill(0)
            .map((_, i) => (
              <Text key={i} style={styles.item}>
                视频条目 {i + 1}
              </Text>
            ))}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // 滚动内容样式：让内容至少撑满屏幕高度
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    fontSize: 16,
    marginVertical: 8,
  },
})
