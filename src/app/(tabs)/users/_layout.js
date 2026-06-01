import { Stack } from 'expo-router'

export default function UsersStack() {
  // 一写这个，首页就有标题栏了
  return (
    <Stack
      screenOptions={{
        // 标题栏背景色
        headerStyle: {
          backgroundColor: '#1976D2', // 深蓝
        },
        headerHeight: 56, // 固定标题栏高度
        // 标题文字颜色 + 返回按钮颜色
        headerTintColor: '#fff', // 白色
        // 标题字体样式
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: 'bold',
        },
        // 安卓标题居中
        headerTitleAlign: 'center',
      }}
    >
      {/* 👇 加这一行就出标题！ */}
      <Stack.Screen
        name="index"
        options={{
          title: '用户', // iOS 原生弹性动画关掉（关键）
          shadowColor: 'transparent',
        }}
      />
    </Stack>
  )
}
