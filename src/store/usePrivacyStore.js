import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

const usePrivacyStore = create(
  persist(
    (set) => ({
      /** 用户是否已同意隐私政策 */
      hasAcceptedPrivacy: false,
      /** 已同意的版本号，便于后续政策更新后再次弹窗 */
      acceptedVersion: null,

      acceptPrivacy: (version) =>
        set({
          hasAcceptedPrivacy: true,
          acceptedVersion: version,
        }),

      resetPrivacy: () =>
        set({
          hasAcceptedPrivacy: false,
          acceptedVersion: null,
        }),
    }),
    {
      name: 'privacy-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)

export default usePrivacyStore
