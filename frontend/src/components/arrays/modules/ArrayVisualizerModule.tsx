import { useEffect, useState } from 'react';
import type { FC } from 'react';
import axios from 'axios';
import { AlertCircle, Gauge, Pause, Play, SkipBack, SkipForward, WandSparkles } from 'lucide-react';

type ArrayOperation = 'ACCESS' | 'UPDATE' | 'INSERT' | 'REMOVE' | 'TRAVERSE';

interface ArrayStep {
  values: number[];
  activeIndex: number;
  shiftedIndices: number[];
  description: string;
  completed: boolean;
}

const INITIAL_VALUES = [4, 8, 15, 16, 23, 42];
const OPERATIONS: { value: ArrayOperation; label: string; needsIndex: boolean; needsValue: boolean }[] = [
  { value: 'ACCESS', label: 'Acessar', needsIndex: true, needsValue: false },
  { value: 'UPDATE', label: 'Atualizar', needsIndex: true, needsValue: true },
  { value: 'INSERT', label: 'Inserir', needsIndex: true, needsValue: true },
  { value: 'REMOVE', label: 'Remover', needsIndex: true, needsValue: false },
  { value: 'TRAVERSE', label: 'Percorrer', needsIndex: false, needsValue: false },
];
const SPEEDS = [2200, 1300, 650];

