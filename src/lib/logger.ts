// src/lib/logger.ts

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

class Logger {
  private log(level: LogLevel, message: string, meta?: any) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(meta && { meta }),
      environment: process.env.NODE_ENV,
    }

    if (process.env.NODE_ENV === 'production') {
      // Production: An Logging Service senden
      console.log(JSON.stringify(logEntry))
    } else {
      // Development: Farbige Ausgabe
      const colors = {
        info: '\x1b[32m', // grün
        warn: '\x1b[33m', // gelb
        error: '\x1b[31m', // rot
        debug: '\x1b[36m', // cyan
      }
      console.log(`${colors[level]}${level.toUpperCase()}:`, message, meta || '')
    }
  }

  info(message: string, meta?: any) {
    this.log('info', message, meta)
  }

  warn(message: string, meta?: any) {
    this.log('warn', message, meta)
  }

  error(message: string, meta?: any) {
    this.log('error', message, meta)
  }

  debug(message: string, meta?: any) {
    if (process.env.NODE_ENV !== 'production') {
      this.log('debug', message, meta)
    }
  }
}

export const logger = new Logger()