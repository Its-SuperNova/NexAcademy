import React from "react";
import {
  Maximize2,
  Minimize2,
  ArrowLeft,
  Shuffle,
  User,
  LogOut,
  Crown,
  Code,
  Compass,
  Play,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ModeToggle } from "@/components/nexpractice/mode-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeaderProps {
  profilePic: string | null;
  session: any;
  setSidebarOpen: (open: boolean) => void;
  handleFullscreenToggle: () => void;
  isFullscreen: boolean;
  isMobile: boolean;
  runCode: () => void;
  submitCode: () => void;
  isRunning: boolean;
  isSubmitting: boolean;
  loadingPhrase: string;
}

const Header: React.FC<HeaderProps> = ({
  profilePic,
  session,
  setSidebarOpen,
  handleFullscreenToggle,
  isFullscreen,
  isMobile,
  runCode,
  submitCode,
  isRunning,
  isSubmitting,
  loadingPhrase,
}) => {
  return (
    <header className="flex items-center justify-between px-3 py-2 border-b border-indigo-100 dark:border-indigo-900/50 bg-gradient-to-r from-white via-slate-50 to-white dark:from-black dark:via-neutral-900 dark:to-black shadow-sm relative overflow-hidden backdrop-blur-sm z-30 min-h-[44px]">
      {/* Left section: Logo, Explore Nex, and sidebar toggle */}
      <div className="flex items-center gap-3 min-w-0 relative z-10">
        <button
          className="mr-1 flex items-center justify-center rounded-lg h-8 w-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-neutral-900 dark:to-black border border-indigo-100 dark:border-indigo-900/50 hover:bg-indigo-100 dark:hover:bg-neutral-800 text-indigo-700 dark:text-gray-200 shadow-sm transition-all duration-200 hover:scale-105"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open questions sidebar"
        >
          <div className="flex flex-col justify-center items-center w-4 h-4 gap-[2px]">
            <div className="w-full h-[1.5px] bg-current rounded-full"></div>
            <div className="w-full h-[1.5px] bg-current rounded-full"></div>
            <div className="w-full h-[1.5px] bg-current rounded-full"></div>
          </div>
        </button>
        <div className="flex items-center gap-1 min-w-0">
          <div className="relative flex items-center justify-center w-7 h-7 transition-transform hover:scale-105 group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-neutral-800 dark:to-neutral-900 rounded-lg transform rotate-3 opacity-80 group-hover:opacity-90 transition-all duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-blue-500 to-indigo-600 dark:from-neutral-700 dark:to-neutral-800 rounded-lg transform -rotate-3 opacity-80 group-hover:opacity-90 transition-all duration-300"></div>
            <div className="relative z-10 flex items-center justify-center w-6 h-6 bg-white dark:bg-neutral-900 rounded-lg shadow-inner overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-white dark:from-neutral-900 dark:to-black opacity-40"></div>
              <div className="relative">
                <Code className="w-3.5 h-3.5 text-indigo-600 dark:text-gray-200" />
                <div className="absolute inset-0 bg-indigo-500/10 dark:bg-gray-200/10 animate-pulse-slow rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
          </div>
          <div className="group min-w-0">
            <h1 className="text-base font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 dark:from-blue-200 dark:via-gray-400 dark:to-blue-200 truncate">
              NexPractice
            </h1>
            <div className="h-0.5 w-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-blue-900 dark:via-gray-700 dark:to-blue-900 rounded-full group-hover:animate-gradient-x"></div>
          </div>
          {/* Explore Nex button with modern explore icon */}
          <a
            href="/explore-nex"
            className="ml-2 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/80 dark:bg-neutral-800/80 border border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 font-normal hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-sm"
            style={{ fontSize: "0.92rem" }}
          >
            <Compass className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400 mr-1" />
            Explore Nex
          </a>
        </div>
      </div>

      {/* Center section: Run/Submit and Mobile Navigation Tabs */}
      <div className="hidden md:flex flex-1 items-center justify-center gap-3 mx-4 px-4 border-x border-indigo-100 dark:border-indigo-900/40 min-w-0">
        <Button
          size="sm"
          className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-sm gap-1 min-w-28 relative overflow-hidden group transition-all duration-200 hover:shadow-md"
          onClick={runCode}
          disabled={isRunning}
        >
          {isRunning ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600 animate-gradient-x"></div>
              <div className="relative z-10 flex items-center space-x-1">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                </span>
                <span className="text-sm font-medium text-white animate-pulse">
                  {loadingPhrase || "Processing..."}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-700 transition-all duration-300 group-hover:scale-105"></div>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20"></div>
              <span className="relative z-10 flex items-center">
                <Play className="h-4 w-4 mr-1.5" />
                Run Code
              </span>
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-800 dark:hover:text-indigo-200 transition-all duration-200 gap-1 min-w-28 relative overflow-hidden group"
          onClick={submitCode}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 via-purple-100 to-indigo-100 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-indigo-900/30 animate-gradient-x"></div>
              <div className="relative z-10 flex items-center space-x-1">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300 animate-pulse truncate max-w-24">
                  Submitting...
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-white to-slate-100 dark:from-slate-900 dark:to-slate-800/80 opacity-50 group-hover:opacity-80 transition-all duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-200/80 dark:bg-indigo-700/40 group-hover:bg-indigo-300 dark:group-hover:bg-indigo-600/40 transition-colors"></div>
              <span className="relative z-10 flex items-center">
                <Send className="h-4 w-4 mr-1.5" />
                Submit
              </span>
            </>
          )}
        </Button>
      </div>

      {/* Empty space for layout balance in mobile */}
      <div className="md:hidden w-16"></div>

      {/* Right section: Actions/Profile */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="hidden md:flex items-center gap-2 mr-2">
          {/* Random Challenge button with tooltip and animations */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/nexpractice/problem/random"
                  className="random-challenge-icon flex items-center justify-center rounded-lg h-7 w-7 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-neutral-900 dark:to-black border border-indigo-100 dark:border-indigo-900/50 hover:border-indigo-200 dark:hover:border-indigo-700 transition-colors group"
                  onClick={(e) => {
                    e.preventDefault();
                    const icon = e.currentTarget;
                    const mainContent = document.querySelector("main");

                    // Add loading animation to icon
                    icon.classList.add("loading");

                    // Add blur animation to background
                    if (mainContent) {
                      mainContent.classList.add("background-blur");
                    }

                    // Navigate after animation
                    setTimeout(() => {
                      window.location.href = "/nexpractice/problem/random";
                    }, 800);
                  }}
                >
                  <Shuffle className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 transition-transform group-hover:rotate-12" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Random Challenge</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {/* Back to Practice button */}
          <a
            href="/nexpractice"
            className="ml-2 flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow hover:scale-105 transition-all border border-indigo-200 dark:border-indigo-700/40"
            style={{ fontSize: "0.95rem" }}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to NexPractice
          </a>
          <Button
            variant="ghost"
            size="icon"
            className="ml-2 rounded-full hover:bg-indigo-100 dark:hover:bg-slate-800/60 focus:bg-indigo-200 dark:focus:bg-slate-700/80 border border-transparent focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors"
            onClick={handleFullscreenToggle}
            aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="h-5 w-5 text-indigo-700 dark:text-indigo-200" />
            ) : (
              <Maximize2 className="h-5 w-5 text-indigo-700 dark:text-indigo-200" />
            )}
          </Button>
          {/* Theme Switcher */}
          <ModeToggle />
        </div>

        {/* Profile Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center justify-center rounded-full overflow-hidden border-2 border-indigo-100 dark:border-indigo-800/50 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-medium relative overflow-hidden">
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt={session?.user?.name || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-semibold">
                    {session?.user?.name
                      ? session.user.name.charAt(0).toUpperCase()
                      : "U"}
                  </span>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-slate-900"></div>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-64 p-0 border-indigo-100 dark:border-indigo-900/50 shadow-lg rounded-xl overflow-hidden"
            align="end"
          >
            <div className="bg-gradient-to-r from-indigo-50 to-indigo-100/50 dark:from-indigo-900/30 dark:to-indigo-900/20 px-4 py-3 border-b border-indigo-100 dark:border-indigo-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold relative overflow-hidden">
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt={session?.user?.name || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>
                      {session?.user?.name
                        ? session.user.name.charAt(0).toUpperCase()
                        : "U"}
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">
                    {session?.user?.name || "Guest User"}
                  </div>
                  <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium flex items-center">
                    <Crown className="h-3 w-3 mr-1 text-amber-500" />
                    {session?.user?.role === "ADMIN" ? "Admin" : "Student"}
                  </div>
                </div>
              </div>
            </div>
            <div className="py-2">
              <div className="px-2">
                <a
                  href={
                    session?.user?.username
                      ? `/profile/${session.user.username}`
                      : "/profile"
                  }
                  className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-md transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                    <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <div className="font-medium">Your Profile</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      View and edit your details
                    </div>
                  </div>
                </a>
              </div>
              <div className="h-px bg-slate-200 dark:bg-slate-700/50 my-2"></div>
              <div className="px-2">
                <button className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 rounded-md transition-colors w-full text-left">
                  <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <LogOut className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <div className="font-medium">Sign Out</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Log out of your account
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};

export default Header;
