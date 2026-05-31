import { StyleSheet, ActivityIndicator } from 'react-native'

const Loading = () => {
  return <ActivityIndicator style={styles.loading} size="large" />
}

const styles = StyleSheet.create({
  loading: {
    backgroundColor: '#fff',
    // position: 'absolute',
    // top: 0,
    // bottom: 0,
    // left: 0,
    // right: 0,
    // zIndex: 1,
  },
})
export default Loading
