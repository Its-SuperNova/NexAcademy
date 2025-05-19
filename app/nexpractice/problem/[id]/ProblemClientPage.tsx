"use client";

import React, {
  Fragment,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Play,
  Send,
  Bell,
  FileText,
  Settings,
  List,
  BarChart2,
  MessageSquare,
  Clock,
  Check,
  Eye,
  Grip,
  Terminal,
  Menu,
  X,
  Home,
  MoreVertical,
  Code,
  Zap,
  BrainCircuit,
  RotateCw,
  BookOpenCheck,
  Sparkles,
  Crown,
  Users,
  Maximize2,
  Minimize2,
  ChevronDown,
  Search,
  User,
  LogOut,
  AlertTriangle,
  XCircle,
  Info,
  Cpu,
  Loader2,
  Percent,
  Lock,
  CheckCircle,
  AlignLeft,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Copy,
  ClipboardCopy,
  Sparkle,
  ArrowLeft,
  Filter,
  RefreshCw,
  Database,
  AlertCircle,
  HelpCircle,
  Calendar,
  Hash,
  Code2,
  Server,
  FileCode,
  MonitorSmartphone,
  Moon,
  Sun,
  Type,
  Indent,
  Compass,
  Shuffle,
  Sliders,
  WrapText,
  LineChart,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CgFormatLeft } from "react-icons/cg";
import { LuMaximize } from "react-icons/lu";
import { LuMinimize } from "react-icons/lu";
import { NexEditor as CodeEditor } from "@/components/NexEditor";
import { useIsMobile } from "@/components/ui/use-mobile";
import { useTheme } from "next-themes";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CodingQuestionsSidebar } from "@/components/CodingQuestionsSidebar";
import { Input } from "@/components/ui/input";
import type { editor } from "monaco-editor";
import type { Monaco } from "@monaco-editor/react";
import { useSession } from "next-auth/react";
import { useProfilePic } from "@/components/ProfilePicContext";
import { useMutation, useQuery, useApolloClient } from "@apollo/client";
import { RUN_CODE, SUBMIT_CODE } from "./graphql/codeExecution";
import { getLanguageId } from "./utils/getLanguageId";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { HiddenTestcasesTab } from "./components/HiddenTestcasesTab";
import ProblemHeader from "./components/ProblemHeader";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { submissionService } from "@/lib/services/submissionService";
import JSConfetti from "js-confetti";
import { Editor } from "@monaco-editor/react";
import { ModeToggle } from "@/components/nexpractice/mode-toggle";
import DOMPurify from "isomorphic-dompurify";
import { gql } from "@apollo/client";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
// Import the stopNexPracticeLoading function
import { stopNexPracticeLoading } from "@/app/explore-nex/ExploreNexContent";
import { useXpNotifications } from "@/hooks/use-xp-notification";
import { triggerStreakModal } from "@/components/problem-solving-wrapper";
// Add import for FloatingMobileTab at the top of the file with other imports
import FloatingMobileTab from "./components/FloatingMobileTab";
// Add import for Header component at the top of the file with other imports
import Header from "./components/Header";
import DescriptionTab from "./components/DescriptionTab";
import SolutionTab from "./components/SolutionTab";
import DiscussionTab from "./components/DiscussionTab";
import SubmissionsTab from "./components/SubmissionsTab";
import { Switch } from "@/components/ui/switch";

// Judge0 API language mapping
const JUDGE0_LANGUAGES = {
  "45": "Assembly (NASM 2.14.02)",
  "46": "Bash (5.0.0)",
  "47": "Basic (FBC 1.07.1)",
  "75": "C (Clang 7.0.1)",
  "76": "C++ (Clang 7.0.1)",
  "48": "C (GCC 7.4.0)",
  "52": "C++ (GCC 7.4.0)",
  "49": "C (GCC 8.3.0)",
  "53": "C++ (GCC 8.3.0)",
  "50": "C (GCC 9.2.0)",
  "54": "C++ (GCC 9.2.0)",
  "86": "Clojure (1.10.1)",
  "51": "C# (Mono 6.6.0.161)",
  "77": "COBOL (GnuCOBOL 2.2)",
  "55": "Common Lisp (SBCL 2.0.0)",
  "56": "D (DMD 2.089.1)",
  "57": "Elixir (1.9.4)",
  "58": "Erlang (OTP 22.2)",
  "44": "Executable",
  "87": "F# (.NET Core SDK 3.1.202)",
  "59": "Fortran (GFortran 9.2.0)",
  "60": "Go (1.13.5)",
  "88": "Groovy (3.0.3)",
  "61": "Haskell (GHC 8.8.1)",
  "62": "Java (OpenJDK 13.0.1)",
  "63": "JavaScript (Node.js 12.14.0)",
  "78": "Kotlin (1.3.70)",
  "64": "Lua (5.3.5)",
  "89": "Multi-file program",
  "79": "Objective-C (Clang 7.0.1)",
  "65": "OCaml (4.09.0)",
  "66": "Octave (5.1.0)",
  "67": "Pascal (FPC 3.0.4)",
  "85": "Perl (5.28.1)",
  "68": "PHP (7.4.1)",
  "43": "Plain Text",
  "69": "Prolog (GNU Prolog 1.4.5)",
  "70": "Python (2.7.17)",
  "71": "Python (3.8.1)",
  "80": "R (4.0.0)",
  "72": "Ruby (2.7.0)",
  "73": "Rust (1.40.0)",
  "81": "Scala (2.13.2)",
  "82": "SQL (SQLite 3.27.2)",
  "83": "Swift (5.2.3)",
  "74": "TypeScript (3.7.4)",
  "84": "Visual Basic.Net (vbnc 0.0.0.5943)",
};

interface ProblemClientPageProps {
  codingQuestion: any; // Use 'any' for now, or import the correct type and extend it to include .question
  defaultLanguage: string;
  preloadCode: string;
}

// Helper function to format test case content
const formatTestCase = (content: string): React.ReactNode => {
  if (!content) return null;

  // Try to parse the content as JSON to see if it's structured data
  try {
    const parsedData = JSON.parse(content);
    if (typeof parsedData === "object") {
      return (
        <div className="syntax-highlighted">
          {renderJsonValue(parsedData, 0)}
        </div>
      );
    }
  } catch (e) {
    // Not valid JSON, continue with other formatting
  }

  // Handle arrays represented as strings like "[1,2,3]"
  if (content.trim().startsWith("[") && content.trim().endsWith("]")) {
    try {
      const arrayData = JSON.parse(content);
      if (Array.isArray(arrayData)) {
        return (
          <div className="syntax-highlighted">{renderArray(arrayData)}</div>
        );
      }
    } catch (e) {
      // Not a valid array, continue
    }
  }

  // Handle common variable assignment patterns like "nums = [2,7,11,15], target = 9"
  if (content.includes("=")) {
    return (
      <div className="space-y-1">
        {content.split(",").map((part, idx) => {
          const parts = part.split("=").map((s) => s.trim());
          if (parts.length < 2) return <div key={idx}>{part}</div>;

          const [variable, value] = parts;

          return (
            <div key={idx} className="flex flex-wrap items-center">
              <span className="text-purple-600 dark:text-purple-400 mr-1">
                {variable}
              </span>
              <span className="text-slate-600 dark:text-slate-400 mr-1">=</span>
              <span>{renderFormattedValue(value)}</span>
            </div>
          );
        })}
      </div>
    );
  }

  // If content has multiple lines, preserve them
  if (content.includes("\n")) {
    return <pre className="whitespace-pre-wrap">{content}</pre>;
  }

  // Default: return as-is with basic formatting
  return (
    <div className="whitespace-pre-wrap">{renderFormattedValue(content)}</div>
  );
};

// Helper function to render formatted value
const renderFormattedValue = (value: string): React.ReactNode => {
  // Check if value is a number
  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return <span className="text-amber-600 dark:text-amber-400">{value}</span>;
  }

  // Check if value is a boolean
  if (value === "true" || value === "false") {
    return <span className="text-green-600 dark:text-green-400">{value}</span>;
  }

  // Check if value is null or undefined
  if (value === "null" || value === "undefined") {
    return <span className="text-gray-500 dark:text-gray-400">{value}</span>;
  }

  // Check if value is a string
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return <span className="text-green-600 dark:text-green-400">{value}</span>;
  }

  // Check if value is an array
  if (value.startsWith("[") && value.endsWith("]")) {
    try {
      const array = JSON.parse(value);
      if (Array.isArray(array)) {
        return renderArray(array);
      }
    } catch (e) {
      // Not a valid array
    }
  }

  // Default case
  return <span>{value}</span>;
};

// Helper function to render JSON-like arrays
const renderArray = (array: any[]): React.ReactNode => {
  return (
    <span>
      <span className="text-slate-600 dark:text-slate-400">[</span>
      {array.map((item, index) => (
        <Fragment key={index}>
          {index > 0 && (
            <span className="text-slate-600 dark:text-slate-400">, </span>
          )}
          {renderJsonValue(item, 0)}
        </Fragment>
      ))}
      <span className="text-slate-600 dark:text-slate-400">]</span>
    </span>
  );
};

// Helper to render JSON object/array with indentation
const renderJsonValue = (value: any, level: number): React.ReactNode => {
  if (value === null) {
    return <span className="text-gray-500 dark:text-gray-400">null</span>;
  }

  if (typeof value === "undefined") {
    return <span className="text-gray-500 dark:text-gray-400">undefined</span>;
  }

  if (typeof value === "boolean") {
    return (
      <span className="text-green-600 dark:text-green-400">
        {String(value)}
      </span>
    );
  }

  if (typeof value === "number") {
    return <span className="text-amber-600 dark:text-amber-400">{value}</span>;
  }

  if (typeof value === "string") {
    return (
      <span className="text-green-600 dark:text-green-400">"{value}"</span>
    );
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="text-slate-600 dark:text-slate-400">[]</span>;
    }

    if (level > 2 || isPrimitiveArray(value)) {
      // For deeply nested arrays or primitive arrays, show compact form
      return (
        <span>
          <span className="text-slate-600 dark:text-slate-400">[</span>
          {value.map((item, idx) => (
            <Fragment key={idx}>
              {idx > 0 && (
                <span className="text-slate-600 dark:text-slate-400">, </span>
              )}
              {renderJsonValue(item, level + 1)}
            </Fragment>
          ))}
          <span className="text-slate-600 dark:text-slate-400">]</span>
        </span>
      );
    }

    // For top-level and non-primitive arrays, show expanded form
    return (
      <div className="pl-4 border-l-2 border-indigo-100 dark:border-indigo-900/50 my-1">
        <span className="text-slate-600 dark:text-slate-400">[</span>
        {value.map((item, idx) => (
          <div key={idx} className="ml-2">
            {renderJsonValue(item, level + 1)}
            {idx < value.length - 1 && (
              <span className="text-slate-600 dark:text-slate-400">,</span>
            )}
          </div>
        ))}
        <span className="text-slate-600 dark:text-slate-400">]</span>
      </div>
    );
  }

  if (typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length === 0) {
      return <span className="text-slate-600 dark:text-slate-400">{"{}"}</span>;
    }

    if (level > 2) {
      // For deeply nested objects, show compact form
      return (
        <span>
          <span className="text-slate-600 dark:text-slate-400">{"{"}</span>
          {entries.map(([key, val], idx) => (
            <Fragment key={key}>
              {idx > 0 && (
                <span className="text-slate-600 dark:text-slate-400">, </span>
              )}
              <span className="text-purple-600 dark:text-purple-400">
                "{key}"
              </span>
              <span className="text-slate-600 dark:text-slate-400">: </span>
              {renderJsonValue(val, level + 1)}
            </Fragment>
          ))}
          <span className="text-slate-600 dark:text-slate-400">{"}"}</span>
        </span>
      );
    }

    // For top-level objects, show expanded form
    return (
      <div className="pl-4 border-l-2 border-indigo-100 dark:border-indigo-900/50 my-1">
        <span className="text-slate-600 dark:text-slate-400">{"{"}</span>
        {entries.map(([key, val], idx) => (
          <div key={key} className="ml-2">
            <span className="text-purple-600 dark:text-purple-400">
              "{key}"
            </span>
            <span className="text-slate-600 dark:text-slate-400">: </span>
            {renderJsonValue(val, level + 1)}
            {idx < entries.length - 1 && (
              <span className="text-slate-600 dark:text-slate-400">,</span>
            )}
          </div>
        ))}
        <span className="text-slate-600 dark:text-slate-400">{"}"}</span>
      </div>
    );
  }

  // Default case
  return <span>{String(value)}</span>;
};

// Helper to check if array contains only primitive values
const isPrimitiveArray = (arr: any[]): boolean => {
  return arr.every(
    (item) =>
      item === null ||
      typeof item === "undefined" ||
      typeof item === "string" ||
      typeof item === "number" ||
      typeof item === "boolean"
  );
};

// Add language categories for organization
interface LanguageCategory {
  name: string;
  languages: string[]; // keys from JUDGE0_LANGUAGES
}

// Group languages by category for better organization
const LANGUAGE_CATEGORIES: LanguageCategory[] = [
  {
    name: "Popular",
    languages: ["71", "63", "62", "54", "73", "74", "60"],
  },
  {
    name: "JavaScript & TypeScript",
    languages: ["63", "74"],
  },
  {
    name: "Python",
    languages: ["70", "71"],
  },
  {
    name: "Java & JVM",
    languages: ["62", "78", "81", "86"],
  },
  {
    name: "C & C++",
    languages: ["48", "49", "50", "52", "53", "54", "75", "76"],
  },
  {
    name: "Systems Programming",
    languages: ["73", "45", "56"],
  },
  {
    name: "Web Development",
    languages: ["63", "74", "68", "72"],
  },
  {
    name: "Functional",
    languages: ["55", "57", "58", "65", "87"],
  },
  {
    name: "Others",
    languages: [
      "46",
      "47",
      "51",
      "59",
      "60",
      "61",
      "64",
      "66",
      "67",
      "69",
      "77",
      "79",
      "80",
      "82",
      "83",
      "84",
      "85",
      "88",
      "89",
      "43",
      "44",
    ],
  },
];

// Language icons mapping (for common languages)
const LANGUAGE_ICONS: Record<string, React.ReactNode> = {
  // JavaScript
  "63": (
    <div className="flex items-center justify-center w-full h-full">
      <span className="text-[11px] font-semibold text-yellow-500 dark:text-yellow-400 inline-flex">
        JS
      </span>
    </div>
  ),
  // TypeScript
  "74": (
    <div className="flex items-center justify-center w-full h-full">
      <span className="text-[11px] font-semibold text-blue-500 dark:text-blue-400 inline-flex">
        TS
      </span>
    </div>
  ),
  // Python
  "70": (
    <div className="flex items-center justify-center w-full h-full">
      <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 inline-flex">
        Py
      </span>
    </div>
  ),
  "71": (
    <div className="flex items-center justify-center w-full h-full">
      <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 inline-flex">
        Py
      </span>
    </div>
  ),
  // Java
  "62": (
    <div className="flex items-center justify-center w-full h-full">
      <span className="text-[11px] font-semibold text-orange-500 dark:text-orange-400 inline-flex">
        Ja
      </span>
    </div>
  ),
  // C
  "48": (
    <div className="flex items-center justify-center w-full h-full">
      <span className="text-[11px] font-semibold text-blue-500 dark:text-blue-400 inline-flex">
        C
      </span>
    </div>
  ),
  "49": (
    <div className="flex items-center justify-center w-full h-full">
      <span className="text-[11px] font-semibold text-blue-500 dark:text-blue-400 inline-flex">
        C
      </span>
    </div>
  ),
  "50": (
    <div className="flex items-center justify-center w-full h-full">
      <span className="text-[11px] font-semibold text-blue-500 dark:text-blue-400 inline-flex">
        C
      </span>
    </div>
  ),
  // C++
  "52": (
    <div className="flex items-center justify-center w-full h-full">
      <span className="text-[11px] font-semibold text-pink-500 dark:text-pink-400 inline-flex">
        C++
      </span>
    </div>
  ),
  "53": (
    <div className="flex items-center justify-center w-full h-full">
      <span className="text-[11px] font-semibold text-pink-500 dark:text-pink-400 inline-flex">
        C++
      </span>
    </div>
  ),
  "54": (
    <div className="flex items-center justify-center w-full h-full">
      <span className="text-[11px] font-semibold text-pink-500 dark:text-pink-400 inline-flex">
        C++
      </span>
    </div>
  ),
  // Go
  "60": (
    <div className="flex items-center justify-center w-full h-full">
      <span className="text-[11px] font-semibold text-teal-500 dark:text-teal-400 inline-flex">
        Go
      </span>
    </div>
  ),
  // Rust
  "73": (
    <div className="flex items-center justify-center w-full h-full">
      <span className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 inline-flex">
        Rs
      </span>
    </div>
  ),
  // Ruby
  "72": (
    <div className="flex items-center justify-center w-full h-full">
      <span className="text-[11px] font-semibold text-red-500 dark:text-red-400 inline-flex">
        Rb
      </span>
    </div>
  ),
  // PHP
  "68": (
    <div className="flex items-center justify-center w-full h-full">
      <span className="text-[11px] font-semibold text-indigo-500 dark:text-indigo-400 inline-flex">
        PHP
      </span>
    </div>
  ),
};

