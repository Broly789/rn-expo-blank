import React from 'react'
import { useRouter } from 'expo-router'
import { Cell as DefaultCell } from 'clwy-react-native-tableview-simple'

export function Cell(props) {
  const { uri, onPress, ...rest } = props
  const router = useRouter()
  const baseUrl = 'https://clwy.cn'

  const navigateToDetail = () => {
    if (!uri) return

    router.push({
      pathname: '/settings/[uri]',
      params: {
        title: rest?.title,
        uri: `${baseUrl}/${uri}`,
      },
    })
  }

  return (
    <DefaultCell
      accessory="DisclosureIndicator"
      titleTextStyle={{ textAlign: 'left', fontSize: 17 }}
      titleTextColor="#67c1b5"
      contentContainerStyle={{ height: 55 }}
      backgroundColor="#fff"
      onPress={onPress || navigateToDetail}
      {...rest}
    />
  )
}

export default Cell
