import { View, Text, StyleSheet } from 'react-native'

export default function QuickModuleGrid({ modules }) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>今日学习模块</Text>
      <View style={styles.grid}>
        {modules.map((item) => (
          <View key={item.id} style={[styles.card, { backgroundColor: item.bg }]}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardText}>{item.description}</Text>
          </View>
        ))}
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
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  card: {
    width: '48%',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: '#111827',
  },
  cardText: {
    color: '#4B5563',
    fontSize: 13,
    lineHeight: 20,
  },
})
