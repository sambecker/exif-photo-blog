export const screenForPPR = <T>(
  error: any,
  fallback: T,
  sourceToLog?: string,
): T => {
  if (/ppr-caught-error/.test(error.message) && error.sourceError) {
    // PPR errors, if caught, must be re-thrown in order to
    // postpone rendering
    console.log(
      sourceToLog ? `${sourceToLog}: PPR error caught` : 'PPR error caught',
      error.sourceError,
    );
    throw error.sourceError;
  } else if (sourceToLog) {
    console.error(sourceToLog, error.message);
  }
  return fallback;
};

