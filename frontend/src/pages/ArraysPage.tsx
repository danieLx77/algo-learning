import { useState } from 'react';
import type { FC } from 'react';
import { ArrowRight, BookOpen, Code2, PlayCircle, Sparkles } from 'lucide-react';
import { ArrayExerciseModule } from '../components/arrays/modules/ArrayExerciseModule';
import { ArrayTheoryModule } from '../components/arrays/modules/ArrayTheoryModule';
import { ArrayVisualizerModule } from '../components/arrays/modules/ArrayVisualizerModule';
import { AlgorithmLandscape } from '../components/layout/AlgorithmLandscape';
import { SiteHeader } from '../components/layout/SiteHeader';
import { Tabs } from '../components/learning/Tabs';
import type { LearningTab } from '../components/learning/Tabs';

const LEARNING_TABS: LearningTab[] = [
  { id: 'teoria-arrays', label: 'Entenda', description: 'Estrutura e complexidade', icon: BookOpen },
  { id: 'visualizador-arrays', label: 'Visualize', description: 'Operações passo a passo', icon: PlayCircle },
  { id: 'exercicios-arrays', label: 'Pratique', description: 'Desafio em Java', icon: Code2 },
];

export const ArraysPage: FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const openModule = (index: number) => {
    setActiveTab(index);
    document.getElementById('jornada-arrays')?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="site-canvas">
      <div className="site-frame text-zinc-200">
        <SiteHeader action={(
          <button type="button" onClick={() => openModule(2)} className="primary-pill px-4 py-2 text-[11px]">
            Ir para o desafio <ArrowRight size={13} />
          </button>
        )} />

        <main className="relative z-10">
          <section className="mx-auto max-w-[1120px] px-4 pt-16 text-center sm:px-8 sm:pt-20">
            <div className="hero-kicker"><Sparkles size={12} /> Fundamentos de dados</div>
            <h1 className="mx-auto mt-7 max-w-4xl text-balance text-5xl font-medium leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-[5.25rem]">
              Cada posição guarda uma <span className="text-gradient">história em ordem.</span>
            </h1>
            <p className="mx-auto mt-7 max-w-xl text-pretty text-sm leading-6 text-zinc-500 sm:text-base">
              Domine índices, percursos e deslocamentos para entender uma das estruturas mais importantes da programação.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button type="button" onClick={() => openModule(0)} className="primary-pill px-6 py-3 text-xs">
                Começar pela teoria <ArrowRight size={14} />
              </button>
              <button type="button" onClick={() => openModule(1)} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-6 py-3 text-xs font-medium text-zinc-300 transition hover:border-violet-300/20 hover:bg-violet-300/[0.06] hover:text-white focus-visible:outline-2 focus-visible:outline-violet-300">
                <PlayCircle size={14} className="text-violet-300" /> Explorar operações
              </button>
            </div>
          </section>

          <div className="mx-auto max-w-[1120px] px-2 sm:px-6"><AlgorithmLandscape variant="arrays" /></div>

          <section id="jornada-arrays" className="scroll-mt-24 border-t border-white/[0.055] bg-black/15 py-20 sm:py-24">
            <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
              <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-300">Sua jornada</p>
                  <h2 className="mt-4 text-3xl font-medium tracking-[-0.035em] text-white sm:text-5xl">Construa a base.</h2>
                  <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-500">Entenda como os dados ocupam posições, veja cada operação e pratique com um desafio real.</p>
                </div>
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-4 py-2 text-[10px] uppercase tracking-wider text-zinc-600">
                  <span className="font-mono text-violet-300">0{activeTab + 1}</span> de 03 etapas
                </span>
              </div>

              <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={LEARNING_TABS} />
              <div id={`panel-${LEARNING_TABS[activeTab].id}`} role="tabpanel" aria-labelledby={`tab-${LEARNING_TABS[activeTab].id}`} className="mt-6">
                {activeTab === 0 && <ArrayTheoryModule />}
                {activeTab === 1 && <ArrayVisualizerModule />}
                {activeTab === 2 && <ArrayExerciseModule />}
              </div>
            </div>
          </section>
        </main>

        <footer className="relative z-10 border-t border-white/[0.055]">
          <div className="mx-auto flex max-w-[1120px] flex-col gap-4 px-5 py-8 text-[11px] text-zinc-700 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p>Aprenda estruturas de um jeito visual, prático e direto.</p>
            <p className="font-mono">AlgoLearning · Java + React</p>
          </div>
        </footer>
      </div>
    </div>
  );
};
