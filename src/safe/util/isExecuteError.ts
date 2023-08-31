import { ExecuteError } from "../types/execute-error.type";

export function isExecuteError(obj: unknown): obj is ExecuteError {
  return typeof obj === "object" && obj !== null && "transaction" in obj;
}
