import { useState } from 'react'
import { Bug, BugOff, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { ErrorLogger } from '@/utils/ErrorLogger'
import { AIDebugEngineer } from '@/utils/AIDebugEngineer'

export default function DebugTrigger() {
  const [open, setOpen] = useState(false)
  const [logs, setLogs] = useState(ErrorLogger.getLogs())
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<string | null>(null)

  const handleAnalyze = async () => {
    setAnalyzing(true)
    const result = await AIDebugEngineer.analyze(logs)
    setAnalysis(result)
    setAnalyzing(false)
  }

  const handleClear = () => {
    ErrorLogger.clear()
    setLogs([])
    setAnalysis(null)
  }

  const hasErrors = logs.some((l) => l.level === 'error')

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => {
          setLogs(ErrorLogger.getLogs())
          setOpen(true)
        }}
      >
        {hasErrors ? (
          <AlertTriangle className="h-4 w-4 text-destructive" />
        ) : (
          <Bug className="h-4 w-4" />
        )}
        {hasErrors && (
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-destructive" />
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bug className="h-5 w-5" />
              Debug Console
            </DialogTitle>
            <DialogDescription>
              {logs.length} log entries. {hasErrors ? 'Errors detected.' : 'No errors.'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleAnalyze}
              disabled={analyzing || logs.length === 0}
            >
              {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              AI Analyze
            </Button>
            <Button size="sm" variant="outline" onClick={handleClear}>
              <BugOff className="h-4 w-4" />
              Clear
            </Button>
          </div>

          {analysis && (
            <div className="rounded-lg border bg-muted p-3 text-sm">
              <div className="font-medium mb-1">AI Analysis</div>
              <div className="text-muted-foreground whitespace-pre-wrap">{analysis}</div>
            </div>
          )}

          <ScrollArea className="h-[250px] rounded-md border">
            <div className="p-3 space-y-2">
              {logs.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-8">No logs yet</div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="text-xs font-mono border-b pb-2 last:border-0">
                    <div className="flex items-center gap-2">
                      <Badge variant={log.level === 'error' ? 'destructive' : log.level === 'warn' ? 'secondary' : 'outline'}>
                        {log.level}
                      </Badge>
                      <span className="text-muted-foreground">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="mt-1">{log.message}</div>
                    {log.stack && <div className="text-muted-foreground mt-1">{log.stack}</div>}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}
