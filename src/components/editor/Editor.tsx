'use client'
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import axios from 'axios';
import { EditorPanel } from './EditorPanel';
import { PreviewPanel } from './PreviewPanel';
import { MobileTabSelector } from './MobileTabSelector';
import { useMobileView } from './useMobileView';

const DEFAULT_CONTENT = '# Hello, MDX!\n\nThis is a sample MDX document.\n\n```js\nconsole.log("Hello world");\n```\n\n## Features\n\n- **Bold text** and *italic text*\n- Lists and code blocks\n- And more!';

interface Props {
  path: string[];
}

interface AxiosResponse {
  status: number;
  data: {
    message: string;
    list: null | any[];
  }
}

export function Editor({ path }: Props) {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [mdxContent, setMdxContent] = useState(DEFAULT_CONTENT);
  const [isEditorFullscreen, setIsEditorFullscreen] = useState(false);
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [loading, setLoading] = useState(true);
  const [saveButtonDisable, setSaveButtonDisable] = useState(false);
  const [isContentArrived, setIsContentArrived] = useState(false);
  const [isUserArrived, setIsUserArrived] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const taRef = useRef<HTMLTextAreaElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  
  const isMobileView = useMobileView();

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

  useEffect(() => {
    if (isContentArrived && isUserArrived) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [isContentArrived, isUserArrived]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res: AxiosResponse = await axios.post('/api/edit/get-path', { path });

        if (res.data.list == null) {
          setMdxContent(res.data.message);
          setIsContentArrived(true);
        } else {
          router.replace('/');
        }
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;

          if (!status) {
            toast.error("Network error!");
            return;
          }

          if (status === 400) toast.error(error.response?.data?.message ?? "Bad request");
          else if (status === 401) router.push("/signin");
          else if (status === 403) router.push("/");
          else if (status === 404) router.push("/404");
          else router.push("/");
        } else {
          toast.error("Unexpected error occurred!");
        }
      }
    }

    fetch();
  }, []);

  useEffect(() => {
    if (status != "loading") {
      if (status == "authenticated" && session.user.username == path[0]) {
        setIsAdmin(true);
      }
      if (status == "unauthenticated" || session?.user.username != path[0]) {
        setIsAdmin(false);
      }
      setIsUserArrived(true);
    }
  }, [status, session]);

  const handleSave = async () => {
    setSaveButtonDisable(true);
    try {
      await axios.post('/api/edit/save', { path, content: mdxContent });

      toast.success("File Saved!");
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (!status) {
          toast.error("Network error!");
          return;
        }

        if (status === 400) toast.error(error.response?.data?.message ?? "Bad request");
        else if (status === 401) router.push("/signin");
        else if (status === 403) router.push("/");
        else if (status === 404) router.push("/404");
        else router.push("/");
      } else {
        toast.error("Unexpected error occurred!");
      }
    }

    setSaveButtonDisable(false);
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setMdxContent(newContent);
  };

  const toggleEditorFullscreen = () => {
    setIsEditorFullscreen(!isEditorFullscreen);
    if (!isEditorFullscreen) {
      setIsPreviewFullscreen(false);
    }
  };

  const togglePreviewFullscreen = () => {
    const newState = !isPreviewFullscreen;
    setIsPreviewFullscreen(newState);
    if (newState) {
      setIsEditorFullscreen(false);
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 100);
      }, 50);
    }
  };

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
      {isMobileView && (
        <MobileTabSelector
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
      
      <EditorPanel
        mdxContent={mdxContent}
        handleContentChange={handleContentChange}
        handleSave={handleSave}
        isAdmin={isAdmin}
        loading={loading}
        saveButtonDisable={saveButtonDisable}
        isEditorFullscreen={isEditorFullscreen}
        toggleEditorFullscreen={toggleEditorFullscreen}
        getEditorWidth={getEditorWidth}
        isMobileView={isMobileView}
        activeTab={activeTab}
        isPreviewFullscreen={isPreviewFullscreen}
        taRef={taRef}
        onTextareaScroll={onTextareaScroll}
        setMdxContent={setMdxContent}
        setLoading={setLoading}
      />
      
      <PreviewPanel
        mdxContent={mdxContent}
        isPreviewFullscreen={isPreviewFullscreen}
        togglePreviewFullscreen={togglePreviewFullscreen}
        getPreviewWidth={getPreviewWidth}
        isMobileView={isMobileView}
        activeTab={activeTab}
        divRef={divRef}
      />
    </div>
  );
}
