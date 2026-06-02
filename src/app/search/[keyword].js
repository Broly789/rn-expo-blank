import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

// 模拟课程数据
const ALL_COURSES = [
  {
    id: '1',
    title: 'Python 编程入门',
    image:
      'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=400&q=80',
    teacher: '张老师',
    students: 1280,
    rating: 4.8,
    duration: '12 课时',
  },
  {
    id: '2',
    title: 'JavaScript 基础',
    image:
      'https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=400&q=80',
    teacher: '王老师',
    students: 960,
    rating: 4.7,
    duration: '16 课时',
  },
  {
    id: '3',
    title: '数据结构与算法',
    image:
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=400&q=80',
    teacher: '李教授',
    students: 720,
    rating: 4.9,
    duration: '20 课时',
  },
  {
    id: '4',
    title: 'React 实战项目',
    image:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=400&q=80',
    teacher: '陈老师',
    students: 540,
    rating: 4.6,
    duration: '14 课时',
  },
  {
    id: '5',
    title: 'AI 机器学习入门',
    image:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=400&q=80',
    teacher: '赵博士',
    students: 2100,
    rating: 4.9,
    duration: '18 课时',
  },
  {
    id: '6',
    title: 'iOS App 开发实战',
    image:
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=400&q=80',
    teacher: '刘老师',
    students: 380,
    rating: 4.5,
    duration: '22 课时',
  },
  {
    id: '7',
    title: '数据库设计入门',
    image:
      'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=400&q=80',
    teacher: '周老师',
    students: 450,
    rating: 4.7,
    duration: '10 课时',
  },
  {
    id: '8',
    title: '网络安全基础',
    image:
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80',
    teacher: '吴教授',
    students: 620,
    rating: 4.6,
    duration: '15 课时',
  },
  {
    id: '9',
    title: '前端工程化实践',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80',
    teacher: '林老师',
    students: 310,
    rating: 4.5,
    duration: '8 课时',
  },
  {
    id: '10',
    title: '云计算与部署',
    image:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80',
    teacher: '郑老师',
    students: 280,
    rating: 4.4,
    duration: '12 课时',
  },
  {
    id: '11',
    title: 'Git 版本控制入门',
    image:
      'https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&w=400&q=80',
    teacher: '黄老师',
    students: 890,
    rating: 4.8,
    duration: '6 课时',
  },
  {
    id: '12',
    title: 'TypeScript 进阶',
    image:
      'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=400&q=80',
    teacher: '杨老师',
    students: 430,
    rating: 4.6,
    duration: '10 课时',
  },
  {
    id: '13',
    title: 'C语言从零开始',
    image:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',
    teacher: '孙老师',
    students: 650,
    rating: 4.7,
    duration: '14 课时',
  },
  {
    id: '14',
    title: 'HTML CSS 网页设计',
    image:
      'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=400&q=80',
    teacher: '马老师',
    students: 1100,
    rating: 4.6,
    duration: '10 课时',
  },
  {
    id: '15',
    title: 'Node.js 后端开发',
    image:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80',
    teacher: '高老师',
    students: 370,
    rating: 4.5,
    duration: '16 课时',
  },
  {
    id: '16',
    title: 'Node.js API 接口设计',
    image:
      'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=400&q=80',
    teacher: '高老师',
    students: 260,
    rating: 4.4,
    duration: '10 课时',
  },
  {
    id: '17',
    title: 'Node.js 实战项目',
    image:
      'https://images.unsplash.com/photo-1623282033815-40b05d96c903?auto=format&fit=crop&w=400&q=80',
    teacher: '高老师',
    students: 310,
    rating: 4.5,
    duration: '14 课时',
  },
  {
    id: '18',
    title: 'Express 框架入门',
    image:
      'https://images.unsplash.com/photo-1537884944314-390069a865c8?auto=format&fit=crop&w=400&q=80',
    teacher: '许老师',
    students: 190,
    rating: 4.3,
    duration: '8 课时',
  },
  {
    id: '19',
    title: 'Vue3 框架入门',
    image:
      'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=400&q=80',
    teacher: '宋老师',
    students: 520,
    rating: 4.7,
    duration: '12 课时',
  },
  {
    id: '20',
    title: 'Docker 容器技术',
    image:
      'https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=400&q=80',
    teacher: '何老师',
    students: 290,
    rating: 4.4,
    duration: '8 课时',
  },
  {
    id: '21',
    title: 'Linux 系统运维',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80',
    teacher: '曹老师',
    students: 340,
    rating: 4.5,
    duration: '14 课时',
  },
  {
    id: '22',
    title: '算法面试精讲',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    teacher: '唐老师',
    students: 780,
    rating: 4.9,
    duration: '20 课时',
  },
  {
    id: '23',
    title: 'Flutter 跨平台开发',
    image:
      'https://images.unsplash.com/photo-1534103821365-ae06e9ee9149?auto=format&fit=crop&w=400&q=80',
    teacher: '韩老师',
    students: 210,
    rating: 4.3,
    duration: '18 课时',
  },
  {
    id: '24',
    title: 'MongoDB 数据库入门',
    image:
      'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=400&q=80',
    teacher: '周老师',
    students: 230,
    rating: 4.4,
    duration: '8 课时',
  },
]

