import React from 'react';

interface TabsProps {
  activeTab: number;
  setActiveTab: (index: number) => void;
  tabs: string[];
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab, tabs }) => {
  return (
    <div className="flex border-b border-slate-700 mb-6">
      {tabs.map((tab, index) => (
        <button
          key={index}
          className={`py-2 px-6 font-medium text-sm transition-colors duration-200 border-b-2 ${
            activeTab === index
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
          }`}
          onClick={() => setActiveTab(index)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};
