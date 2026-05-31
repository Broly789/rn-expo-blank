import { View, TextInput, StyleSheet } from 'react-native'

export default function SearchBox({ placeholder }) {
  return (
    <View style={styles.container}>
      <TextInput placeholder={placeholder} placeholderTextColor="#9CA3AF" style={styles.input} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 22,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  input: {
    fontSize: 16,
    color: '#111827',
  },
})
