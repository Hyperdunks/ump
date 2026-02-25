"use client";

import { UserButton } from "@daveyplate/better-auth-ui";
import { Activity } from "lucide-react";
import DynamicSearch from "./dynamic-search";
import { AnimatedBackground } from "./ui/animated-background";

type NavbarProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  return (
    <nav className="relative z-10 px-4 py-3 sm:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-lg">
          {/* Logo */}
          <Activity className="w-5 h-5" />
        </div>

        {/* Nav Links + Search + UserButton */}
        <div className="flex items-center gap-2 sm:gap-3">
          <DynamicSearch />
          <AnimatedBackground
            defaultValue={activeTab}
            onValueChange={(value) => value && onTabChange(value)}
            className="bg-secondary rounded-md"
            transition={{
              type: "spring",
              bounce: 0.2,
              duration: 0.3,
            }}
          >
            {["monitors", "incidents", "alerts"].map((tab) => (
              <button
                key={tab}
                data-id={tab}
                className="px-4 py-2 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:text-foreground data-[checked=true]:text-secondary-foreground"
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </AnimatedBackground>

          <UserButton side="bottom" align="end" size="icon" />
        </div>
      </div>
    </nav>
  );
}
