export interface Logger {
  debug(...data: any[]): void;
  error(...data: any[]): void;
  info(...data: any[]): void;
  trace(...data: any[]): void;
  warn(...data: any[]): void;
}

export type LogLevelType = typeof LogLevel;
export const LogLevel = {
  Trace: 100,
  Debug: 75,
  Info: 50,
  Warn: 25,
  Error: 0,
} as const;
