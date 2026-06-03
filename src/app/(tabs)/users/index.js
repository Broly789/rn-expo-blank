import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { useSession } from '@/utils/ctx'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import useProfileStore from '@/store/useProfileStore'

export default function Users() {
  const router = useRouter()
  const { session } = useSession()
  const { avatarUri, nickname, bio } = useProfileStore()
  const insets = useSafeAreaInsets()
  const isLoggedIn = !!session

  // 底部 TabBar 高度：原生 TabBar 高度 + 安全区底部
  const tabBarHeight = (Platform.OS === 'ios' ? 49 : 56) + insets.bottom

  // 未登录 → 仅显示登录页
  if (!isLoggedIn) {
    return (
      <View style={styles.loginContainer}>
        <View style={styles.loginCard}>
          <View style={styles.loginAvatarPlaceholder}>
            <MaterialCommunityIcons name="account-outline" size={48} color="#CBD5E1" />
          </View>
          <Text style={styles.loginTitle}>登录后享受完整功能</Text>
          <Text style={styles.loginDesc}>查看学习记录、管理账户、获取个性化推荐</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/author')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="login"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.loginButtonText}>立即登录</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  // 已登录 → 完整个人中心
  return (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarHeight + 16 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* ====== 个人资料头部 ====== */}
      <TouchableOpacity
        style={styles.profileSection}
        activeOpacity={0.85}
        onPress={() => router.push('/users/profile')}
      >
        <View style={styles.avatarContainer}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarCircle}>
              <MaterialCommunityIcons name="account" size={44} color="#fff" />
            </View>
          )}
          <View style={styles.editBadge}>
            <MaterialCommunityIcons name="pencil" size={12} color="#fff" />
          </View>
        </View>

        <Text style={styles.userName}>{nickname}</Text>
        <Text style={styles.userBio}>{bio || '这个人很懒，什么都没写~'}</Text>
      </TouchableOpacity>
      {/* ====== 学习统计卡片 ====== */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="book-open-variant" size={24} color="#1f99b0" />
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>学习课程</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="play-circle-outline" size={24} color="#1f99b0" />
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>观看视频</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="star-outline" size={24} color="#1f99b0" />
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>我的收藏</Text>
        </View>
      </View>

      {/* ====== 功能菜单 ====== */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>常用功能</Text>

        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() => router.push('/notifications')}
        >
          <View style={[styles.menuIconBox, { backgroundColor: '#E8F5FD' }]}>
            <MaterialCommunityIcons name="bell-outline" size={22} color="#1f99b0" />
          </View>
          <Text style={styles.menuItemText}>消息通知</Text>
          <View style={styles.menuBadge}>
            <Text style={styles.menuBadgeText}>3</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#CBD5E1" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() => router.push('/users/profile')}
        >
          <View style={[styles.menuIconBox, { backgroundColor: '#E0F2FE' }]}>
            <MaterialCommunityIcons name="account-edit-outline" size={22} color="#0284C7" />
          </View>
          <Text style={styles.menuItemText}>账户资料</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#CBD5E1" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() => router.push('/settings')}
        >
          <View style={[styles.menuIconBox, { backgroundColor: '#F0E6FF' }]}>
            <MaterialCommunityIcons name="cog-outline" size={22} color="#7C3AED" />
          </View>
          <Text style={styles.menuItemText}>系统设置</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#CBD5E1" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() => router.push('/vip')}
        >
          <View style={[styles.menuIconBox, { backgroundColor: '#FFF4E5' }]}>
            <MaterialCommunityIcons name="crown-outline" size={22} color="#F59E0B" />
          </View>
          <Text style={styles.menuItemText}>会员中心</Text>
          <View style={styles.vipBadge}>
            <Text style={styles.vipBadgeText}>开通</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#CBD5E1" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, styles.menuItemLast]}
          activeOpacity={0.7}
          onPress={() => router.push('/course')}
        >
          <View style={[styles.menuIconBox, { backgroundColor: '#FFE8E8' }]}>
            <MaterialCommunityIcons name="heart-outline" size={22} color="#EF4444" />
          </View>
          <Text style={styles.menuItemText}>我的课程</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#CBD5E1" />
        </TouchableOpacity>
      </View>

      {/* ====== 推荐内容 ====== */}
      <View style={styles.recommendSection}>
        <Text style={styles.sectionTitle}>为你推荐</Text>
        <View style={styles.recommendCard}>
          <View style={styles.recommendIconWrapper}>
            <MaterialCommunityIcons name="lightbulb-outline" size={28} color="#1f99b0" />
          </View>
          <View style={styles.recommendTextBlock}>
            <Text style={styles.recommendTitle}>AI 智能推荐</Text>
            <Text style={styles.recommendDesc}>根据你的学习记录，为你推荐最适合的课程</Text>
          </View>
          <MaterialCommunityIcons name="arrow-right" size={18} color="#1f99b0" />
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  scrollContent: {
    // paddingBottom 由 useSafeAreaInsets 动态计算
  },

  /* ====== 未登录占位 ====== */
  loginContainer: {
    flex: 1,
    backgroundColor: '#F8FAFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loginCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  loginAvatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loginTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  loginDesc: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },

  /* ====== 个人资料 ====== */
  profileSection: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 24,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1f99b0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1f99b0',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E2E8F0',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1f99b0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarCirclePlaceholder: {
    backgroundColor: '#E2E8F0',
    shadowColor: '#94A3B8',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  userBio: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 20,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f99b0',
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: '#1f99b0',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  /* ====== 统计卡片 ====== */
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },

  /* ====== 功能菜单 ====== */
  menuSection: {
    marginTop: 24,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F1F5F9',
  },
  menuItemLast: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuItemText: {
    flex: 1,
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '500',
  },
  menuBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginRight: 4,
  },
  menuBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  vipBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginRight: 4,
  },
  vipBadgeText: {
    color: '#D97706',
    fontSize: 11,
    fontWeight: '700',
  },

  /* ====== 推荐卡片 ====== */
  recommendSection: {
    marginTop: 24,
    marginHorizontal: 20,
  },
  recommendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  recommendIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#E8F5FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  recommendTextBlock: {
    flex: 1,
  },
  recommendTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  recommendDesc: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
  },
})
