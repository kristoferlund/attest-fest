import {
  faCheckCircle,
  faPrayingHands,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SignSafeTransactionStateType } from "../types/sign-safe-transaction-state.type";

type SignAttestationsButtonContentProps = {
  signState?: SignSafeTransactionStateType;
};

export function SignAttestationsButtonContent({
  signState,
}: SignAttestationsButtonContentProps): JSX.Element {
  if (typeof signState === "undefined" || signState?.state === "error") {
    return <>Sign transaction</>;
  }

  if (signState?.state === "signing") {
    return (
      <>
        <FontAwesomeIcon icon={faPrayingHands} spin className="w-4 mr-2" />
        Signing
      </>
    );
  }

  if (signState?.state === "signed") {
    return (
      <>
        <FontAwesomeIcon icon={faCheckCircle} className="w-4 mr-2" />
        Signed
      </>
    );
  }
  return <>Login to sign</>;
}
