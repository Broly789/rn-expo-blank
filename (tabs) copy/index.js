import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet, TouchableOpacity, TextInput, Text, View, Image } from 'react-native'
import { Link } from 'expo-router'
import Icon from '@assets/icon.png'
import useFetchData from '@hooks/useFetchData'

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text>My App</Text>
        <Link href="/detail" asChild>
          <TouchableOpacity>
            <Text>Jump to Detail</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/teachers/123" asChild>
          <TouchableOpacity>
            <Text>Jump to Teacher</Text>
          </TouchableOpacity>
        </Link>
        <Image source={Icon} style={{ width: 100, height: 100 }} />
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
