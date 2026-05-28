import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Group as PanelGroup,
  Panel,
  Separator as PanelResizeHandle,
} from 'react-resizable-panels';
import toast from 'react-hot-toast';
import {
  ChevronLeft,
  Play,
  Send,
  GripVertical,
  GripHorizontal,
  Loader2,
} from 'lucide-react';

import api from '../services/api';
import {
  runCode,
  submitCode,
  getQuestionSubmissions,
  getPublicTestCases,
  DEFAULT_BOILERPLATES,
  LANGUAGE_IDS,
  type ExecutionResult,
  type VerdictResult,
  type Submission,
  type PublicTestCase,
} from '../services/codeService';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAuth } from '../context/AuthContext';

import ProblemPanel from '../components/problem/ProblemPanel';
import CodeEditor from '../components/editor/CodeEditor';
import LanguageSelector from '../components/editor/LanguageSelector';
import EditorSettingsBar from '../components/editor/EditorSettingsBar';
import ConsolePanel from '../components/editor/ConsolePanel';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Question {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  type: string;
  constraints: string;
  testCases?: string | null;
  link?: string | null;
  boilerplates?: string | null;
}

type ConsoleTab = 'testcase' | 'output' | 'submissions';

// ─── Component ───────────────────────────────────────────────────────────────
const QuestionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // ── Question state
  const [question, setQuestion] = useState<Question | null>(null);
  const [questionLoading, setQuestionLoading] = useState(true);

  // ── Public test cases (fetched from /testcases/public)
  const [publicTestCases, setPublicTestCases] = useState<PublicTestCase[]>([]);

  // ── Editor preferences (persisted)
  const [language, setLanguage] = useLocalStorage<string>(`editor-lang-${id}`, 'java');
  const [fontSize, setFontSize] = useLocalStorage<number>('editor-font-size', 14);
  const [showMinimap, setShowMinimap] = useLocalStorage<boolean>('editor-minimap', false);

  // ── Per-question, per-language code persistence
  const [codeMap, setCodeMap] = useLocalStorage<Record<string, string>>(
    `editor-code-${id}`,
    DEFAULT_BOILERPLATES
  );

  // ── Execution state
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResult, setRunResult] = useState<ExecutionResult | null>(null);
  const [submitResult, setSubmitResult] = useState<VerdictResult | null>(null);

  // ── Console
  const [consoleTab, setConsoleTab] = useState<ConsoleTab>('testcase');
  const [customInput, setCustomInput] = useLocalStorage<string>(`stdin-${id}`, '');

  // ── Submissions history
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // ── Fullscreen
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // ─── Fetch question + public test cases ─────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    setQuestionLoading(true);
    // Fetch question details and public test cases in parallel
    Promise.all([
      api.get(`/questions/${id}`),
      getPublicTestCases(Number(id)),
    ])
      .then(([qRes, tcData]) => {
        setQuestion(qRes.data);
        setPublicTestCases(tcData);
      })
      .catch(() => toast.error('Failed to load problem.'))
      .finally(() => setQuestionLoading(false));
  }, [id]);

  // ─── Fetch submissions for this question ────────────────────────────────────
  const fetchSubmissions = () => {
    if (!id) return;
    setLoadingSubmissions(true);
    getQuestionSubmissions(Number(id))
      .then((data) => setSubmissions(data))
      .catch(() => {/* silently fail */ })
      .finally(() => setLoadingSubmissions(false));
  };

  useEffect(() => {
    fetchSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ─── Keyboard shortcut: Ctrl+Enter → Run ─────────────────────────────────────
  useEffect(() => {
    const handler = () => handleRun();
    window.addEventListener('editor:run', handler);
    return () => window.removeEventListener('editor:run', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, codeMap, customInput]);

  // ─── Fullscreen toggle ───────────────────────────────────────────────────────
  const handleFullscreenToggle = useCallback(() => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.().catch(() => { });
    } else {
      document.exitFullscreen?.().catch(() => { });
    }
    setIsFullscreen((prev) => !prev);
  }, [isFullscreen]);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // ─── Code helpers ────────────────────────────────────────────────────────────
  const getBoilerplate = useCallback((lang: string): string => {
    if (question && question.boilerplates) {
      try {
        const customBoilerplates = JSON.parse(question.boilerplates);
        if (customBoilerplates && customBoilerplates[lang]) {
          return customBoilerplates[lang];
        }
      } catch (e) {
        console.error('Failed to parse question boilerplates', e);
      }
    }
    return DEFAULT_BOILERPLATES[lang] ?? '';
  }, [question]);

  const currentCode = codeMap[language] ?? getBoilerplate(language);

  const handleCodeChange = useCallback(
    (value: string) => {
      setCodeMap((prev) => ({ ...prev, [language]: value }));
    },
    [language, setCodeMap]
  );

  const handleLanguageChange = useCallback(
    (lang: string) => {
      setLanguage(lang);
      // If no code stored for this language yet, seed with boilerplate
      if (!codeMap[lang]) {
        setCodeMap((prev) => ({
          ...prev,
          [lang]: getBoilerplate(lang),
        }));
      }
    },
    [codeMap, setCodeMap, setLanguage, getBoilerplate]
  );

  const handleReset = useCallback(() => {
    const boilerplate = getBoilerplate(language);
    setCodeMap((prev) => ({ ...prev, [language]: boilerplate }));
    toast('Code reset to boilerplate.', { icon: '🔄' });
  }, [language, setCodeMap, getBoilerplate]);

  // Seed or update codeMap with custom boilerplates if local storage doesn't have custom modifications
  useEffect(() => {
    if (question) {
      const updatedCodeMap = { ...codeMap };
      let changed = false;
      const langs = ['java', 'cpp', 'c', 'python', 'javascript'];
      langs.forEach(lang => {
        const bp = getBoilerplate(lang);
        if (!codeMap[lang] || codeMap[lang] === DEFAULT_BOILERPLATES[lang]) {
          updatedCodeMap[lang] = bp;
          changed = true;
        }
      });
      if (changed) {
        setCodeMap(updatedCodeMap);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question]);

  // ─── Run ─────────────────────────────────────────────────────────────────────
  const handleRun = async () => {
    if (isRunning || isSubmitting) return;
    setIsRunning(true);
    setConsoleTab('output');
    setRunResult(null);

    try {
      const result = await runCode({
        code: currentCode,
        languageId: LANGUAGE_IDS[language],
        stdin: customInput,
        questionId: Number(id),
      });
      setRunResult(result);

      const statusId = result?.status?.id;
      if (statusId === 3) {
        toast.success('Code ran successfully!');
      } else if (statusId === 6) {
        toast.error('Compilation Error');
      } else if (statusId === 5) {
        toast.error('Time Limit Exceeded');
      } else if (statusId && statusId > 3) {
        toast.error(result.status.description);
      }
    } catch (err: any) {
      if (err?.response?.status === 401) {
        toast.error('Session expired or unauthorized. Please log in.');
        navigate('/login');
      } else {
        toast.error(err?.response?.data?.message || 'Run failed. Check your connection.');
      }
      setRunResult(null);
    } finally {
      setIsRunning(false);
    }
  };

  // ─── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please log in to submit solutions.');
      navigate('/login');
      return;
    }
    if (isRunning || isSubmitting) return;

    setIsSubmitting(true);
    setConsoleTab('submissions');
    setSubmitResult(null);

    try {
      const result = await submitCode(Number(id), {
        code: currentCode,
        languageId: LANGUAGE_IDS[language],
      });
      setSubmitResult(result);

      const verdict = result?.verdict;
      if (verdict === 'ACCEPTED') {
        toast.success('🎉 Accepted! Great work!', { duration: 5000 });
      } else if (verdict === 'WRONG_ANSWER') {
        toast.error(`Wrong Answer — ${result.passedCount}/${result.totalCount} test cases passed`);
      } else if (verdict === 'COMPILATION_ERROR') {
        toast.error('Compilation Error');
      } else if (verdict === 'TIME_LIMIT_EXCEEDED') {
        toast.error('Time Limit Exceeded');
      } else if (verdict === 'RUNTIME_ERROR') {
        toast.error('Runtime Error');
      } else {
        toast.error(verdict || 'Submission failed');
      }

      // Refresh submissions list
      fetchSubmissions();
    } catch (err: any) {
      if (err?.response?.status === 401) {
        toast.error('Session expired or unauthorized. Please log in.');
        navigate('/login');
      } else {
        const msg =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          'Submission failed.';
        toast.error(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Loading skeleton ─────────────────────────────────────────────────────────
  if (questionLoading) {
    return (
      <div className="h-[calc(100vh-64px)] bg-[#1a1a1a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400 text-sm">Loading problem...</span>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="h-[calc(100vh-64px)] bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-white text-xl font-bold mb-2">Problem Not Found</h2>
          <p className="text-gray-400 mb-4">This problem doesn't exist or was removed.</p>
          <button
            onClick={() => navigate('/programming')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Problems
          </button>
        </div>
      </div>
    );
  }

  const isLoading = isRunning || isSubmitting;

  return (
    <div
      ref={containerRef}
      className="flex flex-col bg-[#1a1a1a] overflow-hidden"
      style={{ height: 'calc(100vh - 64px)' }}
    >
      {/* ── Top Navigation Bar ── */}
      <div className="shrink-0 bg-[#1e1e1e] border-b border-[#2d2d2d] px-4 py-2 flex items-center justify-between gap-4">
        {/* Back button */}
        <button
          id="back-to-problems-btn"
          onClick={() => navigate('/programming')}
          className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors"
        >
          <ChevronLeft size={18} />
          <span className="hidden sm:inline">Problems</span>
        </button>

        {/* Problem title - center */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <span className="text-white text-sm font-medium truncate max-w-xs">
            {question.title}
          </span>
        </div>

        {/* Controls - right side */}
        <div className="flex items-center gap-2">
          {/* Language selector */}
          <LanguageSelector value={language} onChange={handleLanguageChange} />

          {/* Run button */}
          <button
            id="run-code-btn"
            onClick={handleRun}
            disabled={isLoading}
            className="
              flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold
              bg-[#2d2d2d] border border-[#404040] text-gray-200
              hover:bg-[#3a3a3a] hover:border-gray-500 hover:text-white
              active:scale-95 transition-all duration-150
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {isRunning ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Play size={15} className="text-green-400" />
            )}
            Run
          </button>

          {/* Submit button */}
          <button
            id="submit-code-btn"
            onClick={handleSubmit}
            disabled={isLoading}
            className="
              flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold
              bg-blue-600 text-white
              hover:bg-blue-500 active:scale-95 transition-all duration-150
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {isSubmitting ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Send size={15} />
            )}
            Submit
          </button>
        </div>
      </div>

      {/* ── Main 3-Panel Layout ── */}
      <div className="flex-1 overflow-hidden">
        {/* Horizontal: Left (problem) | Right (editor + console) */}
        <PanelGroup orientation="horizontal" className="h-full">

          {/* ── LEFT: Problem Panel ── */}
          <Panel
            id="problem-panel"
            defaultSize={50}
            minSize={20}
            maxSize={500}
          >
            <ProblemPanel question={question} testCases={publicTestCases} />
          </Panel>

          {/* Horizontal resize handle */}
          <PanelResizeHandle className="group w-1.5 bg-[#252525] hover:bg-blue-600 transition-colors duration-150 flex items-center justify-center cursor-col-resize">
            <GripVertical
              size={14}
              className="text-[#444] group-hover:text-white transition-colors"
            />
          </PanelResizeHandle>

          {/* ── RIGHT: Editor + Console (Vertical split) ── */}
          <Panel id="editor-console-panel" defaultSize={50} minSize={10}>
            <PanelGroup orientation="vertical" className="h-full">

              {/* ── Editor Panel ── */}
              <Panel id="editor-panel" defaultSize={65} minSize={30}>
                <div className="flex flex-col h-full bg-[#1e1e1e]">
                  {/* Editor toolbar */}
                  <div className="shrink-0 bg-[#252525] border-b border-[#333] px-3 py-1.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                      solution.{language === 'cpp' ? 'cpp' : language === 'c' ? 'c' : language === 'java' ? 'java' : language === 'python' ? 'py' : 'js'}
                    </div>
                    <EditorSettingsBar
                      fontSize={fontSize}
                      onFontSizeChange={setFontSize}
                      showMinimap={showMinimap}
                      onMinimapToggle={() => setShowMinimap((p) => !p)}
                      isFullscreen={isFullscreen}
                      onFullscreenToggle={handleFullscreenToggle}
                      onReset={handleReset}
                    />
                  </div>

                  {/* Monaco Editor */}
                  <div className="flex-1 overflow-hidden">
                    <CodeEditor
                      code={currentCode}
                      language={language}
                      fontSize={fontSize}
                      showMinimap={showMinimap}
                      onChange={handleCodeChange}
                    />
                  </div>
                </div>
              </Panel>

              {/* Vertical resize handle */}
              <PanelResizeHandle className="group h-1.5 bg-[#252525] hover:bg-blue-600 transition-colors duration-150 flex items-center justify-center cursor-row-resize">
                <GripHorizontal
                  size={14}
                  className="text-[#444] group-hover:text-white transition-colors"
                />
              </PanelResizeHandle>

              {/* ── Console Panel ── */}
              <Panel id="console-panel" defaultSize={35} minSize={15}>
                <ConsolePanel
                  isRunning={isRunning}
                  isSubmitting={isSubmitting}
                  result={runResult}
                  submissionResult={submitResult}
                  customInput={customInput}
                  onCustomInputChange={setCustomInput}
                  submissions={submissions}
                  loadingSubmissions={loadingSubmissions}
                  activeTab={consoleTab}
                  onTabChange={setConsoleTab}
                />
              </Panel>

            </PanelGroup>
          </Panel>

        </PanelGroup>
      </div>
    </div>
  );
};

export default QuestionDetail;
