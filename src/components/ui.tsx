import { ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useHome } from '@/state/HomeContext';
import { colors, fonts, shadow } from '@/theme';
import { Icon, IconName } from './Icon';

type Weight = 'regular' | 'medium' | 'semibold' | 'bold';

type TxtProps = TextProps & {
  size?: number;
  weight?: Weight;
  color?: string;
  style?: StyleProp<TextStyle>;
};

export function Txt({ size = 14, weight = 'regular', color = colors.ink, style, ...rest }: TxtProps) {
  // Simple mode (PRD · Accessibility) bumps body copy up; display numerals stay as designed.
  const { simpleMode } = useHome();
  const fontSize = simpleMode && size < 20 ? Math.round(size * 1.15) : size;
  return <Text {...rest} style={[{ fontFamily: fonts[weight], fontSize, color }, style]} />;
}

export function Card({
  children,
  style,
  tone = 'white',
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  tone?: 'white' | 'accent' | 'green';
}) {
  const bg = tone === 'accent' ? colors.accentSoft : tone === 'green' ? colors.greenSoft : colors.card;
  return <View style={[styles.card, { backgroundColor: bg }, style]}>{children}</View>;
}

export function Toggle({
  value,
  onChange,
  label,
  activeColor = colors.accent,
  width = 52,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  label: string;
  activeColor?: string;
  width?: number;
}) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
      onPress={() => onChange(!value)}
      hitSlop={8}
      style={[styles.toggle, { width, backgroundColor: value ? activeColor : colors.track }]}
    >
      <View style={[styles.knob, { left: value ? width - 29 : 3 }]} />
    </Pressable>
  );
}

export function PillButton({
  label,
  onPress,
  variant = 'dark',
  height = 36,
  style,
}: {
  label: string;
  onPress?: () => void;
  variant?: 'dark' | 'outline' | 'outlineWarm' | 'light';
  height?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const v = {
    dark: { bg: colors.ink, fg: '#FFFFFF', border: 'transparent' },
    outline: { bg: colors.card, fg: colors.ink, border: colors.line },
    outlineWarm: { bg: 'transparent', fg: colors.ink, border: colors.accentBorder },
    light: { bg: colors.bg, fg: colors.ink, border: 'transparent' },
  }[variant];
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        { height, borderRadius: height / 2, backgroundColor: v.bg, borderColor: v.border, opacity: pressed ? 0.75 : 1 },
        style,
      ]}
    >
      <Txt size={13} weight="semibold" color={v.fg}>
        {label}
      </Txt>
    </Pressable>
  );
}

export function TextLink({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <Pressable accessibilityRole="link" onPress={onPress} hitSlop={8}>
      {({ pressed }) => (
        <Txt size={13} weight="bold" color={pressed ? colors.accentDeep : colors.ink} style={{ textDecorationLine: 'underline' }}>
          {label}
        </Txt>
      )}
    </Pressable>
  );
}

export function IconBubble({
  name,
  size = 40,
  bg = '#FFFFFF',
  color = colors.accentDeep,
  iconSize,
}: {
  name: IconName;
  size?: number;
  bg?: string;
  color?: string;
  iconSize?: number;
}) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={name} size={iconSize ?? Math.round(size / 2)} color={color} />
    </View>
  );
}

export function RoundButton({
  icon,
  label,
  onPress,
  dark,
  size = 44,
}: {
  icon: IconName;
  label: string;
  onPress?: () => void;
  dark?: boolean;
  size?: number;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.round,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: dark ? colors.ink : colors.card, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <Icon name={icon} size={20} color={dark ? '#FFFFFF' : colors.ink} strokeWidth={dark ? 2 : 1.8} />
    </Pressable>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  track = colors.bg,
  radius = 16,
  height = 40,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  label: string;
  track?: string;
  radius?: number;
  height?: number;
}) {
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={label} style={[styles.segment, { backgroundColor: track, borderRadius: radius }]}>
      {options.map((o) => {
        const on = o.id === value;
        return (
          <Pressable
            key={o.id}
            accessibilityRole="radio"
            accessibilityState={{ selected: on }}
            onPress={() => onChange(o.id)}
            style={[styles.segmentItem, { height, borderRadius: radius - 4, backgroundColor: on ? colors.card : 'transparent' }, on && shadow.soft]}
          >
            <Txt size={13} weight="semibold" color={on ? colors.ink : colors.muted}>
              {o.label}
            </Txt>
          </Pressable>
        );
      })}
    </View>
  );
}

export function ScreenHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <View style={styles.header}>
      <RoundButton icon="back" label="Back" onPress={() => (router.canGoBack() ? router.back() : router.replace('/home'))} />
      <Txt size={16} weight="bold">
        {title}
      </Txt>
      {action ?? <View style={{ width: 44 }} />}
    </View>
  );
}

/** Scrollable page with the design's 20px gutter and safe-area aware top padding. */
export function Screen({
  children,
  withTabBar,
  gap = 16,
}: {
  children: ReactNode;
  withTabBar?: boolean;
  gap?: number;
}) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{
        paddingTop: Math.max(insets.top + 12, 24),
        paddingHorizontal: 20,
        paddingBottom: withTabBar ? 120 + insets.bottom : 40 + insets.bottom,
        gap,
      }}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

export function SectionLabel({ children }: { children: string }) {
  return (
    <Txt size={12} weight="bold" color={colors.muted} style={{ letterSpacing: 0.5 }}>
      {children}
    </Txt>
  );
}

export function Row({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>{children}</View>;
}

export const styles = StyleSheet.create({
  card: { borderRadius: 24, padding: 16 },
  toggle: { height: 32, borderRadius: 16, justifyContent: 'center' },
  knob: {
    position: 'absolute',
    top: 3,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  pill: { paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  round: { alignItems: 'center', justifyContent: 'center' },
  segment: { flexDirection: 'row', padding: 4, gap: 4 },
  segmentItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.line },
});
