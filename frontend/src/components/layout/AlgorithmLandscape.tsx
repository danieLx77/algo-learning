import type { FC } from 'react';
import { ArrowUpRight, Braces, CheckCircle2 } from 'lucide-react';

interface AlgorithmLandscapeProps {
  variant?: 'catalog' | 'binary-search' | 'arrays';
}

const BINARY_VALUES = [2, 5, 8, 12, 16, 23, 38];

export const AlgorithmLandscape: FC<AlgorithmLandscapeProps> = ({ variant = 'catalog' }) => {
  const isBinarySearch = variant === 'binary-search';
  const isArrays = variant === 'arrays';
  const showValues = isBinarySearch || isArrays;

  return (
    <div className={`algorithm-landscape ${showValues ? 'algorithm-landscape--binary' : ''}`}>
      <div className="algorithm-stars" aria-hidden="true" />
      <div className="algorithm-glow" aria-hidden="true" />
      <div className="algorithm-mass" aria-hidden="true">
        <div className="algorithm-ridge" />
        <div className="algorithm-ridge algorithm-ridge--secondary" />
      </div>

      <div className="landscape-card landscape-card--left">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="landscape-card-label">{showValues ? 'Complexidade' : 'Aprendizado'}</p>
            <p className="mt-2 text-sm font-medium text-white">
              {isBinarySearch ? 'O(log n)' : isArrays ? 'O(1) no acesso' : 'Visual e prático'}
            </p>
          </div>
          <span className="landscape-card-icon"><ArrowUpRight size={13} /></span>
        </div>
        <div className="mt-5 h-px bg-gradient-to-r from-violet-300/80 to-transparent" />
      </div>

      <div className="landscape-card landscape-card--right">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="landscape-card-label">{isBinarySearch ? 'Valor procurado' : isArrays ? 'Estrutura' : 'Trilha disponível'}</p>
            <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-white">
              {isBinarySearch ? '23' : isArrays ? 'int[]' : 'Busca Binária'}
              {!showValues && <CheckCircle2 size={14} className="text-violet-300" />}
            </p>
          </div>
          <span className="landscape-card-icon"><Braces size={13} /></span>
        </div>
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.06]">
          <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-violet-300 to-indigo-500" />
        </div>
      </div>

      {showValues && (
        <div className="landscape-values" role="img" aria-label={isArrays ? 'Prévia visual de um array com seis posições' : 'Prévia visual da busca binária com o valor 23 destacado'}>
          {BINARY_VALUES.map((value) => (
            <span
              key={value}
              className={value === 23 && isBinarySearch ? 'landscape-value landscape-value--active' : 'landscape-value'}
            >
              {value}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
