import { Tabs } from 'expo-router'
import { Text, TouchableOpacity } from 'react-native'
import { SimpleLineIcons } from '@expo/vector-icons'

function TabBarIcon(props) {
  return <SimpleLineIcons size={24} {...props} />
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: 'center',
        // headerTitle: props =>
        headerLeft: () => <Text>left</Text>,
        headerRight: () => <Text>right</Text>,
        tabBarActiveTintColor: '#1f99b0',
        // andorid 水波纹问题 解决方法， expo 54+ 已经没有这个问题了 可以不用解决了
        tabBarButton: (props) => (
          <TouchableOpacity
            {...props}
            activeOpacity={1}
            style={[props.style, { backgroundColor: 'transparent' }]}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'app首页',
          tabBarIcon: ({ color }) => <TabBarIcon name="compass" color={color} />,
        }}
      />
      <Tabs.Screen
        name="videos"
        options={{
          title: '视频',
          tabBarIcon: ({ color }) => <TabBarIcon name="camrecorder" color={color} />,
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: '用户',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  )
}
