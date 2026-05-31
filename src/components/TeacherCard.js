import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

export default function TeacherCard({ teacher }) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>名师推荐</Text>
      <View style={styles.card}>
        <View style={styles.info}>
          <Text style={styles.name}>{teacher.name}</Text>
          <Text style={styles.role}>{teacher.role}</Text>
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>{teacher.actionText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  info: {
    flex: 1,
    paddingRight: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  role: {
    color: '#6B7280',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#0B69FF',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
})
