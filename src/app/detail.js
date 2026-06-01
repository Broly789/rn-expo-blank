import { StyleSheet, TextInput, Text, View } from 'react-native'
import { Link } from 'expo-router'

export default function Detail() {
  return (
    <View style={styles.container}>
      <Text>My Detail</Text>
      <Link href="/">Jump to Home</Link>
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
})
