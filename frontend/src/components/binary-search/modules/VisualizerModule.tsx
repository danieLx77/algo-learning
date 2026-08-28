import { useState, useEffect } from 'react';
import type { FC } from 'react';
import axios from 'axios';
import { AlertCircle, CheckCircle2, Gauge, Pause, Play, Search, SkipBack, SkipForward } from 'lucide-react';

const STATIC_ARRAY = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
const JAVA_INTEGER_MIN = -2_147_483_648;
const JAVA_INTEGER_MAX = 2_147_483_647;

const SPEED_OPTIONS = [
  { label: 'Lento', value: 2500 },
  { label: 'Médio', value: 1500 },
  { label: 'Rápido', value: 750 },
];

interface BinarySearchStep {
  low: number;
  mid: number;
  high: number;
  midValue: number;
  found: boolean;
  description: string;
}

export const VisualizerModule: FC = () => {
  const [targetInput, setTargetInput] = useState('23');
  const [steps, setSteps] = useState<BinarySearchStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [speedIndex, setSpeedIndex] = useState<number>(1);

  const speed = SPEED_OPTIONS[speedIndex].value;

  const fetchTrace = async () => {
    const parsedTarget = Number(targetInput.trim());
    const isValidTarget = Number.isInteger(parsedTarget)
      && parsedTarget >= JAVA_INTEGER_MIN
      && parsedTarget <= JAVA_INTEGER_MAX;

    if (targetInput.trim() === '' || !isValidTarget) {
      setError('Digite um número inteiro válido para iniciar a busca.');
      setSteps([]);
      setIsPlaying(false);
      return;
    }

    setLoading(true);
    setError(null);
    setIsPlaying(false);
    setCurrentStep(0);
    try {
      const response = await axios.get<BinarySearchStep[]>(
        'http://localhost:8080/api/v1/algorithms/binary-search/trace',
        { params: { target: parsedTarget } },
      );
      setSteps(response.data);
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) && err.response
        ? 'Não foi possível calcular a busca com esse valor.'
        : 'Não foi possível conectar ao servidor. Tente novamente.';
      setError(errorMessage);
      setSteps([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && steps.length > 0) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, steps.length, speed]);

  const activeStep = steps[currentStep] || {
    low: 0,
    high: STATIC_ARRAY.length - 1,
    mid: -1,
    midValue: -1,
    found: false,
    description: 'Defina um target e inicie a visualização.'
  };

  const { low, mid, high, description, found, midValue } = activeStep;
  const progress = steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-slate-900/65 shadow-xl shadow-black/10">
      <div className="flex flex-col gap-5 border-b border-white/[0.06] px-5 py-5 sm:px-7 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.8)]" />
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-300">Laboratório interativo</p>
          </div>
          <h2 className="mt-2 text-xl font-semibold text-white">Veja cada decisão do algoritmo</h2>
        </div>

        <form
          className="flex w-full gap-2 md:w-auto"
          onSubmit={(event) => {
            event.preventDefault();
            void fetchTrace();
          }}
        >
          <label htmlFor="target-value" className="sr-only">Valor procurado</label>
          <div className="flex min-w-0 flex-1 items-center rounded-xl border border-white/[0.08] bg-black/20 px-3 focus-within:border-blue-400/50 md:w-44">
            <span className="mr-2 font-mono text-[10px] uppercase tracking-wider text-slate-600">Alvo</span>
            <input
              id="target-value"
              type="text"
              inputMode="numeric"
              value={targetInput}
              onChange={(event) => setTargetInput(event.target.value)}
              className="min-w-0 flex-1 bg-transparent py-2.5 text-right font-mono text-sm text-white outline-none"
              aria-describedby={error ? 'visualizer-error' : undefined}
            />
          </div>
          <button
            type="submit"
            aria-label="Buscar valor"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
          >
            <Search size={16} />
            <span className="hidden sm:inline">Buscar</span>
          </button>
        </form>
      </div>

      <div className="p-5 sm:p-7">
        {error && (
          <div id="visualizer-error" role="alert" className="mb-6 flex items-start gap-3 rounded-xl border border-rose-400/15 bg-rose-400/[0.06] p-4 text-sm text-rose-200">
            <AlertCircle size={17} className="mt-0.5 shrink-0 text-rose-400" />
            {error}
          </div>
        )}

        <div className="rounded-2xl border border-white/[0.06] bg-[#090f1c] p-5 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-h-[48px]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">Decisão atual</p>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-300" aria-live="polite">
                {loading ? 'Calculando a melhor rota...' : description}
              </p>
            </div>

            {steps.length > 0 && (
              <div className="flex shrink-0 items-center gap-3">
                {found && (
                  <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/[0.08] px-3 py-1.5 text-xs font-medium text-emerald-300">
                    <CheckCircle2 size={13} /> Encontrado: {midValue}
                  </span>
                )}
                <span className="rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 font-mono text-[10px] text-slate-500">
                  {currentStep + 1} / {steps.length}
                </span>
              </div>
            )}
          </div>

          <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/[0.05]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-400 transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-9 flex flex-wrap justify-center gap-2 sm:gap-3">
            {STATIC_ARRAY.map((value, index) => {
              let stateClasses = 'border-white/[0.08] bg-white/[0.04] text-slate-300';

              if (index === mid) {
                stateClasses = found
                  ? 'border-emerald-400 bg-emerald-500 text-white shadow-[0_0_24px_rgba(52,211,153,0.25)]'
                  : 'border-blue-400 bg-blue-500 text-white shadow-[0_0_24px_rgba(59,130,246,0.3)]';
              } else if (index === low) {
                stateClasses = 'border-emerald-400/70 bg-emerald-500/15 text-emerald-200';
              } else if (index === high) {
                stateClasses = 'border-rose-400/70 bg-rose-500/15 text-rose-200';
              } else if (index < low || index > high) {
                stateClasses = 'border-white/[0.03] bg-transparent text-slate-700';
              }

              return (
                <div key={value} className="flex flex-col items-center">
                  <div className={`flex size-10 items-center justify-center rounded-xl border font-mono text-sm font-semibold transition-all duration-500 sm:size-12 sm:text-base ${stateClasses}`}>
                    {value}
                  </div>
                  <span className="mt-2 font-mono text-[9px] text-slate-700">{index}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-5 border-t border-white/[0.05] pt-5">
            <span className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-emerald-300/80">
              <span className="size-2 rounded-full bg-emerald-400" /> Low
            </span>
            <span className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-blue-300/80">
              <span className="size-2 rounded-full bg-blue-400" /> Mid
            </span>
            <span className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-rose-300/80">
              <span className="size-2 rounded-full bg-rose-400" /> High
            </span>
          </div>
        </div>

        <div className="mt-5 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3 sm:flex-row sm:px-4">
          <div className="flex w-full items-center justify-center gap-1 rounded-xl border border-white/[0.06] bg-black/10 p-1 sm:w-auto">
            <Gauge size={14} className="mx-2 text-slate-500" />
            {SPEED_OPTIONS.map((option, index) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSpeedIndex(index)}
                aria-pressed={speedIndex === index}
                className={`rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-blue-400 ${
                  speedIndex === index
                    ? 'bg-white/[0.08] text-white'
                    : 'text-slate-600 hover:text-slate-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 rounded-full border border-white/[0.07] bg-black/20 p-1">
            <button
              type="button"
              aria-label="Voltar um passo"
              onClick={() => { setIsPlaying(false); setCurrentStep(Math.max(0, currentStep - 1)); }}
              disabled={currentStep === 0 || steps.length === 0}
              className="rounded-full p-2.5 text-slate-400 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-25 focus-visible:outline-2 focus-visible:outline-blue-400"
            >
              <SkipBack size={17} />
            </button>
            <button
              type="button"
              aria-label={isPlaying ? 'Pausar animação' : 'Reproduzir animação'}
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={currentStep >= steps.length - 1 || steps.length === 0}
              className="rounded-full bg-blue-500 p-3 text-white shadow-[0_8px_24px_rgba(37,99,235,0.3)] transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="translate-x-px" />}
            </button>
            <button
              type="button"
              aria-label="Avançar um passo"
              onClick={() => { setIsPlaying(false); setCurrentStep(Math.min(steps.length - 1, currentStep + 1)); }}
              disabled={currentStep >= steps.length - 1 || steps.length === 0}
              className="rounded-full p-2.5 text-slate-400 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-25 focus-visible:outline-2 focus-visible:outline-blue-400"
            >
              <SkipForward size={17} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
