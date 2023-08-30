import { useEffect, useState } from "react";

import { AttestDialog } from "../components/AttestDialog";
import { Button } from "../components/ui/Button";
import CsvEditor from "../components/CsvEditor";
import { SchemaField } from "../eas/types/schema-field.type";
import { SchemaPills } from "../components/SchemaPills";
import { isSchemaFieldTypeName } from "../eas/utils/isSchemaFieldTypeName";
import { useEas } from "../eas/hooks/useEas";
import { useStateStore } from "../zustand/hooks/useStateStore";

export function CsvEditView() {
  const { schemaRecord, schemaRecordError, schemaError } = useEas();

  // Local state
  const [attestDialogOpen, setAttestDialogOpen] = useState(false);
  const [editorTouched, setEditorTouched] = useState(false);

  // Global state
  const csv = useStateStore((state) => state.csv);
  const csvError = useStateStore((state) => state.csvError);

  function addRecipientToSchema() {
    if (!schemaRecord) return;
    const schema: SchemaField[] = [];
    schemaRecord.schema.split(",").forEach((field) => {
      const [type, name] = field.split(" ");
      if (isSchemaFieldTypeName(type)) {
        schema.push({ name, type });
      }
    });
    schema.push({ name: "recipient", type: "address" });
    useStateStore.setState({ schema });
  }

  useEffect(addRecipientToSchema, [schemaRecord]);

  function handleEditorChange(csv: string) {
    useStateStore.setState({ csv });
    setEditorTouched(true);
  }

  if (!schemaRecord || schemaError || schemaRecordError) return null;

  const buttonDisabled =
    !editorTouched ||
    !csv ||
    csv.length < 10 ||
    typeof csvError !== "undefined" ||
    attestDialogOpen;

  return (
    <>
      <p className="text-center">
        Paste data or drop a csv file in the form below. In addition to the
        schema fields, you also need to include the recipient field.
      </p>

      <SchemaPills />

      <CsvEditor
        onChange={handleEditorChange}
        onCsvError={(csvError) => useStateStore.setState({ csvError })}
      />

      {csvError && <div className="text-red-500">{csvError.message}</div>}

      <Button
        onClick={() => setAttestDialogOpen(true)}
        disabled={buttonDisabled}
        className="mb-10"
      >
        Submit
      </Button>
      {attestDialogOpen && (
        <AttestDialog
          open={attestDialogOpen}
          close={() => setAttestDialogOpen(false)}
        />
      )}
    </>
  );
}
