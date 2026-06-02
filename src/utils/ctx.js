import { use, createContext } from 'react'
import { useStorageState } from '@/hooks/useStorageState'
import { useRouter } from 'expo-router'
import { Alert } from 'react-native'

const AuthContext = createContext({
  signIn: () => null,
  signUp: () => null,
  signOut: () => null,
  destroyAccount: () => null,
  session: null,
  isLoading: false,
})

// 使用这个 Hook 来获取用户信息
export function useSession() {
  const value = use(AuthContext)
  if (!value) {
    throw new Error('useSession 必须包裹在 <SessionProvider /> 里')
  }
  return value
}

export function SessionProvider({ children }) {
  const router = useRouter()
  const [[isLoading, session], setSession] = useStorageState('session')

  return (
    <AuthContext.Provider
      value={{
        signIn: async (formParams, setLoading = () => {}) => {
          try {
            // 登录成功
            // const { data } = await post({ url: '/auth/sign_in', data: formParams })
            // await setSession(data.token)
            await setSession('xxx')
            setLoading(false)
            router.dismiss()
          } catch (err) {
            // 登录失败
            Alert.alert(
              '错误',
              err.errors[0],
              [
                {
                  text: 'OK',
                  onPress: () => setLoading(false),
                },
              ],
              { cancelable: false },
            )
          }
        },
        signUp: async (formParams, setLoading = () => {}) => {
          try {
            // 注册成功
            // const { data } = await post({ url: '/auth/sign_up', data: formParams })
            // await setSession(data.token)
            await setSession('xxx')
            Alert.alert('提示', '您已经注册成功。', [
              {
                text: 'OK',
                onPress: () => {
                  setLoading(false)
                  router.dismiss()
                },
              },
            ])
          } catch (err) {
            // 注册失败
            Alert.alert('错误', err.errors[0], [
              {
                text: 'OK',
                onPress: () => setLoading(false),
              },
            ])
          }
        },
        signOut: async () => {
          await setSession(null)
        },
        destroyAccount: async () => {
          // 请求 delete /auth/account 接口注销账号
          // await delete({ url: '/auth/account' })
          await setSession(null)
        },
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
