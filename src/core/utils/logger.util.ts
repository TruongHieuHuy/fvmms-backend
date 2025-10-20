export const logError = (message: string, error?: any) => {
  console.error(`[ERROR] ${message}`, error);
};

export const logInfo = (message: string) => {
  console.log(`[INFO] ${message}`);
};
