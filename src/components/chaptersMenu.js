import { View, Text, StyleSheet, FlatList, TouchableHighlight } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

// 菜单列表组件
const ChaptersMenu = (props) => {
  const { course, chapter, chapters, onItemSelected } = props

  // 顶部标题
  const renderHeader = () => (
    <View style={styles.headerWrapper}>
      <Text style={styles.name} numberOfLines={1}>
        {course.name}
      </Text>
    </View>
  )

  // 分割线
  const renderSeparator = () => (
    <View style={styles.separator}>
      <View style={styles.separator_inner} />
    </View>
  )

  // 渲染列表项
  const renderItem = ({ item }) => (
    <TouchableHighlight underlayColor="#DDD" onPress={() => onItemSelected && onItemSelected(item)}>
      <View style={styles.chapters}>
        <Ionicons
          name={chapter.slug === item.slug ? 'play-circle' : 'play-circle-outline'}
          size={25}
          color={chapter.slug === item.slug ? '#1f99b0' : '#666A6C'}
          style={styles.playIcon}
        />
        <Text style={[styles.title, chapter.slug === item.slug && styles.activeTitle]}>
          {item.title}
        </Text>
      </View>
    </TouchableHighlight>
  )

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 20 }}
      ListHeaderComponent={renderHeader}
      data={chapters}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      ItemSeparatorComponent={renderSeparator}
    />
  )
}

const styles = StyleSheet.create({
  // 侧边栏容器
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // 课程标题
  headerWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    fontWeight: 'bold',
    backgroundColor: '#f1f1f1',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  // 分割线
  separator: {
    paddingHorizontal: 16,
  },
  separator_inner: {
    height: 1,
    backgroundColor: '#eee',
  },
  // 章节项
  chapters: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  playIcon: {
    marginRight: 12,
  },
  title: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  activeTitle: {
    color: '#1f99b0',
    fontWeight: '500',
  },
})

export default ChaptersMenu
