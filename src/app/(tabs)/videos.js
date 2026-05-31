import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet, TextInput, Text, View } from 'react-native'
import { Link, useNavigation, useFocusEffect } from 'expo-router'
import { useCallback } from 'react'

export default function Videos() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text>My Videos</Text>
        <Link href="/">Jump to Home</Link>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
