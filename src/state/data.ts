import type { IconName } from '@/components/Icon';

export type SceneId = 'morning' | 'away' | 'movie' | 'sleep';

export const scenes: { id: SceneId; name: string; sub: string; icon: IconName; summary: string; saving?: string }[] = [
  {
    id: 'morning',
    name: 'Good morning',
    sub: 'Shades open slowly · warm lights · 22° by 07:00',
    icon: 'sun',
    summary: 'Shades opening, lights ramping to warm white, climate to 22°.',
  },
  {
    id: 'away',
    name: 'Away',
    sub: 'Lights off · eco climate · sunny-side shades close',
    icon: 'door',
    summary: 'Lights off, climate on eco, west shades closed.',
    saving: 'Est. saving 2.1 kWh today',
  },
  {
    id: 'movie',
    name: 'Movie night',
    sub: 'Lights 10% · shades down · 23°',
    icon: 'film',
    summary: 'Living room lights 10%, shades down, 23°.',
  },
  {
    id: 'sleep',
    name: 'Sleep',
    sub: 'All off · bedroom 24° · quiet alerts',
    icon: 'moon',
    summary: 'All lights off, bedroom 24°, quiet hours on.',
    saving: 'Est. saving 1.4 kWh overnight',
  },
];

export type RoomId = 'living' | 'bedroom' | 'kitchen' | 'garage';

export type Room = {
  id: RoomId;
  name: string;
  temp: number;
  occupied: boolean;
  lights: { id: string; name: string; on: boolean; level: number }[];
  shades?: { name: string; position: number }; // % open
  climate?: { name: string; setpoint: number; eco: boolean };
  extras?: { icon: IconName; name: string; status: string }[];
};

export const initialRooms: Record<RoomId, Room> = {
  living: {
    id: 'living',
    name: 'Living room',
    temp: 22,
    occupied: true,
    lights: [
      { id: 'l1', name: 'Ceiling', on: true, level: 80 },
      { id: 'l2', name: 'Floor lamp', on: true, level: 60 },
      { id: 'l3', name: 'TV backlight', on: true, level: 40 },
    ],
    shades: { name: 'West shades', position: 40 },
  },
  bedroom: {
    id: 'bedroom',
    name: 'Bedroom',
    temp: 23,
    occupied: false,
    lights: [
      { id: 'b1', name: 'Ceiling', on: false, level: 70 },
      { id: 'b2', name: 'Bedside', on: false, level: 30 },
    ],
    shades: { name: 'Blackout blind', position: 100 },
    climate: { name: 'Heat pump', setpoint: 24, eco: true },
  },
  kitchen: {
    id: 'kitchen',
    name: 'Kitchen',
    temp: 24,
    occupied: true,
    lights: [
      { id: 'k1', name: 'Pendants', on: true, level: 90 },
      { id: 'k2', name: 'Under-cabinet', on: true, level: 100 },
    ],
    extras: [{ icon: 'water', name: 'Dishwasher', status: 'Scheduled 21:30 · off-peak' }],
  },
  garage: {
    id: 'garage',
    name: 'Garage',
    temp: 27,
    occupied: false,
    lights: [{ id: 'g1', name: 'Strip light', on: false, level: 100 }],
    extras: [
      { icon: 'car', name: 'EV charger', status: '68% · charging after peak (21:00)' },
      { icon: 'battery', name: 'Home battery', status: '76% · charging +0.7 kW' },
    ],
  },
};

export type Rule = { id: string; when: string; then: string; on: boolean };

export const initialRules: Rule[] = [
  { id: 'away', when: 'Everyone leaves home', then: 'run Away · confirm with est. savings', on: true },
  { id: 'empty', when: 'A room is empty for 10 min', then: 'lights off · relax set-point 2°', on: true },
  { id: 'peak', when: '30 min before peak tariff', then: 'pre-cool · pause EV · dim non-essentials', on: true },
  { id: 'solar', when: 'Solar surplus over 1.5 kW', then: 'charge EV, then heat water', on: false },
];

export type NotifCategory = 'energy' | 'devices' | 'automations';

export type Notif = {
  id: string;
  cat: NotifCategory;
  icon: IconName;
  title: string;
  time: string;
  body: string;
  urgent?: boolean;
  primary?: string;
  action?: string;
};

export const initialNotifs: Notif[] = [
  {
    id: 'n1', cat: 'devices', icon: 'battery', urgent: true, primary: 'Order battery',
    title: 'Hallway sensor battery 8%', time: '08:40',
    body: 'Occupancy automations for the hallway may stop working in about 3 days.',
  },
  {
    id: 'n2', cat: 'devices', icon: 'filter', urgent: true, primary: 'How to clean',
    title: 'AC filter cleaning due', time: '07:15',
    body: 'Living room AC has run 300 h since the last clean. A clean filter cuts cooling energy.',
  },
  {
    id: 'n3', cat: 'energy', icon: 'bolt', action: 'Override',
    title: 'Pre-cooling at 16:30', time: '12:02',
    body: 'Peak tariff runs 17:00–21:00. The AC will hold 23° through the peak.',
  },
  {
    id: 'n4', cat: 'automations', icon: 'shade', action: 'Undo',
    title: 'West shades closed', time: '13:10',
    body: 'Outside 34° and direct sun on the west façade — reducing AC load.',
  },
  {
    id: 'n5', cat: 'automations', icon: 'door',
    title: 'Away mode on', time: '09:12',
    body: 'Everyone left. Lights off, climate on eco. Est. saving 2.1 kWh.',
  },
  {
    id: 'n6', cat: 'energy', icon: 'leaf',
    title: 'Solar covered 82% of your morning', time: '11:30',
    body: 'Surplus went to the battery instead of exporting at low feed-in rates.',
  },
  {
    id: 'n7', cat: 'devices', icon: 'chip', action: 'Update now',
    title: 'Firmware update ready', time: '06:00',
    body: 'Living room keypad v2.4 — installs overnight, scenes keep working locally.',
  },
];

export type AcMode = 'cool' | 'heat' | 'dry' | 'auto';

export type AcState = { on: boolean; temp: number; mode: AcMode; fan: 1 | 2 | 3; eco: boolean; balance: number };

export const initialAc: AcState = { on: true, temp: 22, mode: 'cool', fan: 2, eco: true, balance: 60 };

export const members = [
  { name: 'Priya Sharma', role: 'Owner', detail: 'Full access' },
  { name: 'Rahul Sharma', role: 'Household', detail: 'Control & scenes' },
  { name: 'Asha Sharma', role: 'Guest · simple', detail: 'Living room & bedroom · inactivity alerts on' },
  { name: 'Leo Martin · BrightHome Installs', role: 'Installer', detail: 'Remote diagnostics until 31 Oct' },
];
