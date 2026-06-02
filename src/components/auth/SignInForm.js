import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useSession } from '@/utils/ctx'

const MIN_USERNAME = 2
const MIN_PASSWORD = 6

export default function SignInForm({ setSelected }) {
  const { signIn } = useSession()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!username.trim()) e.username = '请输入用户名'
    else if (username.trim().length < MIN_USERNAME) e.username = `用户名至少 ${MIN_USERNAME} 个字符`
    if (!password) e.password = '请输入密码'
    else if (password.length < MIN_PASSWORD) e.password = `密码至少 ${MIN_PASSWORD} 个字符`
    return e
  }

  const canSubmit =
    username.trim().length >= MIN_USERNAME &&
    password.length >= MIN_PASSWORD &&
    agreed &&
    !submitting

  const handleLogin = async () => {
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length > 0) return

    setSubmitting(true)
    console.log('📤 登录表单数据:', { username: username.trim(), password })
    // 模拟网络请求
    await new Promise((r) => setTimeout(r, 800))
    signIn({ username: username.trim(), password })
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.form}>
        <Text style={styles.title}>登录</Text>

        {/* 用户名 */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, errors.username && styles.inputError]}
            placeholder="用户名"
            placeholderTextColor="#999"
            value={username}
            onChangeText={(v) => {
              setUsername(v)
              setErrors((p) => ({ ...p, username: '' }))
            }}
            autoCapitalize="none"
            editable={!submitting}
          />
          {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}
        </View>

        {/* 密码 */}
        <View style={styles.inputWrapper}>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, styles.passwordInput, errors.password && styles.inputError]}
              placeholder="密码"
              placeholderTextColor="#999"
              value={password}
              onChangeText={(v) => {
                setPassword(v)
                setErrors((p) => ({ ...p, password: '' }))
              }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              editable={!submitting}
            />
            <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword((p) => !p)}>
              <MaterialCommunityIcons
                name={showPassword ? 'eye-off' : 'eye'}
                size={22}
                color="#999"
              />
            </TouchableOpacity>
          </View>
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
        </View>

        {/* 同意条款 */}
        <TouchableOpacity
          style={styles.agreement}
          onPress={() => setAgreed((p) => !p)}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name={agreed ? 'checkbox-marked' : 'checkbox-blank-outline'}
            size={22}
            color={agreed ? '#1f99b0' : '#999'}
          />
          <Text style={styles.agreementText}>
            我已阅读并同意
            <Text style={styles.agreementLink}> 服务条款 </Text>和
            <Text style={styles.agreementLink}> 隐私政策</Text>
          </Text>
        </TouchableOpacity>

        {/* 登录按钮 */}
        <TouchableOpacity
          style={[styles.button, !canSubmit && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={!canSubmit}
          activeOpacity={0.8}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>登录</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => setSelected('signUp')}
          disabled={submitting}
        >
          <Text style={styles.linkText}>还没有账号？去注册</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  form: {
    marginHorizontal: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 32,
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    height: 48,
    justifyContent: 'center',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: '#1f99b0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#b0dce6',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  agreement: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 16,
    marginBottom: 4,
  },
  agreementText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
    lineHeight: 20,
  },
  agreementLink: {
    color: '#1f99b0',
  },
  linkButton: {
    marginTop: 20,
  },
  linkText: {
    color: '#1f99b0',
    fontSize: 14,
  },
})
