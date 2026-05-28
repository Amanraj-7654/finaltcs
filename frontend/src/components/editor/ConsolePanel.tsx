import React, { useState } from 'react';
import {
  Terminal,
  CheckCircle2,
  XCircle,
  Clock,
  Cpu,
  ChevronDown,
  ChevronUp,
  Loader2,
  History,
  AlertTriangle,
} from 'lucide-react';
import type { ExecutionResult, Submission, VerdictResult } from '../../services/codeService';
import { STATUS_CONFIG, VERDICT_TO_STATUS_ID } from '../../services/codeService';

type ConsoleTab = 'testcase' | 'output' | 'submissions';

interface ConsolePanelProps {
  isRunning: boolean;
  isSubmitting: boolean;
  result: ExecutionResult | null;
  submissionResult: VerdictResult | null;
  customInput: string;
  onCustomInputChange: (val: string) => void;
  submissions: Submission[];
  loadingSubmissions: boolean;
  activeTab: ConsoleTab;
  onTabChange: (tab: ConsoleTab) => void;
}

const StatusBadge: React.FC<{ statusId: number }> = ({ statusId }) => {
  const cfg = STATUS_CONFIG[statusId] || {
    label: 'Unknown',
    color: 'text-gray-400',
    bg: 'bg-gray-900/20',
  };
  const isAccepted = statusId === 3;
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold text-sm ${cfg.bg} ${cfg.color}`}
    >
      {isAccepted ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
      {cfg.label}
    </div>
  );
};

const VerdictBadge: React.FC<{ verdict: string }> = ({ verdict }) => {
  const statusId = VERDICT_TO_STATUS_ID[verdict] ?? 13;
  return <StatusBadge statusId={statusId} />;
};

const TestCaseProgressBar: React.FC<{ passed: number; total: number }> = ({ passed, total }) => {
  if (total === 0) return null;
  const pct = Math.round((passed / total) * 100);
  const allPassed = passed === total;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className={allPassed ? 'text-green-400' : 'text-red-400'}>
          {passed}/{total} test cases passed
        </span>
        <span className="text-gray-500">{pct}%</span>
      </div>
      <div className="h-1.5 bg-[#333] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${allPassed ? 'bg-green-500' : 'bg-red-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

const LanguageMap: Record<string, string> = {
  '62': 'Java', '54': 'C++', '50': 'C', '71': 'Python', '63': 'JavaScript',
};

const ConsolePanel: React.FC<ConsolePanelProps> = ({
  isRunning,
  isSubmitting,
  result,
  submissionResult,
  customInput,
  onCustomInputChange,
  submissions,
  loadingSubmissions,
  activeTab,
  onTabChange,
}) => {
  const [expandedOutput, setExpandedOutput] = useState(true);
  const isLoading = isRunning || isSubmitting;

  const tabs: { id: ConsoleTab; label: string; icon: React.ReactNode }[] = [
    { id: 'testcase', label: 'Testcase', icon: <Terminal size={14} /> },
    { id: 'output', label: 'Output', icon: <CheckCircle2 size={14} /> },
    { id: 'submissions', label: 'Submissions', icon: <History size={14} /> },
  ];

  return (
    <div className="h-full flex flex-col bg-[#1a1a1a] text-sm">
      {/* Tab Header */}
      <div className="flex items-center bg-[#252525] border-b border-[#333] px-4 gap-1 shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`console-tab-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors
              ${activeTab === tab.id
                ? 'border-blue-500 text-white'
                : 'border-transparent text-gray-500 hover:text-gray-300'
              }
            `}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="ml-auto flex items-center gap-2 text-blue-400 text-xs">
            <Loader2 size={13} className="animate-spin" />
            {isRunning ? 'Running...' : 'Evaluating test cases...'}
          </div>
        )}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">

        {/* ── TESTCASE TAB ── */}
        {activeTab === 'testcase' && (
          <div className="p-4 h-full flex flex-col gap-3">
            <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">
              Custom Input (stdin)
            </label>
            <textarea
              id="custom-input-area"
              value={customInput}
              onChange={(e) => onCustomInputChange(e.target.value)}
              placeholder={"Enter custom stdin here...\nExample:\n5\n1 2 3 4 5"}
              spellCheck={false}
              className="
                flex-1 min-h-[80px] bg-[#252525] text-gray-300 font-mono text-xs
                border border-[#404040] rounded-lg p-3 resize-none outline-none
                focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30
                placeholder:text-gray-600 transition-colors
              "
            />
            <p className="text-xs text-gray-600">
              Tip: Use <kbd className="bg-[#333] px-1 rounded text-gray-400">Ctrl+Enter</kbd> to run code quickly.
            </p>
          </div>
        )}

        {/* ── OUTPUT TAB ── */}
        {activeTab === 'output' && (
          <div className="p-4 space-y-3 font-mono">
            {isRunning ? (
              <div className="flex items-center gap-3 text-blue-400 py-4">
                <Loader2 size={18} className="animate-spin" />
                <span>Executing your code...</span>
              </div>
            ) : !result ? (
              <div className="text-gray-600 italic py-4 flex items-center gap-2">
                <Terminal size={16} />
                Run your code to see output here...
              </div>
            ) : (
              <>
                {/* Status */}
                {result.status && (
                  <div className="flex items-center gap-3 pb-3 border-b border-[#333]">
                    <StatusBadge statusId={result.status.id} />
                    {result.time && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={12} /> {result.time}s
                      </span>
                    )}
                    {result.memory && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Cpu size={12} /> {result.memory} KB
                      </span>
                    )}
                  </div>
                )}

                {/* Collapsible Output section */}
                <div>
                  <button
                    onClick={() => setExpandedOutput(!expandedOutput)}
                    className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-200 mb-2 transition-colors"
                  >
                    {expandedOutput ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    Output
                  </button>

                  {expandedOutput && (
                    <div className="space-y-2">
                      {result.stdout && (
                        <div className="bg-[#252525] rounded-lg p-3 border border-[#333]">
                          <div className="text-xs text-gray-500 mb-1">stdout</div>
                          <pre className="text-green-400 text-xs whitespace-pre-wrap break-words">
                            {result.stdout}
                          </pre>
                        </div>
                      )}
                      {result.stderr && (
                        <div className="bg-[#252525] rounded-lg p-3 border border-red-900/30">
                          <div className="text-xs text-red-500 mb-1">stderr</div>
                          <pre className="text-red-400 text-xs whitespace-pre-wrap break-words">
                            {result.stderr}
                          </pre>
                        </div>
                      )}
                      {result.compile_output && (
                        <div className="bg-[#252525] rounded-lg p-3 border border-yellow-900/30">
                          <div className="text-xs text-yellow-500 mb-1">compile output</div>
                          <pre className="text-yellow-400 text-xs whitespace-pre-wrap break-words">
                            {result.compile_output}
                          </pre>
                        </div>
                      )}
                      {!result.stdout && !result.stderr && !result.compile_output && (
                        <div className="text-gray-600 text-xs italic">No output produced.</div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── SUBMISSIONS TAB ── */}
        {activeTab === 'submissions' && (
          <div className="p-4 space-y-4">
            {isSubmitting ? (
              <div className="flex items-center gap-3 text-blue-400 py-4 font-mono">
                <Loader2 size={18} className="animate-spin" />
                <span>Evaluating all test cases...</span>
              </div>
            ) : submissionResult ? (
              <div className="space-y-3 font-sans">
                <div className="text-xs text-gray-500 mb-1">Latest submission result</div>

                {/* Verdict */}
                <div className="flex flex-wrap items-center gap-3 pb-3 border-b border-[#333]">
                  <VerdictBadge verdict={submissionResult.verdict} />
                  {submissionResult.runtime && (
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock size={12} /> {submissionResult.runtime}s
                    </span>
                  )}
                  {submissionResult.memory != null && (
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Cpu size={12} /> {submissionResult.memory} KB
                    </span>
                  )}
                </div>

                {/* Test case progress bar */}
                {submissionResult.totalCount > 0 && (
                  <TestCaseProgressBar
                    passed={submissionResult.passedCount}
                    total={submissionResult.totalCount}
                  />
                )}

                {/* Failed input hint (never expose expected output) */}
                {submissionResult.failedInput && (
                  <div className="bg-[#252525] rounded-lg p-3 border border-red-900/30 font-mono">
                    <div className="text-xs text-red-400 mb-1 flex items-center gap-1">
                      <AlertTriangle size={12} /> Failed on input
                    </div>
                    <pre className="text-gray-400 text-xs whitespace-pre-wrap break-words">
                      {submissionResult.failedInput}
                    </pre>
                  </div>
                )}

                {/* Output */}
                {submissionResult.stdout && (
                  <div className="bg-[#252525] rounded-lg p-3 border border-[#333] font-mono">
                    <div className="text-xs text-gray-500 mb-1">stdout</div>
                    <pre className="text-green-400 text-xs whitespace-pre-wrap">
                      {submissionResult.stdout}
                    </pre>
                  </div>
                )}
                {submissionResult.compileOutput && (
                  <div className="bg-[#252525] rounded-lg p-3 border border-yellow-900/30 font-mono">
                    <div className="text-xs text-yellow-500 mb-1">compile output</div>
                    <pre className="text-yellow-400 text-xs whitespace-pre-wrap">
                      {submissionResult.compileOutput}
                    </pre>
                  </div>
                )}
                {submissionResult.stderr && (
                  <div className="bg-[#252525] rounded-lg p-3 border border-red-900/30 font-mono">
                    <div className="text-xs text-red-500 mb-1">stderr</div>
                    <pre className="text-red-400 text-xs whitespace-pre-wrap">
                      {submissionResult.stderr}
                    </pre>
                  </div>
                )}
              </div>
            ) : null}

            {/* Submission History */}
            {loadingSubmissions ? (
              <div className="flex items-center gap-2 text-gray-500 text-xs py-2">
                <Loader2 size={13} className="animate-spin" />
                Loading submissions...
              </div>
            ) : submissions.length === 0 && !submissionResult ? (
              <div className="text-gray-600 italic text-xs py-4 flex items-center gap-2">
                <History size={16} />
                No submissions yet for this problem.
              </div>
            ) : submissions.length > 0 ? (
              <div className="space-y-2">
                {submissionResult && <div className="text-xs text-gray-500 font-medium pt-2 border-t border-[#333]">Previous submissions</div>}
                {submissions.map((sub) => {
                  const verdictStr = sub.verdict || sub.status || '';
                  const isOk = verdictStr === 'ACCEPTED';
                  const statusId = VERDICT_TO_STATUS_ID[verdictStr] ?? (isOk ? 3 : 4);
                  const cfg = STATUS_CONFIG[statusId] || { label: verdictStr.replace(/_/g, ' '), color: 'text-gray-400', bg: '' };
                  return (
                    <div
                      key={sub.id}
                      className="bg-[#252525] rounded-lg p-3 border border-[#333] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        {isOk ? (
                          <CheckCircle2 size={14} className="text-green-400" />
                        ) : (
                          <XCircle size={14} className="text-red-400" />
                        )}
                        <span className={`text-xs font-medium ${cfg.color}`}>
                          {cfg.label}
                        </span>
                        {sub.passedCount != null && sub.totalCount != null && sub.totalCount > 0 && (
                          <span className="text-xs text-gray-600">
                            ({sub.passedCount}/{sub.totalCount})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-gray-600 text-xs">
                        {sub.runtime && <span className="flex items-center gap-0.5"><Clock size={10} /> {sub.runtime}s</span>}
                        <span>{LanguageMap[sub.language] || sub.language}</span>
                        <span>{new Date(sub.submittedAt || sub.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(ConsolePanel);
