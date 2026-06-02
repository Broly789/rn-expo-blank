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

export default function SignUpForm({ setSelected }) {
  const { signUp } = useSession()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [errors, setErrors] = useState({})

  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

  const validate = () => {
    const e = {}
    if (!username.trim()) e.username = '请输入用户名'
    else if (username.trim().length < MIN_USERNAME) e.username = `用户名至少 ${MIN_USERNAME} 个字符`
    if (!email.trim()) e.email = '请输入邮箱'
    else if (!validateEmail(email.trim())) e.email = '邮箱格式不正确'
    if (!password) e.password = '请输入密码'
    else if (password.length < MIN_PASSWORD) e.password = `密码至少 ${MIN_PASSWORD} 个字符`
    if (!confirmPassword) e.confirmPassword = '请确认密码'
    else if (password !== confirmPassword) e.confirmPassword = '两次密码不一致'
    return e
  }

  const canSubmit =
    username.trim().length >= MIN_USERNAME &&
    email.trim().length > 0 &&
    password.length >= MIN_PASSWORD &&
    confirmPassword.length >= MIN_PASSWORD &&
    agreed &&
    !submitting

  const passwordMismatch =
    confirmPassword.length > 0 && password.length > 0 && password !== confirmPassword

  const handleRegister = async () => {
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length > 0) return

    setSubmitting(true)
    console.log('📤 注册表单数据:', {
      username: username.trim(),
      email: email.trim(),
      password,
      confirmPassword,
    })
    // 模拟网络请求
    await new Promise((r) => setTimeout(r, 800))
    signUp(
      {
        username: username.trim(),
        email: email.trim(),
        password,
        confirmPassword,
      },
      setSubmitting,
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.form}>
        <Text style={styles.title}>注册</Text>

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
            onBlur={() => {
              if (username.trim().length > 0 && username.trim().length < MIN_USERNAME) {
                setErrors((p) => ({ ...p, username: `用户名至少 ${MIN_USERNAME} 个字符` }))
              }
            }}
            autoCapitalize="none"
            editable={!submitting}
          />
          {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}
        </View>

        {/* 邮箱 */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="邮箱"
            placeholderTextColor="#999"
            value={email}
            onChangeText={(v) => {
              setEmail(v)
              setErrors((p) => ({ ...p, email: '' }))
            }}
            onBlur={() => {
              if (email.trim().length > 0 && !validateEmail(email.trim())) {
                setErrors((p) => ({ ...p, email: '邮箱格式不正确' }))
              }
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!submitting}
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
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
              onBlur={() => {
                if (password.length > 0 && password.length < MIN_PASSWORD) {
                  setErrors((p) => ({ ...p, password: `密码至少 ${MIN_PASSWORD} 个字符` }))
                }
              }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              textContentType="newPassword"
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

        {/* 确认密码 */}
        <View style={styles.inputWrapper}>
          <View style={styles.passwordRow}>
            <TextInput
              style={[
                styles.input,
                styles.passwordInput,
                errors.confirmPassword && styles.inputError,
              ]}
              placeholder="确认密码"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={(v) => {
                setConfirmPassword(v)
                setErrors((p) => ({ ...p, confirmPassword: '' }))
              }}
              onBlur={() => {
                if (confirmPassword.length > 0 && password !== confirmPassword) {
                  setErrors((p) => ({ ...p, confirmPassword: '两次密码不一致' }))
                }
              }}
              secureTextEntry={!showConfirm}
              autoCapitalize="none"
              editable={!submitting}
            />
            <TouchableOpacity style={styles.eyeButton} onPress={() => setShowConfirm((p) => !p)}>
              <MaterialCommunityIcons
                name={showConfirm ? 'eye-off' : 'eye'}
                size={22}
                color="#999"
              />
            </TouchableOpacity>
          </View>
          {passwordMismatch ? (
            <Text style={styles.errorText}>两次密码不一致</Text>
          ) : errors.confirmPassword ? (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          ) : null}
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

        {/* 注册按钮 */}
        <TouchableOpacity
          style={[styles.button, !canSubmit && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={!canSubmit}
          activeOpacity={0.8}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>注册</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => setSelected('signIn')}
          disabled={submitting}
        >
          <Text style={styles.linkText}>已有账号？去登录</Text>
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
