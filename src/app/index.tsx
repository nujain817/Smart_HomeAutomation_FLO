import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient, RadialGradient, Stop, Svg, Rect, Defs } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { LogoTile } from '@/components/Logo';
import { RoundButton, Txt } from '@/components/ui';
import { colors, shadow } from '@/theme';

const CATEGORIES = ['Lighting', 'Shades', 'Climate', 'Energy'];

export default function Welcome() {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      {/* Warm glow behind the product render */}
      <View style={styles.glow} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 510 520" preserveAspectRatio="none">
        <Defs>
          <RadialGradient id="g" cx="50%" cy="60%" rx="50%" ry="50%">
            <Stop offset="0" stopColor="#F28A3C" stopOpacity={0.38} />
            <Stop offset="0.45" stopColor="#F28A3C" stopOpacity={0.12} />
            <Stop offset="0.7" stopColor="#F3F3F1" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={510} height={520} fill="url(#g)" />
      </Svg>
      </View>

      <View style={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.topRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <LogoTile size={44} />
            <Txt size={18} weight="bold" style={{ letterSpacing: -0.3 }}>
              HomeOne
            </Txt>
          </View>
          <RoundButton icon="globe" label="Language and region" />
        </View>

        <View style={{ marginTop: 36, gap: 14 }}>
          <Txt size={46} weight="bold" style={{ lineHeight: 47, letterSpacing: -1.8 }} accessibilityRole="header">
            Smarter living,{'\n'}simplified.
          </Txt>
          <Txt size={15} color={colors.muted} style={{ lineHeight: 22, maxWidth: 300 }}>
            Lights, shades, climate and energy — working together as one home, from one app.
          </Txt>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
            {CATEGORIES.map((c) => (
              <View key={c} style={styles.chip}>
                <Txt size={13} weight="semibold">
                  {c}
                </Txt>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.heroWrap}>
          <ThermostatRender />
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.replace('/home')}
          style={({ pressed }) => [styles.cta, shadow.float, pressed && { opacity: 0.85 }]}
        >
          <Txt size={17} weight="semibold">
            Get started
          </Txt>
          <View style={styles.ctaArrow}>
            <Icon name="arrowRight" size={22} color="#FFFFFF" strokeWidth={2} />
          </View>
        </Pressable>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 18 }}>
          <Txt size={14} color={colors.body}>
            Installer?{' '}
          </Txt>
          <Pressable accessibilityRole="link" onPress={() => router.push({ pathname: '/add-device', params: { mode: 'installer' } })}>
            <Txt size={14} weight="bold" style={{ textDecorationLine: 'underline' }}>
              Commission a home
            </Txt>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

/** The tilted smart-thermostat render from the welcome design, rebuilt in vector. */
function ThermostatRender() {
  return (
    <View style={styles.device}>
      <Svg style={StyleSheet.absoluteFill} viewBox="0 0 260 300" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="body" x1="0.2" y1="0" x2="0.8" y2="1">
            <Stop offset="0" stopColor="#FFFFFF" />
            <Stop offset="0.7" stopColor="#ECEBE8" />
            <Stop offset="1" stopColor="#DDDBD6" />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width={260} height={300} rx={72} fill="url(#body)" />
      </Svg>
      <View style={styles.dialHalo}>
        <View style={styles.dialRing}>
          <Svg width={136} height={136} viewBox="0 0 160 160">
            <Defs>
              <RadialGradient id="dial" cx="35%" cy="30%" r="70%">
                <Stop offset="0" stopColor="#D9D9D7" />
                <Stop offset="0.7" stopColor="#A9A9A6" />
                <Stop offset="1" stopColor="#8E8E8B" />
              </RadialGradient>
            </Defs>
            <Rect x={0} y={0} width={160} height={160} rx={80} fill="url(#dial)" />
            {[35, -80, 150].map((deg) => (
              <Rect key={deg} x={79} y={37} width={2} height={46} rx={1} fill="#F4F4F2" transform={`rotate(${deg} 80 80)`} />
            ))}
          </Svg>
        </View>
      </View>
      <View style={styles.sideButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  glow: { position: 'absolute', left: -60, right: -60, bottom: -180, height: 520 },
  content: { flex: 1, paddingHorizontal: 24 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chip: { paddingVertical: 7, paddingHorizontal: 12, borderRadius: 999, backgroundColor: colors.card },
  heroWrap: { flex: 1, minHeight: 260, alignItems: 'center', justifyContent: 'center' },
  device: {
    width: 220,
    height: 254,
    borderRadius: 62,
    transform: [{ rotate: '-10deg' }],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#141414',
    shadowOpacity: 0.14,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 30 },
    elevation: 12,
  },
  dialHalo: {
    width: 164,
    height: 164,
    borderRadius: 82,
    backgroundColor: '#F6A866',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F28A3C',
    shadowOpacity: 0.55,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  dialRing: { width: 156, height: 156, borderRadius: 78, backgroundColor: '#FBD3B0', alignItems: 'center', justifyContent: 'center', transform: [{ scale: 1 }] },
  sideButton: { position: 'absolute', right: -5, top: 100, width: 9, height: 60, borderRadius: 6, backgroundColor: '#CFCDC8' },
  cta: {
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 26,
    paddingRight: 8,
  },
  ctaArrow: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
});
