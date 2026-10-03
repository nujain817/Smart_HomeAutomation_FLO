import { ReactNode, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { Icon } from '@/components/Icon';
import { Sheet } from '@/components/Sheet';
import { Card, IconBubble, PillButton, RoundButton, ScreenHeader, Screen, Segmented, Txt } from '@/components/ui';
import { colors } from '@/theme';

type Period = 'day' | 'week' | 'month';

const DATA: Record<Period, { label: string; total: string; totalLabel: string; sub: string; labels: string[]; use: number[]; base: number[]; peak: [number, number] | null }> = {
  day: {
    label: 'Day', total: '12.8', totalLabel: 'Today so far', sub: 'Today · hourly',
    labels: ['6a', '8a', '10a', '12p', '2p', '4p', '6p', '8p'],
    use: [0.6, 1.1, 0.9, 1.4, 2.4, 1.5, 1.2, 1.6], base: [0.7, 1.3, 1.2, 1.8, 2.9, 2.6, 3.0, 2.0], peak: [5, 7],
  },
  week: {
    label: 'Week', total: '88.2', totalLabel: 'This week', sub: 'Last 7 days · daily',
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    use: [11.2, 12.8, 10.4, 13.1, 12.2, 14.6, 13.9], base: [13, 14, 12.5, 15, 14, 16.5, 15.8], peak: null,
  },
  month: {
    label: 'Month', total: '361.9', totalLabel: 'September', sub: 'September · weekly',
    labels: ['W1', 'W2', 'W3', 'W4', 'W5'],
    use: [78, 92, 88, 84, 20], base: [90, 104, 99, 96, 23], peak: null,
  },
};

const CATS: [string, number, string][] = [
  ['Heating & cooling', 168.4, colors.accent],
  ['EV charging', 72.1, colors.accentMid],
  ['Water heater', 46.0, colors.grey],
  ['Lighting', 38.2, colors.accentDark],
  ['Shades & other', 37.2, colors.greyLight],
];

const TONES = ['#FCE3CE', '#F9C9A0', '#F6A764', '#E9762B', '#C25A15'];

export default function EnergyScreen() {
  const [period, setPeriod] = useState<Period>('day');
  const [tariffOpen, setTariffOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const p = DATA[period];
  const totalC = CATS.reduce((a, c) => a + c[1], 0);

  return (
    <Screen withTabBar gap={14}>
      <ScreenHeader title="Energy" action={<RoundButton icon="calendar" label="Tariff settings" onPress={() => setTariffOpen(true)} />} />

      <Segmented
        label="Period"
        options={(Object.keys(DATA) as Period[]).map((k) => ({ id: k, label: DATA[k].label }))}
        value={period}
        onChange={setPeriod}
        track={colors.segment}
        radius={22}
      />

      <Card style={[styles.between, { padding: 18 }]}>
        <View style={{ gap: 4 }}>
          <Txt size={34} weight="bold" style={{ letterSpacing: -1.2, lineHeight: 36 }}>
            {p.total}{' '}
            <Txt size={18} weight="bold">
              kWh
            </Txt>
          </Txt>
          <Txt size={13} color={colors.muted}>
            {p.totalLabel} · measured
          </Txt>
        </View>
        <View style={styles.dots} aria-hidden>
          {Array.from({ length: 24 }, (_, i) => (
            <View key={i} style={[styles.dot, { backgroundColor: TONES[(i * 7 + Math.floor(i / 6) * 3) % 5] }]} />
          ))}
        </View>
      </Card>

      <UsageChart period={period} />

      <Card tone="green" style={{ flexDirection: 'row', gap: 12, alignItems: 'center', paddingHorizontal: 18 }}>
        <IconBubble name="leaf" color={colors.green} />
        <View style={{ flex: 1, gap: 2 }}>
          <Txt size={15} weight="bold" color={colors.greenDeep}>
            Automations saved 38.4 kWh
          </Txt>
          <Txt size={12} color={colors.green}>
            ≈ [$9.10] in September · estimate ±12%
          </Txt>
        </View>
      </Card>

      <Card style={{ padding: 18, gap: 12 }}>
        <View style={styles.between}>
          <Txt size={16} weight="bold">
            Energy cost
          </Txt>
          <Pressable accessibilityRole="button" accessibilityLabel="Open monthly report" onPress={() => setReportOpen(true)} style={styles.smallRound}>
            <Icon name="arrowUpRight" size={16} strokeWidth={2.2} />
          </Pressable>
        </View>
        <CostRow label="This week" value="[$20.26]" />
        <CostRow label="Month estimate" value="[$73.26]" />
        <CostRow label="Last month" value="[$59.26]" />
      </Card>

      <Card style={{ padding: 18, gap: 14 }}>
        <Txt size={16} weight="bold">
          By category
        </Txt>
        {CATS.map(([name, kwh, color]) => (
          <View key={name} style={{ gap: 6 }}>
            <View style={styles.between}>
              <Txt size={13} weight="semibold">
                {name}
              </Txt>
              <Txt size={13} color={colors.muted}>
                {kwh.toFixed(1)} kWh · {Math.round((kwh / totalC) * 100)}%
              </Txt>
            </View>
            <View style={styles.catTrack}>
              <View style={[styles.catFill, { width: `${Math.round((kwh / CATS[0][1]) * 100)}%`, backgroundColor: color }]} />
            </View>
          </View>
        ))}
        <Txt size={12} color={colors.muted}>
          Lighting and shades are estimated from device ratings (±15%).
        </Txt>
      </Card>

      <Sheet visible={tariffOpen} onClose={() => setTariffOpen(false)} title="Your tariff">
        <Txt size={13} color={colors.body}>
          Time-of-use · imported from your utility account. HomeOne shifts flexible loads out of the peak window automatically.
        </Txt>
        <Card style={{ gap: 10 }}>
          <TariffRow band="Off-peak" time="21:00–07:00" price="[$0.12]/kWh" color={colors.greenSoft} />
          <TariffRow band="Standard" time="07:00–17:00" price="[$0.22]/kWh" color={colors.bg} />
          <TariffRow band="Peak" time="17:00–21:00" price="[$0.41]/kWh" color={colors.accentSoft} />
          <TariffRow band="Solar export" time="any time" price="[$0.05]/kWh" color={colors.bg} />
        </Card>
        <PillButton label="Edit tariff manually" variant="outline" height={48} onPress={() => setTariffOpen(false)} />
      </Sheet>

      <Sheet visible={reportOpen} onClose={() => setReportOpen(false)} title="September report">
        <Txt size={13} color={colors.body}>
          You spent [$59.26] on energy — 14% less than your baseline. Heating & cooling was your largest cost.
        </Txt>
        <Card style={{ gap: 12 }}>
          <Txt size={12} weight="bold" color={colors.muted} style={{ letterSpacing: 0.5 }}>
            RECOMMENDED FOR YOU
          </Txt>
          <Rec icon="car" text="Charge the EV from 01:00 instead of 21:00 — save about [$4]/month." />
          <Rec icon="shade" text="Close west shades at 14:00 on hot days — about 1.2 kWh/day." />
          <Rec icon="water" text="Heat water from solar surplus at midday — about 18 kWh/month." />
        </Card>
        <PillButton label="Done" height={48} onPress={() => setReportOpen(false)} />
      </Sheet>
    </Screen>
  );
}

function UsageChart({ period }: { period: Period }) {
  const [w, setW] = useState(326);
  const p = DATA[period];
  const n = p.use.length;
  const maxV = Math.max(...p.base, ...p.use) * 1.12;
  const X = (i: number) => 12 + i * (302 / (n - 1));
  const Y = (v: number) => 140 - (v / maxV) * 125;
  const line = (arr: number[]) => arr.map((v, i) => (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(v).toFixed(1)).join(' ');
  const linePath = line(p.use);
  const areaPath = `${linePath} L${X(n - 1).toFixed(1)} 140 L12 140 Z`;
  let hi = 0;
  p.use.forEach((v, i) => {
    if (v > p.use[hi]) hi = i;
  });
  const hiX = X(hi);
  const hiY = Y(p.use[hi]);
  const sumU = p.use.reduce((a, b) => a + b, 0);
  const sumB = p.base.reduce((a, b) => a + b, 0);
  const pct = Math.round((1 - sumU / sumB) * 100);
  const k = w / 326;

  return (
    <Card style={{ paddingTop: 18, paddingHorizontal: 16, paddingBottom: 14, gap: 12 }}>
      <View style={[styles.between, { alignItems: 'flex-start' }]}>
        <View style={{ gap: 2 }}>
          <Txt size={16} weight="bold">
            Usage vs. your baseline
          </Txt>
          <Txt size={12} color={colors.muted}>
            {p.sub}
          </Txt>
        </View>
        <View style={styles.greenPill}>
          <Txt size={12} weight="bold" color={colors.green}>
            −{pct}% vs. baseline
          </Txt>
        </View>
      </View>
      <View onLayout={(e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width)} style={{ height: 150 * k + 20 }}>
        <Svg width={w} height={150 * k} viewBox="0 0 326 150" accessibilityLabel={`Usage versus baseline, ${pct} percent lower`}>
          <Defs>
            <LinearGradient id="ar" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#F6A764" stopOpacity={0.55} />
              <Stop offset="1" stopColor="#F6A764" stopOpacity={0.04} />
            </LinearGradient>
          </Defs>
          <Path d="M12 140H314M12 100H314M12 60H314M12 20H314" stroke="#EFEEEA" strokeWidth={1} />
          {p.peak && <Rect x={X(p.peak[0])} y={10} width={X(p.peak[1]) - X(p.peak[0])} height={130} fill={colors.accentSoft} />}
          <Path d={areaPath} fill="url(#ar)" />
          <Path d={line(p.base)} fill="none" stroke={colors.grey} strokeWidth={1.6} strokeDasharray="4 4" />
          <Path d={linePath} fill="none" stroke={colors.accent} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round" />
          <Line x1={hiX} x2={hiX} y1={hiY} y2={140} stroke={colors.accent} strokeWidth={1} strokeDasharray="2 3" />
          <Circle cx={hiX} cy={hiY} r={5} fill={colors.accent} stroke="#FFFFFF" strokeWidth={2} />
        </Svg>
        <View style={[styles.tip, { left: Math.max(0, Math.min(w - 108, hiX * k - 54)), top: Math.max(0, hiY * k - 62) }]}>
          <Txt size={11} color={colors.tooltipMuted}>
            {p.labels[hi] + (p.peak ? ' · off-peak' : '')}
          </Txt>
          <Txt size={14} weight="bold" color="#FFFFFF">
            {p.use[hi]} kWh
          </Txt>
        </View>
        <View style={styles.xLabels}>
          {p.labels.map((x) => (
            <Txt key={x} size={11} color={colors.muted}>
              {x}
            </Txt>
          ))}
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 16 }}>
        <Legend swatch={<View style={{ width: 14, height: 3, borderRadius: 2, backgroundColor: colors.accent }} />} label="Usage" />
        <Legend swatch={<View style={{ width: 14, height: 0, borderTopWidth: 2, borderStyle: 'dashed', borderColor: colors.grey }} />} label="Baseline" />
        {p.peak && (
          <Legend
            swatch={<View style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: colors.accentOutline }} />}
            label="Peak tariff"
          />
        )}
      </View>
    </Card>
  );
}

