import { useState, useEffect } from 'react'
import {
  View,
  Text,
  Image,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Share, // 已导入
  Alert,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'

// ====================== Mock 数据 ======================
const COURSE_INFO = {
  cover: 'https://picsum.photos/1080/400',
  title: 'Node.js 项目实践',
  lessons: 10,
  publishTime: '2026-01-01 08:00:00',
  author: '刘东',
  likes: 2,
  isFinished: true,
  summary:
    '本课程从0到1带你掌握Node.js全栈开发，涵盖nvm环境搭建、Express框架、路由中间件、数据库操作、项目部署等核心内容。通过实战项目让你快速上手后端开发，成为全栈工程师。',
  teacher: {
    id: 7701,
    avatar: 'https://picsum.photos/200/200',
    name: '刘东',
    title: '10年全栈开发经验',
    intro:
      '前大厂高级架构师，主导过多个千万级用户项目的后端开发。擅长Node.js、React、云原生技术，教学风格通俗易懂，注重实战。',
  },
}

// 🔥 绝对唯一 ID 生成（彻底修复 key 重复）
const generateChapters = (page) => {
  return Array.from({ length: 5 }, (_, i) => {
    const uniqueId = page * 1000 + i
    const episode = page * 5 + i + 1
    return {
      id: `chapter-${uniqueId}`,
      title:
        [
          '课程介绍',
          '使用 nvm 安装 Node.js',
          '编辑器与创建 Express 项目',
          '项目结构与解析',
          '路由与中间件详解',
        ][i] || `第 ${episode} 章`,
      author: '刘东',
      publishTime: '2026-01-01 08:00:00',
      cover: 'https://picsum.photos/200/120',
      episode: episode,
    }
  })
}

// ====================== 主组件 ======================
export default function CourseDetail() {
  const insets = useSafeAreaInsets()
  const { id } = useLocalSearchParams()
  const router = useRouter()

  const [chapters, setChapters] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [likes, setLikes] = useState(COURSE_INFO.likes)
  const [isLiked, setIsLiked] = useState(false)

  const MAX_PAGES = 3

  // ====================== 🔥 原生分享功能（双平台兼容） ======================
  const onShare = async () => {
    try {
      // 分享内容配置
      const shareOptions = {
        // 分享标题
        title: COURSE_INFO.title,
        // 分享文字内容（兼容所有平台）
        message: `【${COURSE_INFO.title}】\n${COURSE_INFO.summary}\n\n讲师：${COURSE_INFO.teacher.name}`,
        // 分享链接（iOS优先，Android自动拼接）
        url: 'https://clwy.cn/courses/fullstack-node' || COURSE_INFO.cover,
        // 分享图片（网络图片，双平台支持）
        subject: COURSE_INFO.title,
      }

      // 调用系统分享
      const result = await Share.share(shareOptions)

      // 分享结果回调
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // 用户已通过指定渠道分享
          console.log('分享成功')
        } else {
          // 用户已分享
          console.log('分享完成')
        }
      } else if (result.action === Share.dismissedAction) {
        // 用户取消分享
        console.log('取消分享')
      }
    } catch (error) {
      // 分享失败
      Alert.alert('分享失败', '当前不支持分享功能')
      console.error('分享错误：', error)
    }
  }

  useEffect(() => {
    loadMoreChapters()
  }, [id])

  const loadMoreChapters = () => {
    if (loading || !hasMore) return
    setLoading(true)

    setTimeout(() => {
      const newChapters = generateChapters(page)
      setChapters((prev) => [...prev, ...newChapters])

      if (page >= MAX_PAGES) {
        setHasMore(false)
      } else {
        setPage((prev) => prev + 1)
      }
      setLoading(false)
    }, 800)
  }

  const toggleLike = () => {
    setIsLiked(!isLiked)
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  const renderHeader = () => (
    <View>
      {/* 顶部封面 */}
      <ImageBackground
        source={{ uri: COURSE_INFO.cover }}
        style={styles.coverContainer}
        resizeMode="cover"
      >
        <View style={styles.coverOverlay} />
        <View style={styles.coverTitleContainer}>
          <Text style={styles.coverMainTitle}>{COURSE_INFO.title}</Text>
          <Text style={styles.coverSubTitle}>2025 最新版 · 全栈开发实战</Text>
        </View>

        {COURSE_INFO.isFinished && (
          <View style={styles.finishedTag}>
            <Text style={styles.finishedText}>已完结</Text>
          </View>
        )}
      </ImageBackground>

      {/* 🔥 通透毛玻璃信息栏 */}
      <ImageBackground
        source={{ uri: COURSE_INFO.cover }}
        style={styles.courseInfoBg}
        blurRadius={26}
        resizeMode="cover"
      >
        <View style={styles.courseInfoOverlay}>
          <Text style={styles.courseTitle}>
            {COURSE_INFO.title}
            <Text style={styles.courseId}> (ID: {id || '未知'})</Text>
          </Text>

          <View style={styles.infoRow}>
            <View style={styles.lessonsTag}>
              <Text style={styles.lessonsText}>全 {COURSE_INFO.lessons} 回</Text>
            </View>
            <Text style={styles.publishTime}>{COURSE_INFO.publishTime} 发布</Text>

            <View style={styles.actionButtons}>
              {/* 🔥 分享按钮绑定点击事件 */}
              <TouchableOpacity style={styles.actionBtn} onPress={onShare}>
                <Text style={styles.actionIcon}>↗</Text>
                <Text style={styles.actionText}>分享</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionBtn} onPress={toggleLike}>
                <Text style={[styles.actionIcon, isLiked && styles.likedIcon]}>♡</Text>
                <Text style={styles.actionText}>{likes}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  )

  const renderChapterItem = ({ item }) => (
    <TouchableOpacity style={styles.chapterItem} activeOpacity={0.8}>
      <View style={styles.chapterLeft}>
        <Text style={styles.chapterTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.chapterMeta}>
          {item.author} | {item.publishTime} 发布
        </Text>
      </View>

      <View style={styles.chapterRight}>
        <Image source={{ uri: item.cover }} style={styles.chapterCover} resizeMode="cover" />
        <View style={styles.episodeTag}>
          <Text style={styles.episodeText}>第 {item.episode} 回</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  const renderFooter = () => {
    return (
      <View style={{ paddingBottom: insets.bottom + 30 }}>
        {loading && hasMore && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#1f99b0" />
            <Text style={styles.footerText}>加载中...</Text>
          </View>
        )}

        {/* 课程简介 */}
        <View style={styles.footerCard}>
          <Text style={styles.footerTitle}>课程简介</Text>
          <Text style={styles.summaryText}>{COURSE_INFO.summary}</Text>
        </View>

        {/* 讲师介绍（可点击跳转） */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            router.navigate(`/teachers/${COURSE_INFO.teacher.id}`)
          }}
        >
          <View style={styles.footerCard}>
            <Text style={styles.footerTitle}>讲师介绍</Text>
            <View style={styles.teacherContainer}>
              <Image
                source={{ uri: COURSE_INFO.teacher.avatar }}
                style={styles.teacherAvatar}
                resizeMode="cover"
              />
              <View style={styles.teacherInfo}>
                <Text style={styles.teacherName}>{COURSE_INFO.teacher.name}</Text>
                <Text style={styles.teacherTitle}>{COURSE_INFO.teacher.title}</Text>
                <Text style={styles.teacherIntro} numberOfLines={3}>
                  {COURSE_INFO.teacher.intro}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={chapters}
        keyExtractor={(item) => item.id}
        renderItem={renderChapterItem}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        onEndReached={loadMoreChapters}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
      />
    </View>
  )
}

