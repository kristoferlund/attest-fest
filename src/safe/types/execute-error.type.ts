export interface ExecuteError extends Error {
  code: string;
  method: string;
  reason: string;
  transaction: {
    data: string;
    from: string;
    to: string;
  };
}
