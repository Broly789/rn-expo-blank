import { useFocusEffect } from 'expo-router'
import { useCallback } from 'react'

/**
 * 初次安装 App，有可能没有给网络权限，需要重新读取
 * @param data
 * @param onReload
 */
export default function useAutoReload(data, onReload) {
  useFocusEffect(
    useCallback(() => {
      if (Object.keys(data).length === 0) {
        void onReload()
      }
    }, [data]),
  )
}
