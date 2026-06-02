import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

const useProfileStore = create(
  persist(
    (set) => ({
      avatarUri: null,
      nickname: '学霸',
      bio: '学而时习之，不亦说乎',
      genderId: 'secret',
      grade: '',

      setAvatarUri: (uri) => set({ avatarUri: uri }),
      setNickname: (name) => set({ nickname: name }),
      setBio: (text) => set({ bio: text }),
      setGenderId: (id) => set({ genderId: id }),
      setGrade: (g) => set({ grade: g }),

      saveProfile: (data) =>
        set({
          avatarUri: data.avatarUri ?? null,
          nickname: data.nickname ?? '学霸',
          bio: data.bio ?? '',
          genderId: data.genderId ?? 'secret',
          grade: data.grade ?? '',
        }),
    }),
    {
      name: 'profile-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)

export default useProfileStore
