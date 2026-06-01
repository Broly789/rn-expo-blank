import { useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet, View, Text } from 'react-native'
import { Link } from 'expo-router'

export default function Users() {
  return (
    <View style={styles.container}>
      <Text>My Users</Text>
      <Link href="/">Jump to Home</Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
  },
})
