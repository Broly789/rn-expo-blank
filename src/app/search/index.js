import { View, StyleSheet, TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default function Search() {
  // 回车搜索
  const submitSearch = (event) => {
    const keyword = event.nativeEvent.text
    console.log('搜索的关键词：', keyword)
  }

  return (
    <View style={styles.container}>
      {/* 外层搜索容器 圆角边框 */}
      <View style={styles.searchWrapper}>
        <Ionicons name={'search-outline'} size={20} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          autoCapitalize={'none'}
          autoFocus={true}
          autoCorrect={false}
          returnKeyType={'search'}
          selectionColor={'#1f99b0'}
          placeholder={'通过关键词搜索'}
          placeholderTextColor={'#777'}
          onSubmitEditing={submitSearch}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 999, // 超大圆角实现胶囊圆角
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1, // 输入框自动占满剩余宽度
    fontSize: 16,
    color: '#333',
    paddingVertical: 0, // 去掉默认内边距，和图标居中对齐
  },
})
