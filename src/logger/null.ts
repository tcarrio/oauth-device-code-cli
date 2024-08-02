import type { Logger } from "./types";

export class NullLogger implements Logger {
  debug(...data: any[]): void {
    /* no-op */
  }
  error(...data: any[]): void {
    /* no-op */
  }
  info(...data: any[]): void {
    /* no-op */
  }
  trace(...data: any[]): void {
    /* no-op */
  }
  warn(...data: any[]): void {
    /* no-op */
  }
}
