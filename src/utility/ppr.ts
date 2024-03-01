export const screenForPPR = <T>(
  error: any,
  fallback: T,
  sourceToLog?: string,
): T => {
  // PPR errors, if caught, must be re-thrown in order to
  // postpone rendering

  if (error.sourceError?.message?.includes('ppr-caught-error')) {
    console.log(
      // eslint-disable-next-line max-len
      sourceToLog ? `screenForPPR A: ${sourceToLog}: PPR error caught` : 'PPR error caught',
      error,
    );
    throw error.sourceError;
  } else if (error.message?.includes('ppr-caught-error')) {
    console.log(
      // eslint-disable-next-line max-len
      sourceToLog ? `screenForPPR B: ${sourceToLog}: PPR error caught` : 'PPR error caught',
      error,
    );
    throw error;
  } else if (sourceToLog) {
    console.log(// eslint-disable-next-line max-len
      sourceToLog ? `screenForPPR C: ${sourceToLog}: PPR error caught` : 'PPR error caught',
      error
    );
  }

  return fallback;
};
