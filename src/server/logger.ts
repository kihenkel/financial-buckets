const LOG_LEVEL = {
  verbose: 'verbose',
  info: 'info',
  warning: 'warn',
  error: 'error',
};
const logLevel = process.env.LOG_LEVEL ?? LOG_LEVEL.warning;
const shouldLogVerbose = logLevel === 'verbose';
const shouldLogInfo = logLevel === 'verbose' || logLevel === 'info';
const shouldLogWarn = logLevel === 'verbose' || logLevel === 'info' || logLevel === 'warn';

const logger = {
  verbose: (...args: any[]) => {
    if (shouldLogVerbose) {
      console.log('[Verbose]', ...args);
    }
  },
  info: (...args: any[]) => {
    if (shouldLogInfo) {
      console.log('[Info]', ...args);
    }
  },
  warning: (...args: any[]) => {
    if (shouldLogWarn) {
      console.warn('[Warning]', ...args);
    }
  },
  error: (...args: any[]) => {
    console.error('[Error]', ...args);
  },
};

export default logger;
