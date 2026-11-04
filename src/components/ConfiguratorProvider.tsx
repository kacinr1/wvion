'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { DriverId, FormuleId, VehicleId } from '@/lib/data';
import { defaultVehicle } from '@/lib/data';

export type Phase = 'closed' | 'open' | 'closing';
export type SendStatus = 'idle' | 'sending' | 'error';

export interface Fields {
  date: string;
  time: string;
  from: string;
  to: string;
  pax: string;
  flight: string;
  name: string;
  phone: string;
  email: string;
  note: string;
}

const emptyFields: Fields = {
  date: '', time: '', from: '', to: '', pax: '', flight: '', name: '', phone: '', email: '', note: '',
};

interface OpenPreset {
  form?: FormuleId | null;
  drv?: DriverId | null;
  step?: number;
}

interface CfgContextValue {
  phase: Phase;
  step: number;
  form: FormuleId | null;
  veh: VehicleId;
  drv: DriverId | null;
  opts: Record<string, boolean>;
  sent: boolean;
  status: SendStatus;
  f: Fields;
  // actions
  openMain: () => void;
  openAllin: () => void;
  openWithDriver: (id: DriverId) => void;
  close: () => void;
  setStep: (n: number) => void;
  setForm: (id: FormuleId) => void;
  setVeh: (id: VehicleId) => void;
  setDrv: (id: DriverId | null) => void;
  toggleOpt: (id: string) => void;
  setField: (k: keyof Fields, v: string) => void;
  setSent: (b: boolean) => void;
  setStatus: (s: SendStatus) => void;
}

const CfgContext = createContext<CfgContextValue | null>(null);

export function useConfigurator() {
  const ctx = useContext(CfgContext);
  if (!ctx) throw new Error('useConfigurator must be used within ConfiguratorProvider');
  return ctx;
}

export function ConfiguratorProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>('closed');
  const [step, setStep] = useState(0);
  const [form, setFormState] = useState<FormuleId | null>(null);
  const [veh, setVeh] = useState<VehicleId>(defaultVehicle);
  const [drv, setDrv] = useState<DriverId | null>(null);
  const [opts, setOpts] = useState<Record<string, boolean>>({});
  const [sent, setSent] = useState(false);
  const [status, setStatus] = useState<SendStatus>('idle');
  const [f, setF] = useState<Fields>(emptyFields);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const open = useCallback((preset: OpenPreset = {}) => {
    setPhase('open');
    setSent(false);
    setStatus('idle');
    setStep(preset.step ?? 0);
    if (preset.form !== undefined) setFormState(preset.form);
    if (preset.drv !== undefined) setDrv(preset.drv);
  }, []);

  const openMain = useCallback(() => open({}), [open]);
  const openAllin = useCallback(() => open({ form: 'allin', step: 1 }), [open]);

  const openWithDriver = useCallback(
    (id: DriverId) => {
      // Raccourci : chauffeur pré-sélectionné, formule « Journée » par défaut
      // (sauf si une formule compatible est déjà choisie).
      setFormState((prev) =>
        prev && prev !== 'transfert' && prev !== 'allin' ? prev : 'jour',
      );
      open({ drv: id });
    },
    [open],
  );

  const close = useCallback(() => {
    setPhase('closing');
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      setPhase('closed');
      setSent(false);
      setStatus('idle');
    }, 620);
  }, []);

  const setForm = useCallback((id: FormuleId) => setFormState(id), []);
  const toggleOpt = useCallback(
    (id: string) => setOpts((prev) => ({ ...prev, [id]: !prev[id] })),
    [],
  );
  const setField = useCallback(
    (k: keyof Fields, v: string) => setF((prev) => ({ ...prev, [k]: v })),
    [],
  );

  // Verrouille le scroll du corps quand le configurateur est ouvert
  useEffect(() => {
    if (phase === 'closed') {
      document.body.style.overflow = '';
    } else {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [phase]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const value = useMemo<CfgContextValue>(
    () => ({
      phase, step, form, veh, drv, opts, sent, status, f,
      openMain, openAllin, openWithDriver, close,
      setStep, setForm, setVeh, setDrv, toggleOpt, setField, setSent, setStatus,
    }),
    [phase, step, form, veh, drv, opts, sent, status, f, openMain, openAllin, openWithDriver, close, setForm, toggleOpt, setField],
  );

  return <CfgContext.Provider value={value}>{children}</CfgContext.Provider>;
}
