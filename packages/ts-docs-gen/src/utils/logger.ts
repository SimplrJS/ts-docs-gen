import { LoggerBuilder, LoggerConfigurationBuilder, LogLevel } from "simplr-logger";

const LoggerConfiguration = new LoggerConfigurationBuilder()
    .SetDefaultLogLevel(LogLevel.Information)
    .Build();

export const Logger = new LoggerBuilder(LoggerConfiguration);

export namespace LoggerHelpers {
    /**
     * Returns string keys of LogLevel.
     */
    export function GetLogLevelKeys(): string[] {
        return Object.values(LogLevel).filter(x => typeof x === "string");
    }

    export function ParseLogLevelKey(key: string): LogLevel {
        const logLevelEnum = LogLevel as any as { [key: string]: number };

        if (logLevelEnum[key] == null) {
            throw `LogLevel ${key} was not found.`;
        }

        return logLevelEnum[key];
    }
}
