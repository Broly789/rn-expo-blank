import React, { useCallback, useState } from 'react'
import { useRouter, useFocusEffect, useNavigation } from 'expo-router' // 🔥 导入 useNavigation
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native'
import Icon from '@assets/icon.png'
import HomeHeader from '@components/HomeHeader'
import SearchBox from '@components/SearchBox'
import CategoryChips from '@components/CategoryChips'
import CourseCarousel from '@components/CourseCarousel'
import QuickModuleGrid from '@components/QuickModuleGrid'
import ArticleCard from '@components/ArticleCard'
import TeacherCard from '@components/TeacherCard'
import NoteCard from '@components/NoteCard'
import { MaterialCommunityIcons } from '@expo/vector-icons'

export default function App() {
  const [refreshing, setRefreshing] = useState(false)

  const categories = [
    { id: '1', label: '编程思维', color: '#E9F5FF' },
    { id: '2', label: '英语阅读', color: '#FFF3E5' },
    { id: '3', label: '数学提升', color: '#EAF9EB' },
    { id: '4', label: '科学项目', color: '#F5E8FF' },
  ]

  const featuredCourses = [
    { id: '1', title: 'AI 课堂入门', subtitle: '启蒙式项目学习', badge: '热门' },
    { id: '2', title: 'STEAM 实验', subtitle: '动手探索世界', badge: '新课' },
    { id: '3', title: '语文阅读营', subtitle: '故事与写作', badge: '精品' },
  ]

  const quickModules = [
    { id: '1', title: '学习计划', description: '今天完成 3 课时', bg: '#FFF4EB' },
    { id: '2', title: '习题挑战', description: '数学闯关 | 12 道', bg: '#EEF7FF' },
    { id: '3', title: '名师直播', description: '下一场 19:00 开始', bg: '#F7F0FF' },
  ]

  const article = {
    title: '校园创客活动：编程与设计融合',
    description: '本周末开展项目实践，让孩子在动手中学习科学与创意。',
    imageUri:
      'https://images.unsplash.com/photo-1584697964154-5f6d4c1d5a35?auto=format&fit=crop&w=700&q=80',
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 1200)
  }, [])

  const teacher = {
    name: '李老师',
    role: '数学思维训练专家',
    actionText: '预约直播',
  }

  const note = {
    title: '今日目标',
    description: '阅读 20 分钟，完成 1 个实验练习，提交学习反馈。',
  }

  const router = useRouter()

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.page}
        showsVerticalScrollIndicator={false}
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
      >
        <HomeHeader
          title="欢迎回来，学霸"
          subtitle="今天学习什么？去探索教育新世界"
          avatar={Icon}
          onPressNotification={() => router.push('/notifications')}
          notificationCount={3}
        />
        <SearchBox placeholder="搜索课程、老师、专题" onPress={() => router.push('/search')} />
        <CategoryChips categories={categories} />
        <CourseCarousel courses={featuredCourses} />
        <QuickModuleGrid modules={quickModules} />
        <ArticleCard article={article} />
        <TeacherCard teacher={teacher} />
        <NoteCard note={note} />
      </ScrollView>
    </SafeAreaView>
  )
}

// 样式保持不变
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  page: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    marginTop: 6,
    color: '#6B7280',
    fontSize: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
  },
  searchBox: {
    marginBottom: 22,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  searchInput: {
    fontSize: 16,
    color: '#111827',
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  chipList: {
    paddingRight: 10,
  },
  chip: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginRight: 12,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  cardList: {
    paddingRight: 10,
  },
  courseCard: {
    width: 220,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 18,
    marginRight: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  courseBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginBottom: 14,
  },
  courseBadgeText: {
    color: '#0B69FF',
    fontSize: 12,
    fontWeight: '700',
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  courseSubtitle: {
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 18,
  },
  courseButton: {
    backgroundColor: '#0B69FF',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
  },
  courseButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  moduleGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  smallCard: {
    width: '48%',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  smallCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: '#111827',
  },
  smallCardText: {
    color: '#4B5563',
    fontSize: 13,
    lineHeight: 20,
  },
  articleCard: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  articleImage: {
    width: '100%',
    height: 160,
  },
  articleBody: {
    padding: 16,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  articleText: {
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 20,
  },
  teacherCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  teacherInfo: {
    flex: 1,
    paddingRight: 12,
  },
  teacherName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  teacherRole: {
    color: '#6B7280',
    fontSize: 14,
  },
  teacherButton: {
    backgroundColor: '#0B69FF',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  teacherButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  noteCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 22,
    padding: 18,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: '#111827',
  },
  noteText: {
    color: '#4B5563',
    fontSize: 14,
    lineHeight: 20,
  },
})
