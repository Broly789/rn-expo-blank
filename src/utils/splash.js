import { useEffect, useRef } from 'react'
import { SplashScreen } from 'expo-router'
import { useSession } from '@/utils/ctx'

SplashScreen.preventAutoHideAsync()

export function SplashScreenController() {
  const { isLoading } = useSession()
  const hiddenRef = useRef(false)

  useEffect(() => {
    if (!isLoading && !hiddenRef.current) {
      hiddenRef.current = true
      SplashScreen.hide()
    }
  }, [isLoading])

  return null
}
