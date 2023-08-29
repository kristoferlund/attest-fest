import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrayingHands } from "@fortawesome/free-solid-svg-icons";
import { useEas } from "../eas/hooks/useEas";
import { useSafe } from "../safe/hooks/useSafe";
import { useStateStore } from "../zustand/hooks/useStateStore";

export function CreateTransactionView() {
  const { owners, threshold } = useSafe();
  const { createAttestationsTransaction, safeTransactionState } = useEas();

  // Global state
  const showTransaction = useStateStore((state) => state.showTransaction);
  const csv = useStateStore((state) => state.csv);

  return (
    <>
      <div className="text-center">
        This transaction requires the signature of:
        <br />
        <strong>{threshold}</strong> out of{" "}
        <strong>{owners.length} owners</strong>.
      </div>
      <div className="p-10 text-center bg-opacity-20 bg-themecolor-alt-2">
        Submit to create and sign this transaction.
      </div>
      <div className="flex justify-center gap-5 mt-5">
        <button
          className="btn"
          onClick={() =>
            useStateStore.setState({
              showTransaction: !showTransaction,
            })
          }
        >
          Back
        </button>

        <button
          onClick={() => {
            createAttestationsTransaction && createAttestationsTransaction(csv);
          }}
          disabled={
            safeTransactionState?.status === "creating" ||
            safeTransactionState?.status === "created"
          }
        >
          {safeTransactionState?.status === "creating" ? (
            <>
              <FontAwesomeIcon
                icon={faPrayingHands}
                className="w-4 mr-2"
                spin
              />
              Creating...
            </>
          ) : (
            <>
              {safeTransactionState?.status === "created"
                ? "Created"
                : "Submit"}
            </>
          )}
        </button>
      </div>
    </>
  );
}
