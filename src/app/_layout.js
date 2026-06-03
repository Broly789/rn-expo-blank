import { Stack, useRouter } from 'expo-router'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { SessionProvider, useSession } from '@/utils/ctx'
import { SplashScreenController } from '@/utils/splash'
import PrivacyPolicyModal from '@/components/PrivacyPolicyModal'
import usePrivacyStore from '@/store/usePrivacyStore'

function CloseButton() {
  const router = useRouter()
  return (
    <View style={{ paddingLeft: 4, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity onPress={() => router.dismiss()}>
        <MaterialCommunityIcons name="close" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  )
}

function RootLayoutContent() {
  const { session: isLoggedIn, isLoading } = useSession()
  const { hasAcceptedPrivacy, acceptedVersion, acceptPrivacy } = usePrivacyStore()

  /** 是否需要显示隐私政策弹窗 */
  const needPrivacyConsent = !hasAcceptedPrivacy || acceptedVersion !== '1.0.0'

  if (isLoading) return null

  return (
    <SafeAreaProvider>
      {/* 全屏隐私政策弹窗，未同意前阻止所有操作 */}
      <PrivacyPolicyModal
        visible={needPrivacyConsent}
        onAccept={(version) => acceptPrivacy(version)}
      />

      {/* 未同意隐私政策前，用空白层阻止交互 */}
      {needPrivacyConsent && <View style={styles.privacyOverlay} />}

      <Stack
        screenOptions={{
          headerTitleAlign: 'center',
          animation: 'slide_from_right',
          headerStyle: {
            backgroundColor: '#1f99b0',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerBackButtonDisplayMode: 'minimal', // 🔥 核心修改：只显示返回按钮，不显示文字
          // 🔥 只需要加这两行，彻底解决跳动
          // headerTransparent: false, // 确保标题栏不透明
        }}
      >
        {/* <Stack.Protected guard={!!isLoggedIn}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="settings/index" options={{ title: '设置' }} />
          <Stack.Screen name="course/[id]" options={{ title: '课程详情' }} />
        </Stack.Protected> */}
        {/* 🔥 核心修改：关闭整个Tab组的标题栏 */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Protected guard={!!isLoggedIn}>
          <Stack.Screen name="settings/index" options={{ title: '设置' }} />
        </Stack.Protected>
        <Stack.Screen name="course/[id]" options={{ title: '课程详情' }} />

        {/* 当isLoggedIn为false时，默认会按下面顺序 打开第一个未受保护路由页 
         也可以在其他页面使用Redirect到登录页 */}
        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen name="sign-in" options={{ title: '登录' }} />
          {/* 这里也可有多个未包含路由页Stack.Screen */}
        </Stack.Protected>
        <Stack.Screen
          name="author/index"
          options={{
            presentation: 'modal',
            title: '登录',
            headerLeft: () => <CloseButton />,
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="teachers/[id]"
          options={{
            presentation: 'modal',
            title: '教师详情',
            headerLeft: () => <CloseButton />,
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen name="detail" options={{ title: '详情' }} />
        <Stack.Screen name="search/index" options={{ title: '搜索' }} />
        <Stack.Screen name="search/[keyword]" options={{ title: '搜索结果' }} />
        <Stack.Screen name="notifications/index" options={{ title: '通知' }} />
        <Stack.Screen name="notifications/[id]" options={{ title: '通知详情' }} />
        <Stack.Screen
          name="settings/[url]"
          options={({ route }) => ({ title: route.params.title })}
        />

        <Stack.Screen
          name="chapters/[id]"
          options={{
            title: '章节详情',
            headerStyle: {
              backgroundColor: '#ffffff', // 背景白色
              shadowColor: 'transparent', // 去除底部阴影线（可选）
            },
            // 配套修改文字/返回按钮颜色（根据你需求调整）
            headerTintColor: '#333', // 标题、返回箭头颜色
            headerTitleStyle: {
              color: '#333', // 标题文字颜色
              fontSize: 18,
              fontWeight: 'bold',
            },
          }}
        />
      </Stack>
    </SafeAreaProvider>
  )
}

export default function RootLayout() {
  return (
    <SessionProvider>
      <SplashScreenController />
      <RootLayoutContent />
    </SessionProvider>
  )
}

const styles = StyleSheet.create({
  privacyOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    backgroundColor: 'transparent',
    pointerEvents: 'auto',
  },
})
