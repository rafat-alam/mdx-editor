'use client'
import { Textarea } from '@/components/ui2/textarea';
import { EditorHeader } from './EditorHeader';
import { Spinner } from '../ui/shadcn-io/spinner';

interface EditorPanelProps {
  mdxContent: string;
  handleContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSave: () => Promise<void>;
  isAdmin: boolean;
  loading: boolean;
  saveButtonDisable: boolean;
  isEditorFullscreen: boolean;
  toggleEditorFullscreen: () => void;
  getEditorWidth: () => string;
  isMobileView: boolean;
  activeTab: 'editor' | 'preview';
  isPreviewFullscreen: boolean;
  taRef: React.RefObject<HTMLTextAreaElement | null>;
  onTextareaScroll: () => void;
  setMdxContent: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  selectedText: string;
  setSelectedText: React.Dispatch<React.SetStateAction<string>>;
  path: string [];
}

export function EditorPanel({
  mdxContent,
  handleContentChange,
  handleSave,
  isAdmin,
  loading,
  saveButtonDisable,
  isEditorFullscreen,
  toggleEditorFullscreen,
  getEditorWidth,
  isMobileView,
  activeTab,
  isPreviewFullscreen,
  taRef,
  onTextareaScroll,
  setMdxContent,
  setLoading,
  selectedText,
  setSelectedText,
  path,
}: EditorPanelProps) {
  const getSelectedText = () => {
    const el = taRef.current
    if (!el) return ''

    const { selectionStart, selectionEnd, value } = el
    if (selectionStart === selectionEnd) return ''

    return value.slice(selectionStart, selectionEnd)
  }

  return (
    <div
      className={`${getEditorWidth()} h-full border-r border-slate-200 dark:border-slate-700 transition-all duration-300 ${
        (isMobileView && activeTab !== 'editor') || isPreviewFullscreen ? 'hidden' : ''
      }`}
    >
      <EditorHeader
        isAdmin={isAdmin}
        loading={loading}
        mdxContent={mdxContent}
        setMdxContent={setMdxContent}
        setLoading={setLoading}
        handleSave={handleSave}
        saveButtonDisable={saveButtonDisable}
        isEditorFullscreen={isEditorFullscreen}
        toggleEditorFullscreen={toggleEditorFullscreen}
        selectedText={selectedText}
        path={path}
      />
      
      {loading ? (
        <div className='w-full h-[calc(100%-3.5rem)] bg-muted flex items-center justify-center'>
          <Spinner />
        </div>
      ) : (
        <Textarea
          className="w-full h-[calc(100%-3.5rem)] p-4 border-none rounded-none resize-none font-mono focus:ring-0 focus:outline-none text-base"
          value={mdxContent}
          onChange={handleContentChange}
          style={{ fontSize: '1rem', lineHeight: '1.5' }}
          readOnly={!isAdmin}
          ref={taRef}
          onScroll={onTextareaScroll}
          onMouseUp={() => {
            const selected = getSelectedText()
            setSelectedText(selected)
          }}
          onKeyUp={() => {
            const selected = getSelectedText()
            setSelectedText(selected)
          }}
        />
      )}
    </div>
  );
}
