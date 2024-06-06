export function formatErrorMessage(error: unknown): string {
  if (error && typeof error === "object") {
    if (
      "info" in error &&
      error.info &&
      typeof error.info === "object" &&
      "error" in error.info &&
      error.info.error &&
      typeof error.info.error === "object" &&
      "message" in error.info.error &&
      typeof error.info.error.message === "string"
    ) {
      return error.info.error.message;
    }
    if ("shortMessage" in error && typeof error.shortMessage === "string") {
      return error.shortMessage;
    }
  }
  return "Unknown error";
}
