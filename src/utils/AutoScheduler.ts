export interface ScheduledTask {
  id: string
  name: string
  cron: string
  action: () => void
  enabled: boolean
}

class AutoScheduler {
  private tasks: Map<string, ScheduledTask> = new Map()
  private intervals: Map<string, ReturnType<typeof setInterval>> = new Map()

  addTask(task: ScheduledTask) {
    this.tasks.set(task.id, task)
    if (task.enabled) {
      this.startTask(task.id)
    }
  }

  startTask(id: string) {
    const task = this.tasks.get(id)
    if (!task) return

    // Simple cron parsing for demo (e.g., "*/5 * * * *" = every 5 minutes)
    const minutes = this.parseCron(task.cron)
    const intervalMs = minutes * 60 * 1000

    const interval = setInterval(() => {
      try {
        task.action()
      } catch (e) {
        console.error(`Task ${task.name} failed:`, e)
      }
    }, intervalMs)

    this.intervals.set(id, interval)
  }

  stopTask(id: string) {
    const interval = this.intervals.get(id)
    if (interval) {
      clearInterval(interval)
      this.intervals.delete(id)
    }
  }

  removeTask(id: string) {
    this.stopTask(id)
    this.tasks.delete(id)
  }

  private parseCron(cron: string): number {
    // Simplified: assume */N format for minutes
    const match = cron.match(/^\*\/(\d+)$/)
    if (match) {
      return parseInt(match[1], 10)
    }
    return 5 // default 5 minutes
  }

  getTasks(): ScheduledTask[] {
    return Array.from(this.tasks.values())
  }
}

export const autoScheduler = new AutoScheduler()
