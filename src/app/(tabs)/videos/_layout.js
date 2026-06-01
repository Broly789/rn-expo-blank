import { Stack } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { StyleSheet, Image } from 'react-native'

function TabBarIcon(props) {
  return (
    <TouchableOpacity style={{ backgroundColor: 'transparent', marginLeft: 6 }}>
      <AntDesign size={24} {...props} />
    </TouchableOpacity>
  )
}
function LogoTitle() {
  return (
    <Image style={styles.image} source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} />
  )
}
export default function VideosStack() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1f99b0',
        },
        headerTintColor: '#fff',
        headerTitleStyle: { fontSize: 18, fontWeight: 'bold' },
        headerTitleAlign: 'center',
        headerRight: () => TabBarIcon({ name: 'plus', color: '#1f99b0' }),

        headerLeft: () => <TabBarIcon name="alipay-circle" color="#1f99b0" />,
        // 外层也给固定高度，统一渲染基准
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: '视频',
          headerTitle: (props) => <LogoTitle {...props} />,
        }}
      />
    </Stack>
  )
}

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
    borderRadius: '100%',
  },
})
