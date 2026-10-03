import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { Icon } from '@/components/Icon';
import { LogoTile } from '@/components/Logo';
import { Card, IconBubble, PillButton, Screen, Txt } from '@/components/ui';
import { RoomId, scenes } from '@/state/data';
import { useHome } from '@/state/HomeContext';
import { colors } from '@/theme';

function today() {
  const d = new Date();
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }).replace(/^(\w+) /, '$1, ');
}

export default function HomeScreen() {
  const { activeScene, runScene, rooms, ac, notifs, peakSkipped, setPeakSkipped, showToast } = useHome();
  const urgent = notifs.filter((n) => n.urgent).length;

  const roomSummary = (id: RoomId) => {
    const r = rooms[id];
    const lightsOn = r.lights.filter((l) => l.on).length;
    const lights = lightsOn ? `${lightsOn} light${lightsOn > 1 ? 's' : ''}` : 'lights off';
    if (id === 'living') {
      const acText = ac.on ? `AC ${ac.mode === 'cool' ? 'cooling' : ac.mode}` : 'AC off';
      return `${acText} · ${lights} · Shades ${r.shades?.position ?? 0}%`;
    }
    if (id === 'bedroom') return `${r.occupied ? 'Occupied' : 'Empty'} · ${lights} · eco`;
    if (id === 'kitchen') return `${lightsOn ? `${lightsOn} lights on` : 'lights off'} · dishwasher at 21:30`;
    return '68% · charging after peak';
  };

  return (
    <Screen withTabBar>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="Switch home" style={styles.homePicker}>
          <LogoTile size={32} />
          <Txt size={14} weight="semibold">
            [Home name]
          </Txt>
          <Icon name="chevronDown" size={14} strokeWidth={2} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Notifications, ${urgent} need attention`}
          onPress={() => router.navigate('/alerts')}
          style={styles.roundWhite}
        >
          <Icon name="bell" size={20} />
          {urgent > 0 && <View style={styles.badgeDot} />}
        </Pressable>
      </View>

      <View style={{ gap: 4, marginTop: 4 }}>
        <Txt size={14} color={colors.muted}>
          {today()}
        </Txt>
        <Txt size={30} weight="bold" style={{ letterSpacing: -0.8, lineHeight: 35 }} accessibilityRole="header">
          Good morning, [Name]
        </Txt>
      </View>

      <Card style={styles.climateRow}>
        <Stat label="Inside" value={`${rooms.living.temp + 0.5}°`} note="Comfortable" noteColor={colors.green} />
        <Stat label="Outside" value="34°" note="Sunny, hot" divider />
        <Stat label="Humidity" value="48%" note="Indoor" divider />
      </Card>

      {!peakSkipped ? (
        <Card tone="accent" style={{ gap: 10 }}>
          <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
            <IconBubble name="bolt" />
            <View style={{ flex: 1, gap: 3 }}>
              <Txt size={15} weight="bold">
                Peak tariff 17:00–21:00
              </Txt>
              <Txt size={13} color={colors.body} style={{ lineHeight: 19 }}>
                We'll pre-cool at 16:30 and hold EV charging until 21:00. Est. saving today: [$1.40].
              </Txt>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 8, paddingLeft: 52 }}>
            <PillButton label="See plan" onPress={() => router.push('/plan')} />
            <PillButton
              label="Skip today"
              variant="outlineWarm"
              onPress={() => {
                setPeakSkipped(true);
                showToast({ title: 'Peak plan skipped for today', body: 'Pre-cooling and EV hold are off until tomorrow.', undo: () => setPeakSkipped(false) });
              }}
            />
          </View>
        </Card>
      ) : null}

      <Card style={{ paddingVertical: 18, gap: 14 }}>
        <View style={styles.between}>
          <Txt size={16} weight="bold">
            Live energy
          </Txt>
          <View style={styles.greenPill}>
            <Txt size={12} weight="semibold" color={colors.green}>
              Exporting 0.4 kW
            </Txt>
          </View>
        </View>
        <View style={styles.flowRow}>
          <FlowNode icon="sun" value="3.2 kW" label="Solar" bg={colors.accentSoft} fg={colors.accentDeep} />
          <FlowArrow color={colors.accent} />
          <FlowNode icon="home" value="2.1 kW" label="Home" bg={colors.ink} fg="#FFFFFF" big />
          <FlowArrow color={colors.green} />
          <FlowNode icon="pylon" value="0.4 kW" label="To grid" bg={colors.bg} fg={colors.ink} />
        </View>
        <View style={styles.batteryRow}>
          <Icon name="battery" size={22} />
          <View style={{ flex: 1, gap: 6 }}>
            <View style={styles.between}>
              <Txt size={13} weight="semibold">
                Battery 76%
              </Txt>
              <Txt size={13} color={colors.muted}>
                Charging +0.7 kW
              </Txt>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: '76%' }]} />
            </View>
          </View>
        </View>
      </Card>

      <View style={{ gap: 10 }}>
        <View style={[styles.between, { alignItems: 'baseline' }]}>
          <Txt size={17} weight="bold">
            Scenes
          </Txt>
          <Pressable accessibilityRole="link" onPress={() => router.navigate('/scenes')} hitSlop={8}>
            <Txt size={14} weight="semibold" style={{ textDecorationLine: 'underline' }}>
              View all
            </Txt>
          </Pressable>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {scenes.slice(0, 3).map((s) => {
            const on = activeScene === s.id;
            return (
              <Pressable
                key={s.id}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                onPress={() => runScene(s.id)}
                style={[styles.sceneChip, { backgroundColor: on ? colors.ink : colors.card }]}
              >
                {on && <View style={styles.sceneDot} />}
                <Txt size={14} weight="semibold" color={on ? '#FFFFFF' : colors.ink}>
                  {s.name}
                </Txt>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={{ gap: 10 }}>
        <Txt size={17} weight="bold">
          Rooms
        </Txt>
        <View style={styles.grid}>
          {(Object.keys(rooms) as RoomId[]).map((id) => {
            const r = rooms[id];
            const active = id === 'living' && ac.on;
            return (
              <Pressable
                key={id}
                accessibilityRole="button"
                onPress={() => (id === 'living' ? router.push('/device/ac') : router.push({ pathname: '/room/[id]', params: { id } }))}
                style={({ pressed }) => [styles.roomCard, pressed && { opacity: 0.8 }]}
              >
                <View style={styles.between}>
                  <Txt size={15} weight="bold">
                    {r.name}
                  </Txt>
                  {active && <View style={styles.activeDot} />}
                </View>
                <Txt size={26} weight="bold" style={{ letterSpacing: -0.5 }}>
                  {id === 'garage' ? 'EV' : id === 'living' ? `${ac.on ? ac.temp : r.temp}°` : `${r.temp}°`}
                </Txt>
                <Txt size={12} color={colors.muted}>
                  {roomSummary(id)}
                </Txt>
              </Pressable>
            );
          })}
        </View>
      </View>
    </Screen>
  );
}

function Stat({ label, value, note, noteColor = colors.muted, divider }: { label: string; value: string; note: string; noteColor?: string; divider?: boolean }) {
  return (
    <View style={[{ flex: 1, gap: 2 }, divider && { borderLeftWidth: 1, borderLeftColor: colors.line, paddingLeft: 12 }]}>
      <Txt size={12} color={colors.muted}>
        {label}
      </Txt>
      <Txt size={22} weight="bold">
        {value}
      </Txt>
      <Txt size={12} color={noteColor} weight={noteColor === colors.muted ? 'regular' : 'semibold'}>
        {note}
      </Txt>
    </View>
  );
}

function FlowNode({ icon, value, label, bg, fg, big }: { icon: 'sun' | 'home' | 'pylon'; value: string; label: string; bg: string; fg: string; big?: boolean }) {
  const s = big ? 60 : 48;
  return (
    <View style={{ flex: 1, alignItems: 'center', gap: 6 }}>
      <View style={{ width: s, height: s, borderRadius: s / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={big ? 26 : 22} color={fg} />
      </View>
      <Txt size={15} weight="bold">
        {value}
      </Txt>
      <Txt size={12} color={colors.muted}>
        {label}
      </Txt>
    </View>
  );
}

function FlowArrow({ color }: { color: string }) {
  return (
    <View style={{ width: 28, marginTop: -40 }}>
      <Icon name="arrowRight" size={26} color={color} strokeWidth={2} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  homePicker: {
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.card,
    paddingLeft: 6,
    paddingRight: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roundWhite: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  badgeDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  climateRow: { flexDirection: 'row', gap: 8 },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greenPill: { backgroundColor: colors.greenSoft, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 999 },
  flowRow: { flexDirection: 'row', alignItems: 'center' },
  batteryRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.bg, borderRadius: 16, paddingVertical: 12, paddingHorizontal: 14 },
  barTrack: { height: 6, borderRadius: 3, backgroundColor: '#E2E1DD' },
  barFill: { height: 6, borderRadius: 3, backgroundColor: colors.accent },
  sceneChip: { height: 44, paddingHorizontal: 16, borderRadius: 22, flexDirection: 'row', alignItems: 'center', gap: 8 },
  sceneDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accentLight },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  roomCard: { flexBasis: '47%', flexGrow: 1, backgroundColor: colors.card, borderRadius: 22, padding: 16, gap: 10 },
  activeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent },
});
