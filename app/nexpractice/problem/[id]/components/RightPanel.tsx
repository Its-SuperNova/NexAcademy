import React, { useState, useCallback } from "react";
import CodeEditorSection from "./CodeEditorSection";
import ResultsSection from "./ResultsSection";

interface RightPanelProps {
  hasMounted: boolean;
  isMobile: boolean;
  activePanel: string;
  leftPanelWidth: number;
  editorHeight: number;
  language: string;
  editorTheme: "vs-dark" | "light";
  fontSize: number;
  tabSize: number;
  code: string;
  isRunning: boolean;
  isSubmitting: boolean;
  isFormatting: boolean;
  formatSuccess: boolean;
  editorLoading: boolean;
  initialLoading: boolean;
  searchLanguage: string;
  languageDropdownOpen: boolean;
  JUDGE0_LANGUAGES: Record<string, string>;
  setCode: (code: string) => void;
  setFontSize: (size: number) => void;
  setTabSize: (size: number) => void;
  setEditorTheme: (theme: "vs-dark" | "light") => void;
  setSearchLanguage: (lang: string) => void;
  setLanguageDropdownOpen: (open: boolean) => void;
  setFormatSuccess: (success: boolean) => void;
  runCode: () => void;
  submitCode: () => void;
  formatCode: () => void;
  toggleFocusMode: () => void;
  handleLanguageChange: (lang: string) => void;
  parseLanguageName: (name: string) => { name: string; version: string };
  focusMode: boolean;
  preloadCode: string;
  editorRef: React.RefObject<any>;
  monacoRef: React.RefObject<any>;
  handleEditorDidMount: (editor: any, monaco: any) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showEvaluatingSkeletons: boolean;
  skeletonTab: "sample" | "hidden" | null;
  sampleTestResults: any[];
  sampleExecutionStatus: "success" | "error" | "warning" | "info" | null;
  formatTestCase: (content: string) => React.ReactNode;
  examples: any[];
  copiedInput: boolean;
  copiedOutput: boolean;
  setCopiedInput: (copied: boolean) => void;
  setCopiedOutput: (copied: boolean) => void;
  executingHiddenTestcases: boolean;
  hiddenTestResults: any[];
  totalHiddenTestcases: number;
  completedHiddenTestcases: number;
  passedHiddenTestcases: number;
  skippedHiddenTestcases: number;
  hiddenExecutionStatus: "success" | "error" | "warning" | "info" | null;
  showCelebration: boolean;
}

