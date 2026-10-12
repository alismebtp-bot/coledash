import { useState, useEffect, useCallback } from "react";
import { Bug, X, Trash2, RefreshCw, AlertTriangle, CheckCircle, Info } from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: number;
  level: "info" | "warn" | "error" | "success";
  message: string;
  details?: string;
}

const levelIcons = {
  info: Info,
  warn: AlertTriangle,
  error: AlertTriangle,
  success: CheckCircle,
};

const levelColors = {
  info: "text-blue-500 bg-blue-50",
  warn: "text-amber-500 bg-amber-50",
  error: "text-red-500 bg-red-50",
  success: "text-emerald-500 bg-emerald-50",
};

export default function DebugTrigger() {
  const [open, setOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = useCallback((level: LogEntry["level"], message: string, details?: string) => {
    const entry: LogEntry = {
      id: Math.random().toString(36).slice(2),
      timestamp: Date.now(),
      level,
      message,
      details,
    };
    setLogs((prev) => [entry, ...prev].slice(0, 200));
  }, []);

  useEffect(() => {
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalLog = console.log;

    console.error = (...args: unknown[]) => {
      originalError.apply(console, args);
      addLog("error", args.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" "));
    };
    console.warn = (...args: unknown[]) => {
      originalWarn.apply(console, args);
      addLog("warn", args.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" "));
    };
    console.log = (...args: unknown[]) => {
      originalLog.apply(console, args);
      // Only capture logs that look like debug/info messages
      const msg = args.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" ");
      if (msg.includes("[DEBUG]") || msg.includes("[INFO]")) {
        addLog("info", msg);
      }
    };

    window.addEventListener("error", (e) => {
      addLog("error", e.message, e.filename);
    });
    window.addEventListener("unhandledrejection", (e) => {
      addLog("error", String(e.reason), "Unhandled Promise Rejection");
    });

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      console.log = originalLog;
    };
  }, [addLog]);

  const clearLogs = () => setLogs([]);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-white shadow-lg hover:bg-slate-700 transition-colors"
        title="Debug Console"
      >
        {open ? <X className="h-5 w-5" /> : <Bug className="h-5 w-5" />}
      </button>

      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-[480px] max-w-[calc(100vw-3rem)] rounded-xl border bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <Bug className="h-4 w-4 text-slate-500" />
              <h3 className="font-semibold text-slate-800">Debug Console</h3>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                {logs.length}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={clearLogs}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-red-500"
                title="Clear logs"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => window.location.reload()}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
                title="Refresh page"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto p-2">
            {logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                <Info className="h-8 w-8 mb-2" />
                <p className="text-sm">No logs yet</p>
              </div>
            ) : (
              logs.map((log) => {
                const Icon = levelIcons[log.level];
                return (
                  <div
                    key={log.id}
                    className="mb-1 rounded-lg border border-transparent p-2 hover:bg-slate-50"
                  >
                    <div className="flex items-start gap-2">
                      <div className={"rounded-md p-1 " + levelColors[log.level]}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-700">{log.message}</p>
                        {log.details && (
                          <p className="mt-0.5 text-[10px] text-slate-500 font-mono truncate">
                            {log.details}
                          </p>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 tabular-nums">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </>
  );
}
