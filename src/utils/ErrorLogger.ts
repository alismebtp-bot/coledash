type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

interface LoggedError {
  id: string;
  message: string;
  stack?: string;
  severity: ErrorSeverity;
  timestamp: string;
  userAgent: string;
  url: string;
  resolved: boolean;
}

class ErrorLoggerClass {
  private errors: LoggedError[] = [];
  private listeners: ((errors: LoggedError[]) => void)[] = [];

  init() {
    // Load from localStorage
    try {
      const saved = localStorage.getItem('coledash_errors');
      if (saved) {
        this.errors = JSON.parse(saved);
      }
    } catch {
      // Ignore parse errors
    }

    // Global error handler
    window.addEventListener('error', (event) => {
      this.log(event.error?.message || event.message, 'high', event.error?.stack);
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.log(String(event.reason), 'critical', event.reason?.stack);
    });
  }

  log(message: string, severity: ErrorSeverity = 'medium', stack?: string) {
    const error: LoggedError = {
      id: Math.random().toString(36).substring(2, 9),
      message,
      stack,
      severity,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      resolved: false,
    };

    this.errors.unshift(error);
    // Keep only last 100 errors
    if (this.errors.length > 100) {
      this.errors = this.errors.slice(0, 100);
    }

    // Save to localStorage
    try {
      localStorage.setItem('coledash_errors', JSON.stringify(this.errors));
    } catch {
      // Storage full
    }

    this.notifyListeners();
  }

  getErrors(): LoggedError[] {
    return [...this.errors];
  }

  resolveError(id: string) {
    const error = this.errors.find((e) => e.id === id);
    if (error) {
      error.resolved = true;
      localStorage.setItem('coledash_errors', JSON.stringify(this.errors));
      this.notifyListeners();
    }
  }

  clearErrors() {
    this.errors = [];
    localStorage.removeItem('coledash_errors');
    this.notifyListeners();
  }

  subscribe(listener: (errors: LoggedError[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.errors));
  }
}

export const errorLogger = new ErrorLoggerClass();
