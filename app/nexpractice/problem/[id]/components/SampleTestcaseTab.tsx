import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Check,
  X,
  Clock,
  AlertTriangle,
  AlertCircle,
  Cpu,
  CheckCircle,
  XCircle,
  Play,
} from "lucide-react";
import { LuCopy } from "react-icons/lu";
import { Skeleton } from "@/components/ui/skeleton";

interface SampleTestcaseTabProps {
  showEvaluatingSkeletons: boolean;
  skeletonTab: string | null;
  sampleTestResults: any[];
  activeTab: string;
  sampleExecutionStatus: string | null;
  formatTestCase: (content: string) => React.ReactNode;
  examples: any[];
  copiedInput: boolean;
  copiedOutput: boolean;
  setCopiedInput: (copied: boolean) => void;
  setCopiedOutput: (copied: boolean) => void;
}

export default function SampleTestcaseTab({
  showEvaluatingSkeletons,
  skeletonTab,
  sampleTestResults,
  activeTab,
  sampleExecutionStatus,
  formatTestCase,
  examples,
  copiedInput,
  copiedOutput,
  setCopiedInput,
  setCopiedOutput,
}: SampleTestcaseTabProps) {
  return (
    <TabsContent
      value="sample"
      className="focus-visible:outline-none focus-visible:ring-0 p-4"
    >
      {showEvaluatingSkeletons && skeletonTab === "sample" ? (
        <div className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-3 duration-300">
          {/* Summary skeleton */}
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-5 w-40 bg-slate-200/70 dark:bg-slate-700/50" />
            <Skeleton className="h-6 w-28 rounded-full bg-slate-200/70 dark:bg-slate-700/50" />
          </div>

          {/* Test cases skeletons */}
          <div className="bg-white dark:bg-black rounded-lg shadow-sm overflow-hidden border border-slate-200 dark:border-slate-700/50">
            {/* Header skeleton */}
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700/50 bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/70 dark:to-slate-800/50 flex justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-full bg-slate-200/70 dark:bg-slate-700/50" />
                <Skeleton className="h-5 w-24 bg-slate-200/70 dark:bg-slate-700/50" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full bg-slate-200/70 dark:bg-slate-700/50" />
            </div>

            {/* Content skeleton */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Input skeleton */}
              <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700/50">
                <div className="bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 border-b border-slate-200 dark:border-slate-700/50">
                  <Skeleton className="h-4 w-16 bg-slate-200/70 dark:bg-slate-700/50" />
                </div>
                <div className="p-3 space-y-2">
                  <Skeleton className="h-4 w-full bg-slate-200/70 dark:bg-slate-700/50" />
                  <Skeleton className="h-4 w-3/4 bg-slate-200/70 dark:bg-slate-700/50" />
                  <Skeleton className="h-4 w-1/2 bg-slate-200/70 dark:bg-slate-700/50" />
                </div>
              </div>

              {/* Expected Output skeleton */}
              <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700/50">
                <div className="bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 border-b border-slate-200 dark:border-slate-700/50">
                  <Skeleton className="h-4 w-36 bg-slate-200/70 dark:bg-slate-700/50" />
                </div>
                <div className="p-3 space-y-2">
                  <Skeleton className="h-4 w-full bg-slate-200/70 dark:bg-slate-700/50" />
                  <Skeleton className="h-4 w-2/3 bg-slate-200/70 dark:bg-slate-700/50" />
                  <Skeleton className="h-4 w-1/4 bg-slate-200/70 dark:bg-slate-700/50" />
                </div>
              </div>

              {/* Your Output skeleton - professional loading style */}
              <div className="rounded-lg overflow-hidden md:col-span-2 border border-indigo-200 dark:border-indigo-900/30 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 via-purple-50/50 to-indigo-50/50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 animate-gradient-x"></div>
                <div className="px-3 py-1.5 border-b border-indigo-200 dark:border-indigo-900/30 bg-slate-50 dark:bg-slate-800/60 relative z-10 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-indigo-500 animate-pulse-opacity"></div>
                    <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                      Executing the code...
                    </span>
                  </div>
                </div>
                <div className="relative z-10">
                  <div className="p-3 space-y-2">
                    <Skeleton className="h-5 w-full bg-indigo-100/70 dark:bg-indigo-900/30" />
                    <Skeleton className="h-5 w-4/5 bg-indigo-100/70 dark:bg-indigo-900/30" />
                    <Skeleton className="h-5 w-2/3 bg-indigo-100/70 dark:bg-indigo-900/30" />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer skeleton */}
            <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-2 border-t border-slate-200 dark:border-slate-700/50 flex justify-between items-center">
              <Skeleton className="h-4 w-32 bg-slate-200/70 dark:bg-slate-700/50" />
              <Skeleton className="h-4 w-32 bg-slate-200/70 dark:bg-slate-700/50" />
            </div>
          </div>
        </div>
      ) : sampleTestResults.length > 0 && activeTab === "sample" ? (
        <div className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-3 duration-500">
          {/* Summary badge */}
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-300">
              <span className="font-medium">{sampleTestResults.length}</span>{" "}
              sample test cases evaluated
            </div>
            {sampleExecutionStatus && (
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm
          ${
            sampleExecutionStatus === "success"
              ? "bg-[#1e3a2f] border border-[#2d5a48] text-green-400"
              : sampleExecutionStatus === "warning"
              ? "bg-[#3a3020] border border-[#5a4a30] text-amber-400"
              : "bg-[#3a2020] border border-[#5a3030] text-red-400"
          }`}
              >
                {sampleExecutionStatus === "success" ? (
                  <>
                    <Check className="h-3 w-3 mr-1.5" />
                    All Sample Testcases Passed
                  </>
                ) : sampleExecutionStatus === "warning" ? (
                  <>
                    <AlertTriangle className="h-3 w-3 mr-1.5" />
                    Partially Passed
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3 mr-1.5" />
                    No Sample Testcases Passed
                  </>
                )}
              </div>
            )}
          </div>

          {/* Nested tabs for multiple test cases */}
          <Tabs defaultValue={`sample-testcase-0`} className="w-full">
            <TabsList className="flex flex-nowrap overflow-x-auto px-3 scrollbar-thin scrollbar-thumb-[#444444] bg-[#1a1a1a] rounded-lg border border-[#333333] shadow-sm mb-3 gap-1.5 p-2">
              {sampleTestResults.map((result, idx) => (
                <TabsTrigger
                  key={`sample-trigger-${result.id || idx}`}
                  value={`sample-testcase-${idx}`}
                  className="flex-shrink-0 min-w-[85px] rounded-md py-2 data-[state=active]:bg-[#2a2a2a] data-[state=active]:text-white text-gray-400 relative overflow-hidden group transition-all duration-150"
                >
                  <div className="absolute inset-0 opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-[#0779FF]"></div>
                  </div>
                  <div className="flex items-center justify-center gap-1.5">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-medium
                ${result.isCorrect ? "bg-[#10b981]" : "bg-[#ef4444]"}`}
                    >
                      {result.isCorrect ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                    </div>
                    <span className="font-medium text-sm group-data-[state=active]:text-white">
                      Test {idx + 1}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#333333] opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-0 transition-opacity"></div>
                </TabsTrigger>
              ))}
            </TabsList>

            {sampleTestResults.map((result, idx) => (
              <TabsContent
                key={`sample-content-${result.id || idx}`}
                value={`sample-testcase-${idx}`}
                className="focus-visible:outline-none focus-visible:ring-0"
              >
                <div className="bg-[#1a1a1a] rounded-lg shadow-sm overflow-hidden border border-[#333333]">
                  <div
                    className={`px-4 py-2 border-b border-[#333333] flex items-center justify-between
              ${
                result.isCorrect
                  ? "bg-[#1e3a2f]"
                  : result.verdict === "Time Limit Exceeded" ||
                    (result.status && result.status.id === 5) ||
                    result.verdict?.toLowerCase()?.includes("time limit")
                  ? "bg-[#3a3020]"
                  : result.verdict === "Compilation Error" ||
                    result.compileOutput
                  ? "bg-[#3a3020]"
                  : "bg-[#3a2020]"
              }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-medium
                  ${
                    result.isCorrect
                      ? "bg-[#10b981]"
                      : result.verdict === "Time Limit Exceeded" ||
                        (result.status && result.status.id === 5) ||
                        result.verdict?.toLowerCase()?.includes("time limit")
                      ? "bg-[#f59e0b]"
                      : result.verdict === "Compilation Error" ||
                        result.compileOutput
                      ? "bg-[#f59e0b]"
                      : "bg-[#ef4444]"
                  }`}
                      >
                        {idx + 1}
                      </div>
                      <span className="font-medium text-gray-300">
                        {result.isCorrect
                          ? "Passed"
                          : result.verdict === "Time Limit Exceeded" ||
                            (result.status && result.status.id === 5) ||
                            result.verdict
                              ?.toLowerCase()
                              ?.includes("time limit")
                          ? "Time Limit Exceeded"
                          : result.verdict === "Compilation Error" ||
                            result.compileOutput
                          ? "Compilation Error"
                          : "Failed"}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                  ${
                    result.isCorrect
                      ? "bg-[#132e25] text-green-400"
                      : result.verdict === "Time Limit Exceeded" ||
                        (result.status && result.status.id === 5) ||
                        result.verdict?.toLowerCase()?.includes("time limit")
                      ? "bg-[#2e2512] text-amber-400"
                      : result.verdict === "Compilation Error" ||
                        result.compileOutput
                      ? "bg-[#2e2512] text-amber-400"
                      : "bg-[#2e1212] text-red-400"
                  }`}
                      >
                        {result.isCorrect ? (
                          <>
                            <Check className="h-3 w-3 mr-1" />
                            Correct
                          </>
                        ) : result.verdict === "Time Limit Exceeded" ||
                          (result.status && result.status.id === 5) ||
                          result.verdict
                            ?.toLowerCase()
                            ?.includes("time limit") ? (
                          <>
                            <Clock className="h-3 w-3 mr-1" />
                            Time Limit
                          </>
                        ) : result.verdict === "Compilation Error" ||
                          result.compileOutput ? (
                          <>
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Compile Error
                          </>
                        ) : (
                          <>
                            <X className="h-3 w-3 mr-1" />
                            Incorrect
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-lg overflow-hidden border border-[#333333]">
                      <div className="bg-[#232323] px-3 py-1.5 border-b border-[#333333] text-xs font-medium text-gray-300">
                        Input
                      </div>
                      <div className="p-3 font-mono text-sm bg-[#1a1a1a] text-gray-300">
                        {formatTestCase(result.input)}
                      </div>
                    </div>

                    <div className="rounded-lg overflow-hidden border border-[#333333]">
                      <div className="bg-[#232323] px-3 py-1.5 border-b border-[#333333] text-xs font-medium text-gray-300">
                        Expected Output
                      </div>
                      <div className="p-3 font-mono text-sm bg-[#1a1a1a] text-gray-300">
                        {formatTestCase(result.expectedOutput)}
                      </div>
                    </div>

                    {/* Only show the Your Output section if there are no errors/warnings/time limit exceeded */}
                    {!(
                      result.stderr ||
                      result.compileOutput ||
                      result.verdict === "Time Limit Exceeded" ||
                      (result.status && result.status.id === 5) ||
                      result.verdict?.toLowerCase()?.includes("time limit") ||
                      result.verdict === "Compilation Error"
                    ) && (
                      <div
                        className={`rounded-lg overflow-hidden md:col-span-2 
                  ${
                    result.isCorrect
                      ? "border border-[#2d5a48]"
                      : "border border-[#5a3030]"
                  }`}
                      >
                        <div
                          className={`px-3 py-1.5 border-b flex items-center
                    ${
                      result.isCorrect
                        ? "bg-[#1e3a2f] border-[#2d5a48] text-green-400"
                        : "bg-[#3a2020] border-[#5a3030] text-red-400"
                    }`}
                        >
                          {result.isCorrect ? (
                            <Check className="h-3 w-3 mr-1.5" />
                          ) : (
                            <X className="h-3 w-3 mr-1.5" />
                          )}
                          Your Output
                        </div>
                        <div className="p-3 font-mono text-sm bg-[#1a1a1a] text-gray-300">
                          {formatTestCase(result.actualOutput)}
                        </div>
                      </div>
                    )}

                    {/* Show Time Limit Exceeded message instead of output */}
                    {(result.verdict === "Time Limit Exceeded" ||
                      (result.status && result.status.id === 5) ||
                      result.verdict
                        ?.toLowerCase()
                        ?.includes("time limit")) && (
                      <div className="rounded-lg overflow-hidden border border-[#5a4a30] md:col-span-2">
                        <div className="bg-[#3a3020] px-3 py-1.5 border-b border-[#5a4a30] text-xs font-medium text-amber-400 flex items-center">
                          <Clock className="h-3 w-3 mr-1.5" />
                          Time Limit Exceeded
                        </div>
                        <div className="p-3 bg-[#1a1a1a]">
                          <p className="text-sm text-amber-400">
                            Your solution took too long to execute. Try
                            optimizing your algorithm to run within the time
                            limit.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Show Compilation Error message */}
                    {(result.verdict === "Compilation Error" ||
                      result.compileOutput) && (
                      <div className="rounded-lg overflow-hidden border border-[#5a4a30] md:col-span-2">
                        <div className="bg-[#3a3020] px-3 py-1.5 border-b border-[#5a4a30] text-xs font-medium text-amber-400 flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1.5" />
                          Compilation Error
                        </div>
                        <div className="p-3 bg-[#1a1a1a]">
                          <div className="text-sm text-amber-400 font-mono whitespace-pre-wrap">
                            {result.compileOutput ||
                              "Your code has syntax errors and could not be compiled."}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Show Runtime Error message */}
                    {result.stderr &&
                      !(
                        result.verdict === "Compilation Error" ||
                        result.compileOutput
                      ) && (
                        <div className="rounded-lg overflow-hidden border border-[#5a3030] md:col-span-2">
                          <div className="bg-[#3a2020] px-3 py-1.5 border-b border-[#5a3030] text-xs font-medium text-red-400 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1.5" />
                            Runtime Error
                          </div>
                          <div className="p-3 bg-[#1a1a1a]">
                            <div className="text-sm text-red-400 font-mono whitespace-pre-wrap">
                              {result.stderr}
                            </div>
                          </div>
                        </div>
                      )}
                  </div>

                  <div className="bg-[#232323] px-4 py-2 border-t border-[#333333] flex justify-between items-center">
                    <div className="flex items-center">
                      <Clock className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
                      <span className="text-xs text-gray-400">
                        Execution Time: {result.executionTime || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Cpu className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
                      <span className="text-xs text-gray-400">
                        Memory Used: {result.memoryUsed || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Tabs for each sample testcase */}
          <Tabs defaultValue={`example-0`} className="w-full">
            <TabsList className="bg-[#f2f3f5] dark:bg-[#1a1a1a] p-1.5 rounded-lg overflow-hidden border border-[#d3d5d8] dark:border-[#333333] mb-3 w-full flex flex-wrap gap-2">
              {examples.map(
                (
                  example: {
                    id: string;
                    input: string;
                    output: string;
                    explanation?: string;
                  },
                  idx: number
                ) => (
                  <TabsTrigger
                    key={`example-trigger-${example.id || idx}`}
                    value={`example-${idx}`}
                    className="flex-1 min-w-[100px] rounded-md py-2 data-[state=active]:bg-[#0779FF] dark:data-[state=active]:bg-[#2a2a2a] data-[state=active]:text-white text-gray-400 relative overflow-hidden group transition-all duration-150 hover:bg-[#dcedff] dark:hover:bg-[#2a2a2a] hover:text-[black] dark:hover:text-white"
                  >
                    <div className="absolute inset-0 opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-[#0779FF]"></div>
                    </div>
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center  dark:text-white text-xs font-medium bg-[white] dark:bg-[#0779FF] group-data-[state=active]:bg-[white] dark:group-data-[state=active]:bg-[#0779FF] dark:group-data-[state=active]:text-[white] group-data-[state=active]:text-[#0779FF]  transition-colors">
                        {idx + 1}
                      </div>
                      <span className="hidden sm:inline font-medium text-sm group-data-[state=active]:text-white transition-colors">
                        Test {idx + 1}
                      </span>
                    </div>
                  </TabsTrigger>
                )
              )}
            </TabsList>

            {examples.map(
              (
                example: {
                  id: string;
                  input: string;
                  output: string;
                  explanation?: string;
                },
                idx: number
              ) => (
                <TabsContent
                  key={`example-content-${example.id || idx}`}
                  value={`example-${idx}`}
                  className="focus-visible:outline-none focus-visible:ring-0"
                >
                  <div className="flex flex-col md:flex-row gap-4 w-full">
                    <div className="flex-1 rounded-md overflow-hidden border   border-gray-200 dark:border-[#1a1a1a]">
                      <div className="bg-gray-100 dark:bg-[#1a1a1a]  px-4 py-3 border-none dark:border-b dark:border-[#333333] text-sm font-medium  text-[black] dark:text-white flex items-center justify-between">
                        <span>Input</span>
                        <button
                          className="text-gray-400 hover:text-white transition-colors"
                          aria-label="Copy input"
                          onClick={() => {
                            navigator.clipboard.writeText(example.input);
                            setCopiedInput(true);
                            setTimeout(() => setCopiedInput(false), 2000);
                          }}
                        >
                          {copiedInput ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <LuCopy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <div className="p-4 font-mono text-sm bg-[white] dark:bg-[#121212] text-[#262626] dark:text-gray-300 min-h-[100px]">
                        {formatTestCase(example.input)}
                      </div>
                    </div>

                    <div className="flex-1 rounded-md overflow-hidden border  border-gray-200 dark:border-[#1a1a1a]">
                      <div className="bg-gray-100 dark:bg-[#1a1a1a]  px-4 py-3 border-none dark:border-b dark:border-[#333333] text-sm font-medium text-[black] dark:text-white flex items-center justify-between">
                        <span>Output</span>
                        <button
                          className="text-gray-400 hover:text-white transition-colors"
                          aria-label="Copy output"
                          onClick={() => {
                            navigator.clipboard.writeText(example.output);
                            setCopiedOutput(true);
                            setTimeout(() => setCopiedOutput(false), 2000);
                          }}
                        >
                          {copiedOutput ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <LuCopy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <div className="p-4 font-mono text-sm bg-[white] dark:bg-[#121212] text-[#262626] dark:text-gray-300  min-h-[100px]">
                        {formatTestCase(example.output)}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              )
            )}
          </Tabs>
        </div>
      )}
    </TabsContent>
  );
}
