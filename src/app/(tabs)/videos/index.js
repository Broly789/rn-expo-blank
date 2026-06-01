import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Animated,
} from 'react-native'
import ScrollableTabView, { ScrollableTabBar } from 'clwy-expo-scrollable-tab-view'
import { useState, useEffect, useRef } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'

// Tab 分类
const TAB_CATEGORIES = [
  { label: '新闻', key: 'news' },
  { label: '体育', key: 'sport' },
  { label: '生活', key: 'life' },
  { label: '娱乐', key: 'ent' },
  { label: '科技', key: 'tech' },
  { label: '创业', key: 'startup' },
  { label: '教育', key: 'edu' },
  { label: '财经', key: 'finance' },
]

// 模拟数据
const generateMockData = (category, page) => {
  return Array.from({ length: 10 }, (_, i) => ({
    id: `${category}-${page}-${i}`,
    title: `【${category}】第 ${page} 页内容 ${i + 1}`,
    desc: `下拉刷新 + 上拉加载 + 回到顶部 + 状态独立`,
    image: 'https://picsum.photos/600/300',
  }))
}

// 每个 Tab 页面（完全独立状态）
const CategoryList = ({ category }) => {
  const insets = useSafeAreaInsets()
  const flatListRef = useRef(null)
  // 动画值：透明度 + 缩放
  const btnAnim = useRef(new Animated.Value(0)).current

  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showTopBtn, setShowTopBtn] = useState(false)

  const MAX_PAGES = 3

  // 按钮显隐动画
  useEffect(() => {
    if (showTopBtn) {
      // 显示：淡入 + 放大
      Animated.parallel([
        Animated.timing(btnAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      // 隐藏：淡出 + 缩小
      Animated.parallel([
        Animated.timing(btnAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [showTopBtn, btnAnim])

  // 加载数据
  const fetchData = async (isRefresh = false) => {
    const currentPage = isRefresh ? 1 : page
    if (loading || (!isRefresh && !hasMore)) return

    setLoading(true)
    setTimeout(() => {
      const newData = generateMockData(category, currentPage)
      if (isRefresh) {
        setData(newData)
        setPage(2)
        setHasMore(true)
      } else {
        setData((prev) => [...prev, ...newData])
        setPage(currentPage + 1)
        if (currentPage >= MAX_PAGES) {
          setHasMore(false)
        }
      }
      setLoading(false)
      setRefreshing(false)
      setInitialLoading(false)
    }, 800)
  }

  // 初始化
  useEffect(() => {
    fetchData(true)
  }, [category])

  // 下拉刷新
  const onRefresh = () => {
    setRefreshing(true)
    fetchData(true)
  }

  // 滚动判断回到顶部
  const handleScroll = (e) => {
    const offsetY = e.nativeEvent.contentOffset.y
    setShowTopBtn(offsetY > 300)
  }

  // 回到顶部
  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true })
  }

  const router = useRouter()
  // 列表项
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => router.push(`/course/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.desc} numberOfLines={1}>
          {item.desc}
        </Text>
      </View>
    </TouchableOpacity>
  )

  // 空页面
  const renderEmpty = () => {
    if (initialLoading) return null
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>暂无数据</Text>
      </View>
    )
  }

  // 底部状态
  const renderFooter = () => {
    if (initialLoading || data.length === 0) return null

    if (loading) {
      return (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
          <ActivityIndicator size="small" color="#1f99b0" />
          <Text style={styles.footerText}>加载中...</Text>
        </View>
      )
    }

    if (!hasMore) {
      return (
        <View style={[styles.footerEnd, { paddingBottom: insets.bottom + 20 }]}>
          <Text style={styles.footerEndText}>已加载全部</Text>
        </View>
      )
    }

    return <View style={{ height: insets.bottom + 70 }} />
  }

  if (initialLoading) {
    return (
      <View style={styles.initialLoading}>
        <ActivityIndicator size="large" color="#1f99b0" />
      </View>
    )
  }

  // 动画样式：透明度 + 缩放
  const btnAnimateStyle = {
    opacity: btnAnim,
    transform: [{ scale: btnAnim }],
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ref={flatListRef}
        style={styles.list}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={() => fetchData(false)}
        onEndReachedThreshold={0.6}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1f99b0" />
        }
      />

      {/* 带动画回到顶部按钮 */}
      <Animated.View style={[styles.topBtn, { bottom: insets.bottom + 80 }, btnAnimateStyle]}>
        <TouchableOpacity activeOpacity={0.8} onPress={scrollToTop} style={styles.btnInner}>
          <Text style={styles.topBtnText}>↑</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

// 主页面
export default function Index() {
  return (
    <View style={styles.wrapper}>
      <ScrollableTabView
        style={styles.container}
        initialPage={0}
        renderTabBar={() => <ScrollableTabBar />}
        tabBarUnderlineStyle={styles.barUnderLine}
        tabBarBackgroundColor="#fff"
        tabBarInactiveTextColor="#777"
        tabBarActiveTextColor="#000"
        tabBarTextStyle={styles.barText}
      >
        {TAB_CATEGORIES.map((item) => (
          <View key={item.key} tabLabel={item.label} style={styles.page}>
            <CategoryList category={item.label} />
          </View>
        ))}
      </ScrollableTabView>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1 },
  page: { flex: 1 },
  list: { flex: 1, padding: 12 },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  image: { width: 110, height: 75, borderRadius: 8 },
  info: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  title: { fontSize: 15, fontWeight: '500' },
  desc: { fontSize: 12, color: '#888', marginTop: 4 },

  initialLoading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
  emptyText: { fontSize: 16, color: '#999' },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  footerText: { marginLeft: 8, fontSize: 14, color: '#777' },
  footerEnd: { justifyContent: 'center', alignItems: 'center', paddingVertical: 15 },
  footerEndText: { fontSize: 13, color: '#bbb' },

  topBtn: {
    position: 'absolute',
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1f99b0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  btnInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBtnText: { fontSize: 24, color: '#fff', fontWeight: 'bold' },

  barUnderLine: { backgroundColor: '#1f99b0', height: 2 },
  barText: { fontWeight: '400' },
})
