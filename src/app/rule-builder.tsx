import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { Card, PillButton, ScreenHeader, Screen, SectionLabel, Txt } from '@/components/ui';
import { useHome } from '@/state/HomeContext';
import { colors } from '@/theme';

const TRIGGERS = ['Everyone leaves home', 'Sunset', 'It’s above 30°C outside', 'Peak tariff starts', 'Keypad button 2 pressed', 'Solar surplus over 1.5 kW'];
const ACTIONS = ['Lights off', 'Close shades', 'Climate to eco', 'Pre-cool to 21°', 'Pause EV charging', 'Run Movie night', 'Heat water'];
const TEMPLATES = [
  { name: 'Leaving home', when: 'Everyone leaves home', then: ['Lights off', 'Climate to eco', 'Close shades'] },
  { name: 'Hot afternoon', when: 'It’s above 30°C outside', then: ['Close shades', 'Pre-cool to 21°'] },
  { name: 'Use my solar', when: 'Solar surplus over 1.5 kW', then: ['Heat water'] },
];

/** No-code if/when/then builder with templates (FR-6). */
export default function RuleBuilder() {
  const { addRule, showToast } = useHome();
  const [when, setWhen] = useState<string | null>(null);
  const [then, setThen] = useState<string[]>([]);

  const toggleAction = (a: string) => setThen((t) => (t.includes(a) ? t.filter((x) => x !== a) : [...t, a]));
  const ready = !!when && then.length > 0;

  return (
    <Screen>
      <ScreenHeader title="New automation" />

      <SectionLabel>START FROM A TEMPLATE</SectionLabel>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {TEMPLATES.map((t) => (
          <Pressable
            key={t.name}
            accessibilityRole="button"
            onPress={() => {
              setWhen(t.when);
              setThen(t.then);
            }}
            style={styles.template}
          >
            <Txt size={13} weight="semibold">
              {t.name}
            </Txt>
          </Pressable>
        ))}
      </View>

      <Card style={{ gap: 12 }}>
        <Txt size={11} weight="bold" color={colors.muted} style={{ letterSpacing: 0.4 }}>
          WHEN
        </Txt>
        <Chips options={TRIGGERS} selected={when ? [when] : []} onPress={(o) => setWhen(o)} />
      </Card>

      <Card style={{ gap: 12 }}>
        <Txt size={11} weight="bold" color={colors.accentDeep} style={{ letterSpacing: 0.4 }}>
          THEN
        </Txt>
        <Chips options={ACTIONS} selected={then} onPress={toggleAction} />
      </Card>

      <Card tone="accent" style={{ gap: 4 }}>
        <Txt size={12} weight="bold" color={colors.accentDeep}>
          PREVIEW
        </Txt>
        <Txt size={14} weight="semibold" style={{ lineHeight: 20 }}>
          {ready ? `When ${when!.charAt(0).toLowerCase() + when!.slice(1)}, ${then.join(', ').toLowerCase()}.` : 'Pick a trigger and at least one action.'}
        </Txt>
        <Txt size={12} color={colors.body}>
          Runs locally on your hub, so it still works if the internet is down.
        </Txt>
      </Card>

      <PillButton
        label="Save automation"
        height={52}
        style={{ opacity: ready ? 1 : 0.4 }}
        onPress={() => {
          if (!ready) return;
          addRule({ when: when!, then: then.join(' · ').toLowerCase() });
          showToast({ title: 'Automation saved', body: 'You can switch it off any time in Scenes.' });
          router.back();
        }}
      />
    </Screen>
  );
}

function Chips({ options, selected, onPress }: { options: string[]; selected: string[]; onPress: (o: string) => void }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {options.map((o) => {
        const on = selected.includes(o);
        return (
          <Pressable
            key={o}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: on }}
            onPress={() => onPress(o)}
            style={[styles.chip, { backgroundColor: on ? colors.ink : colors.bg }]}
          >
            <Txt size={13} weight="semibold" color={on ? '#FFFFFF' : colors.ink}>
              {o}
            </Txt>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  template: { height: 40, paddingHorizontal: 16, borderRadius: 20, backgroundColor: colors.card, justifyContent: 'center', borderWidth: 1, borderColor: colors.line },
  chip: { minHeight: 36, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, justifyContent: 'center' },
});
