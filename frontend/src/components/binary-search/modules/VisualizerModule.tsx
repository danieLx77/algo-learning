import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, Pause, SkipBack, SkipForward, Search } from 'lucide-react';

const STATIC_ARRAY = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];

interface BinarySearchStep {
  low: number;
  mid: number;
  high: number;
  midValue: number;
  found: boolean;
  description: string;
}

export const VisualizerModule: React.FC = () => {
  const [target, setTarget] = useState<number>(23);
  const [steps, setSteps] = useState<BinarySearchStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrace = async () => {
    setLoading(true);
    setError(null);
    setIsPlaying(false);
    setCurrentStep(0);
    try {
      const response = await axios.get<BinarySearchStep[]>(
        \`http://localhost:8080/api/v1/algorithms/binary-search/trace?target=\${target}\`
      );
      setSteps(response.data);
    } catch (err: any) {
      setError(err.message || 'Erro ao conectar com o backend');
      setSteps([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrace();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      }, 1500); // 1.5s per step
    }
    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  const activeStep = steps[currentStep] || {
    low: 0,
    high: STATIC_ARRAY.length - 1,
    mid: -1,
    midValue: -1,
    found: false,
    description: 'Carregando...'
  };

  const { low, mid, high, description } = activeStep;

  return (
    <div className="bg-slate-800 p-8 rounded-lg shadow-lg flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-slate-200">Visualização Interativa</h2>
        <div className="flex gap-2 items-center">
          <label className="text-sm text-slate-400">Target:</label>
          <input 
            type="number" 
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            className="bg-slate-900 border border-slate-700 rounded px-3 py-1 w-24 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button 
            onClick={fetchTrace}
            disabled={loading}
            className="p-1.5 bg-blue-600 hover:bg-blue-500 rounded text-white disabled:opacity-50 transition-colors"
          >
            <Search size={18} />
          </button>
        </div>
      </div>
      
      {error && (
        <div className="w-full bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded mb-6 text-sm">
          {error}
        </div>
      )}

      <div className="text-slate-300 font-medium mb-8 min-h-[24px]">
        {loading ? "Calculando rota..." : description}
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-12">
        {STATIC_ARRAY.map((val, idx) => {
          let bgColor = 'bg-slate-700';
          let textColor = 'text-white';
          
          if (idx === mid) {
            bgColor = 'bg-blue-500';
          } else if (idx === low) {
            bgColor = 'bg-emerald-600';
          } else if (idx === high) {
            bgColor = 'bg-rose-600';
          } else if (idx < low || idx > high) {
            bgColor = 'bg-slate-800 border border-slate-700';
            textColor = 'text-slate-500';
          }

          return (
            <div key={idx} className="flex flex-col items-center">
              <div 
                className={\`w-12 h-12 flex items-center justify-center rounded-md text-lg font-bold transition-all duration-300 \${bgColor} \${textColor}\`}
              >
                {val}
              </div>
              <span className="text-xs text-slate-400 mt-2">{idx}</span>
            </div>
          );
        })}
      </div>

      <div className="flex gap-4">
        <div className="flex items-center gap-2 text-emerald-500 text-sm"><span className="w-3 h-3 bg-emerald-600 rounded-full"></span> Low</div>
        <div className="flex items-center gap-2 text-blue-500 text-sm"><span className="w-3 h-3 bg-blue-500 rounded-full"></span> Mid</div>
        <div className="flex items-center gap-2 text-rose-500 text-sm"><span className="w-3 h-3 bg-rose-600 rounded-full"></span> High</div>
      </div>

      <div className="mt-12 flex items-center gap-4 bg-slate-900 p-3 rounded-full border border-slate-700">
        <button 
          onClick={() => { setIsPlaying(false); setCurrentStep(Math.max(0, currentStep - 1)); }}
          disabled={currentStep === 0 || steps.length === 0}
          className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-300 disabled:opacity-30"
        >
          <SkipBack size={20} />
        </button>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          disabled={currentStep >= steps.length - 1 || steps.length === 0}
          className="p-3 bg-blue-600 hover:bg-blue-500 rounded-full transition-colors text-white disabled:opacity-50"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button 
          onClick={() => { setIsPlaying(false); setCurrentStep(Math.min(steps.length - 1, currentStep + 1)); }}
          disabled={currentStep >= steps.length - 1 || steps.length === 0}
          className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-300 disabled:opacity-30"
        >
          <SkipForward size={20} />
        </button>
      </div>
    </div>
  );
};
