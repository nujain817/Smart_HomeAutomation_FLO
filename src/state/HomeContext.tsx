import { createContext, ReactNode, useCallback, useContext, useMemo, useRef, useState } from 'react';

import {
  AcState,
  initialAc,
  initialNotifs,
  initialRooms,
  initialRules,
  Notif,
  Room,
  RoomId,
  Rule,
  SceneId,
  scenes,
} from './data';

export type Toast = { title: string; body?: string; undo?: () => void };

type HomeState = {
  activeScene: SceneId | null;
  runScene: (id: SceneId) => void;
  ac: AcState;
  setAc: (patch: Partial<AcState>) => void;
  rooms: Record<RoomId, Room>;
  updateRoom: (id: RoomId, fn: (r: Room) => Room) => void;
  rules: Rule[];
  toggleRule: (id: string) => void;
  addRule: (rule: Omit<Rule, 'id' | 'on'>) => void;
  notifs: Notif[];
  dismissNotif: (id: string) => void;
  peakSkipped: boolean;
  setPeakSkipped: (v: boolean) => void;
  suggestionDismissed: boolean;
  setSuggestionDismissed: (v: boolean) => void;
  simpleMode: boolean;
  setSimpleMode: (v: boolean) => void;
  toast: Toast | null;
  showToast: (t: Toast) => void;
  hideToast: () => void;
};

const Ctx = createContext<HomeState | null>(null);

export function HomeProvider({ children }: { children: ReactNode }) {
  const [activeScene, setActiveScene] = useState<SceneId | null>('morning');
  const [ac, setAcState] = useState<AcState>(initialAc);
  const [rooms, setRooms] = useState(initialRooms);
  const [rules, setRules] = useState(initialRules);
  const [notifs, setNotifs] = useState(initialNotifs);
  const [peakSkipped, setPeakSkipped] = useState(false);
  const [suggestionDismissed, setSuggestionDismissed] = useState(false);
  const [simpleMode, setSimpleMode] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideToast = useCallback(() => setToast(null), []);
  const showToast = useCallback((t: Toast) => {
    if (timer.current) clearTimeout(timer.current);
    setToast(t);
    timer.current = setTimeout(() => setToast(null), 4500);
  }, []);

  const setAc = useCallback((patch: Partial<AcState>) => setAcState((s) => ({ ...s, ...patch })), []);

  const updateRoom = useCallback(
    (id: RoomId, fn: (r: Room) => Room) => setRooms((rs) => ({ ...rs, [id]: fn(rs[id]) })),
    [],
  );

  const runScene = useCallback(
    (id: SceneId) => {
      const prev = { activeScene, ac, rooms };
      const scene = scenes.find((s) => s.id === id)!;
      setActiveScene(id);
      // Cross-category effects so the rest of the prototype reflects the scene.
      setRooms((rs) => {
        const next = { ...rs };
        const setLights = (rid: RoomId, on: boolean, level?: number) => {
          next[rid] = { ...next[rid], lights: next[rid].lights.map((l) => ({ ...l, on, level: level ?? l.level })) };
        };
        const setShade = (rid: RoomId, position: number) => {
          const s = next[rid].shades;
          if (s) next[rid] = { ...next[rid], shades: { ...s, position } };
        };
        if (id === 'morning') {
          (['living', 'kitchen'] as RoomId[]).forEach((r) => setLights(r, true, 70));
          setShade('living', 100);
          setShade('bedroom', 100);
        } else if (id === 'away') {
          (Object.keys(next) as RoomId[]).forEach((r) => setLights(r, false));
          setShade('living', 0);
        } else if (id === 'movie') {
          setLights('living', true, 10);
          setLights('kitchen', false);
          setShade('living', 0);
        } else if (id === 'sleep') {
          (Object.keys(next) as RoomId[]).forEach((r) => setLights(r, false));
          setShade('bedroom', 0);
        }
        return next;
      });
      setAcState((s) => {
        if (id === 'away') return { ...s, eco: true, temp: 26 };
        if (id === 'movie') return { ...s, on: true, temp: 23 };
        if (id === 'sleep') return { ...s, on: false };
        return { ...s, on: true, temp: 22 };
      });
      showToast({
        title: `${scene.name} is running`,
        body: [scene.summary, scene.saving].filter(Boolean).join(' '),
        undo: () => {
          setActiveScene(prev.activeScene);
          setAcState(prev.ac);
          setRooms(prev.rooms);
        },
      });
    },
    [activeScene, ac, rooms, showToast],
  );

  const toggleRule = useCallback((id: string) => setRules((rs) => rs.map((r) => (r.id === id ? { ...r, on: !r.on } : r))), []);
  const addRule = useCallback(
    (rule: Omit<Rule, 'id' | 'on'>) => setRules((rs) => [...rs, { ...rule, id: `r${Date.now()}`, on: true }]),
    [],
  );
  const dismissNotif = useCallback((id: string) => setNotifs((ns) => ns.filter((n) => n.id !== id)), []);

  const value = useMemo<HomeState>(
    () => ({
      activeScene,
      runScene,
      ac,
      setAc,
      rooms,
      updateRoom,
      rules,
      toggleRule,
      addRule,
      notifs,
      dismissNotif,
      peakSkipped,
      setPeakSkipped,
      suggestionDismissed,
      setSuggestionDismissed,
      simpleMode,
      setSimpleMode,
      toast,
      showToast,
      hideToast,
    }),
    [activeScene, runScene, ac, setAc, rooms, updateRoom, rules, toggleRule, addRule, notifs, dismissNotif, peakSkipped, suggestionDismissed, simpleMode, toast, showToast, hideToast],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useHome() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useHome must be used inside HomeProvider');
  return v;
}
