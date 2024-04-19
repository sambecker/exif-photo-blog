export const screenForPPR = <T>(
  error: any,
  fallback: T,
  sourceToLog?: string,
  debug?: boolean
): T => {
  // PPR errors, if caught, must be re-thrown in order to
  // postpone rendering
  if (error.sourceError?.message?.includes('ppr-caught-error')) {
    if (debug) {
      console.log(`${sourceToLog}: throwing error.sourceError`);
    }
    throw error.sourceError;
  } else if (error.message?.includes('ppr-caught-error')) {
    if (debug) {
      console.log(`${sourceToLog}: throwing error`);
    }
    throw error;
  }
  return fallback;
};
