import React, { useCallback, useRef } from 'react';
import type * as MonacoEditor from 'monaco-editor';
import Editor, { loader } from '@monaco-editor/react';
import { MONACO_LANGUAGE_MAP } from '../../services/codeService';

// Configure Monaco Editor loader to fetch assets locally (same-origin)
// to resolve tracking prevention, cross-origin blocks, and storage access warnings.
loader.config({ paths: { vs: '/monaco-editor/vs' } });

interface CodeEditorProps {
  code: string;
  language: string;
  fontSize: number;
  showMinimap: boolean;
  onChange: (value: string) => void;
}

const EditorLoadingFallback: React.FC = () => (
  <div className="flex-1 bg-[#1e1e1e] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-gray-500 text-sm">Loading editor...</span>
    </div>
  </div>
);

const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  language,
  fontSize,
  showMinimap,
  onChange,
}) => {
  const editorRef = useRef<MonacoEditor.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount = useCallback(
    (editor: MonacoEditor.editor.IStandaloneCodeEditor) => {
      editorRef.current = editor;

      // Add keyboard shortcuts
      editor.addCommand(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).monaco?.KeyMod.CtrlCmd | (window as any).monaco?.KeyCode.Enter,
        () => {
          // Run code shortcut - dispatched as custom event
          window.dispatchEvent(new CustomEvent('editor:run'));
        }
      );
    },
    []
  );

  const monacoLang = MONACO_LANGUAGE_MAP[language] || language;

  return (
    <Editor
      height="100%"
      language={monacoLang}
      value={code}
      theme="vs-dark"
      onChange={(val) => onChange(val ?? '')}
      onMount={handleEditorDidMount}
      loading={<EditorLoadingFallback />}
      options={{
        fontSize,
        fontFamily: '"Fira Code", "JetBrains Mono", "Cascadia Code", Consolas, monospace',
        fontLigatures: true,
        minimap: { enabled: showMinimap },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 4,
        wordWrap: 'on',
        lineNumbers: 'on',
        renderLineHighlight: 'line',
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        smoothScrolling: true,
        bracketPairColorization: { enabled: true },
        guides: { bracketPairs: true },
        suggest: { showKeywords: true },
        quickSuggestions: true,
        padding: { top: 12, bottom: 12 },
        scrollbar: {
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8,
        },
      }}
    />
  );
};

export default React.memo(CodeEditor);
