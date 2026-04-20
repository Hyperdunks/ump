"use client";

import * as React from "react";
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "next-themes";

import { AnimatedBackground } from "@/components/ui/animated-background";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const { state } = useSidebar();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isCollapsed = state === "collapsed";

  const options = [
    { id: "system", label: "System", icon: Laptop },
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
  ];

  if (!mounted) {
    return (
      <div
        className={cn(
          "flex h-10 w-full items-center",
          isCollapsed ? "justify-center" : "px-2",
        )}
      >
        <div
          className={cn(
            "h-8 rounded-full bg-muted/50",
            isCollapsed ? "w-8" : "w-full",
          )}
        />
      </div>
    );
  }

  if (isCollapsed) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="w-full"
        onClick={() => {
          if (theme === "light") setTheme("dark");
          else if (theme === "dark") setTheme("system");
          else setTheme("light");
        }}
      >
        <Sun className="h-5 w-5 transition-all dark:hidden" />
        <Moon className="h-5 w-5 hidden dark:block transition-all" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <div className="flex items-center w-full px-2 py-1.5">
      <div className="flex w-full items-center rounded-full bg-muted p-0.5">
        <AnimatedBackground
          defaultValue={theme || "system"}
          onValueChange={(value) => {
            if (value) setTheme(value);
          }}
          className="rounded-full bg-background shadow-sm"
          transition={{
            type: "spring",
            bounce: 0.2,
            duration: 0.3,
          }}
        >
          {options.map((option) => (
            <button
              key={option.id}
              data-id={option.id}
              type="button"
              className={cn(
                "inline-flex flex-1 h-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground",
                theme === option.id && "text-foreground",
              )}
            >
              <div className="flex w-full items-center justify-center gap-1.5 whitespace-nowrap">
                <option.icon className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">{option.label}</span>
              </div>
            </button>
          ))}
        </AnimatedBackground>
      </div>
    </div>
  );
}
