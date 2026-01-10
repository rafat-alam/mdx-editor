'use client'

interface MobileTabSelectorProps {
  activeTab: 'editor' | 'preview';
  setActiveTab: (tab: 'editor' | 'preview') => void;
}

export function MobileTabSelector({
  activeTab,
  setActiveTab,
}: MobileTabSelectorProps) {
  return (
    <div className="flex border-b border-slate-200 dark:border-slate-700">
      <button
        className={`flex-1 py-3 px-4 text-center font-medium ${
          activeTab === 'editor'
            ? 'bg-slate-100 dark:bg-slate-800 border-b-2 border-primary'
            : 'bg-transparent'
        }`}
        onClick={() => setActiveTab('editor')}
      >
        Editor
      </button>
      <button
        className={`flex-1 py-3 px-4 text-center font-medium ${
          activeTab === 'preview'
            ? 'bg-slate-100 dark:bg-slate-800 border-b-2 border-primary'
            : 'bg-transparent'
        }`}
        onClick={() => setActiveTab('preview')}
      >
        Preview
      </button>
    </div>
  );
}
