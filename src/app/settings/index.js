import { ScrollView, StyleSheet, View, Alert } from 'react-native'
import SettingsTable from '@components/SettingsTable'
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import { useRouter } from 'expo-router'
import { useSession } from '@/utils/ctx'

export default function Settings() {
  const router = useRouter()
  const { signOut, destroyAccount } = useSession()
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
      cells: [
        {
          title: '注销账户',
          titleTextColor: '#999',
          onPress: () =>
            Alert.alert('重要提示', '注销后所有数据将被清除且无法恢复，确定要继续吗？', [
              { text: '取消', style: 'cancel' },
              {
                text: '确认注销',
                style: 'destructive',
                onPress: async () => {
                  console.log('注销账户')
                  Alert.alert(
                    '重要提示',
                    '确认提交注销申请，您的账号将会立即停用。可在7天内联系管理员恢复使用。',
                    [
                      {
                        text: '确定',
                        onPress: async () => {
                          await destroyAccount()
                          router.replace('/users')
                        },
                      },
                    ],
                  )
                },
              },
            ]),
        },
        {
          title: '安全退出',
          titleTextColor: '#999',
          onPress: () =>
            Alert.alert('确认退出', '确定要退出当前账号吗？', [
              { text: '取消', style: 'cancel' },
              {
                text: '退出',
                style: 'destructive',
                onPress: async () => {
                  console.log('安全退出')
                  await signOut()
                  router.replace('/users')
                },
              },
            ]),
        },
      ],
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
