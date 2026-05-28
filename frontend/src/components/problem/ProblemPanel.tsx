import React, { useState } from 'react';
import {
  Info,
  Tag,
  Zap,
  ChevronRight,
  BookOpen,
  AlignLeft,
} from 'lucide-react';
import type { PublicTestCase } from '../../services/codeService';

interface Question {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  type: string;
  constraints: string;
  testCases?: string | null; // legacy field, ignored
  link?: string | null;
}

interface ProblemPanelProps {
  question: Question;
  testCases: PublicTestCase[];
}

type ProblemTab = 'description' | 'examples';

const DifficultyBadge: React.FC<{ difficulty: string }> = ({ difficulty }) => {
  const map: Record<string, string> = {
    EASY:   'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    MEDIUM: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    HARD:   'bg-red-500/10 text-red-400 border-red-500/20',
  };
  const cls = map[difficulty?.toUpperCase()] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      {difficulty}
    </span>
  );
};

const ProblemPanel: React.FC<ProblemPanelProps> = ({ question, testCases }) => {
  const [activeTab, setActiveTab] = useState<ProblemTab>('description');

  const tabs: { id: ProblemTab; label: string; icon: React.ReactNode }[] = [
    { id: 'description', label: 'Description', icon: <AlignLeft size={14} /> },
    { id: 'examples', label: 'Examples', icon: <BookOpen size={14} /> },
  ];

  return (
    <div className="h-full flex flex-col bg-[#1a1a1a] text-gray-300">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-[#2d2d2d] shrink-0">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h1 className="text-lg font-bold text-white leading-tight">
            {question.title}
          </h1>
          {question.link && (
            <a
              href={question.link}
              target="_blank"
              rel="noopener noreferrer"
              title="External reference"
              className="text-gray-500 hover:text-blue-400 transition-colors shrink-0 mt-0.5"
            >
              <ChevronRight size={16} />
            </a>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <DifficultyBadge difficulty={question.difficulty} />
          {question.type && (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Tag size={10} />
              {question.type}
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#2d2d2d] px-5 gap-1 shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`problem-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-1.5 px-1 py-2.5 text-xs font-medium border-b-2 transition-colors
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
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4">

        {/* ── DESCRIPTION TAB ── */}
        {activeTab === 'description' && (
          <div className="space-y-5">
            {/* Description Text */}
            <div className="prose prose-invert prose-sm max-w-none">
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
                {question.description}
              </p>
            </div>

            {/* Inline Examples from testCases (first 2) */}
            {testCases.slice(0, 2).map((tc, idx) => (
              <div key={idx} className="bg-[#252525] rounded-xl border border-[#333] overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 border-b border-[#333] bg-[#2a2a2a]">
                  <Info size={13} className="text-blue-400" />
                  <span className="text-xs font-semibold text-gray-300">Example {idx + 1}</span>
                </div>
                <div className="p-4 space-y-2 font-mono text-xs">
                  <div>
                    <span className="text-gray-500">Input: </span>
                    <span className="text-gray-200">{tc.input}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Output: </span>
                    <span className="text-gray-200">{tc.expectedOutput}</span>
                  </div>
                  {tc.explanation && (
                    <div>
                      <span className="text-gray-500">Explanation: </span>
                      <span className="text-gray-400">{tc.explanation}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Constraints */}
            {question.constraints && (
              <div className="bg-[#252525] rounded-xl border border-[#333] overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 border-b border-[#333] bg-[#2a2a2a]">
                  <Zap size={13} className="text-yellow-400" />
                  <span className="text-xs font-semibold text-gray-300">Constraints</span>
                </div>
                <div className="p-4">
                  <pre className="text-gray-400 text-xs whitespace-pre-wrap font-mono leading-relaxed">
                    {question.constraints}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── EXAMPLES TAB ── */}
        {activeTab === 'examples' && (
          <div className="space-y-4">
            {testCases.length === 0 ? (
              <div className="text-gray-600 italic text-sm py-4 flex items-center gap-2">
                <BookOpen size={16} />
                No example test cases available.
              </div>
            ) : (
              testCases.map((tc, idx) => (
                <div
                  key={tc.id ?? idx}
                  className="bg-[#252525] rounded-xl border border-[#333] overflow-hidden"
                >
                  <div className="flex items-center gap-2 px-4 py-2 border-b border-[#333] bg-[#2a2a2a]">
                    <span className="text-xs font-semibold text-gray-300">Example {idx + 1}</span>
                  </div>
                  <div className="p-4 space-y-3 font-mono text-xs">
                    <div>
                      <div className="text-gray-500 mb-1 text-[10px] uppercase tracking-wider">Input</div>
                      <div className="bg-[#1e1e1e] rounded-lg p-2.5 border border-[#404040] text-gray-200 whitespace-pre-wrap">
                        {tc.input}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1 text-[10px] uppercase tracking-wider">Expected Output</div>
                      <div className="bg-[#1e1e1e] rounded-lg p-2.5 border border-[#404040] text-green-300 whitespace-pre-wrap">
                        {tc.expectedOutput}
                      </div>
                    </div>
                    {tc.explanation && (
                      <div>
                        <div className="text-gray-500 mb-1 text-[10px] uppercase tracking-wider">Explanation</div>
                        <div className="text-gray-400 font-sans leading-relaxed">
                          {tc.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(ProblemPanel);
