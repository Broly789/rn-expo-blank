import { useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
  Pressable,
} from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import RadioGroup from 'react-native-radio-buttons-group'
import * as ImagePicker from 'expo-image-picker'
import useProfileStore from '@/store/useProfileStore'

const genderOptions = [
  { id: 'male', label: '男', value: 'male' },
  { id: 'female', label: '女', value: 'female' },
  { id: 'secret', label: '保密', value: 'secret' },
]

export default function ProfileEdit() {
  const router = useRouter()
  const store = useProfileStore()
  const [nickname, setNickname] = useState(store.nickname)
  const [bio, setBio] = useState(store.bio)
  const [genderId, setGenderId] = useState(store.genderId)
  const [grade, setGrade] = useState(store.grade)
  const [saving, setSaving] = useState(false)
  const [avatarUri, setAvatarUri] = useState(store.avatarUri)
  const [showPickerModal, setShowPickerModal] = useState(false)

  // 从相册选取
  const pickFromLibrary = async () => {
    setShowPickerModal(false)
    // 请求相册权限（iOS 需要，Android 自动）
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!granted) {
      Alert.alert('权限不足', '需要相册访问权限才能更换头像')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })
    if (!result.canceled && result.assets?.length > 0) {
      setAvatarUri(result.assets[0].uri)
    }
  }

  // 拍照
  const takePhoto = async () => {
    setShowPickerModal(false)
    const { granted } = await ImagePicker.requestCameraPermissionsAsync()
    if (!granted) {
      Alert.alert('权限不足', '需要相机权限才能拍照')
      return
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })
    if (!result.canceled && result.assets?.length > 0) {
      setAvatarUri(result.assets[0].uri)
    }
  }

  const handleSave = () => {
    if (!nickname.trim()) {
      Alert.alert('提示', '昵称不能为空')
      return
    }
    setSaving(true)
    // 保存到 zustand 持久化存储
    setTimeout(() => {
      store.saveProfile({ avatarUri, nickname, bio, genderId, grade })
      setSaving(false)
      Alert.alert('成功', '资料已更新', [{ text: '好的', onPress: () => router.back() }])
    }, 800)
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ====== 头像编辑 ====== */}
          <View style={styles.avatarSection}>
            <TouchableOpacity
              style={styles.avatarWrapper}
              activeOpacity={0.8}
              onPress={() => setShowPickerModal(true)}
            >
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarCircle}>
                  <MaterialCommunityIcons name="account" size={52} color="#fff" />
                </View>
              )}
              <View style={styles.cameraButton}>
                <MaterialCommunityIcons name="camera" size={16} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text style={styles.avatarHint}>点击更换头像</Text>
          </View>

          {/* ====== 表单卡片 ====== */}
          <View style={styles.formCard}>
            {/* 昵称 */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                <MaterialCommunityIcons name="account-outline" size={16} color="#1f99b0" />
                {'  '}昵称
              </Text>
              <TextInput
                style={styles.textInput}
                value={nickname}
                onChangeText={setNickname}
                placeholder="请输入昵称"
                placeholderTextColor="#CBD5E1"
                maxLength={20}
              />
            </View>

            <View style={styles.divider} />

            {/* 个人简介 */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                <MaterialCommunityIcons name="text-short" size={16} color="#1f99b0" />
                {'  '}个人简介
              </Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={bio}
                onChangeText={setBio}
                placeholder="介绍一下自己吧"
                placeholderTextColor="#CBD5E1"
                multiline
                numberOfLines={3}
                maxLength={100}
              />
              <Text style={styles.charCount}>{bio.length}/100</Text>
            </View>

            <View style={styles.divider} />

            {/* 性别 */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                <MaterialCommunityIcons
                  name={
                    genderId === 'male'
                      ? 'gender-male'
                      : genderId === 'female'
                        ? 'gender-female'
                        : 'gender-transgender'
                  }
                  size={16}
                  color="#1f99b0"
                />
                {'  '}性别
              </Text>
              <RadioGroup
                radioButtons={genderOptions}
                selectedId={genderId}
                onPress={setGenderId}
                layout="row"
                containerStyle={styles.radioContainer}
                labelStyle={styles.radioLabel}
              />
            </View>

            <View style={styles.divider} />

            {/* 年级 */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                <MaterialCommunityIcons name="school-outline" size={16} color="#1f99b0" />
                {'  '}年级 / 身份
              </Text>
              <TextInput
                style={styles.textInput}
                value={grade}
                onChangeText={setGrade}
                placeholder="如：初中一年级 / 编程爱好者"
                placeholderTextColor="#CBD5E1"
                maxLength={30}
              />
            </View>
          </View>

          {/* ====== 提示文字 ====== */}
          <View style={styles.tipRow}>
            <MaterialCommunityIcons name="information-outline" size={16} color="#94A3B8" />
            <Text style={styles.tipText}>完善资料有助于为你推荐更合适的课程</Text>
          </View>

          {/* ====== 保存按钮 ====== */}
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            activeOpacity={0.8}
            disabled={saving}
          >
            {saving ? (
              <MaterialCommunityIcons name="loading" size={20} color="#fff" />
            ) : (
              <MaterialCommunityIcons name="check-circle-outline" size={20} color="#fff" />
            )}
            <Text style={styles.saveButtonText}>{saving ? '保存中...' : '保存资料'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ====== 选择头像方式弹窗 ====== */}
      <Modal
        visible={showPickerModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPickerModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowPickerModal(false)}>
          <Pressable style={styles.modalSheet}>
            <Text style={styles.modalTitle}>更换头像</Text>

            <TouchableOpacity style={styles.modalOption} onPress={takePhoto} activeOpacity={0.7}>
              <View style={[styles.modalIconBox, { backgroundColor: '#E8F5FD' }]}>
                <MaterialCommunityIcons name="camera" size={22} color="#1f99b0" />
              </View>
              <Text style={styles.modalOptionText}>拍照</Text>
            </TouchableOpacity>

            <View style={styles.modalDivider} />

            <TouchableOpacity
              style={styles.modalOption}
              onPress={pickFromLibrary}
              activeOpacity={0.7}
            >
              <View style={[styles.modalIconBox, { backgroundColor: '#F0E6FF' }]}>
                <MaterialCommunityIcons name="image-outline" size={22} color="#7C3AED" />
              </View>
              <Text style={styles.modalOptionText}>从相册选择</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowPickerModal(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.modalCancelText}>取消</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 50,
  },

  /* ====== 头像 ====== */
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 8,
  },
  avatarImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#E2E8F0',
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#1f99b0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1f99b0',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: -2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#64748B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#F8FAFF',
  },
  avatarHint: {
    fontSize: 12,
    color: '#94A3B8',
  },

  /* ====== 表单卡片 ====== */
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  fieldGroup: {
    paddingVertical: 14,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  textArea: {
    minHeight: 72,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  charCount: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'right',
    marginTop: 4,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#F1F5F9',
  },

  /* ====== Radio Group ====== */
  radioContainer: {
    justifyContent: 'flex-start',
    gap: 4,
  },
  radioLabel: {
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '500',
  },

  /* ====== 提示 ====== */
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  tipText: {
    fontSize: 12,
    color: '#94A3B8',
    marginLeft: 6,
    flex: 1,
  },

  /* ====== 保存按钮 ====== */
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1f99b0',
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#1f99b0',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },

  /* ====== 头像选择弹窗 ====== */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  modalIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  modalOptionText: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  modalDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#F1F5F9',
  },
  modalCancel: {
    marginTop: 20,
    paddingVertical: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '600',
  },
})
