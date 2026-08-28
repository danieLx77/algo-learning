import { useState, useEffect } from 'react';
import type { FC } from 'react';
import axios from 'axios';
import { Play, Pause, SkipBack, SkipForward, Search, Gauge } from 'lucide-react';

const STATIC_ARRAY = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];

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
  const [target, setTarget] = useState<number>(23);
  const [steps, setSteps] = useState<BinarySearchStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [speedIndex, setSpeedIndex] = useState<number>(1);

  const speed = SPEED_OPTIONS[speedIndex].value;

  const fetchTrace = async () => {
    setLoading(true);
    setError(null);
    setIsPlaying(false);
    setCurrentStep(0);
    try {
      const response = await axios.get<BinarySearchStep[]>(
        `http://localhost:8080/api/v1/algorithms/binary-search/trace?target=${target}`
      );
      setSteps(response.data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg || 'Erro ao conectar com o backend');
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

  const { low, mid, high, description } = activeStep;

  return (
    <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-white">Visualização Interativa</h2>
        <div className="flex gap-2 items-center">
          <label className="text-sm text-slate-400">Target:</label>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 w-24 text-slate-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            onClick={() => { void fetchTrace(); }}
            disabled={loading}
            className="p-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white disabled:opacity-50 transition-colors"
          >
            <Search size={18} />
          </button>
        </div>
      </div>

      {error && (
        <div className="w-full bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <div className="text-slate-300 font-medium mb-6 min-h-[24px] text-center">
        {loading ? "Calculando rota..." : description}
      </div>

      {steps.length > 0 && (
        <div className="text-xs text-slate-500 mb-6 font-mono">
          Passo {currentStep + 1} / {steps.length}
        </div>
      )}

      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {STATIC_ARRAY.map((val, idx) => {
          let bgColor = 'bg-slate-800 border border-slate-700';
          let textColor = 'text-slate-300';

          if (idx === mid) {
            bgColor = 'bg-blue-600 border border-blue-500';
            textColor = 'text-white';
          } else if (idx === low) {
            bgColor = 'bg-emerald-600/80 border border-emerald-500';
            textColor = 'text-white';
          } else if (idx === high) {
            bgColor = 'bg-rose-600/80 border border-rose-500';
            textColor = 'text-white';
          } else if (idx < low || idx > high) {
            bgColor = 'bg-slate-900 border border-slate-800';
            textColor = 'text-slate-600';
          }

          return (
            <div key={idx} className="flex flex-col items-center">
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-lg text-lg font-bold transition-all duration-300 ${bgColor} ${textColor}`}
              >
                {val}
              </div>
              <span className="text-xs text-slate-600 mt-2 font-mono">{idx}</span>
            </div>
          );
        })}
      </div>

      <div className="flex gap-5 mb-8">
        <div className="flex items-center gap-2 text-emerald-400 text-xs">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span> Low
        </div>
        <div className="flex items-center gap-2 text-blue-400 text-xs">
          <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span> Mid
        </div>
        <div className="flex items-center gap-2 text-rose-400 text-xs">
          <span className="w-2.5 h-2.5 bg-rose-500 rounded-full"></span> High
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5">
          <Gauge size={14} className="text-slate-400" />
          {SPEED_OPTIONS.map((opt, idx) => (
            <button
              key={opt.value}
              onClick={() => setSpeedIndex(idx)}
              className={`px-2 py-0.5 text-xs rounded-md transition-colors ${
                speedIndex === idx
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full px-2 py-1">
          <button
            onClick={() => { setIsPlaying(false); setCurrentStep(Math.max(0, currentStep - 1)); }}
            disabled={currentStep === 0 || steps.length === 0}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 disabled:opacity-30"
          >
            <SkipBack size={18} />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={currentStep >= steps.length - 1 || steps.length === 0}
            className="p-2.5 bg-blue-600 hover:bg-blue-500 rounded-full transition-colors text-white disabled:opacity-50"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button
            onClick={() => { setIsPlaying(false); setCurrentStep(Math.min(steps.length - 1, currentStep + 1)); }}
            disabled={currentStep >= steps.length - 1 || steps.length === 0}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 disabled:opacity-30"
          >
            <SkipForward size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
