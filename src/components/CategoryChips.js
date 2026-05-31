import { View, Text, ScrollView, StyleSheet } from 'react-native'

export default function CategoryChips({ categories }) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>学习分类</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {categories.map((item) => (
          <View key={item.id} style={[styles.chip, { backgroundColor: item.color }]}>
            <Text style={styles.chipText}>{item.label}</Text>
          </View>
        ))}
      </ScrollView>
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
  list: {
    paddingRight: 10,
  },
  chip: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginRight: 12,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
})
