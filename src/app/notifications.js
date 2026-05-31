import React, { useCallback, useState } from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native'
import ListEmptyComponent from '@components/ListEmptyComponent'

const notifications = [
  {
    id: '1',
    title: '直播提醒',
    description: '李老师的数学思维训练直播将在 19:00 开始，马上进入课堂。',
    time: '刚刚',
  },
  {
    id: '2',
    title: '任务完成奖励',
    description: '你已完成今日学习计划，获得 10 个学习积分。',
    time: '1 小时前',
  },
  {
    id: '3',
    title: '新课程上线',
    description: '“AI 创客实验”课程已上线，快来预约你的专属学习空间。',
    time: '昨天',
  },
  {
    id: 'a1',
    title: 'a直播提醒',
    description: '李老师的数学思维训练直播将在 19:00 开始，马上进入课堂。',
    time: '刚刚',
  },
  {
    id: 'a2',
    title: 'a任务完成奖励',
    description: '你已完成今日学习计划，获得 10 个学习积分。',
    time: '1 小时前',
  },
  {
    id: 'a3',
    title: 'a新课程上线',
    description: '“AI 创客实验”课程已上线，快来预约你的专属学习空间。',
    time: '昨天',
  },
]

export default function NotificationsPage() {
  const [refreshing, setRefreshing] = useState(false)
  const [data, setData] = useState(notifications)
  const [loadingMore, setLoadingMore] = useState(false)

  const generateMockNotifications = useCallback((startIndex) => {
    return [
      {
        id: String(startIndex),
        title: '活动提醒',
        description: '暑期专属报名通道已开启，快去查看你的专属课程推荐。',
        time: '刚刚',
      },
      {
        id: String(startIndex + 1),
        title: '系统消息',
        description: '你的练习报告已生成，成绩进步稳定，继续保持！',
        time: '2 小时前',
      },
      {
        id: String(startIndex + 2),
        title: '课程更新',
        description: '“创意科学实验”新增互动内容，马上去体验。',
        time: '昨天',
      },
    ]
  }, [])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setTimeout(() => {
      setData(notifications)
      setRefreshing(false)
    }, 1000)
  }, [])

  const onEndReached = useCallback(() => {
    if (loadingMore) return
    setLoadingMore(true)

    setTimeout(() => {
      setData((prev) => [...prev, ...generateMockNotifications(prev.length + 1)])
      setLoadingMore(false)
    }, 1200)
  }, [generateMockNotifications, loadingMore])

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => console.log('点击通知', item.id)}
      activeOpacity={0.7}
      style={styles.cardWrapper}
    >
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardTime}>{item.time}</Text>
        </View>
        <Text style={styles.cardDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          <Text style={styles.pageTitle}>通知</Text>
        </View>

        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footer}>
                <ActivityIndicator size="small" color="#0B69FF" />
                <Text style={styles.footerText}>正在加载更多...</Text>
              </View>
            ) : null
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#0B69FF"
              title="下拉刷新"
              titleColor="#0B69FF"
              colors={['#0B69FF']}
            />
          }
          ListEmptyComponent={<ListEmptyComponent title="当前没有新通知😊" subtitle="" />}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  container: {
    padding: 20,
    paddingBottom: 32,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  headerContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: '#F8FAFF',
  },

  // 卡片外层包装（负责间距）
  cardWrapper: {
    marginBottom: 14,
  },

  // 卡片样式
  card: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginRight: 12,
  },
  cardTime: {
    color: '#6B7280',
    fontSize: 12,
  },
  cardDescription: {
    color: '#4B5563',
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  footerText: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 8,
  },
  emptyState: {
    marginTop: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 16,
  },
})
