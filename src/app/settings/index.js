import { ScrollView, StyleSheet, View, Alert } from 'react-native'
import SettingsTable from '@components/SettingsTable'
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import { useRouter } from 'expo-router'

export default function Settings() {
  const router = useRouter()
  const sections = [
    {
      cells: [
        { title: 'Wiki' },
        {
          title: '常用站点',
          uri: 'sites',
          // onPress: () =>
          //   router.push({
          //     pathname: '/settings/[url]',
          //     params: { url: 'https://www.clwy.cn/sites', title: '常用站点' },
          //   }),
        },
      ],
    },
    {
      cells: [
        {
          title: '关于「长乐未央」',
          //   在当前app内打开一个网页，展示关于我们的一些信息
          onPress: async () => await WebBrowser.openBrowserAsync('https://www.clwy.cn/sites'),
        },
        // 点击跳转到浏览器打开网页
        { title: '使用条款', onPress: () => Linking.openURL('https://m.baidu.com') },
        { title: '隐私政策', onPress: () => Linking.openURL('https://www.clwy.cn/sites') },
        {
          title: 'App 备案号',
          onPress: () => Alert.alert('备案号：粤ICP备2024012345号-1'),
        },
      ],
    },
    {
      cells: [{ title: '注销账户' }, { title: '安全退出', titleTextColor: 'red' }],
    },
  ]

  return (
    <View style={styles.container}>
      <ScrollView>
        <SettingsTable sections={sections} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#F8FAFF',
  },
})
