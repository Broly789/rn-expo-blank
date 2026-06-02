import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default function SearchBox({ placeholder, onPress }) {
  if (onPress) {
    return (
      <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
        <Ionicons name="search-outline" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
        <Text style={styles.placeholder}>{placeholder}</Text>
      </TouchableOpacity>
    )
  }

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
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },
  placeholder: {
    fontSize: 16,
    color: '#9CA3AF',
    flex: 1,
  },
})
