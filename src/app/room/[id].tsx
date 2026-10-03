import { Pressable, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { Card, IconBubble, ScreenHeader, Screen, SectionLabel, Toggle, Txt } from '@/components/ui';
import { Icon } from '@/components/Icon';
import { RoomId } from '@/state/data';
import { useHome } from '@/state/HomeContext';
import { colors } from '@/theme';

const SHADE_STEPS = [0, 25, 50, 75, 100];

/** Generic room view: every device appears in its room regardless of brand or protocol (FR-2). */
export default function RoomScreen() {
  const { id } = useLocalSearchParams<{ id: RoomId }>();
  const { rooms, updateRoom } = useHome();
  const room = rooms[id as RoomId] ?? rooms.bedroom;
  const rid = room.id;

  return (
    <Screen>
      <ScreenHeader title={room.name} />

      <Card style={[styles.between, { padding: 18 }]}>
        <View style={{ gap: 2 }}>
          <Txt size={13} color={colors.muted}>
            Room temperature
          </Txt>
          <Txt size={34} weight="bold" style={{ letterSpacing: -1.2 }}>
            {room.temp}°
          </Txt>
        </View>
        <View style={[styles.statusPill, { backgroundColor: room.occupied ? colors.accentSoft : colors.bg }]}>
          <View style={[styles.dot, { backgroundColor: room.occupied ? colors.accent : colors.greyLight }]} />
          <Txt size={12} weight="semibold" color={room.occupied ? colors.accentDeep : colors.muted}>
            {room.occupied ? 'Occupied' : 'Empty · eco'}
          </Txt>
        </View>
      </Card>

      <SectionLabel>LIGHTS</SectionLabel>
      <Card style={{ paddingVertical: 4 }}>
        {room.lights.map((l, i) => (
          <View key={l.id} style={[styles.row, i < room.lights.length - 1 && styles.rowBorder]}>
            <IconBubble name="bulb" size={36} bg={l.on ? colors.accentSoft : colors.bg} color={l.on ? colors.accentDeep : colors.muted} iconSize={18} />
            <View style={{ flex: 1, gap: 2 }}>
              <Txt size={14} weight="semibold">
                {l.name}
              </Txt>
              <Txt size={12} color={colors.muted}>
                {l.on ? `${l.level}% · warm white` : 'Off'}
              </Txt>
            </View>
            <Toggle
              label={`${l.name} light`}
              value={l.on}
              onChange={(on) => updateRoom(rid, (r) => ({ ...r, lights: r.lights.map((x) => (x.id === l.id ? { ...x, on } : x)) }))}
            />
          </View>
        ))}
      </Card>

      {room.shades && (
        <>
          <SectionLabel>SHADES</SectionLabel>
          <Card style={{ gap: 12 }}>
            <View style={styles.between}>
              <Txt size={14} weight="semibold">
                {room.shades.name}
              </Txt>
              <Txt size={13} color={colors.muted}>
                {room.shades.position}% open
              </Txt>
            </View>
            <View accessibilityRole="radiogroup" accessibilityLabel="Shade position" style={styles.steps}>
              {SHADE_STEPS.map((p) => {
                const on = room.shades!.position === p;
                return (
                  <Pressable
                    key={p}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: on }}
                    onPress={() => updateRoom(rid, (r) => ({ ...r, shades: { ...r.shades!, position: p } }))}
                    style={[styles.step, { backgroundColor: on ? colors.ink : colors.bg }]}
                  >
                    <Txt size={13} weight="semibold" color={on ? '#FFFFFF' : colors.ink}>
                      {p}%
                    </Txt>
                  </Pressable>
                );
              })}
            </View>
          </Card>
        </>
      )}

      {room.climate && (
        <>
          <SectionLabel>CLIMATE</SectionLabel>
          <Card style={[styles.between, { gap: 12 }]}>
            <IconBubble name="thermo" size={36} bg={colors.bg} color={colors.ink} iconSize={18} />
            <View style={{ flex: 1, gap: 2 }}>
              <Txt size={14} weight="semibold">
                {room.climate.name}
              </Txt>
              <Txt size={12} color={colors.muted}>
                Set-point {room.climate.setpoint}° {room.climate.eco ? '· eco (room empty)' : ''}
              </Txt>
            </View>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {(['minus', 'plus'] as const).map((k) => (
                <Pressable
                  key={k}
                  accessibilityRole="button"
                  accessibilityLabel={k === 'minus' ? 'Lower set-point' : 'Raise set-point'}
                  onPress={() =>
                    updateRoom(rid, (r) => ({ ...r, climate: { ...r.climate!, setpoint: Math.min(30, Math.max(16, r.climate!.setpoint + (k === 'plus' ? 1 : -1))) } }))
                  }
                  style={[styles.step, { flex: 0, width: 40, backgroundColor: k === 'plus' ? colors.ink : colors.bg }]}
                >
                  <Icon name={k} size={18} strokeWidth={2} color={k === 'plus' ? '#FFFFFF' : colors.ink} />
                </Pressable>
              ))}
            </View>
          </Card>
        </>
      )}

      {room.extras && (
        <>
          <SectionLabel>ENERGY DEVICES</SectionLabel>
          <Card style={{ paddingVertical: 4 }}>
            {room.extras.map((x, i) => (
              <View key={x.name} style={[styles.row, i < room.extras!.length - 1 && styles.rowBorder]}>
                <IconBubble name={x.icon} size={36} bg={colors.accentSoft} iconSize={18} />
                <View style={{ flex: 1, gap: 2 }}>
                  <Txt size={14} weight="semibold">
                    {x.name}
                  </Txt>
                  <Txt size={12} color={colors.muted}>
                    {x.status}
                  </Txt>
                </View>
              </View>
            ))}
          </Card>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.lineSoft },
  steps: { flexDirection: 'row', gap: 6 },
  step: { flex: 1, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
