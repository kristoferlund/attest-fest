import { AttestDialog } from "../components/AttestDialog";
import { AttestDialogEoa } from "../components/AttestDialogEoa";
import { Button } from "../components/ui/Button";
import CsvEditor from "../components/CsvEditor";
import { SchemaPills } from "../components/SchemaPills";
import { useAccount } from "wagmi";
import { useEas } from "../eas/hooks/useEas";
import { useState } from "react";
import { useStateStore } from "../zustand/hooks/useStateStore";

export function CsvEditView() {
  const { schemaRecord, schemaRecordError, schemaError, resetTransactions } =
    useEas();
  const { address } = useAccount();

  // Local state
  const [attestDialogOpen, setAttestDialogOpen] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);

  // Global state
  const csv = useStateStore((state) => state.csv);
  const csvError = useStateStore((state) => state.csvError);
  const selectedWalletAddress = useStateStore(
    (state) => state.selectedWalletAddress
  );

  function handleEditorChange(csv: string) {
    useStateStore.setState({ csv });
    setSubmitDisabled(true);
    setTimeout(() => setSubmitDisabled(false), 1500);
  }

  if (!schemaRecord || schemaError || schemaRecordError) return null;

  const buttonDisabled =
    submitDisabled ||
    !csv ||
    csv.length < 10 ||
    typeof csvError !== "undefined" ||
    attestDialogOpen;

  const isSafeAddress = selectedWalletAddress !== address;

  return (
    <>
      <SchemaPills />

      <p className="leading-loose text-center">
        Paste data or drop a csv file in the form below. In addition to the
        schema fields, you also need to include the recipient field for every
        row.
      </p>

      <CsvEditor
        onChange={handleEditorChange}
        onCsvError={(csvError) => useStateStore.setState({ csvError })}
      />

      {csvError && <div className="text-red-500">{csvError.message}</div>}

      <Button
        onClick={() => {
          resetTransactions?.();
          setAttestDialogOpen(true);
        }}
        disabled={buttonDisabled}
        className="mb-10"
      >
        Submit
      </Button>
      {attestDialogOpen &&
        (isSafeAddress ? (
          <AttestDialog
            open={attestDialogOpen}
            close={() => setAttestDialogOpen(false)}
          />
        ) : (
          <AttestDialogEoa
            open={attestDialogOpen}
            close={() => setAttestDialogOpen(false)}
          />
        ))}
    </>
  );
}
