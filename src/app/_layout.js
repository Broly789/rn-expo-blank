import { Stack, useRouter } from 'expo-router'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { View, TouchableOpacity } from 'react-native'

function CloseButton() {
  const router = useRouter()
  return (
    <View style={{ width: 30 }}>
      <TouchableOpacity onPress={() => router.dismiss()}>
        <MaterialCommunityIcons name="close" size={30} color="#1f99b0" />
      </TouchableOpacity>
    </View>
  )
}

export default function RootLayout() {
  return (
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
        headerHeight: 56, // 固定标题栏高度
        headerTransparent: false, // 确保标题栏不透明
      }}
    >
      {/* 🔥 核心修改：关闭整个Tab组的标题栏 */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

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
      <Stack.Screen name="notifications/index" options={{ title: '通知' }} />
      <Stack.Screen name="notifications/[id]" options={{ title: '通知详情' }} />
    </Stack>
  )
}