// Helper to extract language name and version
const parseLanguageName = (fullName: string | undefined | null) => {
  if (!fullName || typeof fullName !== "string") {
    return { name: "", version: "" };
  }
  const match = fullName.match(/^(.+?)\s+\((.+?)\)$/);
  if (match) {
    return {
      name: match[1],
      version: match[2],
    };
  }
  return { name: fullName, version: "" };
};

// GraphQL mutation for saving user code draft
const SAVE_USER_CODE_DRAFT = gql`
  mutation SaveCodeDraft($input: SaveCodeDraftInput!) {
    saveCodeDraft(input: $input) {
      success
      message
    }
  }
`;

// GraphQL mutation for saving user problem setting (language)
const SAVE_USER_PROBLEM_SETTINGS = gql`
  mutation SaveUserProblemSettings($input: SaveUserProblemSettingsInput!) {
    saveUserProblemSettings(input: $input) {
      success
      message
    }
  }
`;

// GraphQL query for getting user problem settings
const GET_USER_PROBLEM_SETTINGS = gql`
  query GetUserProblemSettings($userId: String!, $problemId: String!) {
    getUserProblemSettings(userId: $userId, problemId: $problemId) {
      lastLanguage
    }
  }
`;

// GraphQL query for getting user code draft
const GET_USER_CODE_DRAFT = gql`
  query GetUserCodeDraft(
    $userId: String!
    $problemId: String!
    $language: String!
  ) {
    getUserCodeDraft(
      userId: $userId
      problemId: $problemId
      language: $language
    ) {
      code
      updatedAt
    }
  }
`;

// Animation styles for the component
const animationStyles = `
@keyframes popOnHover {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1.1);
  }
}

@keyframes heartbeat {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.2);
  }
  50% {
    transform: scale(1);
  }
  75% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes centerAndBlur {
  0% {
    filter: blur(0);
    opacity: 0;
  }
  100% {
    filter: blur(8px);
    opacity: 1;
  }
}

.random-challenge-icon {
  transition: all 0.2s ease;
}

.random-challenge-icon:hover {
  animation: popOnHover 0.3s ease forwards;
}

.random-challenge-icon.loading {
  animation: heartbeat 1.2s ease-in-out infinite;
}

.background-blur {
  animation: centerAndBlur 0.8s ease forwards;
}
`;

// Create a helper function to inject styles on the client side
const injectStyles = () => {
  if (typeof document !== "undefined") {
    // Check if a style with our id already exists
    const existingStyle = document.getElementById(
      "nexpractice-animation-styles"
    );
    if (!existingStyle) {
      const styleSheet = document.createElement("style");
      styleSheet.id = "nexpractice-animation-styles";
      styleSheet.innerText = animationStyles;
      document.head.appendChild(styleSheet);
    }
  }
};

