import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useHome } from '@/state/HomeContext';
import { colors, shadow } from '@/theme';
import { Icon } from './Icon';
import { Txt } from './ui';

/** Confirmation banner: every automated action is visible and overridable (PRD · Safety & control). */
export function ToastHost() {
  const { toast, hideToast } = useHome();
  const insets = useSafeAreaInsets();
  if (!toast) return null;
  return (
    <View pointerEvents="box-none" style={[StyleSheet.absoluteFill, { justifyContent: 'flex-start', paddingTop: insets.top + 8 }]}>
      <View accessibilityLiveRegion="polite" role="status" style={[styles.toast, shadow.float]}>
        <View style={styles.icon}>
          <Icon name="check" size={16} color="#FFFFFF" strokeWidth={2.4} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Txt size={14} weight="bold" color="#FFFFFF">
            {toast.title}
          </Txt>
          {toast.body ? (
            <Txt size={12} color={colors.tooltipMuted} style={{ lineHeight: 17 }}>
              {toast.body}
            </Txt>
          ) : null}
        </View>
        {toast.undo ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              toast.undo?.();
              hideToast();
            }}
            hitSlop={8}
          >
            <Txt size={13} weight="bold" color={colors.accentLight}>
              Undo
            </Txt>
          </Pressable>
        ) : (
          <Pressable accessibilityRole="button" accessibilityLabel="Dismiss" onPress={hideToast} hitSlop={8}>
            <Icon name="close" size={16} color={colors.tooltipMuted} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    marginHorizontal: 16,
    backgroundColor: colors.ink,
    borderRadius: 20,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
});
