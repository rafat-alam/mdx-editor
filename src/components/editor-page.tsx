'use client'
import { MDXRenderer } from '@/components/mdx-renderer';
import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui2/textarea';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';
import { AskAI } from './ai-popup';
import { Spinner } from './ui/shadcn-io/spinner';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const DEFAULT_CONTENT = '# Hello, MDX!\n\nThis is a sample MDX document.\n\n```js\nconsole.log("Hello world");\n```\n\n## Features\n\n- **Bold text** and *italic text*\n- Lists and code blocks\n- And more!';

interface Props {
  path : string [];
}

interface AxiosResponse {
  status: number;
  data: {
    message: string;
    list: null | any [];
  }
}

export function EditorPage({ path } : Props) {
  const router = useRouter();
  const [mdxContent, setMdxContent] = useState(DEFAULT_CONTENT);
  const [isEditorFullscreen, setIsEditorFullscreen] = useState(false);
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [loading, setLoading] = useState(true);
  const [saveButtonDisable, setSaveButtonDisable] = useState(false);
  const [isContentArrived, setIsContentArrived] = useState(false);
  const [isUserArrived, setIsUserArrived] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  const onTextareaScroll = () => {
    requestAnimationFrame(() => {
      if (taRef.current && divRef.current)
        syncByRatio(taRef.current, divRef.current);
    });
  };

  function syncByRatio(from: HTMLElement, to: HTMLElement) {
    const fromMax = from.scrollHeight - from.clientHeight;
    const toMax = to.scrollHeight - to.clientHeight;
    if (fromMax <= 0 || toMax <= 0) return;

    const ratio = from.scrollTop / fromMax;
    to.scrollTop = ratio * toMax;
  }

  //Check for mobile view and handle resize
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkMobileView();

    window.addEventListener('resize', checkMobileView);

    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  useEffect(() => {
    if(isContentArrived && isUserArrived) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [isContentArrived, isUserArrived]);


  useEffect(() => {
    const fetch = async () => {
      try {
        const res: AxiosResponse = await axios.post('/api/edit/get-path', { path }, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if(res.status == 200 && res.data.list == null) {
          setMdxContent(res.data.message);
          setIsContentArrived(true);
        } else {
          router.replace('/');
        }
      } catch {
        router.replace('/');
      }
    }

    fetch();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res: AxiosResponse = await axios.get(`/api/u/${path[0]}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if(res.status == 200 && res.data.message == "1") {
          setIsAdmin(true);
          setIsUserArrived(true);
        } else if(res.status == 200 && res.data.message == "2") {
          setIsUserArrived(true);
        } else {
          router.replace('/');
        }
      } catch {
        router.replace('/');
      }
    }

    fetch();
  }, []);

  const handleSave = async () => {
    setSaveButtonDisable(true);
    try {
      const res: AxiosResponse = await axios.post('/api/edit/save', { path , content: mdxContent }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if(res.status == 200) {
        toast.success("File Saved");
      } else if(res.status == 400) {
        toast.error(res.data.message);
      } else {
        router.replace('/');
      }
    } catch {
      router.replace('/');
    }
    setSaveButtonDisable(false);
  }

  // Handle content changes
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setMdxContent(newContent);
  };

  // Toggle fullscreen for editor
  const toggleEditorFullscreen = () => {
    setIsEditorFullscreen(!isEditorFullscreen);
    if (!isEditorFullscreen) {
      setIsPreviewFullscreen(false);
    }
  };

  // Toggle fullscreen for preview
  const togglePreviewFullscreen = () => {
    const newState = !isPreviewFullscreen;
    setIsPreviewFullscreen(newState);
    if (newState) {
      // When entering fullscreen, ensure editor is hidden
      setIsEditorFullscreen(false);
      // Force a reflow to ensure the layout updates correctly
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
        // Force another reflow after a bit more time to ensure content is centered
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 100);
      }, 50);
    }
  };

  // Determine panel widths based on fullscreen states
  const getEditorWidth = () => {
    if (isMobileView) return 'w-full';
    if (isEditorFullscreen) return 'w-full';
    if (isPreviewFullscreen) return 'w-0 hidden';
    return 'w-2/3';
  };

  const getPreviewWidth = () => {
    if (isMobileView) return 'w-full';
    if (isPreviewFullscreen) return 'w-full';
    if (isEditorFullscreen) return 'w-0 hidden';
    return 'w-1/3';
  };

  return (
    <div className={`flex flex-col md:flex-row h-[calc(100vh-4rem)] ${isPreviewFullscreen || isEditorFullscreen ? 'overflow-hidden' : ''}`}>
      {/* Mobile Tab Selector */}
      {isMobileView && (
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
      )}
      {/* Editor Panel */}
      <div
        className={`${getEditorWidth()} h-full border-r border-slate-200 dark:border-slate-700 transition-all duration-300 ${
          (isMobileView && activeTab !== 'editor') || isPreviewFullscreen ? 'hidden' : ''
        }`}
      >
        <div className="p-3 h-14 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold">MDX Editor</h2>
          <div className='w-32 text text-red-500 text-center'>{isAdmin || loading ? `` : `Read Only`}</div>
          <AskAI content={mdxContent} setcontent={setMdxContent} setloading={setLoading} disabled={!isAdmin || loading}/>
          <Button variant="outline" onClick={() => {handleSave()}} disabled={saveButtonDisable || !isAdmin || loading}>Save File</Button>
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
          {loading ? <div className='w-full h-[calc(100%-3.5rem)] bg-muted flex items-center justify-center'><Spinner /></div> : 
            <Textarea
              className="w-full h-[calc(100%-3.5rem)] p-4 border-none rounded-none resize-none font-mono focus:ring-0 focus:outline-none text-base"
              value={mdxContent}
              onChange={handleContentChange}
              style={{ fontSize: '1rem', lineHeight: '1.5' }}
              readOnly={!isAdmin}
              ref={taRef}
              onScroll={onTextareaScroll}
            />
          }
        </div>
      {/* Preview Panel */}
      <div
        className={`${getPreviewWidth()} h-full overflow-auto transition-all duration-300 ${
          isMobileView && activeTab !== 'preview' ? 'hidden' : ''
        } ${isPreviewFullscreen ? 'w-full' : ''}`}
      >
        <div className="p-3 h-14 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Preview</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePreviewFullscreen}
              className="h-8 w-8 p-0"
              title={isPreviewFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isPreviewFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </Button>
          </div>
        </div>
        <div className={`overflow-auto h-[calc(100%-3.5rem)] w-full ${isPreviewFullscreen ? 'p-6' : 'p-4'}`} ref={divRef}>
          <div className="prose prose-sm sm:prose dark:prose-invert w-full max-w-none prose-headings:text-inherit prose-p:text-inherit prose-a:text-blue-600 prose-strong:font-bold prose-em:italic prose-ul:list-disc prose-ol:list-decimal prose-li:ml-4 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:p-4 prose-pre:rounded prose-pre:overflow-auto prose-code:text-red-500 prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 prose-img:max-w-full">
            <MDXRenderer content={mdxContent} />
          </div>
        </div>
      </div>
    </div>
  );
}