const PAGE_SIZE = 6

function highlightText(text, keyword) {
  if (!keyword.trim()) return text
  const parts = text.split(new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
  return parts.map((part, i) =>
    part.toLowerCase() === keyword.toLowerCase() ? (
      <Text key={i} style={styles.highlight}>
        {part}
      </Text>
    ) : (
      part
    ),
  )
}

export default function SearchResult() {
  const { keyword } = useLocalSearchParams()
  const router = useRouter()
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [refreshing, setRefreshing] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  // 模拟搜索过滤
  const fetchResults = useCallback(
    (pageNum = 1, keywordStr = keyword) => {
      const filtered = ALL_COURSES.filter((c) =>
        c.title.toLowerCase().includes(keywordStr.toLowerCase()),
      )
      const start = 0
      const end = pageNum * PAGE_SIZE
      const items = filtered.slice(start, end)
      return { items, total: filtered.length }
    },
    [keyword],
  )

  // 初始加载 / 关键词变化
  useEffect(() => {
    setPage(1)
    const { items, total } = fetchResults(1)
    setData(items)
    setHasMore(items.length < total)
    setLoadingMore(false)
  }, [keyword])

  // 下拉刷新
  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setPage(1)
    setTimeout(() => {
      const { items, total } = fetchResults(1)
      setData(items)
      setHasMore(items.length < total)
      setRefreshing(false)
    }, 600)
  }, [keyword])

  // 加载更多
  const onLoadMore = useCallback(() => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    const nextPage = page + 1
    setTimeout(() => {
      const { items, total } = fetchResults(nextPage)
      setData(items)
      setPage(nextPage)
      setHasMore(items.length < total)
      setLoadingMore(false)
    }, 500)
  }, [page, loadingMore, hasMore, keyword])

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => router.push(`/chapters/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {highlightText(item.title, keyword)}
        </Text>
        <Text style={styles.cardTeacher}>
          <Ionicons name="person-outline" size={13} color="#6B7280" /> {item.teacher}
        </Text>
        <View style={styles.cardMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={13} color="#9CA3AF" />
            <Text style={styles.metaText}>
              {item.students >= 1000 ? `${(item.students / 1000).toFixed(1)}k` : item.students}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="star" size={13} color="#F59E0B" />
            <Text style={[styles.metaText, { color: '#F59E0B' }]}>{item.rating}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={13} color="#9CA3AF" />
            <Text style={styles.metaText}>{item.duration}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="small" color="#0B69FF" />
          <Text style={styles.footerText}>加载更多...</Text>
        </View>
      )
    }
    if (!hasMore && data.length > 0) {
      return <Text style={styles.noMore}>— 已加载全部课程 —</Text>
    }
    return null
  }

  const renderEmpty = () => (
    <View style={styles.empty}>
      <Ionicons name="search-outline" size={64} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>未找到相关课程</Text>
      <Text style={styles.emptyText}>试试其他关键词吧</Text>
    </View>
  )

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerKeyword} numberOfLines={1}>
            “{keyword}”
          </Text>
        </View>
        <Text style={styles.resultCount}>{data.length} 个结果</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0B69FF"
            colors={['#0B69FF']}
          />
        }
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEDF0',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F2F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerKeyword: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  resultCount: {
    fontSize: 13,
    color: '#8C8CA1',
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardImage: {
    width: 110,
    height: 110,
    resizeMode: 'cover',
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A2E',
    lineHeight: 21,
    marginBottom: 6,
  },
  highlight: {
    color: '#0B69FF',
    fontWeight: '700',
  },
  cardTeacher: {
    fontSize: 13,
    color: '#8C8CA1',
    marginBottom: 8,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    fontSize: 12,
    color: '#B0B0C0',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#8C8CA1',
  },
  noMore: {
    textAlign: 'center',
    fontSize: 13,
    color: '#C0C0D0',
    paddingVertical: 20,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8C8CA1',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#B0B0C0',
    marginTop: 6,
  },
})
