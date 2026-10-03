import Svg, { Circle, Path, Rect } from 'react-native-svg';

// Stroke icons lifted from the HomeOne design file (24×24 grid).
export const iconPaths = {
  home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
  bell: 'M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15z M10 20a2 2 0 0 0 4 0',
  sparkle:
    'M11 3l1.8 4.7 4.7 1.8-4.7 1.8L11 16l-1.8-4.7-4.7-1.8 4.7-1.8z M18.5 14.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z',
  sparkleOne: 'M11 3l1.8 4.7 4.7 1.8-4.7 1.8L11 16l-1.8-4.7-4.7-1.8 4.7-1.8z',
  bars: 'M5 20v-8M10 20V6M15 20v-9M20 20V9',
  user: 'M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6',
  chevronDown: 'M6 9l6 6 6-6',
  chevronRight: 'M9 6l6 6-6 6',
  back: 'M19 12H5M11 6l-6 6 6 6',
  arrowRight: 'M5 12h14M13 6l6 6-6 6',
  arrowUpRight: 'M7 17L17 7M9 7h8v8',
  bolt: 'M13 2L4 14h7l-1 8 9-12h-7z',
  sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  pylon: 'M12 2l-5 20M12 2l5 20M8.5 9h7M6.8 15.5h10.4',
  battery: 'M2 7h17v10H2zM22 11v2M6 10v4M9.5 10v4M13 10v4',
  minus: 'M5 12h14',
  plus: 'M12 5v14M5 12h14',
  shade: 'M4 3h16v4H4zM5 7v9h14V7M5 11.5h14M12 16v4',
  leaf: 'M5 19c0-8 5-13 15-14-1 10-6 15-14 15M5 19l7-7',
  calendar: 'M3.5 8a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-11a3 3 0 0 1-3-3zM3.5 10h17M8 3v4M16 3v4',
  settingsHex: 'M12 2.5l8.2 4.75v9.5L12 21.5l-8.2-4.75v-9.5z',
  sliders: 'M4 7h10M18 7h2M4 17h4M12 17h8',
  moon: 'M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z',
  door: 'M5 21V4a1 1 0 0 1 1-1h9l4 2v16M3 21h18M14 12h.01',
  film: 'M4 5h16v14H4zM8 5v14M16 5v14M4 9h4M4 15h4M16 9h4M16 15h4',
  filter: 'M3 5h18l-7 8v6l-4 2v-8z',
  chip: 'M7 7h10v10H7zM10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4',
  bulb: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z',
  thermo: 'M14 14.8V5a2 2 0 1 0-4 0v9.8a4 4 0 1 0 4 0z',
  car: 'M5 17h14M5 17a2 2 0 1 0 4 0M15 17a2 2 0 1 0 4 0M3 17v-4l2-5h14l2 5v4M3 12h18',
  water: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z',
  qr: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z',
  shield: 'M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z',
  users: 'M3 20c.8-3 3.2-5 6-5s5.2 2 6 5M15 4.5a3.5 3.5 0 0 1 0 7M17 15c2 .4 3.5 2 4 5',
  mic: 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3',
  wifi: 'M2 8.5a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0M12 19h.01',
  check: 'M5 12l5 5L20 7',
  close: 'M6 6l12 12M18 6L6 18',
  info: 'M12 16v-5M12 8h.01',
  grid: '',
  globe: 'M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18',
  wrench: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z',
} as const;

export type IconName = keyof typeof iconPaths;

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export function Icon({ name, size = 20, color = '#141414', strokeWidth = 1.8 }: Props) {
  const common = { fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'user' && <Circle cx={12} cy={8} r={4} {...common} />}
      {name === 'settingsHex' && <Circle cx={12} cy={12} r={3} {...common} />}
      {name === 'sliders' && (
        <>
          <Circle cx={16} cy={7} r={2} {...common} />
          <Circle cx={10} cy={17} r={2} {...common} />
        </>
      )}
      {(name === 'info' || name === 'globe') && <Circle cx={12} cy={12} r={9} {...common} />}
      {name === 'grid' ? (
        <>
          <Rect x={4} y={4} width={6.5} height={6.5} rx={1.5} {...common} />
          <Rect x={13.5} y={4} width={6.5} height={6.5} rx={1.5} {...common} />
          <Rect x={4} y={13.5} width={6.5} height={6.5} rx={1.5} {...common} />
          <Rect x={13.5} y={13.5} width={6.5} height={6.5} rx={1.5} {...common} />
        </>
      ) : (
        <Path d={iconPaths[name]} {...common} />
      )}
    </Svg>
  );
}
