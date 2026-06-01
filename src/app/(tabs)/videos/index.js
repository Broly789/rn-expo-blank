import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet, Text } from 'react-native'
import { Link } from 'expo-router'

export default function Videos() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text>My Videos</Text>
        <Link href="/detail">Jump to Detail</Link>
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