export const ArrayVisualizerModule: FC = () => {
  const [operation, setOperation] = useState<ArrayOperation>('ACCESS');
  const [indexInput, setIndexInput] = useState('2');
  const [valueInput, setValueInput] = useState('99');
  const [steps, setSteps] = useState<ArrayStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [speedIndex, setSpeedIndex] = useState(1);
  const selectedOperation = OPERATIONS.find((item) => item.value === operation) ?? OPERATIONS[0];

  useEffect(() => {
    if (!isPlaying || steps.length === 0) return undefined;
    const interval = window.setInterval(() => {
      setCurrentStep((current) => {
        if (current >= steps.length - 1) {
          setIsPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, SPEEDS[speedIndex]);
    return () => window.clearInterval(interval);
  }, [isPlaying, speedIndex, steps.length]);

  const runOperation = async () => {
    const index = Number(indexInput);
    const value = Number(valueInput);
    if (selectedOperation.needsIndex && (!Number.isInteger(index) || index < 0)) {
      setError('Informe um índice inteiro não negativo.');
      return;
    }
    if (selectedOperation.needsValue && (!Number.isInteger(value) || value < -2_147_483_648 || value > 2_147_483_647)) {
      setError('Informe um valor inteiro válido.');
      return;
    }

    setLoading(true);
    setError(null);
    setIsPlaying(false);
    setCurrentStep(0);
    try {
      const response = await axios.post<ArrayStep[]>('http://localhost:8080/api/v1/algorithms/arrays/trace', {
        array: INITIAL_VALUES,
        operation,
        index: selectedOperation.needsIndex ? index : null,
        value: selectedOperation.needsValue ? value : null,
      });
      setSteps(response.data);
    } catch (requestError) {
      setSteps([]);
      setError(axios.isAxiosError(requestError) && requestError.response
        ? 'A operação não é válida para este array.'
        : 'Não foi possível conectar ao servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const activeStep = steps[currentStep];
  const values = activeStep?.values ?? INITIAL_VALUES;
  const progress = steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0;

  return (
    <div className="violet-panel overflow-hidden rounded-[22px]">
      <div className="flex flex-col gap-5 border-b border-white/[0.06] px-5 py-5 sm:px-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-violet-300 shadow-[0_0_12px_rgba(196,181,253,0.8)]" /><p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">Laboratório interativo</p></div>
          <h2 className="mt-2 text-xl font-semibold text-white">Veja o array se transformar</h2>
        </div>

        <form className="flex flex-wrap gap-2" onSubmit={(event) => { event.preventDefault(); void runOperation(); }}>
          <label className="sr-only" htmlFor="array-operation">Operação</label>
          <select id="array-operation" value={operation} onChange={(event) => setOperation(event.target.value as ArrayOperation)} className="rounded-xl border border-white/[0.08] bg-[#111117] px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-violet-300/50">
            {OPERATIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
          {selectedOperation.needsIndex && <input aria-label="Índice" inputMode="numeric" value={indexInput} onChange={(event) => setIndexInput(event.target.value)} className="w-20 rounded-xl border border-white/[0.08] bg-black/20 px-3 py-2.5 text-center font-mono text-sm text-white outline-none focus:border-violet-300/50" />}
          {selectedOperation.needsValue && <input aria-label="Valor" inputMode="numeric" value={valueInput} onChange={(event) => setValueInput(event.target.value)} className="w-24 rounded-xl border border-white/[0.08] bg-black/20 px-3 py-2.5 text-center font-mono text-sm text-white outline-none focus:border-violet-300/50" />}
          <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-violet-300">
            <WandSparkles size={15} /> {loading ? 'Calculando...' : 'Executar'}
          </button>
        </form>
      </div>

      <div className="p-5 sm:p-7">
        {error && <div role="alert" className="mb-5 flex items-start gap-3 rounded-xl border border-rose-400/15 bg-rose-400/[0.06] p-4 text-sm text-rose-200"><AlertCircle size={17} className="mt-0.5 shrink-0" />{error}</div>}
        <div className="rounded-[22px] border border-white/[0.055] bg-[#09090d] p-5 sm:p-7">
          <div className="flex min-h-14 items-start justify-between gap-4">
            <div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">Movimento atual</p><p className="mt-2 text-sm font-medium leading-6 text-slate-300" aria-live="polite">{activeStep?.description ?? 'Escolha uma operação para iniciar.'}</p></div>
            {steps.length > 0 && <span className="shrink-0 rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 font-mono text-[10px] text-slate-500">{currentStep + 1} / {steps.length}</span>}
          </div>
          <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.05]"><div className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-400 transition-[width] duration-500" style={{ width: `${progress}%` }} /></div>

          <div className="mt-10 flex flex-wrap justify-center gap-2 sm:gap-3">
            {values.map((value, index) => {
              const active = activeStep?.activeIndex === index;
              const shifted = activeStep?.shiftedIndices.includes(index);
              const state = active
                ? 'border-violet-300 bg-violet-600 text-white shadow-[0_0_24px_rgba(139,92,246,0.36)]'
                : shifted ? 'border-amber-300/60 bg-amber-400/10 text-amber-200' : 'border-white/[0.08] bg-white/[0.04] text-slate-300';
              return <div key={`${index}-${value}`} className="flex flex-col items-center"><div className={`flex size-11 items-center justify-center rounded-xl border font-mono text-sm font-semibold transition-all duration-500 sm:size-13 ${state}`}>{value}</div><span className="mt-2 font-mono text-[9px] text-slate-700">{index}</span></div>;
            })}
          </div>
        </div>

        <div className="mt-5 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3 sm:flex-row sm:px-4">
          <div className="flex items-center gap-1"><Gauge size={14} className="mx-2 text-slate-500" />{['Lento', 'Médio', 'Rápido'].map((label, index) => <button key={label} type="button" aria-pressed={speedIndex === index} onClick={() => setSpeedIndex(index)} className={`rounded-lg px-2.5 py-1.5 text-[11px] ${speedIndex === index ? 'bg-white/[0.08] text-white' : 'text-slate-600'}`}>{label}</button>)}</div>
          <div className="flex items-center gap-1 rounded-full border border-white/[0.07] bg-black/20 p-1">
            <button type="button" aria-label="Voltar um passo" disabled={currentStep === 0 || steps.length === 0} onClick={() => { setIsPlaying(false); setCurrentStep(Math.max(0, currentStep - 1)); }} className="rounded-full p-2.5 text-slate-400 disabled:opacity-25"><SkipBack size={17} /></button>
            <button type="button" aria-label={isPlaying ? 'Pausar animação' : 'Reproduzir animação'} disabled={currentStep >= steps.length - 1 || steps.length === 0} onClick={() => setIsPlaying(!isPlaying)} className="rounded-full bg-violet-600 p-3 text-white disabled:opacity-30">{isPlaying ? <Pause size={18} /> : <Play size={18} />}</button>
            <button type="button" aria-label="Avançar um passo" disabled={currentStep >= steps.length - 1 || steps.length === 0} onClick={() => { setIsPlaying(false); setCurrentStep(Math.min(steps.length - 1, currentStep + 1)); }} className="rounded-full p-2.5 text-slate-400 disabled:opacity-25"><SkipForward size={17} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};
