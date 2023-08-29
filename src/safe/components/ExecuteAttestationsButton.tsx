import { ExecuteAttestationsButtonContent } from "./ExecuteAttestationsButtonContent";
import { ExecuteSafeTransactionStateType } from "../types/execute-safe-transaction-state.type";

type ExecuteAttestationsButtonProps = {
  executeState?: ExecuteSafeTransactionStateType;
  onClick?: () => void;
};

export function ExecuteAttestationsButton({
  executeState,
  onClick,
}: ExecuteAttestationsButtonProps): JSX.Element | null {
  const signButtonDisabled =
    executeState?.state === "executing" ||
    executeState?.state === "indexing" ||
    executeState?.state === "executed";

  return (
    <button
      className="py-0 ml-2"
      onClick={onClick}
      disabled={signButtonDisabled}
    >
      <ExecuteAttestationsButtonContent executeState={executeState} />
    </button>
  );
}