export default function RightPanel({
  hasMounted,
  isMobile,
  activePanel,
  leftPanelWidth,
  editorHeight,
  language,
  editorTheme,
  fontSize,
  tabSize,
  code,
  isRunning,
  isSubmitting,
  isFormatting,
  formatSuccess,
  editorLoading,
  initialLoading,
  searchLanguage,
  languageDropdownOpen,
  JUDGE0_LANGUAGES,
  setCode,
  setFontSize,
  setTabSize,
  setEditorTheme,
  setSearchLanguage,
  setLanguageDropdownOpen,
  setFormatSuccess,
  runCode,
  submitCode,
  formatCode,
  toggleFocusMode,
  handleLanguageChange,
  parseLanguageName,
  focusMode,
  preloadCode,
  editorRef,
  monacoRef,
  handleEditorDidMount,
  activeTab,
  setActiveTab,
  showEvaluatingSkeletons,
  skeletonTab,
  sampleTestResults,
  sampleExecutionStatus,
  formatTestCase,
  examples,
  copiedInput,
  copiedOutput,
  setCopiedInput,
  setCopiedOutput,
  executingHiddenTestcases,
  hiddenTestResults,
  totalHiddenTestcases,
  completedHiddenTestcases,
  passedHiddenTestcases,
  skippedHiddenTestcases,
  hiddenExecutionStatus,
  showCelebration,
}: RightPanelProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [editorHeightState, setEditorHeightState] = useState(editorHeight);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      const container = document.querySelector(".right-panel-container");
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const newHeight =
        ((e.clientY - containerRect.top) / containerRect.height) * 100;

      // Limit the height between 20% and 80%
      const clampedHeight = Math.min(Math.max(newHeight, 20), 80);
      setEditorHeightState(clampedHeight);
    },
    [isResizing]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  React.useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div
      className={`flex flex-col h-full m-4 mb-0 ml-1 right-panel-container ${
        hasMounted && isMobile && activePanel === "problem" ? "hidden" : ""
      }`}
      style={{
        width: hasMounted && isMobile ? "100%" : `${100 - leftPanelWidth}%`,
      }}
    >
      <div className="flex flex-col gap-1 h-[calc(100vh-8rem)]">
        <CodeEditorSection
          hasMounted={hasMounted}
          isMobile={isMobile}
          activePanel={activePanel}
          editorHeight={editorHeightState}
          language={language}
          editorTheme={editorTheme}
          fontSize={fontSize}
          tabSize={tabSize}
          code={code}
          isRunning={isRunning}
          isSubmitting={isSubmitting}
          isFormatting={isFormatting}
          formatSuccess={formatSuccess}
          editorLoading={editorLoading}
          initialLoading={initialLoading}
          searchLanguage={searchLanguage}
          languageDropdownOpen={languageDropdownOpen}
          JUDGE0_LANGUAGES={JUDGE0_LANGUAGES}
          setCode={setCode}
          setFontSize={setFontSize}
          setTabSize={setTabSize}
          setEditorTheme={setEditorTheme}
          setSearchLanguage={setSearchLanguage}
          setLanguageDropdownOpen={setLanguageDropdownOpen}
          setFormatSuccess={setFormatSuccess}
          runCode={async () => await runCode()}
          submitCode={async () => await submitCode()}
          formatCode={async () => await formatCode()}
          toggleFocusMode={toggleFocusMode}
          handleLanguageChange={handleLanguageChange}
          parseLanguageName={(fullName: string | null | undefined) =>
            parseLanguageName(fullName || "")
          }
          focusMode={focusMode}
          preloadCode={preloadCode}
          editorRef={editorRef}
          monacoRef={monacoRef}
          handleEditorDidMount={handleEditorDidMount}
        />

        <div
          className={`h-2 cursor-row-resize active:bg-indigo-500/30 transition-colors flex justify-center items-center group`}
          onMouseDown={handleMouseDown}
        >
          <div
            className={`h-2 bg-[#1f1f1f] group-hover:bg-white w-[60px] rounded-full transition-colors group-active:bg-[#0779FF]`}
          ></div>
        </div>

        <ResultsSection
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          showEvaluatingSkeletons={showEvaluatingSkeletons}
          skeletonTab={skeletonTab}
          sampleTestResults={sampleTestResults}
          sampleExecutionStatus={sampleExecutionStatus}
          formatTestCase={formatTestCase}
          examples={examples}
          copiedInput={copiedInput}
          copiedOutput={copiedOutput}
          setCopiedInput={setCopiedInput}
          setCopiedOutput={setCopiedOutput}
          executingHiddenTestcases={executingHiddenTestcases}
          hiddenTestResults={hiddenTestResults}
          totalHiddenTestcases={totalHiddenTestcases}
          completedHiddenTestcases={completedHiddenTestcases}
          passedHiddenTestcases={passedHiddenTestcases}
          skippedHiddenTestcases={skippedHiddenTestcases}
          hiddenExecutionStatus={hiddenExecutionStatus}
          isRunning={isRunning}
          isSubmitting={isSubmitting}
          submitCode={submitCode}
          showCelebration={showCelebration}
          hasMounted={hasMounted}
          isMobile={isMobile}
          editorHeight={editorHeightState}
        />
      </div>
    </div>
  );
}
