import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { SimpleLineIcons } from '@expo/vector-icons'

export default function NetworkError({
  message = '抱歉，网络连接出错了！',
  iconSize = 100,
  iconColor = '#ddd',
  onReload = () => {},
}) {
  return (
    <View style={styles.container}>
      <SimpleLineIcons name="drawer" size={iconSize} color={iconColor} />
      <Text style={styles.error}>{message}</Text>
      <TouchableOpacity style={styles.reload} onPress={onReload}>
        <Text style={styles.label}>重新加载</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: '#999',
  },
  reload: {
    marginTop: 10,
    backgroundColor: '#1f99b0',
    height: 40,
    borderRadius: 4,
    paddingLeft: 10,
    paddingRight: 10,
  },
  label: {
    color: '#fff',
    lineHeight: 40,
  },
})
