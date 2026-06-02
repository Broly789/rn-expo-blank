import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs'

export default function TabLayout() {
  return (
    <NativeTabs tintColor="#1f99b0" disableTransparentOnScrollEdge>
      <NativeTabs.Trigger name="index">
        <Label>首页</Label>
        <Icon sf={{ default: 'house', selected: 'house.fill' }} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="videos">
        <Label>视频</Label>
        <Icon sf={{ default: 'video', selected: 'video.fill' }} />
      </NativeTabs.Trigger>
      {/* <NativeTabs.Trigger name="vip">
        <Label>Vip会员</Label>
        <Icon sf={{ default: 'lock', selected: 'lock.fill' }} />
      </NativeTabs.Trigger> */}
      <NativeTabs.Trigger name="users">
        <Label>用户</Label>
        <Icon sf={{ default: 'person', selected: 'person.fill' }} />
      </NativeTabs.Trigger>
    </NativeTabs>
  )
}
