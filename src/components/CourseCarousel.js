import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'

export default function CourseCarousel({ courses }) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>推荐课程</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {courses.map((course) => (
          <View key={course.id} style={styles.card}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{course.badge}</Text>
            </View>
            <Text style={styles.courseTitle}>{course.title}</Text>
            <Text style={styles.courseSubtitle}>{course.subtitle}</Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>查看详情</Text>
            </TouchableOpacity>
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
  card: {
    width: 220,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 18,
    marginRight: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginBottom: 14,
  },
  badgeText: {
    color: '#0B69FF',
    fontSize: 12,
    fontWeight: '700',
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  courseSubtitle: {
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 18,
  },
  button: {
    backgroundColor: '#0B69FF',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
})
