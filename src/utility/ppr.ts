export const screenForPPR = <T>(
  error: any,
  fallback: T,
  sourceToLog?: string,
): T => {
  // PPR errors, if caught, must be re-thrown in order to
  // postpone rendering

  if (error.sourceError?.message?.includes('ppr-caught-error')) {
    console.log(
      sourceToLog ? `${sourceToLog}: PPR error caught` : 'PPR error caught',
      error.sourceError?.message,
    );
    throw error.sourceError.message;
  } else if (error.message?.includes('ppr-caught-error')) {
    console.log(
      sourceToLog ? `${sourceToLog}: PPR error caught` : 'PPR error caught',
      error.message,
    );
    throw error.message;
  } else if (sourceToLog) {
    console.error(sourceToLog, error);
  }

  return fallback;
};
