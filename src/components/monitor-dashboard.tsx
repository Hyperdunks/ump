"use client";

import { useState, useMemo } from "react";
import {
  Activity,
  Plus,
  AlertCircle,
  CheckCircle2,
  ServerCrash,
  Inbox,
} from "lucide-react";
import { useTheme } from "next-themes";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useMonitors } from "@/hooks/api/use-monitors";
import { useIncidents } from "@/hooks/api/use-incidents";
import { Skeleton } from "@/components/ui/skeleton";

const MonitorDashboard = () => {
  const [activeTab, setActiveTab] = useState("monitors");
  const [bgPattern, setBgPattern] = useState<
    "vercel" | "dark" | "basic" | "hybrid" | "mesh"
  >("mesh");
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  // Fetch real data from API
  const {
    data: monitorsData,
    isLoading: monitorsLoading,
    error: monitorsError,
  } = useMonitors();

  const {
    data: incidentsData,
    isLoading: incidentsLoading,
    error: incidentsError,
  } = useIncidents();

  // Extract monitors array from API response
  const monitors = monitorsData?.data ?? [];

  // Compute stats from real data
  const stats = useMemo(() => {
    if (!monitors.length) {
      return { total: 0, up: 0, down: 0 };
    }

    const upCount = monitors.filter((m) => m.isActive).length;
    const downCount = monitors.filter((m) => !m.isActive).length;

    return {
      total: monitors.length,
      up: upCount,
      down: downCount,
    };
  }, [monitors]);

  const statusColor =
    stats.down > 1 ? "red" : stats.down === 1 ? "yellow" : "blue";
  const statusText =
    stats.down > 1
      ? `${stats.down} monitors down`
      : stats.down === 1
        ? "1 monitor down"
        : "All systems normal";

  // Background patterns
  const patterns = {
    vercel: {
      backgroundImage: `
        linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
      `,
      backgroundSize: "60px 60px",
      opacity: "opacity-30",
    },
    dark: {
      backgroundImage: `
        linear-gradient(to right, #262626 1px, transparent 1px),
        linear-gradient(to bottom, #262626 1px, transparent 1px)
      `,
      backgroundSize: "20px 20px",
      opacity: "",
    },
    basic: {
      backgroundImage: `
        linear-gradient(to right, rgba(75, 85, 99, 0.4) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(75, 85, 99, 0.4) 1px, transparent 1px)
      `,
      backgroundSize: "40px 40px",
      opacity: "",
    },
    hybrid: {
      backgroundImage: `
        linear-gradient(to right, rgba(75, 85, 99, 0.3) 1px, transparent 0.5px),
        linear-gradient(to bottom, rgba(75, 85, 99, 0.3) 1px, transparent 0.5px)
      `,
      backgroundSize: "60px 60px",
      opacity: "20",
    },
    mesh: {
      backgroundImage: `
        radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(74, 222, 128, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 40% 20%, rgba(251, 146, 60, 0.06) 0%, transparent 50%),
        linear-gradient(to right, rgba(75, 85, 99, 0.08) 0.5px, transparent 0.5px),
        linear-gradient(to bottom, rgba(75, 85, 99, 0.08) 0.5px, transparent 0.5px)
      `,
      backgroundSize:
        "100% 100%, 100% 100%, 100% 100%, 100px 100px, 100px 100px",
      opacity: "",
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative font-sans">
      {/* Background Pattern */}
      {isDark && (
        <div
          className={`absolute inset-0 z-0 ${patterns[bgPattern].opacity}`}
          style={{
            backgroundImage: patterns[bgPattern].backgroundImage,
            backgroundSize: patterns[bgPattern].backgroundSize,
          }}
        />
      )}

      {/* Top Nav */}
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 px-6 py-8 max-w-7xl mx-auto w-full relative z-10">
        {activeTab === "monitors" && (
          <>
            {/* Chart at Top */}
            <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border p-6 mb-8 shadow-lg">
              <div className="h-64 flex items-center justify-center text-muted-foreground text-sm mb-4">
                [shadcn area chart goes here]
              </div>
              <h3 className="text-sm font-medium">Uptime Last 24h</h3>
            </div>

            {/* Stats Cards Below Chart */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border p-6 shadow-lg">
                <div className="text-3xl font-bold mb-2">{stats.total}</div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total Monitors
                  </span>
                  <Activity className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border p-6 shadow-lg">
                <div className="text-3xl font-bold text-green-500 mb-2">
                  {stats.up}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Up</span>
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </div>
              </div>

              <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border p-6 shadow-lg">
                <div className="text-3xl font-bold text-red-500 mb-2">
                  {stats.down}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Down</span>
                  <AlertCircle className="w-4 h-4 text-red-500" />
                </div>
              </div>
            </div>

            {/* Monitor Table */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Monitors</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 shadow-lg">
                <Plus className="w-4 h-4" />
                Add Monitor
              </button>
            </div>

            <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border overflow-hidden shadow-lg">
              {/* Error State */}
              {monitorsError && (
                <div className="p-12 text-center">
                  <ServerCrash className="w-12 h-12 mx-auto mb-4 text-destructive" />
                  <h3 className="text-lg font-semibold mb-2">
                    Failed to load monitors
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Please check your connection and try again.
                  </p>
                </div>
              )}

              {/* Loading State */}
              {monitorsLoading && !monitorsError && (
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr className="text-left text-sm">
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium">Name</th>
                      <th className="px-6 py-3 font-medium">URL</th>
                      <th className="px-6 py-3 font-medium text-right">Type</th>
                      <th className="px-6 py-3 font-medium text-right">
                        Interval
                      </th>
                      <th className="px-6 py-3 font-medium text-right">
                        Updated
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4].map((i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="px-6 py-4">
                          <Skeleton className="w-2 h-2 rounded-full" />
                        </td>
                        <td className="px-6 py-4">
                          <Skeleton className="h-4 w-32" />
                        </td>
                        <td className="px-6 py-4">
                          <Skeleton className="h-4 w-48" />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Skeleton className="h-4 w-12 ml-auto" />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Skeleton className="h-4 w-16 ml-auto" />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Skeleton className="h-4 w-20 ml-auto" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Empty State */}
              {!monitorsLoading && !monitorsError && monitors.length === 0 && (
                <div className="p-12 text-center">
                  <Inbox className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">
                    No monitors yet
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create your first monitor to start tracking uptime.
                  </p>
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 shadow-lg">
                    <Plus className="w-4 h-4" />
                    Add Monitor
                  </button>
                </div>
              )}

              {/* Monitors Table */}
              {!monitorsLoading && !monitorsError && monitors.length > 0 && (
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr className="text-left text-sm">
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium">Name</th>
                      <th className="px-6 py-3 font-medium">URL</th>
                      <th className="px-6 py-3 font-medium text-right">Type</th>
                      <th className="px-6 py-3 font-medium text-right">
                        Interval
                      </th>
                      <th className="px-6 py-3 font-medium text-right">
                        Updated
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {monitors.map((monitor) => (
                      <tr
                        key={monitor.id}
                        className="border-t border-border hover:bg-muted/30 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div
                            className={`w-2 h-2 rounded-full ${monitor.isActive ? "bg-green-500" : "bg-red-500"}`}
                          />
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {monitor.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {monitor.url}
                        </td>
                        <td className="px-6 py-4 text-right text-sm uppercase">
                          {monitor.type}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {monitor.checkInterval}s
                        </td>
                        <td className="px-6 py-4 text-right text-muted-foreground text-sm">
                          {new Date(monitor.updatedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {activeTab === "incidents" && (
          <div className="text-center py-20 text-muted-foreground">
            Incidents page
          </div>
        )}

        {activeTab === "alerts" && (
          <div className="text-center py-20 text-muted-foreground">
            Alerts page
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        bgPattern={bgPattern}
        setBgPattern={setBgPattern}
        statusColor={statusColor}
        statusText={statusText}
        isDark={isDark}
        onThemeToggle={() => setTheme(isDark ? "light" : "dark")}
      />
    </div>
  );
};

export default MonitorDashboard;
