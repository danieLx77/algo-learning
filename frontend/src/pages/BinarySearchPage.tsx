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
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <header className="bg-slate-800 border-b border-slate-700 py-6 px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white tracking-tight">AlgoLearning</h1>
          <div className="flex gap-4">
            {/* Espaço para futuros menus, login, etc */}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Busca Binária</h1>
          <p className="text-slate-400">Aprenda, visualize e pratique o algoritmo de Busca Binária.</p>
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
