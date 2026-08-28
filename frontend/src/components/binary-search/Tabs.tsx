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
      case 'ArrowRight':
        nextIndex = (index + 1) % tabs.length;
        break;
      case 'ArrowLeft':
        nextIndex = (index - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    setActiveTab(nextIndex);
    document.getElementById(`tab-${tabs[nextIndex].id}`)?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label="Etapas de aprendizagem"
      className="grid grid-cols-1 gap-2 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-2 sm:grid-cols-3"
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
          className={`group flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 sm:px-5 ${
            activeTab === index
              ? 'border-blue-400/20 bg-blue-500/10 shadow-[0_10px_30px_rgba(37,99,235,0.08)]'
              : 'border-transparent hover:border-white/[0.06] hover:bg-white/[0.035]'
          }`}
          onClick={() => setActiveTab(index)}
          onKeyDown={(event) => handleKeyDown(event, index)}
        >
          <span
            className={`flex size-10 shrink-0 items-center justify-center rounded-xl border transition-colors ${
              activeTab === index
                ? 'border-blue-400/20 bg-blue-500/15 text-blue-300'
                : 'border-white/[0.06] bg-white/[0.03] text-slate-500 group-hover:text-slate-300'
            }`}
          >
            <tab.icon size={18} />
          </span>
          <span className="min-w-0">
            <span className={`block text-sm font-semibold ${activeTab === index ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
              <span className="mr-2 font-mono text-[10px] text-slate-600">0{index + 1}</span>
              {tab.label}
            </span>
            <span className="mt-0.5 block truncate text-xs text-slate-600">{tab.description}</span>
          </span>
        </button>
      ))}
    </div>
  );
};
