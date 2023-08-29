import {
  faCheckCircle,
  faPrayingHands,
} from "@fortawesome/free-solid-svg-icons";

import { ExecuteSafeTransactionStateType } from "../types/execute-safe-transaction-state.type";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ExecuteAttestationsButtonContentProps = {
  executeState?: ExecuteSafeTransactionStateType;
};

export function ExecuteAttestationsButtonContent({
  executeState,
}: ExecuteAttestationsButtonContentProps): JSX.Element {
  if (typeof executeState === "undefined" || executeState?.state === "error") {
    return <>Execute transaction</>;
  }

  if (executeState?.state === "executing") {
    return (
      <>
        <FontAwesomeIcon icon={faPrayingHands} spin className="w-4 mr-2" />
        Executing
      </>
    );
  }

  if (executeState?.state === "indexing") {
    return (
      <>
        <FontAwesomeIcon icon={faPrayingHands} spin className="w-4 mr-2" />
        Indexing
      </>
    );
  }

  if (executeState?.state === "executed") {
    return (
      <>
        <FontAwesomeIcon icon={faCheckCircle} className="w-4 mr-2" />
        Executed
      </>
    );
  }
  return <>Login to execute</>;
}
