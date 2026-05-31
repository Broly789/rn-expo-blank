import { useCallback } from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet, TextInput, Text, View } from 'react-native'
import { Link, useNavigation, useFocusEffect } from 'expo-router'

export default function Users() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text>My Users</Text>
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
