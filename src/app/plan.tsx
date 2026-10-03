import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { Card, IconBubble, PillButton, ScreenHeader, Screen, SectionLabel, Toggle, Txt } from '@/components/ui';
import { IconName } from '@/components/Icon';
import { useHome } from '@/state/HomeContext';
import { colors } from '@/theme';

type Step = { id: string; time: string; icon: IconName; title: string; body: string };

const STEPS: Step[] = [
  { id: 'precool', time: '16:30', icon: 'thermo', title: 'Pre-cool living room to 21°', body: 'Uses cheaper standard-rate power before the peak.' },
  { id: 'shades', time: '16:45', icon: 'shade', title: 'Close west shades', body: 'Blocks late sun so the AC can coast through the peak.' },
  { id: 'ev', time: '17:00', icon: 'car', title: 'Hold EV charging until 21:00', body: 'EV is at 68% — it will reach 90% by 06:00.' },
  { id: 'dim', time: '17:00', icon: 'bulb', title: 'Dim non-essential lights 30%', body: 'Hallway and garden only. Living spaces unchanged.' },
  { id: 'battery', time: '17:00', icon: 'battery', title: 'Run home from battery', body: 'Battery covers ~70% of evening load before grid import.' },
];

/** Peak-tariff response plan (PRD journey 4, FR-9): every step is explained and can be switched off. */
export default function PlanScreen() {
  const { peakSkipped, setPeakSkipped, showToast } = useHome();
  const [enabled, setEnabled] = useState<Record<string, boolean>>(Object.fromEntries(STEPS.map((s) => [s.id, true])));
  const count = Object.values(enabled).filter(Boolean).length;
  const saving = (0.28 * count).toFixed(2);

  return (
    <Screen>
      <ScreenHeader title="Today's peak plan" />

      <Card tone="accent" style={{ gap: 6 }}>
        <Txt size={13} weight="bold" color={colors.accentDeep}>
          PEAK TARIFF 17:00–21:00
        </Txt>
        <Txt size={22} weight="bold" style={{ letterSpacing: -0.5 }}>
          Est. saving today [${saving}]
        </Txt>
        <Txt size={13} color={colors.body}>
          Based on your tariff, forecast (34°C) and the last 30 days of usage. Estimate ±12%.
        </Txt>
      </Card>

      <SectionLabel>WHAT WILL HAPPEN</SectionLabel>
      <Card style={{ paddingVertical: 4 }}>
        {STEPS.map((s, i) => (
          <View key={s.id} style={[styles.row, i < STEPS.length - 1 && styles.rowBorder]}>
            <View style={{ alignItems: 'center', gap: 6, width: 44 }}>
              <Txt size={12} weight="bold" color={colors.muted}>
                {s.time}
              </Txt>
              <IconBubble name={s.icon} size={34} bg={enabled[s.id] ? colors.accentSoft : colors.bg} color={enabled[s.id] ? colors.accentDeep : colors.muted} iconSize={17} />
            </View>
            <View style={{ flex: 1, gap: 2, opacity: enabled[s.id] ? 1 : 0.5 }}>
              <Txt size={14} weight="semibold">
                {s.title}
              </Txt>
              <Txt size={12} color={colors.muted} style={{ lineHeight: 17 }}>
                {s.body}
              </Txt>
            </View>
            <Toggle label={s.title} value={enabled[s.id]} onChange={(v) => setEnabled({ ...enabled, [s.id]: v })} />
          </View>
        ))}
      </Card>

      <Txt size={12} color={colors.muted}>
        Comfort limits are never breached: the living room stays between 21° and 25°. You can override any step at any time.
      </Txt>

      <PillButton
        label={peakSkipped ? 'Turn plan back on' : 'Confirm plan'}
        height={52}
        onPress={() => {
          setPeakSkipped(false);
          showToast({ title: 'Peak plan confirmed', body: `${count} actions scheduled from 16:30.` });
          router.back();
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.lineSoft },
});
