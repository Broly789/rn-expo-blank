import React, { useState } from 'react'
import { Button, View, Text } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function StorageDebugger() {
  const [data, setData] = useState('')

  const dumpAsyncStorage = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys()
      const result = await AsyncStorage.multiGet(keys)
      // 将数组转换为易读的 JSON 字符串
      const formattedData = JSON.stringify(Object.fromEntries(result), null, 2)
      setData(formattedData)
      console.log('📦 AsyncStorage 内容:', formattedData)
    } catch (e) {
      console.error('读取 AsyncStorage 失败:', e)
    }
  }

  return (
    <View style={{ padding: 20, marginTop: 50 }}>
      <Button title="查看 AsyncStorage" onPress={dumpAsyncStorage} />
      {data ? <Text style={{ marginTop: 20 }}>{data}</Text> : null}
    </View>
  )
}
