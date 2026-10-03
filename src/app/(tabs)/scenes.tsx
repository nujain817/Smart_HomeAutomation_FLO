import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { Icon } from '@/components/Icon';
import { Card, PillButton, RoundButton, Screen, Toggle, Txt } from '@/components/ui';
import { scenes } from '@/state/data';
import { useHome } from '@/state/HomeContext';
import { colors } from '@/theme';

export default function ScenesScreen() {
  const { activeScene, runScene, rules, toggleRule, addRule, suggestionDismissed, setSuggestionDismissed, showToast } = useHome();
  const activeCount = rules.filter((r) => r.on).length;

  return (
    <Screen withTabBar>
      <View style={styles.between}>
        <Txt size={28} weight="bold" style={{ letterSpacing: -0.8 }} accessibilityRole="header">
          Scenes
        </Txt>
        <RoundButton icon="plus" label="New scene" dark onPress={() => router.push('/rule-builder')} />
      </View>

      <View style={styles.grid}>
        {scenes.map((s) => {
          const on = activeScene === s.id;
          return (
            <Pressable
              key={s.id}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`${s.name}. ${s.sub}. ${on ? 'Running' : 'Tap to run'}`}
              onPress={() => runScene(s.id)}
              style={({ pressed }) => [styles.scene, { backgroundColor: on ? colors.ink : colors.card, opacity: pressed ? 0.85 : 1 }]}
            >
              <View style={styles.between}>
                <View style={[styles.sceneIcon, { backgroundColor: on ? colors.accent : colors.bg }]}>
                  <Icon name={s.icon} size={20} color={on ? '#FFFFFF' : colors.ink} />
                </View>
                <Txt size={11} weight="bold" color={on ? colors.accentLight : colors.muted} style={{ letterSpacing: 0.4 }}>
                  {on ? 'RUNNING' : 'RUN'}
                </Txt>
              </View>
              <View style={{ gap: 4 }}>
                <Txt size={16} weight="bold" color={on ? '#FFFFFF' : colors.ink}>
                  {s.name}
                </Txt>
                <Txt size={12} color={on ? colors.tooltipMuted : colors.muted} style={{ lineHeight: 17 }}>
                  {s.sub}
                </Txt>
              </View>
            </Pressable>
          );
        })}
      </View>

      {!suggestionDismissed && (
        <Card tone="accent" style={{ gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon name="sparkleOne" size={16} color={colors.accentDeep} strokeWidth={2} />
            <Txt size={12} weight="bold" color={colors.accentDeep} style={{ letterSpacing: 0.5 }}>
              SUGGESTED FROM YOUR USAGE
            </Txt>
          </View>
          <Txt size={15} weight="bold" style={{ lineHeight: 20 }}>
            Close west shades at 14:00 on days above 32°C
          </Txt>
          <Txt size={13} color={colors.body} style={{ lineHeight: 19 }}>
            Your living room AC runs hardest 14:00–17:00. Blocking direct sun first could save about 1.2 kWh a day.
          </Txt>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <PillButton
              label="Add automation"
              height={40}
              onPress={() => {
                addRule({ when: 'It’s 14:00 and above 32°C', then: 'close west shades' });
                setSuggestionDismissed(true);
                showToast({ title: 'Automation added', body: 'West shades will close at 14:00 on hot days.' });
              }}
            />
            <PillButton label="Not now" variant="outlineWarm" height={40} onPress={() => setSuggestionDismissed(true)} />
          </View>
        </Card>
      )}

      <View style={[styles.between, { alignItems: 'baseline', marginTop: 4 }]}>
        <Txt size={20} weight="bold" style={{ letterSpacing: -0.4 }}>
          Automations
        </Txt>
        <Txt size={13} color={colors.muted}>
          {activeCount} active
        </Txt>
      </View>

      <Card style={{ paddingVertical: 4 }}>
        {rules.map((r, i) => (
          <View key={r.id} style={[styles.rule, i < rules.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.lineSoft }]}>
            <View style={{ flex: 1, gap: 4 }}>
              <Txt size={11} weight="bold" color={colors.muted} style={{ letterSpacing: 0.4 }}>
                WHEN
              </Txt>
              <Txt size={14} weight="semibold" style={{ lineHeight: 19 }}>
                {r.when}
              </Txt>
              <Txt size={13} color={colors.body} style={{ lineHeight: 18 }}>
                <Txt size={13} weight="bold" color={colors.accentDeep}>
                  Then{' '}
                </Txt>
                {r.then}
              </Txt>
            </View>
            <Toggle label={`${r.when} automation`} value={r.on} onChange={() => toggleRule(r.id)} />
          </View>
        ))}
      </Card>

      <Pressable accessibilityRole="button" onPress={() => router.push('/rule-builder')} style={styles.build}>
        <Icon name="plus" size={18} strokeWidth={2} />
        <Txt size={15} weight="semibold">
          Build an automation
        </Txt>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  scene: { flexBasis: '47%', flexGrow: 1, borderRadius: 24, padding: 16, minHeight: 150, justifyContent: 'space-between', gap: 12 },
  sceneIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  rule: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  build: {
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.greyLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
