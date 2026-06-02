import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { useSession } from '@/utils/ctx'

export default function Users() {
  const router = useRouter()
  const { session } = useSession()

  return (
    <View style={styles.container}>
      <Text style={styles.text}>My Users</Text>
      {
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push('/author')}
          activeOpacity={0.8}
        >
          <Text style={styles.loginButtonText}>登录</Text>
        </TouchableOpacity>
      }
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
  text: {
    fontSize: 18,
    color: '#333',
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: '#1f99b0',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
