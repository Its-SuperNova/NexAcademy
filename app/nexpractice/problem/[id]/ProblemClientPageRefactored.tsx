"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useIsMobile } from "@/components/ui/use-mobile";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import { useProfilePic } from "@/components/ProfilePicContext";
import { useMutation, useQuery, useApolloClient } from "@apollo/client";
import { RUN_CODE, SUBMIT_CODE } from "./graphql/codeExecution";
import { CodingQuestionsSidebar } from "@/components/CodingQuestionsSidebar";
import { NexEditor as CodeEditor } from "@/components/NexEditor";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { getLanguageId } from "./utils/getLanguageId";
import { stopNexPracticeLoading } from "@/app/explore-nex/ExploreNexContent";
import { useXpNotifications } from "@/hooks/use-xp-notification";
import { triggerStreakModal } from "@/components/problem-solving-wrapper";
import DOMPurify from "isomorphic-dompurify";
import { gql } from "@apollo/client";

// Import our new components
import Header from "./components/Header";
import ProblemHeader from "./components/ProblemHeader";
import EditorToolbar from "./components/EditorToolbar";
import RunSubmitButtons from "./components/RunSubmitButtons";
import ResultsPanel from "./components/ResultsPanel";
import MobileNavigation from "./components/MobileNavigation";
import LanguageSelector from "./components/LanguageSelector";
import {
  JUDGE0_LANGUAGES,
  parseLanguageName,
} from "./components/LanguageSelector";

interface ProblemClientPageProps {
  codingQuestion: any;
  defaultLanguage: string;
  preloadCode: string;
}

