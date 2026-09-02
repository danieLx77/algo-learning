import { useState } from 'react';
import type { FC } from 'react';
import {
  ArrowRight,
  BookOpen,
  Code2,
  PlayCircle,
  Sparkles,
} from 'lucide-react';
import { AlgorithmLandscape } from '../components/layout/AlgorithmLandscape';
import { SiteHeader } from '../components/layout/SiteHeader';
import { Tabs } from '../components/learning/Tabs';
import type { LearningTab } from '../components/learning/Tabs';
import { TheoryModule } from '../components/binary-search/modules/TheoryModule';
import { VisualizerModule } from '../components/binary-search/modules/VisualizerModule';
import { ExerciseModule } from '../components/binary-search/modules/ExerciseModule';

const LEARNING_TABS: LearningTab[] = [
  { id: 'teoria', label: 'Entenda', description: 'Conceitos e intuição', icon: BookOpen },
  { id: 'visualizador', label: 'Visualize', description: 'Execução passo a passo', icon: PlayCircle },
  { id: 'exercicios', label: 'Pratique', description: 'Desafio em Java', icon: Code2 },
];

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
    <div className="site-canvas">
      <div className="site-frame text-zinc-200">
        <SiteHeader
          action={(
            <button type="button" onClick={() => openModule(2)} className="primary-pill px-4 py-2 text-[11px]">
              Ir para o desafio <ArrowRight size={13} />
            </button>
          )}
        />

        <main id="topo" className="relative z-10">
          <section className="mx-auto max-w-[1120px] px-4 pt-16 text-center sm:px-8 sm:pt-20">
            <div className="hero-kicker"><Sparkles size={12} /> Algoritmos sem mistério</div>
            <h1 className="mx-auto mt-7 max-w-4xl text-balance text-5xl font-medium leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-[5.25rem]">
              Encontre a resposta em <span className="text-gradient">metade do caminho.</span>
            </h1>
            <p className="mx-auto mt-7 max-w-xl text-pretty text-sm leading-6 text-zinc-500 sm:text-base">
              Entenda cada decisão da busca binária, acompanhe a execução e resolva um desafio real em Java.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button type="button" onClick={() => openModule(0)} className="primary-pill px-6 py-3 text-xs">
                Começar pela teoria <ArrowRight size={14} />
              </button>
              <button
                type="button"
                onClick={() => openModule(1)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-6 py-3 text-xs font-medium text-zinc-300 transition hover:border-violet-300/20 hover:bg-violet-300/[0.06] hover:text-white focus-visible:outline-2 focus-visible:outline-violet-300"
              >
                <PlayCircle size={14} className="text-violet-300" /> Explorar visualizador
              </button>
            </div>
          </section>

          <div className="mx-auto max-w-[1120px] px-2 sm:px-6">
            <AlgorithmLandscape variant="binary-search" />
          </div>

          <section id="jornada" className="scroll-mt-24 border-t border-white/[0.055] bg-black/15 py-20 sm:py-24">
          <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
            <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-300">Sua jornada</p>
                <h2 className="mt-4 text-3xl font-medium tracking-[-0.035em] text-white sm:text-5xl">Aprenda fazendo.</h2>
                <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-500">
                  Avance no seu ritmo: construa a base, veja o algoritmo em movimento e transforme conhecimento em código.
                </p>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-4 py-2 text-[10px] uppercase tracking-wider text-zinc-600">
                <span className="font-mono text-violet-300">0{activeTab + 1}</span>
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

        <footer className="relative z-10 border-t border-white/[0.055]">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-4 px-5 py-8 text-[11px] text-zinc-700 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>Aprenda algoritmos de um jeito visual, prático e direto.</p>
          <p className="font-mono">AlgoLearning · Java + React</p>
        </div>
        </footer>
      </div>
    </div>
  );
};
