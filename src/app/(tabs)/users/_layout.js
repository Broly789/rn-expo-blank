import { View, TouchableOpacity, Pressable, StyleSheet } from 'react-native'
import { Stack, useRouter } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import { MaterialCommunityIcons } from '@expo/vector-icons'

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

export default function UsersStack() {
  const router = useRouter()

  // 一写这个，首页就有标题栏了
  return (
    <Stack
      screenOptions={{
        // 标题栏背景色
        headerStyle: {
          backgroundColor: '#1f99b0', // 深蓝
        },
        // 标题文字颜色 + 返回按钮颜色
        headerTintColor: '#fff', // 白色
        // 标题字体样式
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: 'bold',
        },
        headerShadowVisible: true,
        // headerTransparent: false,

        // 安卓标题居中
        headerTitleAlign: 'center',
      }}
    >
      {/* 👇 加这一行就出标题！ */}
      <Stack.Screen
        name="index"
        options={{
          title: '个人中心',
          shadowColor: 'transparent',
          headerRight: () => (
            <Pressable style={styles.iconButton} onPress={() => router.push('/settings')}>
              <Ionicons name="settings-outline" size={24} color="#fff" />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: '账户资料',
        }}
      />
    </Stack>
  )
}

const styles = StyleSheet.create({
  iconButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
})