export default function ProblemClientPage({
  codingQuestion,
  defaultLanguage,
  preloadCode,
}: ProblemClientPageProps) {
  // State variables
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [language, setLanguage] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [editorLoading, setEditorLoading] = useState(false);
  const [activePanel, setActivePanel] = useState<
    "problem" | "code" | "results"
  >("problem");
  const [leftPanelWidth, setLeftPanelWidth] = useState(50);
  const [editorHeight, setEditorHeight] = useState(70);
  const [focusMode, setFocusMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isResultsPanelFullscreen, setIsResultsPanelFullscreen] =
    useState(false);

  // Editor settings
  const [fontSize, setFontSize] = useState(14);
  const [tabSize, setTabSize] = useState(4);
  const [editorTheme, setEditorTheme] = useState<"vs-dark" | "light">(
    "vs-dark"
  );

  // Results state
  const [activeTab, setActiveTab] = useState<string>("sample");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [executionMessage, setExecutionMessage] = useState<string>("");
  const [executionStatus, setExecutionStatus] = useState<
    "success" | "error" | "warning" | "info" | null
  >(null);
  const [loadingPhrase, setLoadingPhrase] = useState<string>("");
  const [showEvaluatingSkeletons, setShowEvaluatingSkeletons] =
    useState<boolean>(false);
  const [skeletonTab, setSkeletonTab] = useState<"sample" | "hidden" | null>(
    null
  );
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [sampleTestResults, setSampleTestResults] = useState<any[]>([]);
  const [hiddenTestResults, setHiddenTestResults] = useState<any[]>([]);
  const [sampleExecutionStatus, setSampleExecutionStatus] = useState<
    "success" | "error" | "warning" | "info" | null
  >(null);
  const [hiddenExecutionStatus, setHiddenExecutionStatus] = useState<
    "success" | "error" | "warning" | "info" | null
  >(null);

  // Hidden testcase state
  const [totalHiddenTestcases, setTotalHiddenTestcases] = useState<number>(0);
  const [completedHiddenTestcases, setCompletedHiddenTestcases] =
    useState<number>(0);
  const [passedHiddenTestcases, setPassedHiddenTestcases] = useState<number>(0);
  const [executingHiddenTestcases, setExecutingHiddenTestcases] =
    useState<boolean>(false);
  const [hiddenTestcasesFailed, setHiddenTestcasesFailed] =
    useState<boolean>(false);
  const [skippedHiddenTestcases, setSkippedHiddenTestcases] =
    useState<number>(0);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  // Formatting state
  const [isFormatting, setIsFormatting] = useState(false);
  const [formatSuccess, setFormatSuccess] = useState(false);
  const [noChangesNeeded, setNoChangesNeeded] = useState(false);

  // Hooks
  const isMobile = useIsMobile();
  const { resolvedTheme: appTheme, setTheme: setAppTheme } = useTheme();
  const { data: session } = useSession();
  const { profilePic } = useProfilePic();
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const client = useApolloClient();
  const { showSubmissionXpNotification, showXpNotification } =
    useXpNotifications();

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);

  // GraphQL mutations
  const [runCodeMutation] = useMutation(RUN_CODE);
  const [submitCodeMutation] = useMutation(SUBMIT_CODE);

  // Extract problem details
  const problemId = useMemo(() => {
    const pathSegments = pathname.split("/");
    return pathSegments[pathSegments.length - 1];
  }, [pathname]);

  const problemNumber = codingQuestion.question?.version || 1;
  const problemTitle = codingQuestion.question?.name || "Untitled Problem";
  const difficulty = codingQuestion.question?.difficulty || "EASY";
  const description = codingQuestion.questionText;
  const examples =
    codingQuestion.testCases?.filter(
      (tc: any) => tc.isSample || tc.isSample === undefined
    ) || [];

  // Helper function to format test case content
  const formatTestCase = (content: string): React.ReactNode => {
    // Implementation hidden for brevity
    return <div>{content}</div>;
  };

  // Toggle functions
  const toggleFocusMode = () => {
    setFocusMode(!focusMode);
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleResultsPanelFullscreen = () => {
    setIsResultsPanelFullscreen(!isResultsPanelFullscreen);
  };

  // Code execution functions
  const runCode = async () => {
    // Implementation hidden for brevity
    console.log("Running code...");
  };

  const submitCode = async () => {
    // Implementation hidden for brevity
    console.log("Submitting code...");
  };

  // Formatting function
  const formatCode = async () => {
    // Implementation hidden for brevity
    console.log("Formatting code...");
  };

  const resetCode = () => {
    setCode(preloadCode);
  };

  // Handle language change
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  // Use effect for editor theme sync with app theme
  useEffect(() => {
    if (appTheme === "dark") {
      setEditorTheme("vs-dark");
    } else if (appTheme === "light") {
      setEditorTheme("light");
    }
  }, [appTheme]);

  return (
    <div className="flex flex-col h-screen w-screen fixed inset-0 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 overflow-hidden">
      {/* Sidebar */}
      <CodingQuestionsSidebar
        currentQuestionId={codingQuestion.questionId || codingQuestion.id}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        className={
          isMobile
            ? "fixed inset-y-0 left-0 z-50 m-0 rounded-none w-full max-w-sm transform transition-transform duration-300 ease-in-out" +
              (sidebarOpen ? " translate-x-0" : " -translate-x-full")
            : ""
        }
      />

      {/* Sidebar overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Header */}
      <Header
        profilePic={profilePic}
        session={session}
        setSidebarOpen={setSidebarOpen}
        handleFullscreenToggle={handleFullscreenToggle}
        isFullscreen={isFullscreen}
      />

      {/* Middle section with RunSubmitButtons */}
      <RunSubmitButtons
        runCode={runCode}
        submitCode={submitCode}
        isRunning={isRunning}
        isSubmitting={isSubmitting}
        loadingPhrase={loadingPhrase}
      />

      {/* Main content */}
      <div ref={containerRef} className="flex flex-1 overflow-hidden">
        {/* Problem description panel */}
        <div
          className={`h-full overflow-auto bg-white dark:bg-black ${
            isMobile
              ? activePanel === "problem"
                ? "block w-full"
                : "hidden"
              : "border-r border-indigo-100 dark:border-indigo-900/50"
          } ${isMobile ? "pb-24" : ""}`}
          style={{ width: isMobile ? "100%" : `${leftPanelWidth}%` }}
        >
          <div className="p-3 md:px-5 md:py-3">
            <ProblemHeader
              problemNumber={problemNumber}
              problemTitle={problemTitle}
              difficulty={difficulty}
              isLeftPanelExpanded={false}
              toggleLeftPanelExpansion={() => {}}
              isMobile={isMobile}
              getDifficultyBadge={() => null}
              solvedBy={codingQuestion.question?.solvedBy || 1248}
              tags={
                codingQuestion.question?.tags || [
                  { name: "Array" },
                  { name: "Hash Table" },
                ]
              }
            />

            {/* Problem content - tabs and description would go here */}
          </div>
        </div>

        {/* Horizontal resizer */}
        {!isMobile && (
          <div
            className="relative w-1 h-full flex-shrink-0 z-10 group cursor-ew-resize"
            // Resizing logic would go here
          >
            <div className="absolute inset-0 w-1 h-full bg-indigo-100 dark:bg-indigo-900/30 group-hover:bg-indigo-300 dark:group-hover:bg-indigo-700/50 transition-colors duration-300"></div>
          </div>
        )}

        {/* Right panel containing editor and results */}
        <div
          className={`flex flex-col h-full ${
            isMobile && activePanel === "problem" ? "hidden" : ""
          }`}
          style={{ width: isMobile ? "100%" : `${100 - leftPanelWidth}%` }}
        >
          {/* Code editor panel */}
          <div
            className={`flex flex-col overflow-hidden ${
              isMobile ? (activePanel === "code" ? "block" : "hidden") : ""
            } ${isMobile ? "pb-24" : ""}`}
            style={{
              flexBasis: isMobile ? "100%" : `${editorHeight}%`,
              flexGrow: 0,
              flexShrink: 1,
              minHeight: 0,
              maxHeight: isMobile ? "100%" : `${editorHeight}%`,
              height: isMobile ? "100%" : undefined,
              transition: "all 0.3s ease-in-out",
            }}
          >
            {/* Editor toolbar */}
            <EditorToolbar
              language={language}
              onLanguageChange={handleLanguageChange}
              editorLoading={editorLoading}
              toggleFocusMode={toggleFocusMode}
              focusMode={focusMode}
              formatCode={formatCode}
              isFormatting={isFormatting}
              formatSuccess={formatSuccess}
              noChangesNeeded={noChangesNeeded}
              fontSize={fontSize}
              setFontSize={setFontSize}
              tabSize={tabSize}
              setTabSize={setTabSize}
              editorTheme={editorTheme}
              setEditorTheme={setEditorTheme}
              resetCode={resetCode}
              isMobile={isMobile}
            />

            {/* Code editor */}
            <div className="flex-1 overflow-auto" style={{ minHeight: 0 }}>
              <div className="h-full w-full relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                {editorLoading ? (
                  <div className="flex items-center justify-center h-full w-full">
                    {/* Editor loading skeleton would go here */}
                    <div>Loading editor...</div>
                  </div>
                ) : (
                  <CodeEditor
                    code={code}
                    onChange={setCode}
                    language={language}
                    theme={editorTheme}
                    fontSize={fontSize}
                    tabSize={tabSize}
                    onEditorMount={(editor, monaco) => {
                      editorRef.current = editor;
                      monacoRef.current = monaco;
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Vertical resizer */}
          {!isMobile && (
            <div
              className="relative h-1 w-full flex-shrink-0 z-10 group cursor-ns-resize"
              // Resizing logic would go here
            >
              <div className="absolute inset-0 h-1 w-full bg-indigo-100 dark:bg-indigo-900/30 group-hover:bg-indigo-300 dark:group-hover:bg-indigo-700/50 transition-colors duration-300"></div>
            </div>
          )}

          {/* Results panel */}
          <div
            className={`flex flex-col overflow-hidden ${
              isMobile ? (activePanel === "results" ? "block" : "hidden") : ""
            } ${isMobile ? "pb-24" : ""}`}
            style={{
              flexBasis: isMobile ? "100%" : `${100 - editorHeight}%`,
              flexGrow: 0,
              flexShrink: 0,
              minHeight: 0,
              maxHeight: isMobile ? "100%" : `${100 - editorHeight}%`,
              height: isMobile ? "100%" : undefined,
              transition: "all 0.3s ease-in-out",
            }}
          >
            <ResultsPanel
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              loadingPhrase={loadingPhrase}
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
              showEvaluatingSkeletons={showEvaluatingSkeletons}
              skeletonTab={skeletonTab}
              sampleTestResults={sampleTestResults}
              sampleExecutionStatus={sampleExecutionStatus}
              examples={examples}
              isResultsPanelFullscreen={isResultsPanelFullscreen}
              toggleResultsPanelFullscreen={toggleResultsPanelFullscreen}
              formatTestCase={formatTestCase}
            />
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMobile && (
        <MobileNavigation
          activePanel={activePanel}
          setActivePanel={setActivePanel}
        />
      )}
    </div>
  );
}
