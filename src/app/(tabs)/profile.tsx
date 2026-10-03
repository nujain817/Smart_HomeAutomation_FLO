import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { Icon, IconName } from '@/components/Icon';
import { Card, IconBubble, Screen, SectionLabel, Toggle, Txt } from '@/components/ui';
import { members } from '@/state/data';
import { useHome } from '@/state/HomeContext';
import { colors } from '@/theme';

export default function ProfileScreen() {
  const { simpleMode, setSimpleMode } = useHome();
  const [occupancy, setOccupancy] = useState(true);
  return (
    <Screen withTabBar>
      <Txt size={28} weight="bold" style={{ letterSpacing: -0.8 }} accessibilityRole="header">
        Profile
      </Txt>

      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <View style={styles.avatar}>
          <Txt size={20} weight="bold" color="#FFFFFF">
            ET
          </Txt>
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Txt size={16} weight="bold">
            Emma Thompson
          </Txt>
          <Txt size={13} color={colors.muted}>
            Owner · Maple Grove House · 42 devices
          </Txt>
        </View>
      </Card>

      <SectionLabel>HOUSEHOLD & ACCESS</SectionLabel>
      <Card style={{ paddingVertical: 4 }}>
        {members.map((m, i) => (
          <View key={m.name} style={[styles.row, i < members.length - 1 && styles.rowBorder]}>
            <IconBubble name={m.role === 'Installer' ? 'wrench' : 'user'} size={36} bg={colors.bg} color={colors.ink} iconSize={18} />
            <View style={{ flex: 1, gap: 2 }}>
              <Txt size={14} weight="semibold">
                {m.name}
              </Txt>
              <Txt size={12} color={colors.muted}>
                {m.detail}
              </Txt>
            </View>
            <View style={styles.rolePill}>
              <Txt size={11} weight="bold" color={colors.accentDeep}>
                {m.role}
              </Txt>
            </View>
          </View>
        ))}
      </Card>

      <SectionLabel>HOME</SectionLabel>
      <Card style={{ paddingVertical: 4 }}>
        <LinkRow icon="qr" label="Add a device" sub="Scan QR, auto-discover or import a brand account" onPress={() => router.push('/add-device')} />
        <LinkRow icon="bolt" label="Tariff & utility" sub="Time-of-use · peak 17:00–21:00" onPress={() => router.navigate('/energy')} />
        <LinkRow icon="mic" label="Voice & ecosystems" sub="Alexa, Google Home, Siri · Matter controller" />
        <LinkRow icon="wifi" label="Hub" sub="Online · local control ready if internet drops" last />
      </Card>

      <SectionLabel>PRIVACY & ACCESSIBILITY</SectionLabel>
      <Card style={{ gap: 14 }}>
        <View style={[styles.between, { gap: 12 }]}>
          <View style={{ flex: 1, gap: 2 }}>
            <Txt size={14} weight="semibold">
              Simple mode
            </Txt>
            <Txt size={12} color={colors.muted}>
              Larger text and fewer controls for guests
            </Txt>
          </View>
          <Toggle label="Simple mode" value={simpleMode} onChange={setSimpleMode} />
        </View>
        <View style={[styles.between, { gap: 12 }]}>
          <View style={{ flex: 1, gap: 2 }}>
            <Txt size={14} weight="semibold">
              Use occupancy data
            </Txt>
            <Txt size={12} color={colors.muted}>
              Processed on your hub · required for empty-room savings
            </Txt>
          </View>
          <Toggle label="Use occupancy data" value={occupancy} onChange={setOccupancy} />
        </View>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <Icon name="shield" size={16} color={colors.green} />
          <Txt size={12} color={colors.green} weight="semibold">
            Export or delete your data any time
          </Txt>
        </View>
      </Card>

      <Pressable accessibilityRole="button" onPress={() => router.replace('/')} style={{ alignSelf: 'center', padding: 8 }}>
        <Txt size={14} weight="semibold" color={colors.muted}>
          Sign out (restart demo)
        </Txt>
      </Pressable>
    </Screen>
  );
}

function LinkRow({ icon, label, sub, onPress, last }: { icon: IconName; label: string; sub: string; onPress?: () => void; last?: boolean }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[styles.row, !last && styles.rowBorder]}>
      <IconBubble name={icon} size={36} bg={colors.bg} color={colors.ink} iconSize={18} />
      <View style={{ flex: 1, gap: 2 }}>
        <Txt size={14} weight="semibold">
          {label}
        </Txt>
        <Txt size={12} color={colors.muted}>
          {sub}
        </Txt>
      </View>
      <Icon name="chevronRight" size={16} color={colors.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.lineSoft },
  rolePill: { backgroundColor: colors.accentSoft, borderRadius: 999, paddingVertical: 4, paddingHorizontal: 8 },
});
