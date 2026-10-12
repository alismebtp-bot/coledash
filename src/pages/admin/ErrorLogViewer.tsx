import { useState } from 'react'
import { AlertTriangle, Trash2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ErrorLogger } from '@/utils/ErrorLogger'

export default function ErrorLogViewer() {
  const [logs, setLogs] = useState(ErrorLogger.getLogs())

  const handleClear = () => {
    ErrorLogger.clear()
    setLogs([])
  }

  const handleRefresh = () => {
    setLogs(ErrorLogger.getLogs())
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Error Logs</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="destructive" size="sm" onClick={handleClear}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Log Entries ({logs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            {logs.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                No error logs found
              </div>
            ) : (
              <div className="space-y-2">
                {logs.map((log, i) => (
                  <div key={i} className="border rounded-lg p-3 text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={log.level === 'error' ? 'destructive' : 'secondary'}>
                        {log.level}
                      </Badge>
                      <span className="text-muted-foreground text-xs">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="font-mono">{log.message}</div>
                    {log.stack && (
                      <div className="mt-2 text-xs text-muted-foreground font-mono bg-muted p-2 rounded overflow-auto">
                        {log.stack}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
