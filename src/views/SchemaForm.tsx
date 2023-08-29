import CsvEditor from "../eas/components/CsvEditor";
import { SchemaField } from "../eas/types/schema-field.type";
import { SchemaPills } from "../eas/components/SchemaPills";
import { isSchemaFieldTypeName } from "../eas/utils/is-schema-field-type-name";
import { useEas } from "../eas/hooks/useEas";
import { useEffect } from "react";
import { useStateStore } from "../zustand/hooks/useStateStore";

export function SchemaFormView() {
  const { schemaRecord } = useEas();

  // Global state
  const csv = useStateStore((state) => state.csv);
  const csvError = useStateStore((state) => state.csvError);
  const editorCsv = useStateStore((state) => state.editorCsv);
  const showTransaction = useStateStore((state) => state.showTransaction);

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

  if (!schemaRecord) return null;

  const buttonDisabled =
    !csv || csv.length < 10 || typeof csvError !== "undefined";

  return (
    <>
      <h2>Attestation Data</h2>

      <p>
        Drop a csv file or paste data in the form below. In addition to the
        schema fields, you should also include the recipient field.
      </p>

      <SchemaPills />

      <CsvEditor
        csv={editorCsv}
        onChange={(csv) => useStateStore.setState({ csv })}
        onCsvError={(csvError) => useStateStore.setState({ csvError })}
      />

      {csvError && <div className="text-red-500">{csvError.message}</div>}

      <button
        className="btn"
        onClick={() =>
          useStateStore.setState({
            showTransaction: !showTransaction,
          })
        }
        disabled={buttonDisabled}
      >
        Submit
      </button>
    </>
  );
}
