import {
  BaseEditor,
  Descendant,
  Editor,
  Node,
  Transforms,
  createEditor,
} from "slate";
import { Editable, ReactEditor, Slate, withReact } from "slate-react";
import { faCircleNotch, faFileImport } from "@fortawesome/free-solid-svg-icons";
import { lineColToSlatePoint, slatePointToLineCol } from "../slate/columns";
import { useCallback, useMemo, useRef, useState } from "react";

import { CsvEditorLeaf } from "./CsvEditorLeaf";
import { CsvText } from "../eas/types/editor-nodes.type";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SchemaField } from "../eas/types/schema-field.type";
import debounce from "lodash/debounce";
import { parseCsvAndValidate } from "../eas/utils/parseCsvAndValidate";
import { useCsvErrorStateStore } from "../zustand/hooks/useCsvErrorStateStore";
import { useEas } from "../eas/hooks/useEas";

// Make Slate play nicely with TS
declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Text: CsvText;
  }
}

/**
 * Serialize the Slate editor content to CSV, handling quotes and escaping.
 */
function serializeToCsv(nodes: Node[]): string {
  let content = "";
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (!("children" in node)) continue;
    let row = "";
    for (let j = 0; j < node.children.length; j++) {
      const cell = node.children[j];
      if ("text" in cell) {
        let text = cell.text;
        if (text.startsWith('"') && text.endsWith('"')) {
          text = text.slice(1, -1);
          text = text.replace(/"/g, '""');
          row += `"${text}"`;
          continue;
        }
        row += text;
      }
    }
    content += row + "\n";
  }

  return content;
}

/**
 * Keys that should not trigger content validation.
 */
const IGNORED_KEYS = [
  "Shift",
  "Control",
  "Alt",
  "Meta",
  "CapsLock",
  "Tab",
  ...Array.from({ length: 12 }, (_, i) => `F${i + 1}`),
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
];

type CsvEditorProps = {
  onChange: (csvData: string) => void;
  onCsvError: (error?: Error) => void;
};

export default function CsvEditor({ onChange, onCsvError }: CsvEditorProps) {
  const { schema } = useEas();
  // Local state
  const [isParsing, setIsParsing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hasContentChanged, setContentChanged] = useState(false);

  // Global state
  const editorErrorMessage = useCsvErrorStateStore(
    (state) => state.editorErrorMessage
  );

  // Slate editor instance
  const editor = useMemo(() => withReact(createEditor()), []);

  const updateCsvContent = (content: string, schemaData: SchemaField[]) => {
    const currentSelection = editor.selection;
    const lineCol = slatePointToLineCol(
      editor,
      currentSelection?.anchor.path,
      currentSelection?.anchor.offset
    );

    try {
      let csvHasErrors = false;
      const rows = parseCsvAndValidate(content, schemaData);
      Transforms.delete(editor, {
        at: {
          anchor: Editor.start(editor, []),
          focus: Editor.end(editor, []),
        },
      });
      editor.insertNodes(rows, { at: [0] });
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (!("children" in row)) continue;
        if (
          Array.isArray(row.children) &&
          row.children.filter((r) => (r as CsvText).text !== ",").length <
            schemaData.length
        ) {
          csvHasErrors = true;
          onCsvError(
            new Error(`Invalid CSV: Wrong number of columns, row: ${i + 1}`)
          );
        }
        for (let j = 0; j < row.children.length; j++) {
          const cell = row.children[j];
          if ("error" in cell && cell.error) {
            csvHasErrors = true;
            onCsvError(
              new Error("CSV contains errors, see error highlighting.")
            );
          }
        }
      }
      !csvHasErrors && onCsvError(undefined);

      if (lineCol) {
        const newPoint = lineColToSlatePoint(
          editor,
          lineCol.line,
          lineCol.column
        );
        if (newPoint) {
          const newSelection = {
            anchor: newPoint,
            focus: newPoint,
          };
          Transforms.select(editor, newSelection);
        }
      }
    } catch (error) {
      console.error(error);
      onCsvError(error as Error);
    }
    setIsParsing(false);
  };

  const debouncedUpdate = useRef(
    debounce((newValue: Descendant[], schemaData: SchemaField[]) => {
      updateCsvContent(serializeToCsv(newValue), schemaData);
    }, 500)
  ).current;

  const handleContentChange = useCallback(
    (newValue: Descendant[]) => {
      if (hasContentChanged && schema) {
        debouncedUpdate.cancel();
        onChange(serializeToCsv(newValue));
        debouncedUpdate(newValue, schema);
        setIsParsing(true);
        setContentChanged(false);
      }
      return newValue;
    },
    [debouncedUpdate, hasContentChanged, schema, onChange]
  );

  const handleKeyPress = (event: React.KeyboardEvent) => {
    const { key, ctrlKey, metaKey, altKey } = event;
    if (!(ctrlKey || metaKey || altKey || IGNORED_KEYS.includes(key))) {
      setContentChanged(true);
    }
  };

  const handleFileDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    if (!schema) return;
    const file = event.dataTransfer?.files?.[0];
    if (!file) return;

    setIsParsing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileContent = e.target?.result as string;
      updateCsvContent(fileContent, schema);
    };
    reader.readAsText(file);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDragEnter = () => {
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const editorInitialValue: Descendant[] = [
    {
      children: [{ type: "value", text: "" }],
    },
  ];

  if (!schema) return null;

  return (
    <div
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDrop={handleFileDrop}
      className="relative w-full"
    >
      {editorErrorMessage && (
        <div className="absolute z-10 p-5 transform -translate-x-1/2 -translate-y-1/2 bg-opacity-70 text-theme1 bg-theme4 left-1/2 top-1/2">
          {editorErrorMessage}
        </div>
      )}
      <Slate
        editor={editor}
        initialValue={editorInitialValue}
        onChange={handleContentChange}
      >
        {isParsing && (
          <FontAwesomeIcon
            icon={faCircleNotch}
            spin
            className="absolute top-0 right-0 z-10 p-5 bg-opacity-50 rounded-full"
            size="2x"
          />
        )}

        {isDragging && (
          <div
            className="absolute z-10 w-full bg-black bg-opacity-10"
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
          >
            <div className="flex items-center justify-center h-[300px]">
              <FontAwesomeIcon icon={faFileImport} size="2x" />
            </div>
          </div>
        )}

        <Editable
          renderLeaf={CsvEditorLeaf}
          onKeyDown={handleKeyPress}
          onPaste={() => setContentChanged(true)}
          className="border-2 border-theme4 rounded-xl bg-theme1 w-full h-[300px] p-5 overflow-auto focus:border-b-2 focus:outline-none caret-theme4 focus:bg-theme2"
          spellCheck={false}
        />
      </Slate>
    </div>
  );
}
