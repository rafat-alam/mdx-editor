'use client'
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';
import { AskAI } from './AskAI';
import { AdminIndicator } from './AdminIndicator';

interface EditorHeaderProps {
  isAdmin: boolean;
  loading: boolean;
  mdxContent: string;
  setMdxContent: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleSave: () => Promise<void>;
  saveButtonDisable: boolean;
  isEditorFullscreen: boolean;
  toggleEditorFullscreen: () => void;
}

export function EditorHeader({
  isAdmin,
  loading,
  mdxContent,
  setMdxContent,
  setLoading,
  handleSave,
  saveButtonDisable,
  isEditorFullscreen,
  toggleEditorFullscreen,
}: EditorHeaderProps) {
  return (
    <div className="p-3 h-14 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
      <h2 className="text-lg font-semibold">MDX Editor</h2>
      <AdminIndicator isAdmin={isAdmin} loading={loading} />
      <AskAI 
        content={mdxContent} 
        setcontent={setMdxContent} 
        setloading={setLoading} 
        disabled={!isAdmin || loading}
      />
      <Button 
        variant="outline" 
        onClick={() => {handleSave()}} 
        disabled={saveButtonDisable || !isAdmin || loading}
      >
        Save File
      </Button>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleEditorFullscreen}
          className="h-8 w-8 p-0"
          title={isEditorFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isEditorFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </Button>
      </div>
    </div>
  );
}
