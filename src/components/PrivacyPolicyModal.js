import { useState, useCallback, useRef, useEffect } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
  BackHandler,
  Alert,
  Linking,
  Animated,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { MaterialCommunityIcons } from '@expo/vector-icons'

/** 隐私政策版本号，更新后老用户会再次弹窗 */
const PRIVACY_VERSION = '1.0.0'

/** 隐私政策 & 用户协议完整页面 URL（请替换为你的真实地址） */
const PRIVACY_URL = 'https://clwy.cn/privacy'
const TERMS_URL = 'https://clwy.cn/rules'

/**
 * 隐私政策弹窗组件
 *
 * 在用户首次启动或政策更新时，自动弹出全屏模态，
 * 用户必须「同意」后才能继续使用 App。
 */
export default function PrivacyPolicyModal({ onAccept, visible }) {
  const insets = useSafeAreaInsets()
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const [isAgreed, setIsAgreed] = useState(false)

  // 弹窗显示时触发入场动画
  useEffect(() => {
    if (visible) {
      setIsAgreed(false)
      fadeAnim.setValue(0)
      slideAnim.setValue(50)
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [visible, fadeAnim, slideAnim])

  /** 打开外部链接 */
  const openLink = useCallback((url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url)
      }
    })
  }, [])

  /** 用户同意 */
  const handleAgree = useCallback(() => {
    onAccept?.(PRIVACY_VERSION)
  }, [onAccept])

  /** 用户不同意 → 平台差异化处理 */
  const handleDisagree = useCallback(() => {
    if (Platform.OS === 'android') {
      // Android: 可调用 exitApp 退出
      Alert.alert(
        '提示',
        '很抱歉，您需要同意隐私政策才能使用本应用。\n点击「退出应用」将关闭应用。',
        [
          {
            text: '取消',
            style: 'cancel',
          },
          {
            text: '退出应用',
            style: 'destructive',
            onPress: () => {
              BackHandler.exitApp()
            },
          },
        ],
        { cancelable: true },
      )
    } else {
      // iOS: Apple 禁止 App 自行退出，只能提示用户必须同意
      Alert.alert(
        '提示',
        '很抱歉，您需要先同意隐私政策才能继续使用本应用。\n请勾选上方「我已阅读并同意」后点击「同意」按钮。',
        [{ text: '我知道了', style: 'default' }],
        { cancelable: true },
      )
    }
  }, [])

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={() => {
        // 阻止硬件返回键关闭（必须同意才能继续）
        handleDisagree()
      }}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              paddingTop: insets.top + 20,
              paddingBottom: insets.bottom + 20,
            },
          ]}
        >
          {/* ====== 顶部图标和标题 ====== */}
          <View style={styles.headerSection}>
            <View style={styles.shieldIconContainer}>
              <MaterialCommunityIcons name="shield-check-outline" size={36} color="#1f99b0" />
            </View>
            <Text style={styles.title}>隐私政策提示</Text>
            <Text style={styles.subtitle}>我们非常重视您的隐私保护，请仔细阅读以下条款</Text>
          </View>

          {/* ====== 协议内容 ====== */}
          <ScrollView
            style={styles.contentScroll}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <Text style={styles.contentTitle}>用户隐私政策与用户协议</Text>
            <Text style={styles.contentParagraph}>
              欢迎使用本应用。我们深知个人信息对您的重要性，并会尽全力保护您的个人信息安全可靠。请您在使用我们的服务前，仔细阅读并充分理解本隐私政策及用户协议的全部内容。
            </Text>

            <View style={styles.pointRow}>
              <View style={styles.pointDot} />
              <Text style={styles.pointText}>
                我们需要收集您的必要个人信息（如设备信息、网络信息）以提供基本服务
              </Text>
            </View>
            <View style={styles.pointRow}>
              <View style={styles.pointDot} />
              <Text style={styles.pointText}>您的学习记录、收藏等数据仅用于改善您的使用体验</Text>
            </View>
            <View style={styles.pointRow}>
              <View style={styles.pointDot} />
              <Text style={styles.pointText}>我们不会将您的个人信息用于未经您授权的其他用途</Text>
            </View>
            <View style={styles.pointRow}>
              <View style={styles.pointDot} />
              <Text style={styles.pointText}>您可以随时查看、更正或删除您的个人信息</Text>
            </View>

            <Text style={styles.contentParagraph}>
              如您同意以上条款，请点击「同意」开始使用我们的服务。
              如您不同意，请点击「不同意并退出」，我们将不会收集您的任何信息。
            </Text>

            {/* ====== 链接区域 ====== */}
            <View style={styles.linksRow}>
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => openLink(PRIVACY_URL)}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons name="file-document-outline" size={16} color="#1f99b0" />
                <Text style={styles.linkText}>查看完整隐私政策</Text>
                <MaterialCommunityIcons
                  name="open-in-new"
                  size={14}
                  color="#1f99b0"
                  style={{ marginLeft: 2 }}
                />
              </TouchableOpacity>

              <View style={styles.linkDivider} />

              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => openLink(TERMS_URL)}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons name="file-sign" size={16} color="#1f99b0" />
                <Text style={styles.linkText}>查看用户协议</Text>
                <MaterialCommunityIcons
                  name="open-in-new"
                  size={14}
                  color="#1f99b0"
                  style={{ marginLeft: 2 }}
                />
              </TouchableOpacity>
            </View>

            {/* ====== 勾选同意 ====== */}
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setIsAgreed((prev) => !prev)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, isAgreed && styles.checkboxActive]}>
                {isAgreed && <MaterialCommunityIcons name="check" size={16} color="#fff" />}
              </View>
              <Text style={styles.checkboxText}>
                我已阅读并同意
                <Text style={styles.checkboxLink} onPress={() => openLink(PRIVACY_URL)}>
                  《隐私政策》
                </Text>
                和
                <Text style={styles.checkboxLink} onPress={() => openLink(TERMS_URL)}>
                  《用户协议》
                </Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* ====== 底部按钮 ====== */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.disagreeButton}
              onPress={handleDisagree}
              activeOpacity={0.7}
            >
              <Text style={styles.disagreeButtonText}>不同意并退出</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.agreeButton, !isAgreed && styles.agreeButtonDisabled]}
              onPress={handleAgree}
              activeOpacity={0.8}
              disabled={!isAgreed}
            >
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={20}
                color="#fff"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.agreeButtonText}>同意</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  /* ====== 遮罩层 ====== */
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* ====== 弹窗容器 ====== */
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#F8FAFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 40,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 30,
        shadowOffset: { width: 0, height: -8 },
      },
      android: {
        elevation: 24,
      },
    }),
  },

  /* ====== 头部 ====== */
  headerSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
  },
  shieldIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E8F5FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },

  /* ====== 内容区 ====== */
  contentScroll: {
    flex: 1,
    paddingHorizontal: 24,
  },
  contentContainer: {
    paddingTop: 20,
    paddingBottom: 12,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  contentParagraph: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 16,
  },

  /* ====== 条款要点 ====== */
  pointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingRight: 8,
  },
  pointDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1f99b0',
    marginTop: 8,
    marginRight: 10,
    flexShrink: 0,
  },
  pointText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    flex: 1,
  },

  /* ====== 链接区域 ====== */
  linksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  linkText: {
    fontSize: 13,
    color: '#1f99b0',
    fontWeight: '500',
    marginLeft: 4,
  },
  linkDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 8,
  },

  /* ====== 勾选框 ====== */
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    flexShrink: 0,
  },
  checkboxActive: {
    backgroundColor: '#1f99b0',
    borderColor: '#1f99b0',
  },
  checkboxText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    flex: 1,
  },
  checkboxLink: {
    color: '#1f99b0',
    fontWeight: '600',
  },

  /* ====== 按钮区 ====== */
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 8 : 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E2E8F0',
    gap: 12,
  },
  disagreeButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disagreeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#94A3B8',
  },
  agreeButton: {
    flex: 1.5,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#1f99b0',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#1f99b0',
        shadowOpacity: 0.35,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 4,
      },
    }),
  },
  agreeButtonDisabled: {
    backgroundColor: '#94C5D0',
    shadowOpacity: 0,
    elevation: 0,
  },
  agreeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
})
