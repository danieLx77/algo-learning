import { useState } from 'react';
import type { FC } from 'react';
import { Tabs } from '../components/binary-search/Tabs';
import { TheoryModule } from '../components/binary-search/modules/TheoryModule';
import { VisualizerModule } from '../components/binary-search/modules/VisualizerModule';
import { ExerciseModule } from '../components/binary-search/modules/ExerciseModule';

export const BinarySearchPage: FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['Teoria', 'Visualizador', 'Exercícios'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <header className="bg-slate-900 border-b border-slate-800 py-5 px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-semibold text-white tracking-tight">AlgoLearning</h1>
          <div className="flex gap-4">
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">Busca Binária</h1>
          <p className="text-slate-400 text-lg">Aprenda, visualize e pratique o algoritmo de Busca Binária.</p>
        </div>

        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />

        <div className="mt-6">
          {activeTab === 0 && <TheoryModule />}
          {activeTab === 1 && <VisualizerModule />}
          {activeTab === 2 && <ExerciseModule />}
        </div>
      </main>
    </div>
  );
};
