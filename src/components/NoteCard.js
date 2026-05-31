import { View, Text, StyleSheet } from 'react-native'

export default function NoteCard({ note }) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>成长提醒</Text>
      <View style={styles.card}>
        <Text style={styles.noteTitle}>{note.title}</Text>
        <Text style={styles.noteText}>{note.description}</Text>
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
    backgroundColor: '#EEF2FF',
    borderRadius: 22,
    padding: 18,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: '#111827',
  },
  noteText: {
    color: '#4B5563',
    fontSize: 14,
    lineHeight: 20,
  },
})
