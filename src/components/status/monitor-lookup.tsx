"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function MonitorLookup() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setIsLoading(true);
    let id = trimmed;
    try {
      if (id.includes("/status/")) {
        const url = new URL(id, window.location.origin);
        const parts = url.pathname.split("/status/");
        if (parts.length > 1) {
          id = parts[1].split("/")[0];
        }
      }
    } catch (err) {
      // Ignore URL parsing errors and just use the raw string
    }

    router.push(`/status/${encodeURIComponent(id)}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm items-center space-x-2"
    >
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Enter monitor ID or URL..."
          className="pl-8 bg-background"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <Button type="submit" disabled={isLoading || !query.trim()}>
        {isLoading ? "Looking up..." : "Lookup"}
      </Button>
    </form>
  );
}
