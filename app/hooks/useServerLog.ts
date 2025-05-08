/* eslint-disable @typescript-eslint/no-explicit-any */
export function useServerLog() {
  const logToServer = async (
    message: string,
    level: "error" | "info",
    context?: any
  ) => {
    if (process.env.NODE_ENV === "production") {
      try {
        await fetch("/api/logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, level, context }),
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        // Silencieux en prod
      }
    } else {
      // En dev, on log dans la console
      console[level](message, context);
    }
  };

  return {
    error: (message: string, context?: any) =>
      logToServer(message, "error", context),
    info: (message: string, context?: any) =>
      logToServer(message, "info", context),
  };
}
