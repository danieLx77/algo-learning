import type { FC } from 'react';

interface TabsProps {
  activeTab: number;
  setActiveTab: (index: number) => void;
  tabs: string[];
}

export const Tabs: FC<TabsProps> = ({ activeTab, setActiveTab, tabs }) => {
  return (
    <div className="flex gap-1 border-b border-slate-800 mb-8">
      {tabs.map((tab, index) => (
        <button
          key={index}
          className={`py-2.5 px-5 font-medium text-sm rounded-t-lg transition-all duration-200 ${
            activeTab === index
              ? 'bg-blue-500/10 text-blue-400 border-b-2 border-blue-500'
              : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 border-b-2 border-transparent'
          }`}
          onClick={() => setActiveTab(index)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};
