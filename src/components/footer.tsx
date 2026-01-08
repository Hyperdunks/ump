"use client";

import { Moon, Sun } from "lucide-react";

type FooterProps = {
  bgPattern: "vercel" | "dark" | "basic" | "hybrid" | "mesh";
  setBgPattern: (
    pattern: "vercel" | "dark" | "basic" | "hybrid" | "mesh",
  ) => void;
  statusColor: string;
  statusText: string;
  isDark: boolean;
  onThemeToggle: () => void;
};

export default function Footer({
  bgPattern,
  setBgPattern,
  statusColor,
  statusText,
  isDark,
  onThemeToggle,
}: FooterProps) {
  return (
    <footer className="px-6 py-3 mt-auto relative z-10 backdrop-blur-xl">
      {/* Blur gradient overlay on top */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />

      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left - Nav Links */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <button className="hover:text-foreground transition-colors">
            Monitors
          </button>
          <button className="hover:text-foreground transition-colors">
            Incidents
          </button>
          <button className="hover:text-foreground transition-colors">
            Alerts
          </button>
        </div>

        {/* Center - Pattern Toggle (only in dark mode) */}
        {isDark && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground mr-2">Pattern:</span>
            {(["vercel", "mesh", "hybrid", "basic", "dark"] as const).map(
              (pattern) => (
                <button
                  key={pattern}
                  onClick={() => setBgPattern(pattern)}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    bgPattern === pattern
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
                </button>
              ),
            )}
          </div>
        )}

        {/* Right - Status Badge + Theme */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border border-border/60 hover:bg-secondary/30 cursor-pointer transition-colors">
            <div
              className={`w-2 h-2 rounded-full ${
                statusColor === "blue"
                  ? "bg-blue-500"
                  : statusColor === "yellow"
                    ? "bg-yellow-500"
                    : "bg-red-500"
              }`}
            />
            <span
              className={
                statusColor === "blue"
                  ? "text-blue-500"
                  : statusColor === "yellow"
                    ? "text-yellow-500"
                    : "text-red-500"
              }
            >
              {statusText}
            </span>
          </div>

          <button
            onClick={onThemeToggle}
            className="p-2 rounded-md hover:bg-secondary/50 transition-colors"
          >
            {isDark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </footer>
  );
}