// ====================== 样式 ======================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  coverContainer: {
    width: '100%',
    height: 240,
    justifyContent: 'flex-end',
  },
  coverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
  },
  coverTitleContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  coverMainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  coverSubTitle: {
    fontSize: 14,
    color: 'rgba(255,255,250.9)',
    marginTop: 4,
  },
  finishedTag: {
    position: 'absolute',
    top: 20,
    right: -32,
    width: 130,
    height: 32,
    backgroundColor: '#e53935',
    transform: [{ rotate: '45deg' }],
    justifyContent: 'center',
    alignItems: 'center',
  },
  finishedText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },

  // 毛玻璃信息栏
  courseInfoBg: {
    width: '100%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  courseInfoOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.32)',
    padding: 20,
  },
  courseTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
  },
  courseId: {
    fontSize: 16,
    color: '#444',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lessonsTag: {
    backgroundColor: '#0288d1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  lessonsText: {
    color: '#fff',
    fontSize: 12,
  },
  publishTime: {
    fontSize: 13,
    color: '#333',
    flex: 1,
    marginLeft: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 20,
  },
  actionBtn: {
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 20,
    color: '#333',
  },
  likedIcon: {
    color: '#e53935',
  },
  actionText: {
    fontSize: 12,
    color: '#333',
  },

  // 章节
  chapterItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  chapterLeft: {
    flex: 1,
    marginRight: 12,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  chapterMeta: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  chapterRight: {},
  chapterCover: {
    width: 100,
    height: 60,
    borderRadius: 6,
  },
  episodeTag: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(139, 119, 101, 0.85)',
    paddingVertical: 2,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    alignItems: 'center',
  },
  episodeText: {
    color: '#fff',
    fontSize: 11,
  },

  // 底部卡片
  footerCard: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 16,
    padding: 18,
    borderRadius: 12,
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  footerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  teacherContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  teacherAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 14,
  },
  teacherInfo: {
    flex: 1,
  },
  teacherName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  teacherTitle: {
    fontSize: 13,
    color: '#1f99b0',
    marginVertical: 4,
  },
  teacherIntro: {
    fontSize: 13,
    color: '#888',
    lineHeight: 20,
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#777',
  },
})
