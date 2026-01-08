"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import useClickOutside from "@/hooks/useClickOutside";

const transition = {
  type: "spring",
  bounce: 0.1,
  duration: 0.2,
};

function SearchButton({
  children,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  return (
    <button
      className="relative flex h-9 w-9 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 active:scale-[0.98]"
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

export default function DynamicSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => {
    setIsOpen(false);
  });

  return (
    <motion.div variants={{ transition }}>
      <div ref={containerRef}>
        <div className="h-full w-full rounded-md  bg-card">
          <motion.div
            animate={{
              width: isOpen ? "300px" : "48px",
            }}
            initial={false}
          >
            <div className="overflow-hidden p-1.5">
              {!isOpen ? (
                <SearchButton
                  onClick={() => setIsOpen(true)}
                  ariaLabel="Search"
                >
                  <Search className="h-4 w-4" />
                </SearchButton>
              ) : (
                <div className="flex space-x-2">
                  <div className="relative w-full">
                    <input
                      className="h-9 w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground placeholder-muted-foreground focus:outline-hidden focus:border-ring transition-colors"
                      autoFocus
                      placeholder="Search..."
                    />
                  </div>
                  <SearchButton
                    onClick={() => setIsOpen(false)}
                    ariaLabel="Close"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </SearchButton>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
