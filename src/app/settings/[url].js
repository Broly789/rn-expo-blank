import { useLocalSearchParams } from 'expo-router'
import ProgressWebView from '@components/ProgressWebView'

export default function DetailsWebView() {
  const { url } = useLocalSearchParams()
  return <ProgressWebView userAgent="clwy-app" source={{ uri: url }} />
}