function Legend({ swatch, label }: { swatch: ReactNode; label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      {swatch}
      <Txt size={12} color={colors.body}>
        {label}
      </Txt>
    </View>
  );
}

function CostRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.between}>
      <Txt size={14} color={colors.body}>
        {label}
      </Txt>
      <Txt size={14} weight="bold">
        {value}
      </Txt>
    </View>
  );
}

function TariffRow({ band, time, price, color }: { band: string; time: string; price: string; color: string }) {
  return (
    <View style={[styles.between, { gap: 10 }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
        <View style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: color, borderWidth: 1, borderColor: colors.line }} />
        <Txt size={14} weight="semibold">
          {band}
        </Txt>
        <Txt size={13} color={colors.muted}>
          {time}
        </Txt>
      </View>
      <Txt size={14} weight="bold">
        {price}
      </Txt>
    </View>
  );
}

function Rec({ icon, text }: { icon: 'car' | 'shade' | 'water'; text: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
      <IconBubble name={icon} size={32} bg={colors.accentSoft} />
      <Txt size={13} style={{ flex: 1, lineHeight: 19 }}>
        {text}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dots: { width: 6 * 9 + 5 * 4, flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  dot: { width: 9, height: 9, borderRadius: 5 },
  greenPill: { backgroundColor: colors.greenSoft, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 999 },
  tip: { position: 'absolute', width: 108, backgroundColor: colors.ink, borderRadius: 12, paddingVertical: 8, paddingHorizontal: 10, gap: 2 },
  xLabels: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4 },
  smallRound: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  catTrack: { height: 8, borderRadius: 4, backgroundColor: colors.bg },
  catFill: { height: 8, borderRadius: 4 },
});
