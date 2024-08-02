import type { EnumValue } from "$lib/enum";
import { LogLevel, type Logger, type LogLevelType } from "./types";

export abstract class WrappedLogger {
  constructor(
    private readonly instance: Logger,
    private readonly logLevel: EnumValue<LogLevelType> = LogLevel.Info,
  ) {}

  trace(...data: any[]): void {
    if (this.logLevel >= LogLevel.Trace) {
      this.instance.trace(...data);
    }
  }
  debug(...data: any[]): void {
    if (this.logLevel >= LogLevel.Debug) {
      this.instance.debug(...data);
    }
  }
  info(...data: any[]): void {
    if (this.logLevel >= LogLevel.Info) {
      this.instance.info(...data);
    }
  }
  warn(...data: any[]): void {
    if (this.logLevel >= LogLevel.Warn) {
      this.instance.warn(...data);
    }
  }
  error(...data: any[]): void {
    if (this.logLevel >= LogLevel.Error) {
      this.instance.error(...data);
    }
  }
}
