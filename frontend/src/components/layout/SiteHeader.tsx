import type { FC, ReactNode } from 'react';
import { Binary } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SiteHeaderProps {
  action?: ReactNode;
}

export const SiteHeader: FC<SiteHeaderProps> = ({ action }) => {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" className="group flex items-center gap-3" aria-label="AlgoLearning - início">
            <span className="flex size-9 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-400 shadow-[0_0_24px_rgba(59,130,246,0.12)] transition-transform group-hover:-rotate-3">
              <Binary size={19} strokeWidth={2.3} />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-white">
              algo<span className="text-blue-400">learning</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-xs font-medium text-slate-500 md:flex" aria-label="Navegação principal">
            <Link to="/" className="transition hover:text-white">Início</Link>
            <Link to="/#algoritmos" className="transition hover:text-white">Algoritmos</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-400 sm:flex">
            <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            Trilha Java
          </span>
          {action}
        </div>
      </div>
    </header>
  );
};
