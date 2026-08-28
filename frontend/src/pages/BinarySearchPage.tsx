import { useState } from 'react';
import type { FC } from 'react';
import {
  ArrowRight,
  Binary,
  BookOpen,
  CheckCircle2,
  Code2,
  PlayCircle,
  Sparkles,
  Timer,
} from 'lucide-react';
import { Tabs } from '../components/binary-search/Tabs';
import type { LearningTab } from '../components/binary-search/Tabs';
import { TheoryModule } from '../components/binary-search/modules/TheoryModule';
import { VisualizerModule } from '../components/binary-search/modules/VisualizerModule';
import { ExerciseModule } from '../components/binary-search/modules/ExerciseModule';

const LEARNING_TABS: LearningTab[] = [
  { id: 'teoria', label: 'Entenda', description: 'Conceitos e intuição', icon: BookOpen },
  { id: 'visualizador', label: 'Visualize', description: 'Execução passo a passo', icon: PlayCircle },
  { id: 'exercicios', label: 'Pratique', description: 'Desafio em Java', icon: Code2 },
];

const PREVIEW_VALUES = [2, 5, 8, 12, 16, 23, 38];

export const BinarySearchPage: FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const openModule = (index: number) => {
    setActiveTab(index);
    const moduleSection = document.getElementById('jornada');

    if (typeof moduleSection?.scrollIntoView === 'function') {
      moduleSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-200">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_12%,rgba(59,130,246,0.14),transparent_28%),radial-gradient(circle_at_85%_18%,rgba(139,92,246,0.12),transparent_25%)]" />
      <div className="page-grid pointer-events-none absolute inset-x-0 top-0 h-[760px] opacity-40" />

      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#topo" className="group flex items-center gap-3" aria-label="AlgoLearning - início">
            <span className="flex size-9 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-400 shadow-[0_0_24px_rgba(59,130,246,0.12)] transition-transform group-hover:-rotate-3">
              <Binary size={19} strokeWidth={2.3} />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-white">
              algo<span className="text-blue-400">learning</span>
            </span>
          </a>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-400 sm:flex">
              <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              Trilha Java
            </span>
            <button
              type="button"
              onClick={() => openModule(2)}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
            >
              Ir para o desafio
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      <main id="topo" className="relative z-10">
        <section className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20 lg:pb-28">
          <div className="max-w-3xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/[0.08] px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-300">
              <Sparkles size={14} />
              Algoritmos sem mistério
            </div>

            <h1 className="max-w-3xl text-balance text-5xl font-semibold leading-[1.04] tracking-[-0.045em] text-white sm:text-6xl lg:text-[4.5rem]">
              Encontre a resposta em{' '}
              <span className="text-gradient">metade do caminho.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-slate-400 sm:text-xl">
              Domine busca binária entendendo cada decisão do algoritmo. Aprenda a lógica,
              acompanhe a execução e resolva um desafio real em Java.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => openModule(0)}
                className="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-blue-500 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_12px_35px_rgba(37,99,235,0.28)] transition hover:-translate-y-0.5 hover:bg-blue-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
              >
                Começar pela teoria
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                type="button"
                onClick={() => openModule(1)}
                className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm font-semibold text-slate-200 backdrop-blur transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.07] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
              >
                <PlayCircle size={17} className="text-blue-400" />
                Explorar visualizador
              </button>
            </div>

            <div className="mt-11 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/8 pt-7">
              <div>
                <p className="font-mono text-xl font-semibold text-white">O(log n)</p>
                <p className="mt-1 text-xs text-slate-500">Complexidade de tempo</p>
              </div>
              <div>
                <p className="font-mono text-xl font-semibold text-white">3 etapas</p>
                <p className="mt-1 text-xs text-slate-500">Teoria, visual e prática</p>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-xl font-semibold text-white">
                  <CheckCircle2 size={19} className="text-emerald-400" /> Java
                </p>
                <p className="mt-1 text-xs text-slate-500">Teste seu código na hora</p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:mx-0">
            <div className="absolute -inset-8 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/80 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl">
              <div className="overflow-hidden rounded-[22px] border border-white/[0.06] bg-[#090f1c]">
                <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-rose-400/70" />
                    <span className="size-2.5 rounded-full bg-amber-400/70" />
                    <span className="size-2.5 rounded-full bg-emerald-400/70" />
                  </div>
                  <span className="font-mono text-[11px] text-slate-600">binary-search.java</span>
                </div>

                <div className="p-5 sm:p-7">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Busca em andamento</p>
                      <p className="mt-1 text-sm font-medium text-slate-200">Encontrando o valor 23</p>
                    </div>
                    <span className="flex size-10 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/10 text-blue-400">
                      <Timer size={18} />
                    </span>
                  </div>

                  <div className="mt-8 grid grid-cols-7 gap-1.5 sm:gap-2.5">
                    {PREVIEW_VALUES.map((value, index) => {
                      const isMiddle = value === 12;
                      const isDiscarded = index < 3;

                      return (
                        <div key={value} className="flex flex-col items-center gap-2">
                          <div
                            className={`flex aspect-square w-full items-center justify-center rounded-lg border font-mono text-xs font-semibold transition sm:rounded-xl sm:text-sm ${
                              isMiddle
                                ? 'border-blue-400 bg-blue-500 text-white shadow-[0_0_24px_rgba(59,130,246,0.35)]'
                                : isDiscarded
                                  ? 'border-white/[0.04] bg-white/[0.02] text-slate-700'
                                  : 'border-white/[0.08] bg-white/[0.04] text-slate-300'
                            }`}
                          >
                            {value}
                          </div>
                          <span className="font-mono text-[9px] text-slate-700">{index}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-7 rounded-xl border border-white/[0.06] bg-white/[0.025] p-4 font-mono text-[11px] leading-6 sm:text-xs">
                    <p><span className="text-violet-400">while</span> <span className="text-slate-500">(low &lt;= high) {'{'}</span></p>
                    <p className="pl-4 text-slate-400">mid = low + (high - low) / <span className="text-amber-300">2</span>;</p>
                    <p className="border-l-2 border-blue-400 bg-blue-500/[0.06] pl-[14px] text-blue-200">if (nums[mid] == target) return mid;</p>
                    <p className="text-slate-500">{'}'}</p>
                  </div>

                  <div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.05] px-4 py-3">
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                      <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                    </span>
                    <p className="text-xs text-emerald-200/80">Metade esquerda descartada em uma comparação</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="jornada" className="scroll-mt-24 border-t border-white/[0.06] bg-slate-950/65 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">Sua jornada</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Aprenda fazendo.</h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                  Avance no seu ritmo: construa a base, veja o algoritmo em movimento e transforme conhecimento em código.
                </p>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3 py-2 text-xs text-slate-500">
                <span className="font-mono text-blue-400">0{activeTab + 1}</span>
                de 03 etapas
              </span>
            </div>

            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={LEARNING_TABS} />

            <div
              id={`panel-${LEARNING_TABS[activeTab].id}`}
              role="tabpanel"
              aria-labelledby={`tab-${LEARNING_TABS[activeTab].id}`}
              className="mt-6"
            >
              {activeTab === 0 && <TheoryModule />}
              {activeTab === 1 && <VisualizerModule />}
              {activeTab === 2 && <ExerciseModule />}
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/[0.06] bg-[#070b13]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>Aprenda algoritmos de um jeito visual, prático e direto.</p>
          <p className="font-mono">AlgoLearning · Java + React</p>
        </div>
      </footer>
    </div>
  );
};
