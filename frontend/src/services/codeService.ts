import api from './api';

export interface RunCodeRequest {
  code: string;
  languageId: number;
  stdin: string;
  questionId?: number;
}

export interface SubmitCodeRequest {
  code: string;
  languageId: number;
  contestId?: number | null;
}

export interface ExecutionResult {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  time: string | null;
  memory: number | null;
  status: {
    id: number;
    description: string;
  };
}

/** Rich verdict returned by the new submit endpoint */
export interface VerdictResult {
  verdict: string;
  passedCount: number;
  totalCount: number;
  runtime: string | null;
  memory: number | null;
  stdout: string | null;
  stderr: string | null;
  compileOutput: string | null;
  failedInput: string | null;
  statusId: number;
}

export interface Submission {
  id: number;
  code: string;
  language: string;
  status: string;
  verdict: string;
  runtime: string;
  memory: number;
  passedCount: number;
  totalCount: number;
  submittedAt: string;
  createdAt: string;
  questionId: number;
}

export interface PublicTestCase {
  id: number;
  input: string;
  expectedOutput: string;
  explanation: string | null;
}

export interface LeaderboardEntry {
  rank: number;
  userId: number;
  username: string;
  totalSolved: number;
  totalPenaltyMinutes: number;
}

export const runCode = async (request: RunCodeRequest): Promise<ExecutionResult> => {
  const response = await api.post('/submissions/run', request);
  return response.data;
};

export const submitCode = async (
  questionId: number,
  request: SubmitCodeRequest
): Promise<VerdictResult> => {
  const response = await api.post(`/submissions/submit/${questionId}`, request);
  return response.data;
};

export const getUserSubmissions = async (userId: number): Promise<Submission[]> => {
  const response = await api.get(`/submissions/user/${userId}`);
  return response.data;
};

export const getQuestionSubmissions = async (questionId: number): Promise<Submission[]> => {
  const response = await api.get(`/submissions/question/${questionId}`);
  return response.data;
};

export const getPublicTestCases = async (questionId: number): Promise<PublicTestCase[]> => {
  const response = await api.get(`/questions/${questionId}/testcases/public`);
  return response.data;
};

export const getLeaderboard = async (contestId: number): Promise<LeaderboardEntry[]> => {
  const response = await api.get(`/contests/${contestId}/leaderboard`);
  return response.data;
};

// Admin test case management
export const addTestCase = async (
  questionId: number,
  data: { input: string; expectedOutput: string; isHidden: boolean; explanation?: string }
) => {
  const response = await api.post(`/questions/${questionId}/testcases`, data);
  return response.data;
};

export const deleteTestCase = async (questionId: number, testCaseId: number) => {
  await api.delete(`/questions/${questionId}/testcases/${testCaseId}`);
};

export const getAllTestCasesAdmin = async (questionId: number) => {
  const response = await api.get(`/questions/${questionId}/testcases/all`);
  return response.data;
};

export const LANGUAGE_IDS: Record<string, number> = {
  java: 62,
  cpp: 54,
  c: 50,
  python: 71,
  javascript: 63,
};

export const LANGUAGE_LABELS: Record<string, string> = {
  java: 'Java',
  cpp: 'C++',
  c: 'C',
  python: 'Python',
  javascript: 'JavaScript',
};

export const MONACO_LANGUAGE_MAP: Record<string, string> = {
  java: 'java',
  cpp: 'cpp',
  c: 'c',
  python: 'python',
  javascript: 'javascript',
};

export const DEFAULT_BOILERPLATES: Record<string, string> = {
  java: `public class Solution {
    public static void main(String[] args) {
        // Write your Java solution here
        
    }
}`,
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    // Write your C++ solution here
    
    return 0;
}`,
  c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    // Write your C solution here
    
    return 0;
}`,
  python: `import sys
input = sys.stdin.readline

def solve():
    # Write your Python solution here
    pass

solve()`,
  javascript: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
const lines = [];
rl.on('line', l => lines.push(l));
rl.on('close', () => {
    // Write your JavaScript solution here
    
});`,
};

export const STATUS_CONFIG: Record<number, { label: string; color: string; bg: string }> = {
  1:  { label: 'In Queue',             color: 'text-yellow-400', bg: 'bg-yellow-900/20' },
  2:  { label: 'Processing',           color: 'text-blue-400',   bg: 'bg-blue-900/20'   },
  3:  { label: 'Accepted',             color: 'text-green-400',  bg: 'bg-green-900/20'  },
  4:  { label: 'Wrong Answer',         color: 'text-red-400',    bg: 'bg-red-900/20'    },
  5:  { label: 'Time Limit Exceeded',  color: 'text-orange-400', bg: 'bg-orange-900/20' },
  6:  { label: 'Compilation Error',    color: 'text-pink-400',   bg: 'bg-pink-900/20'   },
  7:  { label: 'Runtime Error (SIGSEGV)', color: 'text-red-400', bg: 'bg-red-900/20'   },
  8:  { label: 'Runtime Error (SIGXFSZ)', color: 'text-red-400', bg: 'bg-red-900/20'   },
  9:  { label: 'Runtime Error (SIGFPE)', color: 'text-red-400',  bg: 'bg-red-900/20'   },
  10: { label: 'Runtime Error (SIGABRT)', color: 'text-red-400', bg: 'bg-red-900/20'   },
  11: { label: 'Runtime Error (NZEC)',  color: 'text-red-400',   bg: 'bg-red-900/20'   },
  12: { label: 'Runtime Error (Other)', color: 'text-red-400',   bg: 'bg-red-900/20'   },
  13: { label: 'Internal Error',        color: 'text-gray-400',  bg: 'bg-gray-900/20'  },
  14: { label: 'Exec Format Error',     color: 'text-gray-400',  bg: 'bg-gray-900/20'  },
};

/** Map backend verdict string → status id for badge display */
export const VERDICT_TO_STATUS_ID: Record<string, number> = {
  ACCEPTED: 3,
  WRONG_ANSWER: 4,
  TIME_LIMIT_EXCEEDED: 5,
  COMPILATION_ERROR: 6,
  RUNTIME_ERROR: 11,
  MEMORY_LIMIT_EXCEEDED: 14,
};
