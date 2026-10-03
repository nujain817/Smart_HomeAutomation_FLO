import { StyleSheet, View } from 'react-native';
import { Defs, LinearGradient, Rect, Stop, Svg } from 'react-native-svg';

import { Icon } from './Icon';

export function LogoTile({ size = 32 }: { size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size * 0.32, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
      <Svg style={StyleSheet.absoluteFill} viewBox="0 0 10 10" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="logo" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#F7A35C" />
            <Stop offset="1" stopColor="#E9762B" />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width={10} height={10} fill="url(#logo)" />
      </Svg>
      <View style={{ zIndex: 1 }}>
        <Icon name="home" size={size / 2} color="#FFFFFF" strokeWidth={2.2} />
      </View>
    </View>
  );
}
