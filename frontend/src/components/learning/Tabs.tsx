import type { FC, KeyboardEvent } from 'react';
import type { LucideIcon } from 'lucide-react';

export interface LearningTab {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

interface TabsProps {
  activeTab: number;
  setActiveTab: (index: number) => void;
  tabs: LearningTab[];
}

export const Tabs: FC<TabsProps> = ({ activeTab, setActiveTab, tabs }) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number;

    switch (event.key) {
      case 'ArrowRight': nextIndex = (index + 1) % tabs.length; break;
      case 'ArrowLeft': nextIndex = (index - 1 + tabs.length) % tabs.length; break;
      case 'Home': nextIndex = 0; break;
      case 'End': nextIndex = tabs.length - 1; break;
      default: return;
    }

    event.preventDefault();
    setActiveTab(nextIndex);
    document.getElementById(`tab-${tabs[nextIndex].id}`)?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label="Etapas de aprendizagem"
      className="grid grid-cols-1 gap-2 rounded-[22px] border border-white/[0.055] bg-white/[0.018] p-2 sm:grid-cols-3"
    >
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          id={`tab-${tab.id}`}
          type="button"
          role="tab"
          aria-selected={activeTab === index}
          aria-controls={`panel-${tab.id}`}
          tabIndex={activeTab === index ? 0 : -1}
          className={`group flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300 sm:px-5 ${
            activeTab === index
              ? 'border-violet-300/15 bg-violet-400/[0.08] shadow-[0_12px_36px_rgba(91,33,182,0.1)]'
              : 'border-transparent hover:border-white/[0.06] hover:bg-white/[0.035]'
          }`}
          onClick={() => setActiveTab(index)}
          onKeyDown={(event) => handleKeyDown(event, index)}
        >
          <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl border transition-colors ${
            activeTab === index
              ? 'border-violet-300/15 bg-violet-400/10 text-violet-300'
              : 'border-white/[0.06] bg-white/[0.03] text-slate-500 group-hover:text-slate-300'
          }`}>
            <tab.icon size={18} />
          </span>
          <span className="min-w-0">
            <span className={`block text-sm font-semibold ${activeTab === index ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
              <span className="mr-2 font-mono text-[10px] text-zinc-700">0{index + 1}</span>
              {tab.label}
            </span>
            <span className="mt-0.5 block truncate text-xs text-zinc-600">{tab.description}</span>
          </span>
        </button>
      ))}
    </div>
  );
};
