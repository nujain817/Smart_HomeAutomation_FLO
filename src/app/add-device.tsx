import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { Icon, IconName } from '@/components/Icon';
import { Card, IconBubble, PillButton, ScreenHeader, Screen, SectionLabel, Txt } from '@/components/ui';
import { useHome } from '@/state/HomeContext';
import { colors } from '@/theme';

type Found = { id: string; icon: IconName; name: string; brand: string; protocol: string; room: string };

const FOUND: Found[] = [
  { id: 'd1', icon: 'bulb', name: 'Hallway lights', brand: '[Lighting brand]', protocol: 'Matter / Thread', room: 'Hallway' },
  { id: 'd2', icon: 'shade', name: 'Office blind', brand: '[Shades brand]', protocol: 'Zigbee', room: 'Office' },
  { id: 'd3', icon: 'thermo', name: 'Office radiator valve', brand: '[HVAC brand]', protocol: 'Wi-Fi', room: 'Office' },
  { id: 'd4', icon: 'sun', name: 'Solar inverter', brand: '[Inverter brand]', protocol: 'Cloud API', room: 'Utility' },
];

const BRANDS = ['[Lighting brand]', '[HVAC brand]', '[EV charger brand]', '[Inverter brand]'];

/** Guided setup: QR / auto-discovery and brand-account import (FR-4). Installer mode adds handover (journey 9). */
export default function AddDevice() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const installer = mode === 'installer';
  const { showToast } = useHome();
  const [scanning, setScanning] = useState(true);
  const [picked, setPicked] = useState<string[]>([]);

  useEffect(() => {
    const t = setTimeout(() => {
      setScanning(false);
      setPicked(FOUND.map((f) => f.id));
    }, 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <Screen>
      <ScreenHeader title={installer ? 'Commission a home' : 'Add devices'} />

      {installer && (
        <Card tone="accent" style={{ gap: 4 }}>
          <Txt size={12} weight="bold" color={colors.accentDeep}>
            INSTALLER MODE
          </Txt>
          <Txt size={13} color={colors.body} style={{ lineHeight: 19 }}>
            Commission every product here, apply a scene package, then hand the home over to the owner’s account.
          </Txt>
        </Card>
      )}

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Option icon="qr" title="Scan QR code" sub="Matter or product label" />
        <Option icon="users" title="Import account" sub="Bring in a brand app" />
      </View>

      <View style={[styles.between, { marginTop: 4 }]}>
        <SectionLabel>{scanning ? 'SEARCHING YOUR NETWORK…' : `FOUND ${FOUND.length} DEVICES`}</SectionLabel>
        {scanning && <ActivityIndicator color={colors.accent} />}
      </View>

      <Card style={{ paddingVertical: 4 }}>
        {scanning ? (
          <Txt size={13} color={colors.muted} style={{ paddingVertical: 16 }}>
            Looking for Matter, Thread, Zigbee and Wi-Fi devices near your hub.
          </Txt>
        ) : (
          FOUND.map((f, i) => {
            const on = picked.includes(f.id);
            return (
              <Pressable
                key={f.id}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: on }}
                onPress={() => setPicked((p) => (on ? p.filter((x) => x !== f.id) : [...p, f.id]))}
                style={[styles.row, i < FOUND.length - 1 && styles.rowBorder]}
              >
                <IconBubble name={f.icon} size={36} bg={colors.accentSoft} iconSize={18} />
                <View style={{ flex: 1, gap: 2 }}>
                  <Txt size={14} weight="semibold">
                    {f.name}
                  </Txt>
                  <Txt size={12} color={colors.muted}>
                    {f.brand} · {f.protocol} · {f.room}
                  </Txt>
                </View>
                <View style={[styles.check, on && { backgroundColor: colors.ink, borderColor: colors.ink }]}>
                  {on && <Icon name="check" size={14} color="#FFFFFF" strokeWidth={2.6} />}
                </View>
              </Pressable>
            );
          })
        )}
      </Card>

      <SectionLabel>OR CONNECT A BRAND ACCOUNT</SectionLabel>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {BRANDS.map((b) => (
          <Pressable key={b} accessibilityRole="button" style={styles.brand} onPress={() => showToast({ title: `${b} linked`, body: '3 devices imported into their rooms.' })}>
            <Txt size={13} weight="semibold">
              {b}
            </Txt>
          </Pressable>
        ))}
      </View>

      <PillButton
        label={installer ? `Commission ${picked.length} devices & hand over` : `Add ${picked.length} devices`}
        height={52}
        style={{ opacity: scanning || picked.length === 0 ? 0.4 : 1, marginTop: 4 }}
        onPress={() => {
          if (scanning || picked.length === 0) return;
          showToast({
            title: installer ? 'Home handed over' : `${picked.length} devices added`,
            body: installer ? 'Owner invite sent. Recommended scene package applied.' : 'They now appear in their rooms and in your scenes.',
          });
          if (installer) router.replace('/home');
          else router.back();
        }}
      />
    </Screen>
  );
}

function Option({ icon, title, sub }: { icon: IconName; title: string; sub: string }) {
  return (
    <Pressable accessibilityRole="button" style={styles.option}>
      <IconBubble name={icon} bg={colors.bg} color={colors.ink} />
      <Txt size={14} weight="bold">
        {title}
      </Txt>
      <Txt size={12} color={colors.muted}>
        {sub}
      </Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  option: { flex: 1, backgroundColor: colors.card, borderRadius: 22, padding: 16, gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.lineSoft },
  check: { width: 24, height: 24, borderRadius: 8, borderWidth: 1.5, borderColor: colors.greyLight, alignItems: 'center', justifyContent: 'center' },
  brand: { height: 40, paddingHorizontal: 14, borderRadius: 20, backgroundColor: colors.card, justifyContent: 'center' },
});
