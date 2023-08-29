import { SignAttestationsButtonContent } from "./SignAttestationsButtonContent";
import { SignSafeTransactionStateType } from "../types/sign-safe-transaction-state.type";

type SignAttestationsButtonProps = {
  signState?: SignSafeTransactionStateType;
  onClick?: () => void;
};

export function SignAttestationsButton({
  signState,
  onClick,
}: SignAttestationsButtonProps): JSX.Element | null {
  const signButtonDisabled =
    signState?.state === "signing" || signState?.state === "signed";

  return (
    <button
      className="py-0 ml-2"
      onClick={onClick}
      disabled={signButtonDisabled}
    >
      <SignAttestationsButtonContent signState={signState} />
    </button>
  );
}
