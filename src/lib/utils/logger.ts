import { createLogger, format, transports } from 'winston';

const { combine, label, printf } = format;

enum LogLevelColors {
    debug = '\x1b[36m',
    info = '\x1b[32m',
    warn = '\x1b[33m',
    error = '\x1b[31m',
    reset = '\x1b[0m',
}

const myFormat = printf(({ level, message, label }) => {
    return `[${label}] ${LogLevelColors[level]}${level}${LogLevelColors['reset']}: ${message}`;
});

export const logger = createLogger({
    level: 'debug',
    format: combine(label({ label: 'mockpox' }), myFormat),
    transports: [new transports.Console()],
});
