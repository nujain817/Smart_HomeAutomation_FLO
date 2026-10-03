import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Sheet } from '@/components/Sheet';
import { Card, IconBubble, PillButton, RoundButton, Screen, SectionLabel, TextLink, Toggle, Txt } from '@/components/ui';
import { Notif, NotifCategory } from '@/state/data';
import { useHome } from '@/state/HomeContext';
import { colors } from '@/theme';

type Filter = 'all' | NotifCategory;
const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'energy', label: 'Energy' },
  { id: 'devices', label: 'Devices' },
  { id: 'automations', label: 'Automations' },
];

export default function AlertsScreen() {
  const { notifs, dismissNotif, showToast, updateRoom, rooms, setPeakSkipped } = useHome();
  const [filter, setFilter] = useState<Filter>('all');
  const [settings, setSettings] = useState(false);
  const [prefs, setPrefs] = useState({ quiet: true, energy: true, devices: true, automations: false });

  const keep = (n: Notif) => filter === 'all' || n.cat === filter;
  const urgent = notifs.filter((n) => n.urgent && keep(n));
  const today = notifs.filter((n) => !n.urgent && keep(n));

  const act = (n: Notif, label: string) => {
    if (label === 'Undo' && n.id === 'n4') {
      const prev = rooms.living.shades!.position;
      updateRoom('living', (r) => ({ ...r, shades: { ...r.shades!, position: 100 } }));
      dismissNotif(n.id);
      showToast({ title: 'West shades opened', undo: () => updateRoom('living', (r) => ({ ...r, shades: { ...r.shades!, position: prev } })) });
      return;
    }
    if (label === 'Override') {
      setPeakSkipped(true);
      dismissNotif(n.id);
      showToast({ title: 'Pre-cooling cancelled', body: 'The AC will follow your normal schedule today.', undo: () => setPeakSkipped(false) });
      return;
    }
    if (label === 'Snooze') {
      dismissNotif(n.id);
      showToast({ title: 'Snoozed until tomorrow 09:00' });
      return;
    }
    dismissNotif(n.id);
    showToast({ title: label === 'Update now' ? 'Keypad update started' : `${label} · opened`, body: label === 'Update now' ? 'Scenes keep working locally while it installs.' : undefined });
  };

  return (
    <Screen withTabBar>
      <View style={styles.between}>
        <Txt size={28} weight="bold" style={{ letterSpacing: -0.8 }} accessibilityRole="header">
          Notifications
        </Txt>
        <RoundButton icon="sliders" label="Notification settings" onPress={() => setSettings(true)} />
      </View>

      <View style={styles.quiet}>
        <Icon name="moon" size={18} />
        <Txt size={13} style={{ flex: 1 }}>
          <Txt size={13} weight="bold">
            Quiet hours
          </Txt>{' '}
          {prefs.quiet ? '22:00–07:00 · only urgent alerts' : 'off'}
        </Txt>
        <TextLink label="Edit" onPress={() => setSettings(true)} />
      </View>

      <View accessibilityRole="radiogroup" accessibilityLabel="Filter" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {FILTERS.map((f) => {
          const on = filter === f.id;
          return (
            <Pressable
              key={f.id}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              onPress={() => setFilter(f.id)}
              style={[styles.filter, { backgroundColor: on ? colors.ink : colors.card }]}
            >
              <Txt size={13} weight="semibold" color={on ? '#FFFFFF' : colors.ink}>
                {f.label}
              </Txt>
            </Pressable>
          );
        })}
      </View>

      {urgent.length > 0 && (
        <View style={{ gap: 10 }}>
          <SectionLabel>NEEDS ATTENTION</SectionLabel>
          {urgent.map((n) => (
            <View key={n.id} style={styles.urgent}>
              <IconBubble name={n.icon} bg={colors.accentSoft} />
              <View style={{ flex: 1, gap: 4 }}>
                <View style={[styles.between, { gap: 8, alignItems: 'flex-start' }]}>
                  <Txt size={14} weight="bold" style={{ flex: 1 }}>
                    {n.title}
                  </Txt>
                  <Txt size={12} color={colors.muted}>
                    {n.time}
                  </Txt>
                </View>
                <Txt size={13} color={colors.body} style={{ lineHeight: 19 }}>
                  {n.body}
                </Txt>
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                  <PillButton label={n.primary!} onPress={() => act(n, n.primary!)} />
                  <PillButton label="Snooze" variant="outline" onPress={() => act(n, 'Snooze')} />
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={{ gap: 10 }}>
        <SectionLabel>TODAY</SectionLabel>
        <Card style={{ paddingVertical: 4, borderRadius: 22 }}>
          {today.length === 0 ? (
            <Txt size={13} color={colors.muted} style={{ paddingVertical: 14 }}>
              Nothing else today.
            </Txt>
          ) : (
            today.map((n, i) => (
              <View key={n.id} style={[styles.item, i < today.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.lineSoft }]}>
                <IconBubble name={n.icon} size={36} bg={colors.bg} color={colors.ink} iconSize={18} />
                <View style={{ flex: 1, gap: 3 }}>
                  <View style={[styles.between, { gap: 8, alignItems: 'flex-start' }]}>
                    <Txt size={14} weight="bold" style={{ flex: 1 }}>
                      {n.title}
                    </Txt>
                    <Txt size={12} color={colors.muted}>
                      {n.time}
                    </Txt>
                  </View>
                  <Txt size={13} color={colors.body} style={{ lineHeight: 19 }}>
                    {n.body}
                  </Txt>
                  {n.action ? (
                    <View style={{ marginTop: 2, alignSelf: 'flex-start' }}>
                      <TextLink label={n.action} onPress={() => act(n, n.action!)} />
                    </View>
                  ) : null}
                </View>
              </View>
            ))
          )}
        </Card>
      </View>

      <Sheet visible={settings} onClose={() => setSettings(false)} title="Notification settings">
        <Card style={{ gap: 14 }}>
          <PrefRow label="Quiet hours 22:00–07:00" sub="Only urgent alerts overnight" value={prefs.quiet} onChange={(quiet) => setPrefs({ ...prefs, quiet })} />
          <PrefRow label="Energy & tariff" sub="Peak windows, savings, solar" value={prefs.energy} onChange={(energy) => setPrefs({ ...prefs, energy })} />
          <PrefRow label="Device health" sub="Batteries, filters, offline, firmware" value={prefs.devices} onChange={(devices) => setPrefs({ ...prefs, devices })} />
          <PrefRow label="Every automation run" sub="Off = only actions that need you" value={prefs.automations} onChange={(automations) => setPrefs({ ...prefs, automations })} />
        </Card>
        <PillButton label="Done" height={48} onPress={() => setSettings(false)} />
      </Sheet>
    </Screen>
  );
}

function PrefRow({ label, sub, value, onChange }: { label: string; sub: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={[styles.between, { gap: 12 }]}>
      <View style={{ flex: 1, gap: 2 }}>
        <Txt size={14} weight="semibold">
          {label}
        </Txt>
        <Txt size={12} color={colors.muted}>
          {sub}
        </Txt>
      </View>
      <Toggle label={label} value={value} onChange={onChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  quiet: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.card, borderRadius: 18, paddingVertical: 12, paddingHorizontal: 14 },
  filter: { height: 40, paddingHorizontal: 16, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  urgent: {
    backgroundColor: colors.card,
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    borderWidth: 1.5,
    borderColor: colors.accentOutline,
  },
  item: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', paddingVertical: 14 },
});
