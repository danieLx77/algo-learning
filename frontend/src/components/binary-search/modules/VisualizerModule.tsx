import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

const STATIC_ARRAY = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];

export const VisualizerModule: React.FC = () => {
  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(STATIC_ARRAY.length - 1);
  const [mid, setMid] = useState(Math.floor((0 + STATIC_ARRAY.length - 1) / 2));
  
  // Exemplo simplificado. Em produção isso seria controlado por steps via API.
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="bg-slate-800 p-8 rounded-lg shadow-lg flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-8 text-slate-200">Visualização Interativa</h2>
      
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
        <button className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-300">
          <SkipBack size={20} />
        </button>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-3 bg-blue-600 hover:bg-blue-500 rounded-full transition-colors text-white"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-300">
          <SkipForward size={20} />
        </button>
      </div>
    </div>
  );
};
