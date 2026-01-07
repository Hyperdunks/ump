"use client";

import { useState } from "react";
import {
  Activity,
  Plus,
  Moon,
  Sun,
  AlertCircle,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { useTheme } from "next-themes";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const MonitorDashboard = () => {
  const [activeTab, setActiveTab] = useState("monitors");
  const [bgPattern, setBgPattern] = useState<
    "vercel" | "dark" | "basic" | "hybrid" | "mesh"
  >("mesh");
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  // Mock data
  const monitors = [
    {
      id: 1,
      name: "API Gateway",
      url: "https://api.example.com",
      status: "up",
      uptime: 99.9,
      responseTime: 145,
      lastChecked: "30s ago",
    },
    {
      id: 2,
      name: "Web Application",
      url: "https://app.example.com",
      status: "up",
      uptime: 99.8,
      responseTime: 230,
      lastChecked: "45s ago",
    },
    {
      id: 3,
      name: "Database",
      url: "db.example.com:5432",
      status: "down",
      uptime: 98.2,
      responseTime: null,
      lastChecked: "2m ago",
    },
    {
      id: 4,
      name: "CDN Endpoint",
      url: "https://cdn.example.com",
      status: "up",
      uptime: 100,
      responseTime: 89,
      lastChecked: "15s ago",
    },
  ];

  const stats = {
    total: 4,
    up: 3,
    down: 1,
    avgResponse: 155,
  };

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
            <div className="grid grid-cols-4 gap-4 mb-8">
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

              <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border p-6 shadow-lg">
                <div className="text-3xl font-bold mb-2">
                  {stats.avgResponse}
                  <span className="text-sm text-muted-foreground ml-1">ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Avg Response
                  </span>
                  <Zap className="w-4 h-4 text-muted-foreground" />
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
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="text-left text-sm">
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">URL</th>
                    <th className="px-6 py-3 font-medium text-right">Uptime</th>
                    <th className="px-6 py-3 font-medium text-right">
                      Response Time
                    </th>
                    <th className="px-6 py-3 font-medium text-right">
                      Last Checked
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
                          className={`w-2 h-2 rounded-full ${monitor.status === "up" ? "bg-green-500" : "bg-red-500"}`}
                        />
                      </td>
                      <td className="px-6 py-4 font-medium">{monitor.name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {monitor.url}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {monitor.uptime}%
                      </td>
                      <td className="px-6 py-4 text-right">
                        {monitor.responseTime
                          ? `${monitor.responseTime}ms`
                          : "—"}
                      </td>
                      <td className="px-6 py-4 text-right text-muted-foreground text-sm">
                        {monitor.lastChecked}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
