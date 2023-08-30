import * as Monaco from "monaco-editor";

import { useEffect, useState } from "react";

import CsvEditor from "../src/components/CsvEditor";
import MonacoEditor from "react-monaco-editor";
import { SchemaField } from "../src/eas/types/schema-field.type";
import { ValidationError } from "../src/eas/types/validation-error.type";
import { parseCsvAndValidate } from "../src/eas/utils/parseCsvAndValidate";
import { useEas } from "../src/eas/hooks/useEas";

function initialInstructions(schema: SchemaField[]) {
  let instructions =
    "# Replace this content with your CSV data in the following format:\n\n";
  instructions += schema.map((field) => field.name).join(",") + "\n";
  instructions += "data, ...";
  return instructions;
}

type EditorType = Monaco.editor.IStandaloneCodeEditor | null;

type CsvEditorProps = {
  csv: string;
  onChange: (csvData: string) => void;
  onCsvError: (error?: Error) => void;
};

export function CsvEditor({ csv, onChange, onCsvError }: CsvEditorProps) {
  //Hooks
  const { schema } = useEas();

  //Local state
  const [csvErrors, setCsvErrors] = useState<ValidationError[]>([]);
  const [editorInstance, setEditorInstance] = useState<EditorType>(null);

  function setInitialInstructions() {
    if (!schema || csv) return; // Don't overwrite existing CSV data
    onChange(initialInstructions(schema));
  }

  function markValidationErrors() {
    if (!editorInstance) return;
    const model = editorInstance.getModel();
    if (!model) return;
    const monacoErrors: Monaco.editor.IMarkerData[] = csvErrors.map((error) => {
      // Calculate the end column based on the CSV content's length at the error position
      const lineContent = csv.split("\n")[error.line];
      const columnContent = lineContent.split(",")[error.column] || "";

      return {
        severity: Monaco.MarkerSeverity.Error,
        startLineNumber: error.line + 1,
        endLineNumber: error.line + 1,
        startColumn: lineContent.indexOf(columnContent) + 1,
        endColumn:
          lineContent.indexOf(columnContent) + columnContent.length + 1,
        message: error.error,
      };
    });
    Monaco.editor.setModelMarkers(model, "csv", monacoErrors);
  }

  function handleEditorChange(content: string) {
    if (!schema) return;
    onCsvError(undefined);
    onChange(content);

    try {
      const validationResults = parseCsvAndValidate(content, schema);
      const allErrors: ValidationError[] = [];
      validationResults.forEach((result) => {
        if (
          Array.isArray(result) &&
          result.length > 0 &&
          "error" in result[0]
        ) {
          allErrors.push(...result);
        }
      });
      if (allErrors.length > 0) {
        onCsvError(new Error("CSV contains errors."));
      }
      setCsvErrors(allErrors);
    } catch (e) {
      onCsvError(e as Error);
    }
  }

  useEffect(setInitialInstructions, [schema, csv, onChange]);
  useEffect(markValidationErrors, [csvErrors, editorInstance, csv]);

  return (
    <div className="flex flex-col items-center gap-5">
      <CsvEditor schema={schema} />
      <div className="p-5 border">
        <MonacoEditor
          width="800"
          height="400"
          language="plaintext"
          options={{
            minimap: { enabled: false },
            wordWrap: "off",
            quickSuggestions: false,
            suggestOnTriggerCharacters: false,
            acceptSuggestionOnEnter: "off",
            acceptSuggestionOnCommitCharacter: false,
            wordBasedSuggestions: false,
            snippetSuggestions: "none",
            roundedSelection: false,
            glyphMargin: false,
            folding: false,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 0,
            lightbulb: {
              enabled: false,
            },
            scrollbar: {
              useShadows: false,
              vertical: "visible",
              horizontal: "visible",
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
          }}
          value={csv}
          onChange={handleEditorChange}
          editorDidMount={(editor) => setEditorInstance(editor)}
        />
      </div>
    </div>
  );
}
