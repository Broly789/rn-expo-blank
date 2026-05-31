import { View, Text, Image, StyleSheet } from 'react-native'

export default function ArticleCard({ article }) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>教育资讯</Text>
      <View style={styles.card}>
        <Image source={{ uri: article.imageUri }} style={styles.image} />
        <View style={styles.body}>
          <Text style={styles.cardTitle}>{article.title}</Text>
          <Text style={styles.cardText}>{article.description}</Text>
        </View>
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
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 160,
  },
  body: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  cardText: {
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 20,
  },
})