export default function ProblemClientPage({
  codingQuestion,
  defaultLanguage,
  preloadCode,
}: ProblemClientPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { data: authSession, status: authStatus } = useSession();
  const client = useApolloClient();

  // Add XP notification hook
  const { showSubmissionXpNotification, showXpNotification } =
    useXpNotifications();

  // Inject styles on client side only after component mounts
  useEffect(() => {
    injectStyles();

    // Clean up the style element when component unmounts
    return () => {
      if (typeof document !== "undefined") {
        const styleElement = document.getElementById(
          "nexpractice-animation-styles"
        );
        if (styleElement && styleElement.parentNode) {
          styleElement.parentNode.removeChild(styleElement);
        }
      }
    };
  }, []);

  // Add authentication debugging
  useEffect(() => {}, [authSession, authStatus]);

  // Extract problem ID from the URL path
  const problemId = useMemo(() => {
    const pathSegments = pathname.split("/");
    return pathSegments[pathSegments.length - 1];
  }, [pathname]);

  // Initialize language correctly based on defaultLanguage
  const processDefaultLanguage = (lang: string): string => {
    // Check if the language is in the coding question's language options
    if (
      codingQuestion.languageOptions &&
      Array.isArray(codingQuestion.languageOptions)
    ) {
      // Find the language in the options
      const languageOption = codingQuestion.languageOptions.find(
        (option: any) => option.name === lang || option.id === lang
      );

      // If found, return its ID
      if (languageOption) {
        return languageOption.id;
      }
    }

    // If language not found in options or no options available
    // Map common language names to their IDs as fallback
    const languageMap: Record<string, string> = {
      Java: "62",
      Python: "71",
      "C++": "54",
      JavaScript: "63",
      TypeScript: "74",
    };

    return languageMap[lang] || "71"; // Default to Python 3.8.1 if not specified or not found
  };

  // 1. Add a loading state for initial code/language
  const [initialLoading, setInitialLoading] = useState(true);

  // 2. Set language and code to empty initially
  const [language, setLanguage] = useState<string>("");
  const [code, setCode] = useState<string>("");

  // Migrate data from anonymous storage to user storage when logging in
  useEffect(() => {
    if (
      authStatus === "authenticated" &&
      authSession?.user?.id &&
      problemId &&
      language
    ) {
      const anonymousKey = `nexacademy_anonymous_${problemId}_${language}`;
      const userKey = `nexacademy_${authSession.user.id}_${problemId}_${language}`;

      // Check if there's anonymous data but no user data yet
      const anonymousData = localStorage.getItem(anonymousKey);
      const userData = localStorage.getItem(userKey);

      if (anonymousData && !userData) {
        // Migrate the anonymous data to the user's storage
        localStorage.setItem(userKey, anonymousData);

        // Clean up the anonymous data after migration
        localStorage.removeItem(anonymousKey);

        // Notify the user (optional)
        toast({
          title: "Your code was saved",
          description:
            "We've migrated your previously saved code to your account.",
          duration: 3000,
        });
      }
    }
  }, [authStatus, authSession, problemId, language, toast]);

  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Always closed by default for mobile
  const { resolvedTheme: appTheme, setTheme: setAppTheme } = useTheme();
  const [focusMode, setFocusMode] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [tabSize, setTabSize] = useState(4);
  const [editorTheme, setEditorTheme] = useState<"vs-dark" | "light">(
    "vs-dark"
  );
  const [editorLoading, setEditorLoading] = useState(false);
  // Mobile view state - default to "problem" on mobile
  const [activePanel, setActivePanel] = useState<
    "problem" | "code" | "results"
  >("problem");

  // Panel sizes (in percentages) - preemptively set based on device
  const isMobileInitial =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;
  const [leftPanelWidth, setLeftPanelWidth] = useState(
    isMobileInitial ? 100 : 50
  );
  const [editorHeight, setEditorHeight] = useState(70);
  const [previousLayout, setPreviousLayout] = useState({
    leftWidth: 50,
    editorHeight: 70,
  });

  // Refs for resizing
  const containerRef = useRef<HTMLDivElement>(null);
  const isHorizontalResizing = useRef(false);
  const isVerticalResizing = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const startLeftWidth = useRef(50);
  const startEditorHeight = useRef(70);

  // Remove client-side style injection to prevent hydration mismatch
  // Now relying on predefined CSS classes in globals.css

  // Toggle focus mode for the editor
  const toggleFocusMode = () => {
    if (focusMode) {
      // Exit focus mode - restore previous layout
      setLeftPanelWidth(previousLayout.leftWidth);
      setEditorHeight(previousLayout.editorHeight);
      setFocusMode(false);
    } else {
      // Enter focus mode - save current layout and expand editor
      setPreviousLayout({
        leftWidth: leftPanelWidth,
        editorHeight: editorHeight,
      });
      setLeftPanelWidth(0);
      setEditorHeight(100);
      setFocusMode(true);
    }
  };

  // Update layout when screen size changes and initialize correctly for mobile
  useEffect(() => {
    if (isMobile) {
      setLeftPanelWidth(100);
      // Always set activePanel to "problem" when the component is first mounted on mobile
      setActivePanel("problem");
    } else {
      setLeftPanelWidth(50);
    }
  }, [isMobile]);

  // Handle mouse events for resizing
  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (isHorizontalResizing.current && containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const deltaX = e.clientX - startX.current;
        const deltaPercent =
          Math.round(((deltaX / containerWidth) * 100) / 5) * 5;
        const newWidth = Math.min(
          Math.max(20, startLeftWidth.current + deltaPercent),
          80
        );
        setLeftPanelWidth(newWidth);
      }
      if (isVerticalResizing.current && containerRef.current) {
        const rightPanelHeight = containerRef.current.clientHeight;
        const deltaY = e.clientY - startY.current;
        const deltaPercent =
          Math.round(((deltaY / rightPanelHeight) * 100) / 5) * 5;
        const newHeight = Math.min(
          Math.max(20, startEditorHeight.current + deltaPercent),
          80
        );
        setEditorHeight(newHeight);
      }
    };
    const handleMouseUp = () => {
      isHorizontalResizing.current = false;
      isVerticalResizing.current = false;
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isMobile]);

  const startHorizontalResize = (e: React.MouseEvent) => {
    if (isMobile) return;
    isHorizontalResizing.current = true;
    startX.current = e.clientX;
    startLeftWidth.current = leftPanelWidth;
    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";
    e.preventDefault();
  };

  const startVerticalResize = (e: React.MouseEvent) => {
    if (isMobile) return;
    isVerticalResizing.current = true;
    startY.current = e.clientY;
    startEditorHeight.current = editorHeight;
    document.body.style.cursor = "ns-resize";
    document.body.style.userSelect = "none";
    e.preventDefault();
  };

  // Save code to localStorage on each keystroke
  useEffect(() => {
    if (!code || !problemId || !language || editorLoading) return;
    if (authStatus === "authenticated" && authSession?.user?.id) {
      const userStorageKey = `nexacademy_${authSession.user.id}_${problemId}_${language}`;
      localStorage.setItem(userStorageKey, code);
      localStorage.setItem(
        `${userStorageKey}_timestamp`,
        Date.now().toString()
      );
      // Optionally clean up any anonymous data for this problem/language
      const anonymousKey = `nexacademy_anonymous_${problemId}_${language}`;
      if (localStorage.getItem(anonymousKey)) {
        localStorage.removeItem(anonymousKey);
        localStorage.removeItem(`${anonymousKey}_timestamp`);
      }
    } else {
      const anonymousKey = `nexacademy_anonymous_${problemId}_${language}`;
      localStorage.setItem(anonymousKey, code);
      localStorage.setItem(`${anonymousKey}_timestamp`, Date.now().toString());
    }
  }, [code, problemId, language, authStatus, authSession, editorLoading]);

  // Load saved code from localStorage on component mount or language change
  useEffect(() => {
    if (!problemId || !language) return;

    let storageKey;

    // Determine the correct key to load from based on authentication status
    if (authStatus === "authenticated" && authSession?.user?.id) {
      storageKey = `nexacademy_${authSession.user.id}_${problemId}_${language}`;
    } else {
      storageKey = `nexacademy_anonymous_${problemId}_${language}`;
    }

    // Check if there's saved code in localStorage
    const savedCode = localStorage.getItem(storageKey);

    // If there's saved code and it's different from the current code, update the editor
    if (savedCode && savedCode !== preloadCode) {
      setCode(savedCode);
    }
  }, [problemId, language, preloadCode, authStatus, authSession]);

  // Helper: get difficulty, version, name, etc. from codingQuestion.question
  const problemNumber = codingQuestion.question?.version || 1;
  const problemTitle = codingQuestion.question?.name || "Untitled Problem";
  const difficulty = codingQuestion.question?.difficulty || "EASY";
  const description = codingQuestion.questionText;
  const examples =
    codingQuestion.testCases?.filter(
      (tc: any) => tc.isSample || tc.isSample === undefined
    ) || [];
  const languageOptions = codingQuestion.languageOptions || [];

  // Format difficulty for display
  const formatDifficulty = (difficulty: string) => {
    if (difficulty === "EASY") return "Easy";
    if (difficulty === "MEDIUM") return "Medium";
    if (difficulty === "HARD") return "Hard";
    if (difficulty === "VERY_HARD") return "Very Hard";
    return difficulty.charAt(0) + difficulty.slice(1).toLowerCase();
  };

  // Get difficulty badge styling
  const getDifficultyBadge = (diff: string) => {
    const formattedDiff = formatDifficulty(diff);

    switch (formattedDiff) {
      case "Easy":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 font-medium">
            {formattedDiff}
          </Badge>
        );
      case "Medium":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 font-medium">
            {formattedDiff}
          </Badge>
        );
      case "Hard":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 font-medium">
            {formattedDiff}
          </Badge>
        );
      default:
        return (
          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 font-medium">
            {formattedDiff}
          </Badge>
        );
    }
  };

  const [searchLanguage, setSearchLanguage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    "Popular"
  );

  const [isFormatting, setIsFormatting] = useState(false);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  // Add a new state variable for formatting success
  const [formatSuccess, setFormatSuccess] = useState(false);
  const [noChangesNeeded, setNoChangesNeeded] = useState(false);

  // Unified code formatter
  const formatCodeByLanguage = (code: string, language: string): string => {
    if (!code.trim()) return code;

    // Use language-specific formatters
    switch (language) {
      case "java":
        return formatJavaCode(code);
      case "javascript":
      case "typescript":
        return formatJsCode(code);
      case "python":
        return formatPythonCode(code);
      default:
        return formatBasicIndentation(code, language);
    }
  };

  // JavaScript/TypeScript specific formatter
  const formatJsCode = (code: string): string => {
    let lines = code.split("\n");
    let formattedLines: string[] = [];
    let indentLevel = 0;

    // JavaScript/TypeScript generally uses 2 spaces
    const tabWidth = 2;

    for (const line of lines) {
      let trimmedLine = line.trim();

      // Skip empty lines
      if (!trimmedLine) {
        formattedLines.push("");
        continue;
      }

      // Check if line ends a block
      if (
        trimmedLine.startsWith("}") ||
        trimmedLine.startsWith("]") ||
        trimmedLine.startsWith(")")
      ) {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      // Apply indentation
      const indent = " ".repeat(indentLevel * tabWidth);
      formattedLines.push(indent + trimmedLine);

      // Check if line opens a block
      const openBraceCount = (trimmedLine.match(/{/g) || []).length;
      const closeBraceCount = (trimmedLine.match(/}/g) || []).length;

      if (openBraceCount > closeBraceCount) {
        indentLevel += openBraceCount - closeBraceCount;
      }
    }

    return formattedLines.join("\n");
  };

  // Format keyboard shortcut handler
  useEffect(() => {
    // Track key sequence for Ctrl+K, Ctrl+F
    let ctrlKPressed = false;
    const resetSequence = () => {
      setTimeout(() => {
        ctrlKPressed = false;
      }, 1000); // Reset after 1 second
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Alt+Shift+F or Shift+Alt+F
      if (e.altKey && e.shiftKey && (e.key === "F" || e.key === "f")) {
        e.preventDefault();
        formatCode();
        return;
      }

      // Check for Ctrl+K followed by Ctrl+F
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        ctrlKPressed = true;
        resetSequence();
        return;
      }

      if (ctrlKPressed && e.ctrlKey && e.key === "f") {
        e.preventDefault();
        ctrlKPressed = false;
        formatCode();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // Empty dependency array as formatCode uses ref that doesn't change

  // Function to format code using Monaco editor's formatting capabilities
  const formatCode = async () => {
    if (!editorRef.current || !monacoRef.current) return;

    setIsFormatting(true);
    setFormatSuccess(false);
    setNoChangesNeeded(false);

    try {
      const editor = editorRef.current;
      const monaco = monacoRef.current;
      const model = editor.getModel();

      if (!model) {
        console.error("No model available for formatting");
        setIsFormatting(false);
        return;
      }

      // Get language ID from the model
      const languageId = model.getLanguageId();

      // Get the current text
      const text = model.getValue();

      // First try to use the built-in formatter for non-Java languages
      let formattingSuccessful = false;
      let changesNeeded = false;

      if (languageId !== "java") {
        try {
          // Try built-in formatter first
          const formatAction = editor.getAction("editor.action.formatDocument");
          if (formatAction) {
            // Save text before formatting to check if changes were made
            const initialText = model.getValue();
            await formatAction.run();
            const afterText = model.getValue();

            if (initialText !== afterText) {
              formattingSuccessful = true;
              changesNeeded = true;
            } else {
              // Built-in formatter made no changes, try our custom formatter
              changesNeeded = false;
            }
          }
        } catch (error) {
          console.warn("Built-in formatter failed:", error);
        }
      }

      // If built-in formatter didn't work or didn't make changes, use our custom formatter
      if (!formattingSuccessful) {
        // Format using our language-specific formatter
        const formattedText = formatCodeByLanguage(text, languageId);

        // Apply changes if the text actually changed
        if (text !== formattedText) {
          const edits = [
            {
              range: model.getFullModelRange(),
              text: formattedText,
            },
          ];
          editor.executeEdits("format", edits);
          formattingSuccessful = true;
          changesNeeded = true;
        } else {
          changesNeeded = false;
        }
      }

      // Show appropriate message
      setIsFormatting(false);

      if (!changesNeeded) {
        // Show no changes needed message
        setNoChangesNeeded(true);
        setTimeout(() => {
          setNoChangesNeeded(false);
        }, 1500);
      } else if (formattingSuccessful) {
        // Show success message
        setFormatSuccess(true);
        setTimeout(() => {
          setFormatSuccess(false);
        }, 1500);
      }
    } catch (error) {
      console.error("Error formatting code:", error);
      setIsFormatting(false);
    }
  };

  // Helper function to format Java code
  const formatJavaCode = (code: string): string => {
    if (!code.trim()) return code;

    let lines = code.split("\n");
    let formattedLines: string[] = [];
    let indentLevel = 0;
    let inComment = false;
    let inMultiLineString = false;
    let pendingBraceClosure = false;
    let inAnnotation = false;
    let inLambda = false;
    let methodChainDepth = 0;

    // Check if the line contains a specific pattern
    const hasPattern = (str: string, pattern: string): boolean => {
      const regex = new RegExp(pattern);
      return regex.test(str);
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let trimmedLine = line.trim();

      // Skip empty lines but preserve them
      if (!trimmedLine) {
        formattedLines.push("");
        continue;
      }

      // Handle multi-line comments
      if (trimmedLine.includes("/*") && !trimmedLine.includes("*/")) {
        inComment = true;
      }

      if (inComment) {
        formattedLines.push(line); // Preserve original indentation in comments
        if (trimmedLine.includes("*/")) {
          inComment = false;
        }
        continue;
      }

      // Handle multi-line strings
      if (
        (trimmedLine.match(/"/g) || []).length % 2 !== 0 &&
        !trimmedLine.includes('\\"') &&
        !inMultiLineString
      ) {
        inMultiLineString = true;
        formattedLines.push(" ".repeat(indentLevel * 4) + trimmedLine);
        continue;
      }

      if (inMultiLineString) {
        formattedLines.push(" ".repeat(indentLevel * 4) + trimmedLine);
        if (
          (trimmedLine.match(/"/g) || []).length % 2 !== 0 &&
          !trimmedLine.includes('\\"')
        ) {
          inMultiLineString = false;
        }
        continue;
      }

      // Handle annotations
      if (trimmedLine.startsWith("@")) {
        inAnnotation = true;
        formattedLines.push(" ".repeat(indentLevel * 4) + trimmedLine);

        // Check if the annotation is complete
        if (trimmedLine.endsWith(")") || !trimmedLine.includes("(")) {
          inAnnotation = false;
        }
        continue;
      }

      if (inAnnotation) {
        formattedLines.push(" ".repeat(indentLevel * 4) + trimmedLine);
        if (trimmedLine.endsWith(")")) {
          inAnnotation = false;
        }
        continue;
      }

      // Remove any inline comments for processing, but add them back later
      let inlineComment = "";
      if (trimmedLine.includes("//")) {
        const commentPos = trimmedLine.indexOf("//");
        // Make sure we're not inside a string
        const beforeComment = trimmedLine.substring(0, commentPos);
        if ((beforeComment.match(/"/g) || []).length % 2 === 0) {
          inlineComment = trimmedLine.substring(commentPos);
          trimmedLine = trimmedLine.substring(0, commentPos).trim();
          if (!trimmedLine) {
            formattedLines.push(" ".repeat(indentLevel * 4) + inlineComment);
            continue;
          }
        }
      }

      // Check if line ends a block before processing
      if (trimmedLine.startsWith("}") || trimmedLine === "});") {
        indentLevel = Math.max(0, indentLevel - 1);

        // If we're exiting a lambda
        if (inLambda && trimmedLine.includes("})")) {
          inLambda = false;
        }
      }

      // Check for method chain endings
      if (
        methodChainDepth > 0 &&
        trimmedLine.startsWith(".") === false &&
        (trimmedLine.endsWith(";") || trimmedLine.endsWith(","))
      ) {
        indentLevel -= methodChainDepth;
        methodChainDepth = 0;
      }

      // Apply indentation
      const indent = " ".repeat(indentLevel * 4);

      // Add inline comment back if it exists
      let lineToAdd = trimmedLine;
      if (inlineComment) {
        lineToAdd = trimmedLine + " " + inlineComment;
      }

      formattedLines.push(indent + lineToAdd);

      // Handle indentation for class, interface, enum declarations
      if (
        hasPattern(trimmedLine, "(class|interface|enum)\\s+\\w+") &&
        trimmedLine.endsWith("{")
      ) {
        indentLevel++;
      }
      // Handle method declarations
      else if (
        hasPattern(
          trimmedLine,
          "(public|private|protected|static|final|synchronized|\\s)*\\s*[\\w<>\\[\\]]+\\s+\\w+\\s*\\(.*\\)"
        ) &&
        (trimmedLine.endsWith("{") || pendingBraceClosure)
      ) {
        if (trimmedLine.endsWith("{")) {
          indentLevel++;
        } else if (!trimmedLine.endsWith(";")) {
          // Method declaration could be split across lines
          pendingBraceClosure = true;
        }
      }
      // Handle opening braces on their own line
      else if (trimmedLine === "{") {
        indentLevel++;
        pendingBraceClosure = false;
      }
      // Handle lambda expressions
      else if (
        trimmedLine.includes("->") &&
        (trimmedLine.endsWith("{") || !trimmedLine.endsWith(";"))
      ) {
        inLambda = true;
        if (trimmedLine.endsWith("{")) {
          indentLevel++;
        }
      }
      // Handle method chaining (lines ending with dots)
      else if (trimmedLine.endsWith(".")) {
        methodChainDepth++;
        indentLevel++;
      }
      // Handle method chain continuations
      else if (trimmedLine.startsWith(".") && methodChainDepth > 0) {
        // Already indented by method chain
      }
      // Handle common Java structures
      else if (
        (hasPattern(
          trimmedLine,
          "(if|for|while|switch|try|catch|finally)\\s*\\(.*\\)"
        ) ||
          trimmedLine.startsWith("else")) &&
        (trimmedLine.endsWith("{") || !trimmedLine.endsWith(";"))
      ) {
        if (trimmedLine.endsWith("{")) {
          indentLevel++;
        }
        // Special handling for if, for, while without braces
        else if (
          !trimmedLine.endsWith(";") &&
          !trimmedLine.endsWith("}") &&
          i < lines.length - 1 &&
          !lines[i + 1].trim().startsWith("{")
        ) {
          indentLevel++;
        }
      }
      // Handle array initializations
      else if (
        trimmedLine.includes("= {") ||
        (trimmedLine.includes("{") && trimmedLine.includes("new "))
      ) {
        indentLevel++;
      }
      // Handle any other opening braces
      else if (
        (trimmedLine.match(/{/g) || []).length >
        (trimmedLine.match(/}/g) || []).length
      ) {
        indentLevel +=
          (trimmedLine.match(/{/g) || []).length -
          (trimmedLine.match(/}/g) || []).length;
      }

      // Handle line with closing brace that also opens a new block (e.g. "} else {")
      if (
        trimmedLine.includes("} else") ||
        hasPattern(trimmedLine, "}\\s+(catch|finally)\\s*\\(.*\\)") ||
        trimmedLine.endsWith("} {")
      ) {
        indentLevel++;
      }

      // Detect end of pending method declaration
      if (pendingBraceClosure && trimmedLine.endsWith("{")) {
        pendingBraceClosure = false;
        indentLevel++;
      }
    }

    return formattedLines.join("\n");
  };

  // Create a completely new basic indentation formatter
  function formatBasicIndentation(code: string, language: string): string {
    if (!code || !code.trim()) return code;

    // Different languages use different indentation sizes
    const tabWidth = ["python", "java", "c", "cpp", "csharp"].includes(language)
      ? 4
      : 2;

    const lines = code.split("\n");
    const result: string[] = [];
    let indentLevel = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Skip empty lines but preserve them
      if (!line) {
        result.push("");
        continue;
      }

      // Reduce indent level if line starts with closing bracket
      if (
        line.startsWith("}") ||
        line.startsWith("]") ||
        line.startsWith(")")
      ) {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      // Add proper indentation
      const spaces = " ".repeat(indentLevel * tabWidth);
      result.push(spaces + line);

      // Increase indent level based on line content
      if (language === "python" && line.endsWith(":")) {
        // Python uses colons to indicate blocks
        indentLevel++;
      } else {
        // For other languages, count braces
        const openBraces = (line.match(/{/g) || []).length;
        const closeBraces = (line.match(/}/g) || []).length;
        if (openBraces > closeBraces) {
          indentLevel += openBraces - closeBraces;
        }
      }
    }

    return result.join("\n");
  }

  // Python-specific formatter
  const formatPythonCode = (code: string): string => {
    let lines = code.split("\n");
    let formattedLines: string[] = [];
    let indentLevel = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let trimmedLine = line.trim();

      // Skip empty lines
      if (!trimmedLine) {
        formattedLines.push("");
        continue;
      }

      // Check for dedent
      if (
        trimmedLine.startsWith("except") ||
        trimmedLine.startsWith("else:") ||
        trimmedLine.startsWith("elif ") ||
        trimmedLine.startsWith("finally:")
      ) {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      // Apply indentation
      const indent = " ".repeat(indentLevel * 4);
      formattedLines.push(indent + trimmedLine);

      // Check for indent triggers (lines ending with colon)
      if (trimmedLine.endsWith(":")) {
        indentLevel++;
      }
    }

    return formattedLines.join("\n");
  };

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLeftPanelExpanded, setIsLeftPanelExpanded] = useState(false);
  const [isResultsPanelFullscreen, setIsResultsPanelFullscreen] =
    useState(false);
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const previousLeftWidthRef = useRef(50);
  const previousEditorHeightRef = useRef(70);

  // Get user session and profile picture
  const { data: session } = useSession();
  const { profilePic } = useProfilePic();

  // Fullscreen toggle handler for browser fullscreen
  const handleFullscreenToggle = () => {
    const elem = document.documentElement;
    if (!isFullscreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) {
        (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).msRequestFullscreen) {
        (elem as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  };

  // Toggle left panel to cover full width
  const toggleLeftPanelExpansion = () => {
    if (!isLeftPanelExpanded) {
      // Save current width before expanding
      previousLeftWidthRef.current = leftPanelWidth;
      // Expand left panel to full width
      setLeftPanelWidth(100);
      setIsLeftPanelExpanded(true);
    } else {
      // Restore previous width
      setLeftPanelWidth(previousLeftWidthRef.current);
      setIsLeftPanelExpanded(false);
    }
  };

  // Toggle the results panel to fullscreen mode
  const toggleResultsPanelFullscreen = () => {
    if (!isResultsPanelFullscreen) {
      // Save the current editor height before going fullscreen
      previousEditorHeightRef.current = editorHeight;
      // Make results panel take up the full right panel
      setEditorHeight(0);
      setIsResultsPanelFullscreen(true);
    } else {
      // Restore previous editor height
      setEditorHeight(previousEditorHeightRef.current);
      setIsResultsPanelFullscreen(false);
    }
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(
        !!(
          document.fullscreenElement ||
          (document as any).webkitFullscreenElement ||
          (document as any).msFullscreenElement
        )
      );
    };
    document.addEventListener("fullscreenchange", handleChange);
    document.addEventListener("webkitfullscreenchange", handleChange);
    document.addEventListener("msfullscreenchange", handleChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleChange);
      document.removeEventListener("webkitfullscreenchange", handleChange);
      document.removeEventListener("msfullscreenchange", handleChange);
    };
  }, []);

  const [results, setResults] = useState<any[]>([]);
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

  // New state variables for testcase progress tracking
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

  // Replace Gen Z loading phrases with compilation stages
  const compilationStages = [
    "Analyzing your code...",
    "Compiling...",
    "Optimizing...",
    "Preparing test cases...",
    "Running tests...",
    "Processing results...",
    "Finalizing evaluation...",
  ];

  // Add the GraphQL mutations
  const [runCodeMutation] = useMutation(RUN_CODE);
  const [submitCodeMutation] = useMutation(SUBMIT_CODE);
  const [saveUserCodeDraft] = useMutation(SAVE_USER_CODE_DRAFT);
  const [saveUserProblemSettings] = useMutation(SAVE_USER_PROBLEM_SETTINGS);

  // Track previous language for code draft saving
  const prevLanguageRef = useRef(language);

  // Add the saveDraftIfChanged function
  const saveDraftIfChanged = useCallback(
    (languageToSave: string, codeToSave: string) => {
      if (
        authStatus === "authenticated" &&
        authSession?.user?.id &&
        problemId
      ) {
        const baseKey = `nexacademy_${authSession.user.id}_${problemId}_${languageToSave}`;
        const draftKey = `${baseKey}_draft`;
        const localCode = localStorage.getItem(baseKey) || "";
        const draftCode = localStorage.getItem(draftKey) || "";
        if (localCode !== draftCode) {
          saveUserCodeDraft({
            variables: {
              input: {
                userId: String(authSession.user.id),
                problemId: String(problemId),
                language: String(languageToSave),
                code: String(codeToSave),
              },
            },
          })
            .then(() => {
              localStorage.setItem(draftKey, codeToSave);
            })
            .catch((err) => {
              console.error("Failed to save code draft:", err);
            });
        }
      }
    },
    [authStatus, authSession, problemId, saveUserCodeDraft]
  );

  // Add the runCode and submitCode functions
  const runCode = async () => {
    // Only save draft if local and draft differ
    if (authStatus === "authenticated" && authSession?.user?.id && problemId) {
      const baseKey = `nexacademy_${authSession.user.id}_${problemId}_${language}`;
      const draftKey = `${baseKey}_draft`;
      const localCode = localStorage.getItem(baseKey) || "";
      const draftCode = localStorage.getItem(draftKey) || "";
      if (localCode !== draftCode) {
        saveDraftIfChanged(language, code);
      }
    }
    try {
      // Make results panel fullscreen when running code
      if (!isResultsPanelFullscreen) {
        toggleResultsPanelFullscreen();
      }

      // Switch to results tab on mobile
      if (isMobile) {
        setActivePanel("results");
      }

      setIsRunning(true);
      setExecutionMessage("Running code...");
      setExecutionStatus("info");
      setSampleExecutionStatus("info");
      setActiveTab("sample");
      setShowEvaluatingSkeletons(true);
      setSkeletonTab("sample"); // Only show skeletons in sample tab

      // Set a static loading phrase instead of cycling through stages
      setLoadingPhrase("Executing the code...");

      const langId = getLanguageId(language);

      const response = await runCodeMutation({
        variables: {
          input: {
            sourceCode: code,
            languageId: langId,
            problemId: codingQuestion.questionId,
          },
        },
      });

      // Delay hiding the skeleton to ensure smooth transition
      setTimeout(() => {
        // Clear the loading animation
        setLoadingPhrase("");
        setLoadingProgress(0);
        setShowEvaluatingSkeletons(false);
        setSkeletonTab(null);
        setIsRunning(false);

        if (response.data?.runCode) {
          const { success, message, results, allTestsPassed } =
            response.data.runCode;

          // Store results only in sample tab results
          setResults(results || []);
          setSampleTestResults(results || []);

          // Determine correct status based on test results
          let newStatus: "success" | "error" | "warning" | "info" = "error";
          if (success) {
            if (allTestsPassed) {
              newStatus = "success";
            } else {
              // Check if at least one test case passed
              const hasPassingTests =
                results && results.some((r: any) => r.isCorrect);
              newStatus = hasPassingTests ? "warning" : "error";
            }
          }

          setExecutionMessage(
            message ||
              (success ? "Code executed successfully" : "Execution failed")
          );
          setExecutionStatus(newStatus);
          setSampleExecutionStatus(newStatus);
        } else {
          setExecutionMessage("Failed to run code. Please try again.");
          setExecutionStatus("error");
          setSampleExecutionStatus("error");
        }
      }, 800); // Add small delay for smoother transition
    } catch (error: any) {
      console.error("Error running code:", error);
      setExecutionMessage(`Error: ${error.message}`);
      setExecutionStatus("error");
      setSampleExecutionStatus("error");
      setLoadingPhrase("");
      setLoadingProgress(0);
      setShowEvaluatingSkeletons(false);
      setSkeletonTab(null);
      setIsRunning(false);
    }
  };

  // Update the submitCode function to also check for partially passing tests correctly
  const submitCode = async () => {
    // Only save draft if local and draft differ
    if (authStatus === "authenticated" && authSession?.user?.id && problemId) {
      const baseKey = `nexacademy_${authSession.user.id}_${problemId}_${language}`;
      const draftKey = `${baseKey}_draft`;
      const localCode = localStorage.getItem(baseKey) || "";
      const draftCode = localStorage.getItem(draftKey) || "";
      if (localCode !== draftCode) {
        saveDraftIfChanged(language, code);
      }
    }
    try {
      // Make results panel fullscreen when submitting code
      if (!isResultsPanelFullscreen) {
        toggleResultsPanelFullscreen();
      }

      // Switch to results tab on mobile
      if (isMobile) {
        setActivePanel("results");
      }

      setIsSubmitting(true);
      setExecutionMessage("Submitting solution...");
      setExecutionStatus("info");
      setHiddenExecutionStatus("info");
      setActiveTab("hidden"); // Make sure we switch to the hidden testcases tab

      // Just show the executing state without any count information yet
      setExecutingHiddenTestcases(true);
      setShowCelebration(false);
      setHiddenTestResults([]);

      // Reset all counter variables to ensure the UI shows 0/total at the beginning
      setCompletedHiddenTestcases(0);
      setPassedHiddenTestcases(0);
      setHiddenTestcasesFailed(false);
      setSkippedHiddenTestcases(0);

      // Set a static loading phrase
      setLoadingPhrase("Executing the code...");

      const langId = getLanguageId(language);

      // Request to execute all testcases in parallel
      const response = await submitCodeMutation({
        variables: {
          input: {
            sourceCode: code,
            languageId: langId,
            problemId: codingQuestion.questionId,
            executeInParallel: true, // Signal the server to use parallel execution
            timezoneOffset: new Date().getTimezoneOffset(), // Pass user's timezone offset
          },
        },
      });
      console.log("response", response);
      // Process XP data for notification
      const xpData = response?.data?.submitCode?.xp;
      console.log("XP data received:", xpData);

      // Since the server doesn't provide userXpEvents yet, we'll generate them client-side
      if (xpData && xpData.awarded) {
        // Create an array to hold our XP events
        const generatedXpEvents = [];

        // Calculate XP based on problem difficulty
        let difficultyXP = 25; // Default for easy
        let difficultyLabel = "Easy";

        // Get the difficulty from the codingQuestion
        const questionDifficulty =
          codingQuestion.question?.difficulty || "EASY";
        console.log("Problem difficulty:", questionDifficulty);

        // Set XP based on difficulty
        if (questionDifficulty === "MEDIUM") {
          difficultyXP = 50;
          difficultyLabel = "Medium";
        } else if (
          questionDifficulty === "HARD" ||
          questionDifficulty === "VERY_HARD"
        ) {
          difficultyXP = 100;
          difficultyLabel =
            questionDifficulty === "VERY_HARD" ? "Very Hard" : "Hard";
        }

        // First event is the base XP for difficulty level
        generatedXpEvents.push({
          amount: difficultyXP,
          eventType: "difficulty_xp",
          description: `${difficultyLabel} Problem Solved`,
        });

        // If there's a streak bonus, add it for proper display
        if (xpData.streakInfo && xpData.streakInfo.streakUpdated) {
          // Add streak bonus (5 XP as per STREAK_DAY in xp-service.ts)
          const streakXp = 5; // Match STREAK_DAY in xp-service.ts
          const streakDay = xpData.streakInfo.currentStreak;

          console.log(
            `[Streak XP] Adding streak bonus notification: ${streakDay}-day streak, ${streakXp}XP`
          );

          generatedXpEvents.push({
            amount: streakXp,
            eventType: "streak_bonus",
            description:
              streakDay > 1 ? `${streakDay}-Day Streak` : "First Day Streak",
          });
        } else if (xpData.streakInfo) {
          console.log(
            "[Streak XP] Streak maintained but not updated - no streak XP notification"
          );
        }

        // Enhanced debugging for XP events
        console.log(
          `Generated ${generatedXpEvents.length} XP events for ${difficultyLabel} problem:`
        );
        generatedXpEvents.forEach((event, index) => {
          console.log(`XP Event #${index + 1}:`, {
            amount: event.amount,
            eventType: event.eventType,
            description: event.description,
          });
        });

        // Display each XP event with appropriate delays
        generatedXpEvents.forEach((event, index) => {
          if (event.amount > 0) {
            setTimeout(() => {
              showXpNotification(
                event.amount,
                event.eventType || "xp_earned",
                event.description || "XP Earned"
              );
            }, index * 1500); // Stagger notifications by 1.5 seconds
          }
        });
      }

      // --- STREAK MODAL TRIGGER ---
      console.log("Checking for streak data:", {
        streakEstablished: response.data?.submitCode?.streakEstablished,
        currentStreak: response.data?.submitCode?.currentStreak,
        highestStreak:
          response.data?.submitCode?.highestStreak ||
          response.data?.submitCode?.currentStreak,
      });

      // Show streak modal only for first correct submission that updates a streak (not when streak is just maintained)
      // The streakEstablished flag will now only be true when a streak is actually updated
      if (
        response.data?.submitCode?.streakEstablished &&
        response.data?.submitCode?.currentStreak
      ) {
        console.log(
          "TRIGGERING STREAK MODAL for streak update/establishment:",
          response.data?.submitCode?.currentStreak
        );
        // Delay slightly to ensure the DOM is ready for the streak modal
        setTimeout(() => {
          triggerStreakModal({
            streakEstablished: true,
            currentStreak: response.data.submitCode.currentStreak,
            highestStreak:
              response.data.submitCode.highestStreak ||
              response.data.submitCode.currentStreak,
          });

          // As a fallback, if the streak modal doesn't show up after a delay,
          // try to show it again with a more forceful approach
          setTimeout(() => {
            // Check if streak modal is visible
            const isModalVisible = document.querySelector(
              '[data-dialog-name="streak-modal"]'
            );
            if (
              !isModalVisible ||
              isModalVisible.getAttribute("data-state") !== "open"
            ) {
              console.log(
                "Streak modal not visible after initial trigger, trying again with force"
              );
              triggerStreakModal({
                streakEstablished: true,
                currentStreak: response.data.submitCode.currentStreak,
                highestStreak:
                  response.data.submitCode.highestStreak ||
                  response.data.submitCode.currentStreak,
              });
            }
          }, 2000);
        }, 100);
      }

      if (response.data?.submitCode) {
        const { success, message, results, allTestsPassed, totalTests } =
          response.data.submitCode;

        // Now that we have the response, set the total number of testcases
        setTotalHiddenTestcases(totalTests || results?.length || 0);

        if (success && results && results.length > 0) {
          // Simulation for UI purposes only - the server has already executed all testcases in parallel
          const processTestcases = async () => {
            let passedCount = 0;
            const processedResults = [];

            // Count and store passing testcases first
            const passingTestcases = results.filter((r: any) => r.isCorrect);
            const skippedTestcases = results.filter(
              (r: any) =>
                r.isSkipped ||
                r.verdict === "Skipped" ||
                (r.status && r.status.description === "Skipped")
            );
            // Update each test case with explicit isSkipped flag if it's missing
            const processedSkippedTestcases = skippedTestcases.map(
              (r: any) => ({
                ...r,
                isSkipped: true,
              })
            );

            const failingTestcases = results.filter(
              (r: any) =>
                !r.isCorrect &&
                !r.isSkipped &&
                r.verdict !== "Skipped" &&
                (!r.status || r.status.description !== "Skipped")
            );

            passedCount = passingTestcases.length;
            const hasFailures = failingTestcases.length > 0;

            // Determine which test cases were processed vs. skipped
            const processedIds = new Set([
              ...passingTestcases.map((r: any) => r.id),
              ...failingTestcases.map((r: any) => r.id),
            ]);

            // Create additional skipped test case placeholders if we're missing some
            const manuallySkippedTestcases =
              totalTests > processedIds.size + processedSkippedTestcases.length
                ? Array.from({
                    length:
                      totalTests -
                      (processedIds.size + processedSkippedTestcases.length),
                  }).map((_, idx) => ({
                    id: `skipped-${idx}`,
                    input: "",
                    expectedOutput: "",
                    actualOutput: null,
                    stderr: null,
                    compileOutput: null,
                    status: { id: 0, description: "Skipped" },
                    verdict: "Skipped",
                    isCorrect: false,
                    isSkipped: true,
                    executionTime: null,
                    memoryUsed: null,
                  }))
                : [];

            // If there are failures, show the first failing test case first
            if (hasFailures) {
              // Show just the first failing test case with a slight delay for visual feedback
              await new Promise((resolve) => setTimeout(resolve, 150));

              const failedResult = failingTestcases[0];
              processedResults.push(failedResult);

              // Update progress counters
              setCompletedHiddenTestcases(1);
              setHiddenTestcasesFailed(true);

              // Update the UI with the failed result
              setHiddenTestResults([...processedResults]);

              // Then show passing test cases
              for (let i = 0; i < passingTestcases.length; i++) {
                await new Promise((resolve) => setTimeout(resolve, 100));

                const result = passingTestcases[i];
                processedResults.push(result);

                // Update progress counters
                setCompletedHiddenTestcases(i + 2); // +2 because we already showed 1 failing test
                setPassedHiddenTestcases(i + 1);

                // Update the UI with the current results
                setHiddenTestResults([...processedResults]);
              }

              // Finally add any remaining failing test cases (without detailed info)
              if (failingTestcases.length > 1) {
                for (let i = 1; i < failingTestcases.length; i++) {
                  await new Promise((resolve) => setTimeout(resolve, 100));

                  const failedResult = {
                    ...failingTestcases[i],
                    // Hide detailed output for secondary failures
                    actualOutput: "Hidden (Multiple failures detected)",
                    stderr: null,
                    compileOutput: null,
                  };
                  processedResults.push(failedResult);

                  // Update progress counters
                  setCompletedHiddenTestcases(passingTestcases.length + i + 1);

                  // Update the UI
                  setHiddenTestResults([...processedResults]);
                }
              }

              // Add any skipped test cases
              if (
                processedSkippedTestcases.length > 0 ||
                manuallySkippedTestcases.length > 0
              ) {
                await new Promise((resolve) => setTimeout(resolve, 100));

                // Add API-marked skipped tests first
                if (processedSkippedTestcases.length > 0) {
                  processedResults.push(...processedSkippedTestcases);
                }

                // Then add any manually created placeholders
                if (manuallySkippedTestcases.length > 0) {
                  processedResults.push(...manuallySkippedTestcases);
                }

                setCompletedHiddenTestcases(processedResults.length);
                setSkippedHiddenTestcases(
                  processedSkippedTestcases.length +
                    manuallySkippedTestcases.length
                );
                setHiddenTestResults([...processedResults]);
              }

              // Show the failure message
              const newStatus: "success" | "error" | "warning" | "info" =
                passedCount > 0 ? "warning" : "error";
              const skippedCount =
                processedSkippedTestcases.length +
                manuallySkippedTestcases.length;
              const failedCount = failingTestcases.length;

              let statusMessage = `Execution stopped after first failure. ${passedCount}/${totalTests} passed.`;
              if (failedCount > 0) statusMessage += ` ${failedCount} failed.`;
              if (skippedCount > 0)
                statusMessage += ` ${skippedCount} skipped.`;

              setExecutionMessage(statusMessage);
              setExecutionStatus(newStatus);
              setHiddenExecutionStatus(newStatus);
            } else {
              // All tests passed
              // Show all passing test cases
              for (let i = 0; i < passingTestcases.length; i++) {
                // Simulate a slight delay for visual feedback
                await new Promise((resolve) => setTimeout(resolve, 100));

                const result = passingTestcases[i];
                processedResults.push(result);

                // Update progress counters
                setCompletedHiddenTestcases(i + 1);
                setPassedHiddenTestcases(i + 1);

                // Update the UI with the current results
                setHiddenTestResults([...processedResults]);
              }

              setExecutionMessage(`All ${totalTests} test cases passed!`);
              setExecutionStatus("success");
              setHiddenExecutionStatus("success");
              setShowCelebration(true);
              // Trigger confetti celebration
              triggerConfettiCelebration();
            }

            // All testcases complete
            setExecutingHiddenTestcases(false);
            setIsSubmitting(false);
          };

          // Start processing testcases
          processTestcases();
        } else {
          setExecutingHiddenTestcases(false);
          setIsSubmitting(false);
          setExecutionMessage(message || "Failed to submit code.");
          setExecutionStatus("error");
          setHiddenExecutionStatus("error");
        }
      } else {
        setExecutingHiddenTestcases(false);
        setIsSubmitting(false);
        setExecutionMessage("Failed to submit code. Please try again.");
        setExecutionStatus("error");
        setHiddenExecutionStatus("error");
      }
    } catch (error: any) {
      console.error("Error submitting code:", error);
      setExecutingHiddenTestcases(false);
      setIsSubmitting(false);
      setExecutionMessage(`Error: ${error.message}`);
      setExecutionStatus("error");
      setHiddenExecutionStatus("error");
      setLoadingPhrase("");
      setLoadingProgress(0);
      setShowEvaluatingSkeletons(false);
      setSkeletonTab(null);
      setIsRunning(false);
    }
  };

  // Confetti celebration trigger
  const triggerConfettiCelebration = () => {
    // Ultra-premium color scheme with metallic/luxury colors
    const luxuryColors = [
      "#FFD700",
      "#E0BF00",
      "#B8860B",
      "#DAA520",
      "#9370DB",
      "#FFFFFF",
    ];
    const accentColors = [
      "#4B0082",
      "#9932CC",
      "#8A2BE2",
      "#FF1493",
      "#00BFFF",
    ];
    // Custom shapes for confetti
    // @ts-ignore - Ignore the shape type mismatch
    const shapeOptions = ["square", "circle"];

    // Helper to patch all confetti canvases
    const patchConfettiCanvas = () => {
      // canvas-confetti appends canvases to body
      document.querySelectorAll("canvas").forEach((c) => {
        // Only patch if it's a confetti canvas (zIndex or style)
        if (
          c.style &&
          (c.style.zIndex === "200" || c.className.includes("confetti"))
        ) {
          c.style.pointerEvents = "none";
        }
      });
    };

    // Phase 1: Initial golden shower from top (sparse but elegant)
    const createGoldenShower = () => {
      confetti({
        particleCount: 35,
        angle: 90,
        spread: 100,
        origin: { x: 0.5, y: 0 },
        colors: luxuryColors,
        // @ts-ignore - Ignore the shape type mismatch
        shapes: shapeOptions,
        gravity: 0.65,
        scalar: 1.5,
        drift: 0.5,
        ticks: 200,
        flat: true,
        zIndex: 200,
        disableForReducedMotion: true,
      });
      setTimeout(patchConfettiCanvas, 50);
    };

    // Phase 2: Elegant side bursts for dimension
    const createSideBursts = () => {
      // Left side
      confetti({
        particleCount: 10,
        angle: 60,
        spread: 25,
        origin: { x: 0, y: 0.5 },
        colors: accentColors,
        // @ts-ignore - Ignore the shape type mismatch
        shapes: shapeOptions,
        gravity: 0.4,
        scalar: 1.3,
        ticks: 400,
      });
      setTimeout(patchConfettiCanvas, 50);
      // Right side
      setTimeout(() => {
        confetti({
          particleCount: 10,
          angle: 120,
          spread: 25,
          origin: { x: 1, y: 0.5 },
          colors: accentColors,
          // @ts-ignore - Ignore the shape type mismatch
          shapes: shapeOptions,
          gravity: 0.4,
          scalar: 1.3,
          ticks: 400,
        });
        setTimeout(patchConfettiCanvas, 50);
      }, 150);
    };

    // Gentle rain effect
    const createGentleRain = () => {
      const interval = setInterval(() => {
        confetti({
          particleCount: 15,
          angle: 90,
          spread: 180,
          origin: { x: Math.random(), y: 0 },
          colors: [...luxuryColors, ...accentColors],
          // @ts-ignore - Ignore the shape type mismatch
          shapes: shapeOptions,
          gravity: 0.6,
          scalar: 1.4,
          drift: 0.2,
          ticks: 400,
        });
        setTimeout(patchConfettiCanvas, 50);
      }, 300);
      // Clear the interval after a few seconds
      setTimeout(() => clearInterval(interval), 2000);
    };

    // Execute celebration effects in sequence
    createGoldenShower();
    setTimeout(() => {
      createSideBursts();
    }, 200);
    setTimeout(() => {
      createGentleRain();
    }, 500);
    // Patch again after all effects
    setTimeout(patchConfettiCanvas, 2500);
  };

  // Add helper function to parse language ID
  const parseLanguageId = (languageName: string): number => {
    // Find the language ID from JUDGE0_LANGUAGES
    const entry = Object.entries(JUDGE0_LANGUAGES).find(
      ([_, name]) => name === languageName || name.includes(languageName)
    );

    return entry ? parseInt(entry[0], 10) : 71; // Default to Python 3 (ID 71) if not found
  };

  // Additional state for submissions tab
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [submissionsError, setSubmissionsError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(5);
  const [submissionsTabActive, setSubmissionsTabActive] = useState(false);

  // State to track if the submissions tab has been loaded at least once
  const [submissionsInitialized, setSubmissionsInitialized] = useState(false);

  // Fetch submissions when the submissions tab becomes active
  const fetchSubmissions = useCallback(
    async (page = 1, size = pageSize) => {
      if (!submissionsTabActive || !session?.user?.id) return;

      try {
        // Set loading state and clear error
        setSubmissionsLoading(true);
        setSubmissionsError(null);

        // Clear existing submissions while loading to provide better UX
        setSubmissions([]);

        // Determine the correct problem ID to use - add fallbacks for backward compatibility
        const problemId = codingQuestion.questionId || codingQuestion.id;

        try {
          const data = await submissionService.getProblemSubmissions({
            problemId,
            userId: session.user.id,
            page,
            pageSize: size,
          });

          if (data && data.submissions) {
            setSubmissions(data.submissions);
            setTotalPages(data.totalPages);
            setCurrentPage(data.page);
          } else {
            console.warn(
              "Received empty or invalid response from submissions API"
            );
            setSubmissionsError(
              "Failed to load submissions. Empty or invalid response received."
            );
            setSubmissions([]);
          }
        } catch (apiError: any) {
          console.error("API error while fetching submissions:", apiError);

          // Attempt to extract GraphQL error message if available
          let errorMessage = "Failed to load submissions. Please try again.";
          if (apiError.graphQLErrors && apiError.graphQLErrors.length > 0) {
            errorMessage = `GraphQL error: ${apiError.graphQLErrors[0].message}`;
          } else if (apiError.networkError) {
            errorMessage = `Network error: ${apiError.networkError.message}`;
          } else if (apiError.message) {
            errorMessage = apiError.message;
          }

          setSubmissionsError(errorMessage);
          setSubmissions([]);
        }
      } catch (error) {
        console.error("Error in fetchSubmissions:", error);
        setSubmissionsError("Failed to load submissions. Please try again.");
        setSubmissions([]);
      } finally {
        setSubmissionsLoading(false);
      }
    },
    [submissionsTabActive, session?.user?.id, codingQuestion, pageSize]
  );

  // Handle tab change to load submissions when the tab becomes active
  const handleTabChange = (value: string) => {
    saveDraftIfChanged(language, code);
    if (value === "submissions") {
      setSubmissionsTabActive(true);
    } else {
      setSubmissionsTabActive(false);
    }
  };

  // Monitor submissionsTabActive state to fetch submissions automatically
  useEffect(() => {
    if (submissionsTabActive && session?.user?.id && !submissionsInitialized) {
      fetchSubmissions(1);
      setSubmissionsInitialized(true);
    }
  }, [
    submissionsTabActive,
    session?.user?.id,
    fetchSubmissions,
    submissionsInitialized,
  ]);

  // Helper functions for submissions
  const renderSubmissionStatus = (submission: any) => {
    const status = submission.status;
    const testcaseInfo =
      submission.testcasesPassed !== undefined &&
      submission.totalTestcases !== undefined
        ? `(${submission.testcasesPassed}/${submission.totalTestcases})`
        : "";

    switch (status) {
      case "ACCEPTED":
        return (
          <>
            <div className="flex-shrink-0 h-7 w-7 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
            </div>
            <div className="ml-2">
              <div className="text-sm font-medium text-green-600 dark:text-green-400">
                Accepted
              </div>
              {testcaseInfo && (
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {testcaseInfo}
                </div>
              )}
            </div>
          </>
        );
      case "FAILED":
      case "WRONG_ANSWER":
        return (
          <>
            <div className="flex-shrink-0 h-7 w-7 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <XCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
            </div>
            <div className="ml-2">
              <div className="text-sm font-medium text-red-600 dark:text-red-400">
                Failed
              </div>
              {testcaseInfo && (
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {testcaseInfo}
                </div>
              )}
            </div>
          </>
        );
      case "TIME_LIMIT_EXCEEDED":
        return (
          <>
            <div className="flex-shrink-0 h-7 w-7 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <Clock className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
            </div>
            <div className="ml-2">
              <div className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                Time Limit Exceeded
              </div>
              {testcaseInfo && (
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {testcaseInfo}
                </div>
              )}
            </div>
          </>
        );
      case "RUNTIME_ERROR":
        return (
          <>
            <div className="flex-shrink-0 h-7 w-7 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-orange-500 dark:text-orange-400" />
            </div>
            <div className="ml-2">
              <div className="text-sm font-medium text-orange-600 dark:text-orange-400">
                Runtime Error
              </div>
              {testcaseInfo && (
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {testcaseInfo}
                </div>
              )}
            </div>
          </>
        );
      case "COMPILATION_ERROR":
        return (
          <>
            <div className="flex-shrink-0 h-7 w-7 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-purple-500 dark:text-purple-400" />
            </div>
            <div className="ml-2 text-sm font-medium text-purple-600 dark:text-purple-400">
              Compilation Error
            </div>
          </>
        );
      default:
        return (
          <>
            <div className="flex-shrink-0 h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <HelpCircle className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            </div>
            <div className="ml-2 text-sm font-medium text-slate-500 dark:text-slate-400">
              {status || "Unknown"}
            </div>
          </>
        );
    }
  };

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      JavaScript: "bg-yellow-500",
      TypeScript: "bg-blue-500",
      Python: "bg-green-500",
      Java: "bg-red-500",
      "C++": "bg-purple-500",
      C: "bg-gray-500",
      "C#": "bg-indigo-500",
      Go: "bg-teal-500",
      Ruby: "bg-pink-500",
      Swift: "bg-orange-500",
      PHP: "bg-violet-500",
      Rust: "bg-amber-500",
    };

    return colors[language] || "bg-slate-500";
  };

  // Add helper function to convert language ID to language name
  const getLanguageNameFromId = (languageId: string) => {
    if (!languageId) return "Unknown";

    // If languageId is a language name rather than an ID
    if (isNaN(Number(languageId))) return languageId;

    // Check if the ID exists in JUDGE0_LANGUAGES
    const fullName =
      JUDGE0_LANGUAGES[languageId as keyof typeof JUDGE0_LANGUAGES];
    if (fullName) {
      return parseLanguageName(fullName).name;
    }

    return "Unknown";
  };

  const formatSubmissionDate = (
    dateString: string | Date | number | null | undefined
  ) => {
    if (!dateString) return "Unknown date";

    // Handle Unix timestamps (in milliseconds)
    let date: Date;
    if (typeof dateString === "number" || !isNaN(Number(dateString))) {
      date = new Date(Number(dateString));
    } else {
      date = new Date(dateString);
    }

    // Check if date is valid
    if (isNaN(date.getTime())) return "Unknown date";

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days === 1 ? "" : "s"} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const viewSubmissionDetails = (submission: any, e?: React.MouseEvent) => {
    // If called from an event handler for a button inside a row, stop propagation
    if (e) e.stopPropagation();
    setSelectedSubmission(submission);
  };

  const closeSubmissionDetails = () => {
    setSelectedSubmission(null);
  };

  const loadSubmissionCode = (submission: any, e?: React.MouseEvent) => {
    // If called from an event handler for a button inside a row, stop propagation
    if (e) e.stopPropagation();

    // Load the submission code into editor
    setCode(submission.code || "");

    // Handle the language ID - if it's a number, use it directly
    // If not, fall back to defaultLanguage
    const langId =
      submission.language && !isNaN(Number(submission.language))
        ? submission.language
        : defaultLanguage;

    setLanguage(langId);

    // Switch to code editor panel
    if (isMobile) {
      setActivePanel("code");
    }

    // Get full language name for toast
    const fullLangName =
      JUDGE0_LANGUAGES[submission.language as keyof typeof JUDGE0_LANGUAGES] ||
      "Unknown";

    // Show a success toast
    toast({
      title: "Code loaded",
      description: `Loaded ${fullLangName} code from ${formatSubmissionDate(
        submission.submittedAt
      )} submission`,
    });
  };

  // State for selected submission details view
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  // Get Monaco Editor language from Judge0 language
  const getMonacoLanguage = (languageName: string): string => {
    if (!languageName) return "plaintext";

    const languageMap: Record<string, string> = {
      Java: "java",
      C: "c",
      "C++": "cpp",
      Python: "python",
      JavaScript: "javascript",
      TypeScript: "typescript",
      Go: "go",
      Ruby: "ruby",
      PHP: "php",
      Rust: "rust",
      "C#": "csharp",
      Swift: "swift",
      Kotlin: "kotlin",
      Scala: "scala",
      "Objective-C": "objective-c",
      R: "r",
      Perl: "perl",
      Haskell: "haskell",
      Lua: "lua",
      Assembly: "asm",
    };

    const normalizedName = languageName.split(" ")[0];
    return languageMap[normalizedName] || "plaintext";
  };

  // Custom setLanguage handler to save code draft and update problem setting
  const handleLanguageChange = useCallback(
    (newLanguage: string) => {
      // 1. Capture previous language and code before any state changes
      const prevLanguage = prevLanguageRef.current;
      const prevCode = code;

      // 2. Save code draft and lastLanguage as before (for prevLanguage)
      if (
        authStatus === "authenticated" &&
        authSession?.user?.id &&
        problemId
      ) {
        const baseKey = `nexacademy_${authSession.user.id}_${problemId}_${prevLanguage}`;
        const draftKey = `${baseKey}_draft`;
        const localCode = localStorage.getItem(baseKey) || "";
        const draftCode = localStorage.getItem(draftKey) || "";
        // Save to localStorage for prevLanguage only
        localStorage.setItem(baseKey, prevCode);
        localStorage.setItem(`${baseKey}_timestamp`, Date.now().toString());
        // Only call mutation if code changed
        if (
          authSession.user.id &&
          problemId &&
          prevLanguage &&
          prevCode !== undefined &&
          localCode !== draftCode
        ) {
          saveUserCodeDraft({
            variables: {
              input: {
                userId: String(authSession.user.id),
                problemId: String(problemId),
                language: String(prevLanguage),
                code: String(prevCode),
              },
            },
          })
            .then(() => {
              localStorage.setItem(draftKey, prevCode);
            })
            .catch((err) => {
              console.error("Failed to save code draft:", err);
            });
        }
        // Optionally clean up anonymous data for this problem/language
        const anonymousKey = `nexacademy_anonymous_${problemId}_${prevLanguage}`;
        if (localStorage.getItem(anonymousKey)) {
          localStorage.removeItem(anonymousKey);
          localStorage.removeItem(`${anonymousKey}_timestamp`);
        }
        saveUserProblemSettings({
          variables: {
            input: {
              userId: String(authSession.user.id),
              problemId: String(problemId),
              lastLanguage: newLanguage,
            },
          },
        }).catch((err) => {
          console.error("Failed to save user problem settings:", err);
        });
      } else if (problemId && prevLanguage && prevCode !== undefined) {
        // Not authenticated, save to anonymous localStorage for prevLanguage only
        const anonymousKey = `nexacademy_anonymous_${problemId}_${prevLanguage}`;
        localStorage.setItem(anonymousKey, prevCode);
        localStorage.setItem(
          `${anonymousKey}_timestamp`,
          Date.now().toString()
        );
      }

      // 3. Now update prevLanguageRef and setLanguage
      prevLanguageRef.current = newLanguage;
      setLanguage(newLanguage);

      // 4. Start loading for the new language
      setEditorLoading(true);
      latestLanguageRequestRef.current = newLanguage;

      // 5. Load code for the new language (DB > localStorage > preloadCode)
      (async () => {
        let loadedCode = "";
        let found = false;
        `Starting language switch to: ${newLanguage}`;
        if (
          authStatus === "authenticated" &&
          authSession?.user?.id &&
          problemId
        ) {
          try {
            const { data: draftData } = await client.query({
              query: GET_USER_CODE_DRAFT,
              variables: {
                userId: authSession.user.id,
                problemId,
                language: newLanguage,
              },
              fetchPolicy: "network-only",
            });
            if (draftData?.getUserCodeDraft?.code) {
              loadedCode = draftData.getUserCodeDraft.code;
              found = true;
            }
          } catch (err) {
            console.error("Error fetching from DB:", err);
          }
        }
        if (!found) {
          // Try localStorage
          const userKey =
            authStatus === "authenticated" && authSession?.user?.id
              ? `nexacademy_${authSession.user.id}_${problemId}_${newLanguage}`
              : `nexacademy_anonymous_${problemId}_${newLanguage}`;
          const localCode = localStorage.getItem(userKey) || "";
          if (localCode) {
            loadedCode = localCode;
            found = true;
          }
        }
        if (!found) {
          // Fallback to preloadCode for the new language from languageOptions
          const langOption = codingQuestion.languageOptions?.find(
            (opt: any) => String(opt.language) === String(newLanguage)
          );

          loadedCode = langOption?.preloadCode || "";
        }
        // Only update if this is still the latest requested language
        if (latestLanguageRequestRef.current === newLanguage) {
          setCode(loadedCode);
          setEditorLoading(false);
        }
      })();
    },
    [
      authStatus,
      authSession,
      problemId,
      code,
      saveUserCodeDraft,
      saveUserProblemSettings,
      client,
      codingQuestion.languageOptions,
    ]
  );

  // Save code to localStorage on each keystroke (for current language only)
  useEffect(() => {
    if (
      code === undefined ||
      code === null ||
      !problemId ||
      !language ||
      editorLoading
    )
      return;
    if (authStatus === "authenticated" && authSession?.user?.id) {
      const userStorageKey = `nexacademy_${authSession.user.id}_${problemId}_${language}`;
      localStorage.setItem(userStorageKey, code);
      localStorage.setItem(
        `${userStorageKey}_timestamp`,
        Date.now().toString()
      );
      // Optionally clean up any anonymous data for this problem/language
      const anonymousKey = `nexacademy_anonymous_${problemId}_${language}`;
      if (localStorage.getItem(anonymousKey)) {
        localStorage.removeItem(anonymousKey);
        localStorage.removeItem(`${anonymousKey}_timestamp`);
      }
    } else {
      const anonymousKey = `nexacademy_anonymous_${problemId}_${language}`;
      localStorage.setItem(anonymousKey, code);
      localStorage.setItem(`${anonymousKey}_timestamp`, Date.now().toString());
    }
  }, [code, problemId, language, authStatus, authSession, editorLoading]);

  // Save draft on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveDraftIfChanged(language, code);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [language, code, saveDraftIfChanged]);

  // Add a ref to track whether initial code has been loaded
  const initialLoadCompletedRef = useRef(false);

  useEffect(() => {
    // Only run on mount when user is authenticated AND we haven't loaded initial code yet
    if (
      authStatus !== "authenticated" ||
      !authSession ||
      !authSession.user ||
      !authSession.user.id ||
      !problemId ||
      initialLoadCompletedRef.current
    )
      return;

    let isMounted = true;

    async function loadInitialCode() {
      try {
        // Mark as loaded to prevent duplicate calls
        initialLoadCompletedRef.current = true;
        // Need to check again inside the function
        if (!authSession || !authSession.user || !authSession.user.id) return;
        const userId = authSession.user.id;
        let langToCheck = null;
        let codeFromDB = null;
        let dbUpdatedAt = null;
        // 1. Try to get lastLanguage from UserProblemSettings
        try {
          const { data: settingsData } = await client.query({
            query: GET_USER_PROBLEM_SETTINGS,
            variables: { userId, problemId },
            fetchPolicy: "network-only",
          });
          langToCheck =
            settingsData?.getUserProblemSettings?.lastLanguage ||
            processDefaultLanguage(defaultLanguage);
        } catch (err) {
          langToCheck = processDefaultLanguage(defaultLanguage);
        }
        // 2. Try to get code draft from DB for langToCheck
        try {
          const { data: draftData } = await client.query({
            query: GET_USER_CODE_DRAFT,
            variables: { userId, problemId, language: langToCheck },
            fetchPolicy: "network-only",
          });
          codeFromDB = draftData?.getUserCodeDraft?.code || null;
          dbUpdatedAt = draftData?.getUserCodeDraft?.updatedAt || null;
        } catch (err) {
          codeFromDB = null;
          dbUpdatedAt = null;
        }
        // 3. Get code from localStorage for the same key
        const localKey = `nexacademy_${userId}_${problemId}_${langToCheck}`;
        const localDraftKey = `${localKey}_draft`;
        const localCode = localStorage.getItem(localKey) || "";
        const localDraftCode = localStorage.getItem(localDraftKey) || "";
        // Use the draft key if it exists and is newer
        let localTimestamp = null;
        try {
          localTimestamp = localStorage.getItem(`${localKey}_timestamp`);
        } catch {}
        // 4. Compare timestamps and pick the latest
        // Get preloadCode from the language option for the current language
        let preloadCode = (() => {
          if (
            codingQuestion.languageOptions &&
            Array.isArray(codingQuestion.languageOptions) &&
            langToCheck
          ) {
            const langOption = codingQuestion.languageOptions.find(
              (opt: any) =>
                String(opt.language) === String(langToCheck) ||
                String(opt.id) === String(langToCheck)
            );
            if (langOption) {
              return langOption.preloadCode;
            }
          }
          return "";
        })();
        let useCode = preloadCode;
        if (codeFromDB && dbUpdatedAt) {
          // Compare with localStorage timestamp
          let dbTime = new Date(dbUpdatedAt).getTime();
          let localTime = localTimestamp ? parseInt(localTimestamp, 10) : 0;
          if (localTime > dbTime && localCode) {
            useCode = localCode;
            // If localCode is newer, save it to DB
            try {
              await saveUserCodeDraft({
                variables: {
                  input: {
                    userId: String(userId),
                    problemId: String(problemId),
                    language: String(langToCheck),
                    code: String(localCode),
                  },
                },
              });
            } catch (err) {
              console.error("Failed to save newer local code to DB:", err);
            }
          } else {
            useCode = codeFromDB;
          }
        } else if (localCode) {
          useCode = localCode;
          // If only localCode exists (no DB code), save it to DB
          try {
            await saveUserCodeDraft({
              variables: {
                input: {
                  userId: String(userId),
                  problemId: String(problemId),
                  language: String(langToCheck),
                  code: String(localCode),
                },
              },
            });
          } catch (err) {
            console.error("Failed to save local code to DB:", err);
          }
        } else {
          useCode = preloadCode;
        }
        // Set language and code
        if (isMounted) {
          setLanguage(langToCheck);
          setCode(useCode);
          // Also update the draft key in localStorage with the loaded code

          localStorage.setItem(localDraftKey, useCode);
        }
      } catch (err) {
        console.error("Error in loadInitialCode:", err);
      } finally {
        if (isMounted) setInitialLoading(false);
      }
    }

    loadInitialCode();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line
  }, [authStatus, authSession, problemId]);

  const latestLanguageRequestRef = useRef<string | null>(null);

  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  // When the page loads, stop the loader animation with a delay
  useEffect(() => {
    // Reset the initialLoadCompletedRef to ensure code loads properly
    initialLoadCompletedRef.current = false;

    // Add a small delay before stopping the loader to ensure the editor has time to initialize
    const timeoutId = setTimeout(() => {
      // Stop the NexPractice loading animation
      stopNexPracticeLoading();

      // Dispatch the routeChangeComplete event
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("nexacademy:routeChangeComplete"));
      }
    }, 1000); // 1 second delay to ensure the editor has time to load

    return () => clearTimeout(timeoutId);
  }, []);

  const [editorLoaded, setEditorLoaded] = useState(false);
  const [codeToLoad, setCodeToLoad] = useState<string | null>(null);

  // When the editor mounts, set the loaded flag
  const handleEditorDidMount = useCallback(
    (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
      setEditorLoaded(true);

      // If we have code waiting to be loaded, set it now
      if (codeToLoad) {
        setCode(codeToLoad);
        setCodeToLoad(null);
      }
    },
    [codeToLoad]
  );

  // Always sync editor theme to match app theme, but only after resolvedTheme is available
  useEffect(() => {
    if (appTheme === "dark") {
      setEditorTheme("vs-dark");
    } else if (appTheme === "light") {
      setEditorTheme("light");
    }
    // Do nothing if appTheme is 'system' or undefined
  }, [appTheme]);

  // Add a flag to track if the component has mounted
  const [hasMounted, setHasMounted] = useState(false);

  // Set the mounted flag after first render
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Update layout when screen size changes and initialize correctly for mobile
  useEffect(() => {
    if (isMobile) {
      setLeftPanelWidth(100);
      // Always set activePanel to "problem" when the component is first mounted on mobile
      setActivePanel("problem");
    } else {
      setLeftPanelWidth(50);
    }
  }, [isMobile]);

  if (!hasMounted) return null;

  return (
    <div className="flex flex-col h-screen w-screen fixed inset-0 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 overflow-hidden">
      {/* Expandable Coding Questions Sidebar - ensure it's completely hidden by default on mobile */}
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

      {/* Add overlay when sidebar is open on mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Header with NexPractice theming */}
      <Header
        profilePic={profilePic}
        session={session}
        setSidebarOpen={setSidebarOpen}
        handleFullscreenToggle={handleFullscreenToggle}
        isFullscreen={isFullscreen}
        isMobile={isMobile}
        runCode={runCode}
        submitCode={submitCode}
        isRunning={isRunning}
        isSubmitting={isSubmitting}
        loadingPhrase={loadingPhrase}
      />

      {/* Main content with resizable panels */}
      <div ref={containerRef} className="flex flex-1 overflow-hidden bg-black">
        {/* Left panel - Problem description */}
        <div
          className={`h-full overflow-hidden bg-white dark:bg-black ${
            hasMounted && isMobile
              ? activePanel === "problem"
                ? "block w-full"
                : "hidden"
              : ""
          } ${hasMounted && isMobile ? "pb-24" : ""}`}
          style={{
            width: hasMounted && isMobile ? "100%" : `${leftPanelWidth}%`,
          }}
        >
          <div className="m-4 mr-[2px] rounded-lg overflow-hidden bg-[#1f1f1f] flex flex-col h-[calc(100vh-5rem)]">
            <Tabs
              defaultValue="description"
              className="mt-2 flex flex-col h-full"
              onValueChange={handleTabChange}
            >
              <TabsList className="flex justify-start px-3 border-none p-2 rounded-none shrink-0">
                <TabsTrigger
                  value="description"
                  className="px-4 py-2 text-sm bg-transparent data-[state=active]:font-bold data-[state=active]:opacity-100 opacity-70 hover:opacity-90"
                >
                  <FileText className="h-4 w-4 mr-1.5 text-[#a040ff]" />
                  <span>Description</span>
                </TabsTrigger>
                <TabsTrigger
                  value="solution"
                  className="px-4 py-2 text-sm bg-transparent data-[state=active]:font-bold data-[state=active]:opacity-100 opacity-70 hover:opacity-90"
                >
                  <BookOpenCheck className="h-4 w-4 mr-1.5 text-[#ffcf40]" />
                  <span>Solution</span>
                </TabsTrigger>
                <TabsTrigger
                  value="submissions"
                  className="px-4 py-2 text-sm bg-transparent data-[state=active]:font-bold data-[state=active]:opacity-100 opacity-70 hover:opacity-90"
                >
                  <BarChart2 className="h-4 w-4 mr-1.5 text-[#18ff65]" />
                  <span>Submissions</span>
                </TabsTrigger>
                <TabsTrigger
                  value="discussion"
                  className="px-4 py-2 text-sm bg-transparent data-[state=active]:font-bold data-[state=active]:opacity-100 opacity-70 hover:opacity-90"
                >
                  <MessageSquare className="h-4 w-4 mr-1.5 text-[#1871ff]" />
                  <span>Discussion</span>
                </TabsTrigger>
              </TabsList>
              {/* Use the new ProblemHeader component */}
              <div className="shrink-0">
                <ProblemHeader
                  problemNumber={problemNumber}
                  problemTitle={problemTitle}
                  difficulty={difficulty}
                  isLeftPanelExpanded={isLeftPanelExpanded}
                  toggleLeftPanelExpansion={toggleLeftPanelExpansion}
                  isMobile={isMobile}
                  getDifficultyBadge={getDifficultyBadge}
                  solvedBy={codingQuestion.question?.solvedBy || 1248}
                  tags={
                    codingQuestion.question?.tags || [
                      { name: "Array" },
                      { name: "Hash Table" },
                      { name: "Two Pointers" },
                    ]
                  }
                />
              </div>
              <TabsContent
                value="description"
                className="mt-3 space-y-5 focus-visible:outline-none focus-visible:ring-0 overflow-y-auto flex-1 pb-4 custom-scrollbar"
              >
                <DescriptionTab
                  description={description}
                  examples={examples}
                  formatTestCase={formatTestCase}
                />
              </TabsContent>

              <TabsContent
                value="solution"
                className="mt-4 focus-visible:outline-none focus-visible:ring-0 overflow-y-auto flex-1 pb-4"
              >
                <SolutionTab />
              </TabsContent>

              <TabsContent
                value="submissions"
                className="mt-4 focus-visible:outline-none focus-visible:ring-0 overflow-y-auto flex-1 pb-4"
              >
                <SubmissionsTab
                  submissions={submissions}
                  submissionsLoading={submissionsLoading}
                  submissionsError={submissionsError}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  selectedSubmission={selectedSubmission}
                  fetchSubmissions={fetchSubmissions}
                  viewSubmissionDetails={viewSubmissionDetails}
                  closeSubmissionDetails={closeSubmissionDetails}
                  loadSubmissionCode={loadSubmissionCode}
                  renderSubmissionStatus={renderSubmissionStatus}
                  formatSubmissionDate={formatSubmissionDate}
                  getLanguageColor={getLanguageColor}
                  parseLanguageName={parseLanguageName}
                  JUDGE0_LANGUAGES={JUDGE0_LANGUAGES}
                  getMonacoLanguage={getMonacoLanguage}
                  fontSize={fontSize}
                  tabSize={tabSize}
                  appTheme={appTheme ?? "light"}
                  setActivePanel={(panel: string) =>
                    setActivePanel(panel as "code" | "results" | "problem")
                  }
                  toast={toast}
                />
              </TabsContent>

              <TabsContent
                value="discussion"
                className="mt-4 focus-visible:outline-none focus-visible:ring-0 overflow-y-auto flex-1 pb-4"
              >
                <DiscussionTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        {/* Horizontal resizer - only visible on desktop */}
        {!isMobile && (
          <div
            className="relative w-1 h-full flex-shrink-0 z-10 group cursor-ew-resize"
            onMouseDown={startHorizontalResize}
          >
            <div className="absolute inset-0 w-[6px] my-4 h-[calc(100vh-5rem)]  transition-colors duration-300 rounded-full flex items-center justify-center">
              <div className="absolute h-10 w-[6px] rounded-full bg-[#1f1f1f]"></div>
            </div>
            <div className="absolute inset-0 w-[6px] my-10 h-[calc(100vh-7rem)] bg-transparent hover:bg-[#404040] transition-colors duration-300 rounded-full flex items-center justify-center"></div>
          </div>
        )}
        {/* Right panel container */}
        <div
          className={`flex flex-col h-full m-4 ml-2 ${
            hasMounted && isMobile && activePanel === "problem" ? "hidden" : ""
          }`}
          style={{
            width: hasMounted && isMobile ? "100%" : `${100 - leftPanelWidth}%`,
          }}
        >
          <div className="flex flex-col h-[calc(100vh-5rem)]">
            {/* Code editor */}
            <div
              className={`flex flex-col overflow-hidden rounded-lg ${
                hasMounted && isMobile
                  ? activePanel === "code"
                    ? "block"
                    : "hidden"
                  : ""
              } ${hasMounted && isMobile ? "pb-24" : ""}`}
              style={{
                flexBasis: hasMounted && isMobile ? "100%" : `${editorHeight}%`,
                flexGrow: 0,
                flexShrink: 1,
                minHeight: 0,
                maxHeight: hasMounted && isMobile ? "100%" : `${editorHeight}%`,
                height: hasMounted && isMobile ? "100%" : undefined,
                transition: "all 0.3s ease-in-out", // Add smooth transition
              }}
            >
              <div className="flex items-center justify-between p-2 pl-3 bg-white dark:bg-[#292929]">
                <div className="flex items-center">
                  <div className="flex items-center mr-3 md:mr-4">
                    {/* Logo - "N" on mobile, "NexEditor" on desktop */}
                    <div className="flex items-center justify-center w-7 h-7 md:w-auto md:h-auto">
                      <span className="hidden md:block text-base font-semibold text-indigo-700 dark:text-indigo-300 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 dark:from-indigo-300 dark:via-purple-300 dark:to-indigo-300">
                        NexEditor
                      </span>
                      <div className="md:hidden flex items-center justify-center w-7 h-7 rounded-md bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-sm">
                        N
                      </div>
                    </div>
                  </div>

                  {/* Move Focus Mode button to the right, before Format */}
                </div>
                <div className="flex items-center gap-2">
                  {/* Mobile Run and Submit buttons */}
                  {hasMounted && isMobile && (
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-2 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/50"
                        onClick={runCode}
                        disabled={isRunning}
                      >
                        {isRunning ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Play className="h-3.5 w-3.5" />
                        )}
                        {!isRunning && (
                          <span className="text-xs ml-1">Run</span>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        className="h-8 px-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white"
                        onClick={submitCode}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Send className="h-3.5 w-3.5" />
                        )}
                        {!isSubmitting && (
                          <span className="text-xs ml-1">Submit</span>
                        )}
                      </Button>
                    </div>
                  )}

                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={toggleFocusMode}
                          className="bg-transparent hover:bg-[#484848] rounded-[8px] p-2 transition-colors duration-300"
                        >
                          {focusMode ? <LuMinimize /> : <LuMaximize />}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        align="center"
                        className="w-fit p-2 px-3 rounded-sm bg-[#1f1f1f] text-xs border border-[#444444]"
                      >
                        {focusMode ? "Exit Focus Mode" : "Focus Mode"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {/* Format button with spinner and tooltip */}
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className="bg-transparent hover:bg-[#484848] rounded-[8px] p-2 transition-colors duration-300"
                          onClick={async () => {
                            await formatCode();
                            setFormatSuccess(true);
                            setTimeout(() => setFormatSuccess(false), 1500);
                          }}
                          disabled={isFormatting}
                        >
                          {isFormatting ? (
                            <CgFormatLeft className="animate-pulse" />
                          ) : formatSuccess ? (
                            <Check className="h-3.5 w-3.5 text-green-500 dark:text-green-400" />
                          ) : (
                            <CgFormatLeft />
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        align="center"
                        className="w-fit p-2  px-3 rounded-sm bg-[#1f1f1f] text-xs border border-[#444444]"
                      >
                        Format
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-30"
                    asChild
                  >
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="bg-transparent hover:bg-[#484848] rounded-[8px] p-2 transition-colors duration-300">
                          <span>
                            <Settings className="h-4 w-4 cursor-pointer" />
                          </span>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent
                        align="end"
                        className="w-80 p-0 border border-gray-200 dark:border-[#4c4c4c] shadow-xl rounded-xl overflow-hidden mt-4"
                      >
                        <div className="p-5 bg-white dark:bg-[#2e2e2e] border-t border-gray-100 dark:border-gray-800">
                          {/* Theme selector */}
                          <div className="mb-5">
                            <div className="flex gap-2 mt-1.5">
                              <button
                                onClick={() => setEditorTheme("vs-dark")}
                                className={`px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 flex-1 ${
                                  editorTheme === "vs-dark"
                                    ? "bg-[#0779FF] text-white shadow-md"
                                    : "bg-gray-100 dark:bg-[#2a2a2a] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#333]"
                                }`}
                              >
                                <span className="flex items-center justify-center">
                                  <Moon className={`h-3.5 w-3.5 mr-1.5`} />
                                  Dark
                                </span>
                              </button>
                              <button
                                onClick={() => setEditorTheme("light")}
                                className={`px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 flex-1 ${
                                  editorTheme === "light"
                                    ? "bg-[#0779FF] text-white shadow-md"
                                    : "bg-gray-100 dark:bg-[#2a2a2a] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#333]"
                                }`}
                              >
                                <span className="flex items-center justify-center">
                                  <Sun className={`h-3.5 w-3.5 mr-1.5`} />
                                  Light
                                </span>
                              </button>
                            </div>
                          </div>

                          {/* Font size slider with improved UX */}
                          <div className="mb-5">
                            <label className="text-xs font-medium mb-2.5 text-gray-700 dark:text-gray-300 flex items-center justify-between">
                              <span className="flex items-center">
                                <Type className="h-3.5 w-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
                                Font Size
                              </span>
                              <div className="flex items-center">
                                <button
                                  onClick={() =>
                                    setFontSize(Math.max(12, fontSize - 1))
                                  }
                                  className="h-5 w-5 flex items-center justify-center bg-gray-100 dark:bg-[#1a1a1a] rounded-l-md border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
                                >
                                  <span className="text-xs">-</span>
                                </button>
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#2a2a2a] px-2 py-0.5 border-t border-b border-gray-200 dark:border-gray-700/50 min-w-[40px] text-center">
                                  {fontSize}px
                                </span>
                                <button
                                  onClick={() =>
                                    setFontSize(Math.min(24, fontSize + 1))
                                  }
                                  className="h-5 w-5 flex items-center justify-center bg-gray-100 dark:bg-[#1a1a1a] rounded-r-md border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
                                >
                                  <span className="text-xs">+</span>
                                </button>
                              </div>
                            </label>
                            <div className="relative mt-3 px-1">
                              <div className="h-1 bg-gray-200 dark:bg-[#333] rounded-full w-full overflow-hidden">
                                <div
                                  className="h-full bg-[#0779FF]"
                                  style={{
                                    width: `${((fontSize - 12) / 12) * 100}%`,
                                  }}
                                ></div>
                              </div>
                              <div
                                className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-[#0779FF] shadow-md border border-[#0779FF]"
                                style={{
                                  left: `calc(${
                                    ((fontSize - 12) / 12) * 100
                                  }% - 6px)`,
                                }}
                              ></div>
                              <input
                                type="range"
                                min="12"
                                max="24"
                                value={fontSize}
                                onChange={(e) =>
                                  setFontSize(Number(e.target.value))
                                }
                                className="absolute inset-0 w-full h-6 opacity-0 cursor-pointer"
                                style={{ marginTop: "-10px" }}
                              />
                            </div>
                            <div className="flex justify-between mt-2 px-1">
                              <span className="text-[10px] text-gray-400 dark:text-gray-500">
                                12px
                              </span>
                              <span className="text-[10px] text-gray-400 dark:text-gray-500">
                                24px
                              </span>
                            </div>
                          </div>

                          {/* Tab size slider with improved UX */}
                          <div className="mb-5">
                            <label className="text-xs font-medium mb-2.5 text-gray-700 dark:text-gray-300 flex items-center justify-between">
                              <span className="flex items-center">
                                <Indent className="h-3.5 w-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
                                Tab Size
                              </span>
                              <div className="flex items-center">
                                <button
                                  onClick={() =>
                                    setTabSize(Math.max(2, tabSize - 2))
                                  }
                                  className="h-5 w-5 flex items-center justify-center bg-gray-100 dark:bg-[#1a1a1a] rounded-l-md border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
                                >
                                  <span className="text-xs">-</span>
                                </button>
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#2a2a2a] px-2 py-0.5 border-t border-b border-gray-200 dark:border-gray-700/50 min-w-[70px] text-center">
                                  {tabSize} spaces
                                </span>
                                <button
                                  onClick={() =>
                                    setTabSize(Math.min(8, tabSize + 2))
                                  }
                                  className="h-5 w-5 flex items-center justify-center bg-gray-100 dark:bg-[#1a1a1a] rounded-r-md border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
                                >
                                  <span className="text-xs">+</span>
                                </button>
                              </div>
                            </label>
                            <div className="relative mt-3 px-1">
                              <div className="h-1 bg-gray-200 dark:bg-[#333] rounded-full w-full overflow-hidden">
                                <div
                                  className="h-full bg-[#0779FF]"
                                  style={{
                                    width: `${((tabSize - 2) / 6) * 100}%`,
                                  }}
                                ></div>
                              </div>
                              <div
                                className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-[#0779FF] shadow-md border border-[#0779FF]"
                                style={{
                                  left: `calc(${
                                    ((tabSize - 2) / 6) * 100
                                  }% - 6px)`,
                                }}
                              ></div>
                              <input
                                type="range"
                                min="2"
                                max="8"
                                step="2"
                                value={tabSize}
                                onChange={(e) =>
                                  setTabSize(Number(e.target.value))
                                }
                                className="absolute inset-0 w-full h-6 opacity-0 cursor-pointer"
                                style={{ marginTop: "-10px" }}
                              />
                            </div>
                            <div className="flex justify-between mt-2 px-1">
                              <span className="text-[10px] text-gray-400 dark:text-gray-500">
                                2
                              </span>
                              <span className="text-[10px] text-gray-400 dark:text-gray-500">
                                4
                              </span>
                              <span className="text-[10px] text-gray-400 dark:text-gray-500">
                                6
                              </span>
                              <span className="text-[10px] text-gray-400 dark:text-gray-500">
                                8
                              </span>
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </Button>
                  {/* Custom Language Dropdown */}
                  <Popover
                    open={languageDropdownOpen}
                    onOpenChange={setLanguageDropdownOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 bg-[#393939] hover:bg-[#494949] text-white min-w-[120px] h-8 md:h-9 px-3 overflow-hidden group relative"
                      >
                        <div className="flex items-center justify-between w-full overflow-hidden">
                          <div className="flex items-center justify-center gap-3 overflow-hidden">
                            <span className="font-medium text-xs md:text-sm truncate">
                              {
                                parseLanguageName(
                                  JUDGE0_LANGUAGES[
                                    language as keyof typeof JUDGE0_LANGUAGES
                                  ]
                                ).name
                              }
                            </span>
                            <span className="text-[10px] md:text-xs text-[#8c8c8c] truncate group-hover:text-[#acacac]">
                              {
                                parseLanguageName(
                                  JUDGE0_LANGUAGES[
                                    language as keyof typeof JUDGE0_LANGUAGES
                                  ]
                                ).version
                              }
                            </span>
                          </div>
                          <ChevronDown className="h-3 w-3 ml-2 flex-shrink-0 opacity-60  transition-colors" />
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="w-[600px] mt-3 mr-6 p-0 max-h-[400px] overflow-hidden flex flex-col border-gray-800 shadow-lg rounded-xl"
                    >
                      <div className="sticky top-0 z-30 bg-[#292929] border-b border-gray-800 p-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Search languages..."
                            className="pl-10 py-1.5 bg-[#1a1a1a] border-gray-700 rounded-lg text-sm text-white"
                            value={searchLanguage}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => setSearchLanguage(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="overflow-y-auto flex-1 p-0 custom-scrollbar bg-[#292929]">
                        <div className="grid grid-cols-3 divide-x divide-[#393939]">
                          <div className="py-2 space-y-1">
                            {Object.entries(JUDGE0_LANGUAGES)
                              .filter(
                                ([id, name]) =>
                                  !searchLanguage ||
                                  name
                                    .toLowerCase()
                                    .includes(searchLanguage.toLowerCase())
                              )
                              .slice(
                                0,
                                Math.ceil(
                                  Object.keys(JUDGE0_LANGUAGES).length / 3
                                )
                              )
                              .map(([langId, langName]: [string, string]) => {
                                const { name, version } =
                                  parseLanguageName(langName);
                                const isSelected = language === langId;
                                return (
                                  <div
                                    key={`lang-${langId}`}
                                    className={`group px-4 py-2.5 transition-all duration-150 cursor-pointer rounded-md mx-1 ${
                                      isSelected
                                        ? "bg-[#333333]"
                                        : "hover:bg-[#2a2a2a]"
                                    }`}
                                    onClick={() => {
                                      handleLanguageChange(langId);
                                      setLanguageDropdownOpen(false);
                                    }}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex flex-col">
                                        <span
                                          className={`font-medium text-sm ${
                                            isSelected
                                              ? "text-[#0779FF]"
                                              : "text-gray-300"
                                          }`}
                                        >
                                          {name}
                                        </span>
                                        {version && (
                                          <span className="text-xs text-gray-500">
                                            {version}
                                          </span>
                                        )}
                                      </div>
                                      {isSelected && (
                                        <div className="text-[#0779FF]">
                                          <Check className="h-3.5 w-3.5" />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                          </div>

                          <div className="py-2 space-y-1">
                            {Object.entries(JUDGE0_LANGUAGES)
                              .filter(
                                ([id, name]) =>
                                  !searchLanguage ||
                                  name
                                    .toLowerCase()
                                    .includes(searchLanguage.toLowerCase())
                              )
                              .slice(
                                Math.ceil(
                                  Object.keys(JUDGE0_LANGUAGES).length / 3
                                ),
                                Math.ceil(
                                  Object.keys(JUDGE0_LANGUAGES).length / 3
                                ) * 2
                              )
                              .map(([langId, langName]: [string, string]) => {
                                const { name, version } =
                                  parseLanguageName(langName);
                                const isSelected = language === langId;
                                return (
                                  <div
                                    key={`lang-${langId}`}
                                    className={`group px-4 py-2.5 transition-all duration-150 cursor-pointer rounded-md mx-1 ${
                                      isSelected
                                        ? "bg-[#333333]"
                                        : "hover:bg-[#2a2a2a]"
                                    }`}
                                    onClick={() => {
                                      handleLanguageChange(langId);
                                      setLanguageDropdownOpen(false);
                                    }}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex flex-col">
                                        <span
                                          className={`font-medium text-sm ${
                                            isSelected
                                              ? "text-[#0779FF]"
                                              : "text-gray-300"
                                          }`}
                                        >
                                          {name}
                                        </span>
                                        {version && (
                                          <span className="text-xs text-gray-500">
                                            {version}
                                          </span>
                                        )}
                                      </div>
                                      {isSelected && (
                                        <div className="text-[#0779FF]">
                                          <Check className="h-3.5 w-3.5" />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                          </div>

                          <div className="py-2 space-y-1">
                            {Object.entries(JUDGE0_LANGUAGES)
                              .filter(
                                ([id, name]) =>
                                  !searchLanguage ||
                                  name
                                    .toLowerCase()
                                    .includes(searchLanguage.toLowerCase())
                              )
                              .slice(
                                Math.ceil(
                                  Object.keys(JUDGE0_LANGUAGES).length / 3
                                ) * 2
                              )
                              .map(([langId, langName]: [string, string]) => {
                                const { name, version } =
                                  parseLanguageName(langName);
                                const isSelected = language === langId;
                                return (
                                  <div
                                    key={`lang-${langId}`}
                                    className={`group px-4 py-2.5 transition-all duration-150 cursor-pointer rounded-md mx-1 ${
                                      isSelected
                                        ? "bg-[#333333]"
                                        : "hover:bg-[#2a2a2a]"
                                    }`}
                                    onClick={() => {
                                      handleLanguageChange(langId);
                                      setLanguageDropdownOpen(false);
                                    }}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex flex-col">
                                        <span
                                          className={`font-medium text-sm ${
                                            isSelected
                                              ? "text-[#0779FF]"
                                              : "text-gray-300"
                                          }`}
                                        >
                                          {name}
                                        </span>
                                        {version && (
                                          <span className="text-xs text-gray-500">
                                            {version}
                                          </span>
                                        )}
                                      </div>
                                      {isSelected && (
                                        <div className="text-[#0779FF]">
                                          <Check className="h-3.5 w-3.5" />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>

                        {searchLanguage &&
                          Object.entries(JUDGE0_LANGUAGES).filter(
                            ([id, name]) =>
                              name
                                .toLowerCase()
                                .includes(searchLanguage.toLowerCase())
                          ).length === 0 && (
                            <div className="text-center py-8 px-4">
                              <Search className="h-5 w-5 text-gray-500 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">
                                No languages matching "{searchLanguage}"
                              </p>
                            </div>
                          )}
                      </div>

                      {searchLanguage && (
                        <div className="border-t border-gray-800 px-3 py-2 bg-[#1a1a1a]">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSearchLanguage("")}
                            className="h-7 text-xs w-full border-gray-700 bg-[#2a2a2a] hover:bg-[#333333] text-gray-300"
                          >
                            <X className="h-3 w-3 mr-1.5" />
                            Clear Search
                          </Button>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex-1 overflow-auto" style={{ minHeight: 0 }}>
                {/* Editor wrapper with subtle background gradient */}
                <div className="h-full w-full relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                  {editorLoading || initialLoading ? (
                    <div className="flex items-center justify-center h-full w-full overflow-hidden">
                      <div className="w-full h-full flex flex-col">
                        {/* Premium skeleton loader */}
                        <div className="h-full w-full relative overflow-hidden rounded-md">
                          {/* Background with subtle gradient */}
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/40 to-purple-50/40 dark:from-indigo-900/10 dark:to-purple-900/10"></div>
                          {/* Animated gradient overlay */}
                          <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_33%,rgba(79,70,229,0.05)_50%,transparent_66%)] dark:bg-[linear-gradient(110deg,transparent_33%,rgba(79,70,229,0.1)_50%,transparent_66%)] bg-size-200 animate-shimmer"></div>
                          {/* Content placeholder */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="space-y-8 w-1/2 max-w-md">
                              <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-full bg-indigo-100/60 dark:bg-indigo-900/20 flex items-center justify-center">
                                  <Code className="h-5 w-5 text-indigo-400/60 dark:text-indigo-400/40" />
                                </div>
                                <div className="h-3 bg-indigo-200/60 dark:bg-indigo-700/30 rounded-md w-36"></div>
                              </div>
                              <div className="space-y-3">
                                <div className="h-3 bg-slate-200/60 dark:bg-slate-700/30 rounded-md w-full"></div>
                                <div className="h-3 bg-slate-200/60 dark:bg-slate-700/30 rounded-md w-5/6"></div>
                                <div className="h-3 bg-slate-200/60 dark:bg-slate-700/30 rounded-md w-4/6"></div>
                              </div>
                              <div className="space-y-3">
                                <div className="h-3 bg-indigo-200/40 dark:bg-indigo-800/20 rounded-md w-full"></div>
                                <div className="h-3 bg-indigo-200/40 dark:bg-indigo-800/20 rounded-md w-3/4"></div>
                                <div className="h-3 bg-indigo-200/40 dark:bg-indigo-800/20 rounded-md w-5/6"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
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
                        // Keep the editor references
                        editorRef.current = editor;
                        monacoRef.current = monaco;

                        // Call our new handler to load code correctly
                        handleEditorDidMount(editor, monaco);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Vertical resizer - only visible on desktop */}
            {!isMobile && (
              <div
                className="relative h-1 w-full flex-shrink-0 z-10 group cursor-ns-resize"
                onMouseDown={startVerticalResize}
              >
                <div className="absolute inset-0 h-1 w-full bg-indigo-100 dark:bg-indigo-900/30 group-hover:bg-indigo-300 dark:group-hover:bg-indigo-700/50 transition-colors duration-300"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-12 bg-white dark:bg-slate-800 rounded-md border border-indigo-200 dark:border-indigo-800/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm">
                  <Grip className="h-4 w-4 text-indigo-500 dark:text-indigo-400 rotate-90" />
                </div>
              </div>
            )}

            {/* Results panel */}
            <div
              className={`flex flex-col overflow-hidden ${
                hasMounted && isMobile
                  ? activePanel === "results"
                    ? "block"
                    : "hidden"
                  : ""
              } ${hasMounted && isMobile ? "pb-24" : ""}`}
              style={{
                flexBasis:
                  hasMounted && isMobile ? "100%" : `${100 - editorHeight}%`,
                flexGrow: 0,
                flexShrink: 0,
                minHeight: 0,
                maxHeight:
                  hasMounted && isMobile ? "100%" : `${100 - editorHeight}%`,
                height: hasMounted && isMobile ? "100%" : undefined,
                transition: "all 0.3s ease-in-out", // Add smooth transition
              }}
            >
              <div className="flex items-center justify-between p-2 md:p-3 bg-white dark:bg-black ">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Results
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-500 dark:text-slate-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                    onClick={toggleResultsPanelFullscreen}
                    aria-label={
                      isResultsPanelFullscreen
                        ? "Exit fullscreen"
                        : "Fullscreen"
                    }
                  >
                    {isResultsPanelFullscreen ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Results Content */}
              <div className="flex-1 relative bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800/80 overflow-auto pb-20">
                {/* Background decorative elements */}
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-full blur-3xl -z-0"></div>
                <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-50/30 dark:bg-purple-900/10 rounded-full blur-3xl -z-0"></div>

                {/* Tabs for Results Panel */}
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full p-4 relative z-10"
                >
                  <TabsList className="flex flex-nowrap justify-start overflow-x-auto overflow-y-hidden px-3 scroll-pl-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-indigo-200 dark:scrollbar-thumb-indigo-900/40 bg-slate-100 dark:bg-slate-800/70 rounded-lg backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/30 shadow-sm mb-3 gap-1.5 p-2">
                    <TabsTrigger
                      value="sample"
                      className="flex-shrink-0 min-w-[140px] px-3 rounded-md py-1.5 data-[state=active]:bg-white data-[state=active]:dark:bg-black/95 data-[state=active]:text-indigo-700 data-[state=active]:dark:text-indigo-30 data-[state=active]:shadow-sm relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 opacity-0 group-data-[state=active]:opacity-100 transition-opacity">
                        <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                      </div>
                      <FileText className="h-3.5 w-3.5 mr-1.5 text-indigo-500/70 dark:text-indigo-400/70 group-data-[state=active]:text-indigo-600 dark:group-data-[state=active]:text-indigo-400" />
                      Sample Testcases
                    </TabsTrigger>
                    <TabsTrigger
                      value="hidden"
                      className="flex-shrink-0 min-w-[140px] px-3 rounded-md py-1.5 data-[state=active]:bg-white data-[state=active]:dark:bg-black/95 data-[state=active]:text-indigo-700 data-[state=active]:dark:text-indigo-30 data-[state=active]:shadow-sm relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 opacity-0 group-data-[state=active]:opacity-100 transition-opacity">
                        <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                      </div>
                      <BarChart2 className="h-3.5 w-3.5 mr-1.5 text-indigo-500/70 dark:text-indigo-400/70 group-data-[state=active]:text-indigo-600 dark:group-data-[state=active]:text-indigo-400" />
                      Hidden Testcases
                    </TabsTrigger>
                    <TabsTrigger
                      value="custom"
                      className="flex-shrink-0 min-w-[140px] px-3 rounded-md py-1.5 data-[state=active]:bg-white data-[state=active]:dark:bg-black/95 data-[state=active]:text-indigo-700 data-[state=active]:dark:text-indigo-30 data-[state=active]:shadow-sm relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 opacity-0 group-data-[state=active]:opacity-100 transition-opacity">
                        <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                      </div>
                      <Sparkles className="h-3.5 w-3.5 mr-1.5 text-indigo-500/70 dark:text-indigo-400/70 group-data-[state=active]:text-indigo-600 dark:group-data-[state=active]:text-indigo-400" />
                      Custom Testcase
                    </TabsTrigger>
                  </TabsList>

                  {/* Sample Testcases Tab */}
                  <TabsContent
                    value="sample"
                    className="focus-visible:outline-none focus-visible:ring-0"
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
                    ) : sampleTestResults.length > 0 &&
                      activeTab === "sample" ? (
                      <div className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-3 duration-500">
                        {/* Summary badge */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-slate-700 dark:text-slate-300">
                            <span className="font-medium">
                              {sampleTestResults.length}
                            </span>{" "}
                            sample test cases evaluated
                          </div>
                          {sampleExecutionStatus && (
                            <div
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm
                ${
                  sampleExecutionStatus === "success"
                    ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/70 dark:border-green-900/30 text-green-700 dark:text-green-400"
                    : sampleExecutionStatus === "warning"
                    ? "bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200/70 dark:border-amber-900/30 text-amber-700 dark:text-amber-400"
                    : "bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200/70 dark:border-red-900/30 text-red-700 dark:text-red-400"
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
                        <Tabs
                          defaultValue={`sample-testcase-0`}
                          className="w-full"
                        >
                          <TabsList className="flex flex-nowrap overflow-x-auto px-3 scrollbar-thin scrollbar-thumb-indigo-200 dark:scrollbar-thumb-indigo-900/40 bg-gradient-to-r from-slate-100/90 to-indigo-50/80 dark:from-slate-800/70 dark:to-indigo-900/30 rounded-lg backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/30 shadow-sm mb-3 gap-1.5 p-2">
                            {sampleTestResults.map((result, idx) => (
                              <TabsTrigger
                                key={`sample-trigger-${result.id || idx}`}
                                value={`sample-testcase-${idx}`}
                                className="flex-shrink-0 min-w-[85px] rounded-md py-2 data-[state=active]:bg-white data-[state=active]:dark:bg-black/95 data-[state=active]:text-indigo-700 data-[state=active]:dark:text-indigo-30 data-[state=active]:shadow-sm relative overflow-hidden group transition-all duration-150"
                              >
                                <div className="absolute inset-0 opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300">
                                  <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/30 dark:from-indigo-900/30 dark:to-purple-900/20 opacity-0 group-data-[state=active]:opacity-100 transition-opacity"></div>
                                </div>
                                <div className="flex items-center justify-center gap-1.5">
                                  <div
                                    className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-medium
                      ${
                        result.isCorrect
                          ? "bg-gradient-to-br from-green-500 to-emerald-600"
                          : "bg-gradient-to-br from-red-500 to-rose-600"
                      }`}
                                  >
                                    {result.isCorrect ? (
                                      <Check className="h-3 w-3" />
                                    ) : (
                                      <X className="h-3 w-3" />
                                    )}
                                  </div>
                                  <span className="font-medium text-sm group-data-[state=active]:text-indigo-600 dark:group-data-[state=active]:text-indigo-400">
                                    Test {idx + 1}
                                  </span>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-0 transition-opacity"></div>
                              </TabsTrigger>
                            ))}
                          </TabsList>

                          {sampleTestResults.map((result, idx) => (
                            <TabsContent
                              key={`sample-content-${result.id || idx}`}
                              value={`sample-testcase-${idx}`}
                              className="focus-visible:outline-none focus-visible:ring-0"
                            >
                              <div className="bg-white dark:bg-black rounded-lg shadow-sm overflow-hidden border border-slate-200 dark:border-slate-700/50">
                                <div
                                  className={`px-4 py-2 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between
                    ${
                      result.isCorrect
                        ? "bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-900/10"
                        : result.verdict === "Time Limit Exceeded" ||
                          (result.status && result.status.id === 5) ||
                          result.verdict?.toLowerCase()?.includes("time limit")
                        ? "bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-900/10"
                        : result.verdict === "Compilation Error" ||
                          result.compileOutput
                        ? "bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-900/10"
                        : "bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-900/10"
                    }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-medium
                        ${
                          result.isCorrect
                            ? "bg-green-500"
                            : result.verdict === "Time Limit Exceeded" ||
                              (result.status && result.status.id === 5) ||
                              result.verdict
                                ?.toLowerCase()
                                ?.includes("time limit")
                            ? "bg-amber-500"
                            : result.verdict === "Compilation Error" ||
                              result.compileOutput
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}
                                    >
                                      {idx + 1}
                                    </div>
                                    <span className="font-medium text-slate-700 dark:text-slate-300">
                                      {result.isCorrect
                                        ? "Passed"
                                        : result.verdict ===
                                            "Time Limit Exceeded" ||
                                          (result.status &&
                                            result.status.id === 5) ||
                                          result.verdict
                                            ?.toLowerCase()
                                            ?.includes("time limit")
                                        ? "Time Limit Exceeded"
                                        : result.verdict ===
                                            "Compilation Error" ||
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
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : result.verdict === "Time Limit Exceeded" ||
                              (result.status && result.status.id === 5) ||
                              result.verdict
                                ?.toLowerCase()
                                ?.includes("time limit")
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                            : result.verdict === "Compilation Error" ||
                              result.compileOutput
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                                    >
                                      {result.isCorrect ? (
                                        <>
                                          <Check className="h-3 w-3 mr-1" />
                                          Correct
                                        </>
                                      ) : result.verdict ===
                                          "Time Limit Exceeded" ||
                                        (result.status &&
                                          result.status.id === 5) ||
                                        result.verdict
                                          ?.toLowerCase()
                                          ?.includes("time limit") ? (
                                        <>
                                          <Clock className="h-3 w-3 mr-1" />
                                          Time Limit
                                        </>
                                      ) : result.verdict ===
                                          "Compilation Error" ||
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
                                  <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700/50">
                                    <div className="bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 border-b border-slate-200 dark:border-slate-700/50 text-xs font-medium text-slate-700 dark:text-slate-300">
                                      Input
                                    </div>
                                    <div className="p-3 font-mono text-sm bg-white dark:bg-slate-800/30 text-slate-700 dark:text-slate-300">
                                      {formatTestCase(result.input)}
                                    </div>
                                  </div>

                                  <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700/50">
                                    <div className="bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 border-b border-slate-200 dark:border-slate-700/50 text-xs font-medium text-slate-700 dark:text-slate-300">
                                      Expected Output
                                    </div>
                                    <div className="p-3 font-mono text-sm bg-white dark:bg-slate-800/30 text-slate-700 dark:text-slate-300">
                                      {formatTestCase(result.expectedOutput)}
                                    </div>
                                  </div>

                                  {/* Only show the Your Output section if there are no errors/warnings/time limit exceeded */}
                                  {!(
                                    result.stderr ||
                                    result.compileOutput ||
                                    result.verdict === "Time Limit Exceeded" ||
                                    (result.status && result.status.id === 5) ||
                                    result.verdict
                                      ?.toLowerCase()
                                      ?.includes("time limit") ||
                                    result.verdict === "Compilation Error"
                                  ) && (
                                    <div
                                      className={`rounded-lg overflow-hidden md:col-span-2 
                        ${
                          result.isCorrect
                            ? "border border-green-200 dark:border-green-900/30"
                            : "border border-red-200 dark:border-red-900/30"
                        }`}
                                    >
                                      <div
                                        className={`px-3 py-1.5 border-b flex items-center
                          ${
                            result.isCorrect
                              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/30 text-green-800 dark:text-green-400"
                              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/30 text-red-800 dark:text-red-400"
                          }`}
                                      >
                                        {result.isCorrect ? (
                                          <Check className="h-3 w-3 mr-1.5" />
                                        ) : (
                                          <X className="h-3 w-3 mr-1.5" />
                                        )}
                                        Your Output
                                      </div>
                                      <div className="p-3 font-mono text-sm bg-white dark:bg-slate-800/30 text-slate-700 dark:text-slate-30">
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
                                    <div className="rounded-lg overflow-hidden border border-amber-200 dark:border-amber-900/30 md:col-span-2">
                                      <div className="bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 border-b border-amber-200 dark:border-amber-900/30 text-xs font-medium text-amber-800 dark:text-amber-400 flex items-center">
                                        <Clock className="h-3 w-3 mr-1.5" />
                                        Time Limit Exceeded
                                      </div>
                                      <div className="p-3 bg-white dark:bg-slate-800/30">
                                        <p className="text-sm text-amber-700 dark:text-amber-400">
                                          Your solution took too long to
                                          execute. Try optimizing your algorithm
                                          to run within the time limit.
                                        </p>
                                      </div>
                                    </div>
                                  )}

                                  {/* Show Compilation Error message */}
                                  {(result.verdict === "Compilation Error" ||
                                    result.compileOutput) && (
                                    <div className="rounded-lg overflow-hidden border border-amber-200 dark:border-amber-900/30 md:col-span-2">
                                      <div className="bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 border-b border-amber-200 dark:border-amber-900/30 text-xs font-medium text-amber-800 dark:text-amber-400 flex items-center">
                                        <AlertTriangle className="h-3 w-3 mr-1.5" />
                                        Compilation Error
                                      </div>
                                      <div className="p-3 bg-white dark:bg-slate-800/30">
                                        <div className="text-sm text-amber-700 dark:text-amber-400 font-mono whitespace-pre-wrap">
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
                                      <div className="rounded-lg overflow-hidden border border-red-200 dark:border-red-900/30 md:col-span-2">
                                        <div className="bg-red-50 dark:bg-red-900/20 px-3 py-1.5 border-b border-red-200 dark:border-red-900/30 text-xs font-medium text-red-800 dark:text-red-400 flex items-center">
                                          <AlertCircle className="h-3 w-3 mr-1.5" />
                                          Runtime Error
                                        </div>
                                        <div className="p-3 bg-white dark:bg-slate-800/30">
                                          <div className="text-sm text-red-700 dark:text-red-400 font-mono whitespace-pre-wrap">
                                            {result.stderr}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-2 border-t border-slate-200 dark:border-slate-700/50 flex justify-between items-center">
                                  <div className="flex items-center">
                                    <Clock className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 mr-1.5" />
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                      Execution Time:{" "}
                                      {result.executionTime || "N/A"}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <Cpu className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 mr-1.5" />
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
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
                      // Display sample test cases when no code has been run
                      <div className="space-y-4">
                        {/* Summary banner for sample test cases */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-slate-700 dark:text-slate-300">
                            <span className="font-medium">
                              {examples.length}
                            </span>{" "}
                            sample test cases available
                          </div>
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200/70 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-300 shadow-sm">
                            <Play className="h-3 w-3 mr-1.5" />
                            Run Code to Test
                          </div>
                        </div>

                        {/* Tabs for each sample testcase */}
                        <Tabs defaultValue={`example-0`} className="w-full">
                          <TabsList className="bg-gradient-to-r from-slate-100/90 to-indigo-50/80 dark:from-slate-800/70 dark:to-indigo-900/30 p-1 rounded-lg overflow-hidden backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/30 shadow-sm mb-3 w-full flex flex-wrap">
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
                                  className="flex-1 min-w-[100px] rounded-md py-2 data-[state=active]:bg-white data-[state=active]:dark:bg-black/95 data-[state=active]:text-indigo-700 data-[state=active]:dark:text-indigo-30 data-[state=active]:shadow-sm relative overflow-hidden group transition-all duration-150"
                                >
                                  <div className="absolute inset-0 opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300">
                                    <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/30 dark:from-indigo-900/30 dark:to-purple-900/20 opacity-0 group-data-[state=active]:opacity-100 transition-opacity"></div>
                                  </div>
                                  <div className="flex items-center justify-center gap-1.5">
                                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-medium bg-gradient-to-br from-indigo-500 to-purple-600">
                                      {idx + 1}
                                    </div>
                                    <span className="hidden sm:inline font-medium text-sm group-data-[state=active]:text-indigo-600 dark:group-data-[state=active]:text-indigo-400">
                                      Test {idx + 1}
                                    </span>
                                  </div>
                                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-0 transition-opacity"></div>
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
                                <div className="bg-white dark:bg-black rounded-lg shadow-sm overflow-hidden border border-slate-200 dark:border-slate-700/50">
                                  <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-900/10">
                                    <div className="flex items-center gap-2">
                                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-medium bg-indigo-500">
                                        {idx + 1}
                                      </div>
                                      <span className="font-medium text-slate-700 dark:text-slate-300">
                                        Sample Test Case
                                      </span>
                                    </div>
                                  </div>

                                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700/50">
                                      <div className="bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 border-b border-slate-200 dark:border-slate-700/50 text-xs font-medium text-slate-700 dark:text-slate-300">
                                        Input
                                      </div>
                                      <div className="p-3 font-mono text-sm bg-white dark:bg-slate-800/30 text-slate-700 dark:text-slate-300">
                                        {formatTestCase(example.input)}
                                      </div>
                                    </div>

                                    <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700/50">
                                      <div className="bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 border-b border-slate-200 dark:border-slate-700/50 text-xs font-medium text-slate-700 dark:text-slate-300">
                                        Expected Output
                                      </div>
                                      <div className="p-3 font-mono text-sm bg-white dark:bg-slate-800/30 text-slate-700 dark:text-slate-300">
                                        {formatTestCase(example.output)}
                                      </div>
                                    </div>

                                    {/* Explanation if available */}
                                    {example.explanation && (
                                      <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700/50 md:col-span-2">
                                        <div className="bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 border-b border-slate-200 dark:border-slate-700/50 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center">
                                          <Info className="h-3 w-3 mr-1.5 text-indigo-500 dark:text-indigo-400" />
                                          Explanation
                                        </div>
                                        <div className="p-3 font-mono text-sm bg-white dark:bg-slate-800/30 text-slate-700 dark:text-slate-300">
                                          {formatTestCase(example.explanation)}
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-2 border-t border-slate-200 dark:border-slate-700/50 flex justify-between items-center">
                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                      Run code to test your solution against
                                      this example
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

                  {/* Hidden Testcases Tab */}
                  <TabsContent
                    value="hidden"
                    className="focus-visible:outline-none focus-visible:ring-0"
                  >
                    <HiddenTestcasesTab
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
                    />
                  </TabsContent>

                  {/* Confetti celebration overlay */}
                  {showCelebration && (
                    <div className="fixed inset-0 pointer-events-none z-50">
                      {/* This div is just a container for the confetti effect */}
                    </div>
                  )}
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Mobile Navigation Tabs */}
      {hasMounted && isMobile && (
        <FloatingMobileTab
          activePanel={activePanel}
          setActivePanel={setActivePanel}
        />
      )}
    </div>
  );
}
