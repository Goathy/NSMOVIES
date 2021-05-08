export const Logger = () => {
  const getTime = () => new Date().toISOString();

  return {
    error: (...args: string[]) =>
      console.error('\x1b[31m%s\x1b[0m', getTime(), ' Error:', '\x1b[0m', ...args),

    warn: (...args: string[]) =>
      console.warn('\x1b[33m%s\x1b[0m', getTime(), ' Warn:', '\x1b[0m', ...args),

    debug: (...args: string[]) =>
      console.info('\x1b[34m%s\x1b[0m', getTime(), ' Debug:', '\x1b[0m', ...args),

    verbose: (...args: string[]) =>
      console.info('\x1b[35m%s\x1b[0m', getTime(), ' Verbose:', '\x1b[0m', ...args),
  };
};

export const logger = Logger();
