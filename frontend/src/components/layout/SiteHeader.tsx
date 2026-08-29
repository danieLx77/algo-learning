import type { FC, ReactNode } from 'react';
import { Binary, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SiteHeaderProps {
  action?: ReactNode;
}

export const SiteHeader: FC<SiteHeaderProps> = ({ action }) => {
  return (
    <header className="site-header sticky top-3 z-50 px-3 sm:top-4 sm:px-5">
      <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between rounded-2xl border border-white/[0.055] bg-[#09090d]/80 px-4 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:px-6">
        <div className="flex items-center gap-10">
          <Link to="/" className="group flex items-center gap-3" aria-label="AlgoLearning - início">
            <span className="flex size-9 items-center justify-center rounded-xl border border-violet-300/20 bg-violet-400/10 text-violet-300 shadow-[0_0_24px_rgba(139,92,246,0.16)] transition-transform group-hover:-rotate-3">
              <Binary size={19} strokeWidth={2.3} />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-white">
              algo<span className="text-violet-300">learning</span>
            </span>
          </Link>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 text-[11px] font-medium text-zinc-400 md:flex" aria-label="Navegação principal">
            <Link to="/" className="transition hover:text-white">Início</Link>
            <Link to="/#algoritmos" className="flex items-center gap-1.5 transition hover:text-white">
              Algoritmos <ChevronDown size={12} />
            </Link>
            <Link to="/#metodo" className="transition hover:text-white">Como funciona</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.025] px-3 py-1.5 text-[11px] font-medium text-zinc-400 lg:flex">
            <span className="size-1.5 rounded-full bg-violet-300 shadow-[0_0_10px_rgba(196,181,253,0.8)]" />
            Trilha Java
          </span>
          {action}
        </div>
      </div>
    </header>
  );
};
