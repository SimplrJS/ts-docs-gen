import { LoggerBuilder, LoggerConfigurationBuilder, LogLevel } from "simplr-logger";

const LoggerConfiguration = new LoggerConfigurationBuilder()
    .SetDefaultLogLevel(LogLevel.Trace)
    .Build();

export const Logger = new LoggerBuilder(LoggerConfiguration);
