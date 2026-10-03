import { useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import Slider from '@react-native-community/slider';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { Icon } from '@/components/Icon';
import { Sheet } from '@/components/Sheet';
import { Card, IconBubble, PillButton, RoundButton, ScreenHeader, Screen, Segmented, TextLink, Toggle, Txt } from '@/components/ui';
import { AcMode } from '@/state/data';
import { useHome } from '@/state/HomeContext';
import { colors } from '@/theme';

const MIN = 16;
const MAX = 30;
const MODES: { id: AcMode; label: string }[] = [
  { id: 'cool', label: 'Cool' },
  { id: 'heat', label: 'Heat' },
  { id: 'dry', label: 'Dry' },
  { id: 'auto', label: 'Auto' },
];
const TIMERS = ['Off', '30 min', '1 h', '2 h'];

export default function AcScreen() {
  const { ac, setAc, rooms, updateRoom, showToast } = useHome();
  const [why, setWhy] = useState(false);
  const [timer, setTimer] = useState(0);
  const shadesClosed = (rooms.living.shades?.position ?? 0) <= 40;

  const b = ac.balance;
  const balanceLabel = b < 34 ? 'Comfort first' : b < 67 ? 'Balanced · ±1.5°' : 'Savings first · ±3°';
  const verb = ac.mode === 'heat' ? 'Heating to' : ac.mode === 'dry' ? 'Drying at' : ac.mode === 'auto' ? 'Holding at' : 'Cooling to';

  return (
    <Screen>
      <ScreenHeader title="Living room" action={<RoundButton icon="settingsHex" label="Device settings" />} />

      <Card style={{ borderRadius: 28, paddingTop: 20, paddingHorizontal: 18, paddingBottom: 22, gap: 18 }}>
        <View style={styles.between}>
          <View style={{ gap: 2 }}>
            <Txt size={20} weight="bold" style={{ letterSpacing: -0.3 }}>
              Air conditioner
            </Txt>
            <Txt size={13} color={colors.muted}>
              Split AC · room now 22.5°
            </Txt>
          </View>
          <Toggle label="Power" value={ac.on} onChange={(on) => setAc({ on })} width={56} />
        </View>

        <Segmented label="Mode" options={MODES} value={ac.mode} onChange={(mode) => setAc({ mode })} />

        <Dial temp={ac.temp} on={ac.on} status={ac.on ? `${verb} ${ac.temp}° · about 6 min` : 'Off'} />

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Lower temperature"
            onPress={() => setAc({ temp: Math.max(MIN, ac.temp - 1) })}
            style={[styles.stepBtn, { borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card }]}
          >
            <Icon name="minus" size={22} strokeWidth={2} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Raise temperature"
            onPress={() => setAc({ temp: Math.min(MAX, ac.temp + 1) })}
            style={[styles.stepBtn, { backgroundColor: colors.ink }]}
          >
            <Icon name="plus" size={22} strokeWidth={2} color="#FFFFFF" />
          </Pressable>
        </View>
      </Card>

      <Card style={{ padding: 18, flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
        <View style={{ flex: 1.3, gap: 8 }}>
          <Txt size={14} weight="semibold">
            Fan speed
          </Txt>
          <View accessibilityRole="radiogroup" accessibilityLabel="Fan speed" style={{ flexDirection: 'row', gap: 4 }}>
            {([1, 2, 3] as const).map((n) => {
              const on = ac.fan === n;
              return (
                <Pressable
                  key={n}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: on }}
                  onPress={() => setAc({ fan: n })}
                  style={[styles.fanBtn, { backgroundColor: on ? colors.ink : colors.bg }]}
                >
                  <Txt size={13} weight="bold" color={on ? '#FFFFFF' : colors.ink}>
                    {n}
                  </Txt>
                </Pressable>
              );
            })}
          </View>
        </View>
        <View style={{ flex: 1, gap: 8 }}>
          <Txt size={14} weight="semibold">
            Timer
          </Txt>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Timer ${TIMERS[timer]}, tap to change`}
            onPress={() => setTimer((t) => (t + 1) % TIMERS.length)}
            style={styles.timerBtn}
          >
            <Txt size={13} weight="semibold">
              {TIMERS[timer]}
            </Txt>
          </Pressable>
        </View>
        <View style={{ flex: 1, gap: 8 }}>
          <Txt size={14} weight="semibold">
            Auto eco
          </Txt>
          <Toggle label="Auto eco" value={ac.eco} onChange={(eco) => setAc({ eco })} activeColor={colors.ink} />
        </View>
      </Card>

      {shadesClosed ? (
        <Card tone="accent" style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
          <IconBubble name="shade" />
          <View style={{ flex: 1, gap: 4 }}>
            <Txt size={14} weight="bold">
              Working with your shades
            </Txt>
            <Txt size={13} color={colors.body} style={{ lineHeight: 19 }}>
              West shades closed at 13:10 to block afternoon sun, so the AC works less. Est. −18% cooling load.
            </Txt>
            <View style={{ flexDirection: 'row', gap: 14, marginTop: 4 }}>
              <TextLink
                label="Undo"
                onPress={() => {
                  const prev = rooms.living.shades!.position;
                  updateRoom('living', (r) => ({ ...r, shades: { ...r.shades!, position: 100 } }));
                  showToast({
                    title: 'West shades opened',
                    body: 'The AC may use ~0.6 kWh more this afternoon.',
                    undo: () => updateRoom('living', (r) => ({ ...r, shades: { ...r.shades!, position: prev } })),
                  });
                }}
              />
              <TextLink label="Why?" onPress={() => setWhy(true)} />
            </View>
          </View>
        </Card>
      ) : null}

      <Card style={{ padding: 18, gap: 10 }}>
        <View style={[styles.between, { alignItems: 'baseline' }]}>
          <Txt size={14} weight="semibold">
            Comfort vs. savings
          </Txt>
          <Txt size={13} color={colors.muted}>
            {balanceLabel}
          </Txt>
        </View>
        <Slider
          accessibilityLabel="Comfort versus savings"
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={ac.balance}
          onValueChange={(v) => setAc({ balance: Math.round(v) })}
          minimumTrackTintColor={colors.accent}
          maximumTrackTintColor={colors.track}
          thumbTintColor={colors.accent}
          style={{ width: '100%', height: 32 }}
        />
        <View style={styles.between}>
          <Txt size={12} color={colors.muted}>
            Max comfort
          </Txt>
          <Txt size={12} color={colors.muted}>
            Max savings
          </Txt>
        </View>
      </Card>

      <Card style={[styles.between, { paddingHorizontal: 18 }]}>
        <View style={{ gap: 2 }}>
          <Txt size={13} color={colors.muted}>
            AC today
          </Txt>
          <Txt size={18} weight="bold">
            4.2 kWh{' '}
            <Txt size={13} weight="medium" color={colors.muted}>
              · est. [$0.62]
            </Txt>
          </Txt>
        </View>
        <Pressable accessibilityRole="link" onPress={() => router.navigate('/energy')} style={styles.energyLink}>
          <Txt size={13} weight="semibold">
            Energy
          </Txt>
          <Icon name="arrowUpRight" size={14} strokeWidth={2.2} />
        </Pressable>
      </Card>

      <Sheet visible={why} onClose={() => setWhy(false)} title="Why did the shades close?">
        <Txt size={14} color={colors.body} style={{ lineHeight: 21 }}>
          At 13:10 the forecast showed 34°C and direct sun on the west façade. Your “Comfort vs. savings” setting is{' '}
          <Txt size={14} weight="bold">
            {balanceLabel.toLowerCase()}
          </Txt>
          , so HomeOne closed the west shades before peak sun to keep the living room cool with less AC.
        </Txt>
        <Card style={{ gap: 8 }}>
          <Reason icon="sun" text="Outside 34° · sun on west façade" />
          <Reason icon="thermo" text="Living room trending +1.2° per hour" />
          <Reason icon="bolt" text="Peak tariff starts 17:00" />
        </Card>
        <Txt size={12} color={colors.muted}>
          Savings are estimated from your AC’s rated power and last 30 days of usage (±15%).
        </Txt>
        <PillButton label="Got it" height={48} onPress={() => setWhy(false)} />
      </Sheet>
    </Screen>
  );
}

function Reason({ icon, text }: { icon: 'sun' | 'thermo' | 'bolt'; text: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <IconBubble name={icon} size={32} bg={colors.accentSoft} />
      <Txt size={13}>{text}</Txt>
    </View>
  );
}

/** Semicircular set-point dial from the design (16°–30°). Geometry mirrors the 314×180 artboard. */
function Dial({ temp, on, status }: { temp: number; on: boolean; status: string }) {
  const [w, setW] = useState(314);
  const frac = (temp - MIN) / (MAX - MIN);
  const ang = Math.PI - frac * Math.PI;
  const r = 108;
  const arcLen = Math.PI * r;
  const accent = on ? colors.accent : colors.greyLight;
  const scale = w / 320;
  return (
    <View
      onLayout={(e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width)}
      style={{ height: 196 * scale, alignItems: 'center' }}
      accessibilityRole="adjustable"
      accessibilityLabel={`Set-point ${temp} degrees`}
    >
      <Svg width={w} height={180 * scale} viewBox="0 0 320 180" style={{ position: 'absolute', top: 0 }}>
        <Defs>
          <LinearGradient id="tk" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#FCE3CE" />
            <Stop offset="0.5" stopColor="#F6A764" />
            <Stop offset="1" stopColor="#FCE3CE" />
          </LinearGradient>
        </Defs>
        <Path d="M30 165 A130 130 0 0 1 290 165" fill="none" stroke="url(#tk)" strokeWidth={28} strokeDasharray="1.6 3.6" opacity={on ? 1 : 0.35} />
        <Path d="M52 165 A108 108 0 0 1 268 165" fill="none" stroke="#EDEBE7" strokeWidth={5} strokeLinecap="round" />
        <Path
          d="M52 165 A108 108 0 0 1 268 165"
          fill="none"
          stroke={accent}
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={`${(frac * arcLen).toFixed(1)} ${arcLen.toFixed(1)}`}
        />
        <Circle cx={160 + r * Math.cos(ang)} cy={165 - r * Math.sin(ang)} r={9} fill="#FFFFFF" stroke={accent} strokeWidth={4} />
      </Svg>
      <View style={{ position: 'absolute', left: 0, right: 0, top: 72 * scale, alignItems: 'center', gap: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <Txt size={64} weight="bold" color={on ? colors.ink : colors.grey} style={{ letterSpacing: -3, lineHeight: 66 }}>
            {temp}
          </Txt>
          <Txt size={26} weight="bold" color={on ? colors.ink : colors.grey} style={{ marginTop: 4 }}>
            °C
          </Txt>
        </View>
        <Txt size={13} color={colors.muted}>
          {status}
        </Txt>
      </View>
      <Txt size={12} color={colors.muted} style={{ position: 'absolute', left: 14 * scale, bottom: 6 }}>
        16°
      </Txt>
      <Txt size={12} color={colors.muted} style={{ position: 'absolute', right: 14 * scale, bottom: 6 }}>
        30°
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stepBtn: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  fanBtn: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  timerBtn: { height: 32, borderRadius: 10, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  energyLink: { height: 40, paddingHorizontal: 14, borderRadius: 20, backgroundColor: colors.bg, flexDirection: 'row', alignItems: 'center', gap: 6 },
});
