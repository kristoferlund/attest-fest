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
import { useCallback, useMemo, useRef, useState } from "react";

import { CsvEditorLeaf } from "./CsvEditorLeaf";
import { CsvText } from "../types/editor-nodes.type";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SchemaField } from "../types/schema-field.type";
import debounce from "lodash/debounce";
import { parseCsvAndValidate } from "../utils/parseCsvAndValidate";
import { useStateStore } from "../../zustand/hooks/useStateStore";

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Text: CsvText;
  }
}

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
  // csv: string;
  onChange: (csvData: string) => void;
  onCsvError: (error?: Error) => void;
};

const CsvEditor = ({ onChange, onCsvError }: CsvEditorProps) => {
  // Local state
  const [isParsing, setIsParsing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hasContentChanged, setContentChanged] = useState(false);

  // Global state
  const schema = useStateStore((state) => state.schema);

  // Slate editor instance
  const editor = useMemo(() => withReact(createEditor()), []);

  const updateCsvContent = (content: string, schemaData: SchemaField[]) => {
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
        console.log(
          row.children.filter((r) => (r as CsvText).text !== ",").length
        );
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
    } catch (error) {
      console.error(error);
      onCsvError(error as Error);
    }
    setIsParsing(false);
  };

  const debouncedUpdate = useRef(
    debounce((newValue: Descendant[], schemaData: SchemaField[]) => {
      updateCsvContent(serializeToCsv(newValue), schemaData);
    }, 1500)
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
      className="relative flex flex-col items-center justify-center gap-5"
    >
      <Slate
        editor={editor}
        initialValue={editorInitialValue}
        onChange={handleContentChange}
      >
        {isParsing && (
          <FontAwesomeIcon
            icon={faCircleNotch}
            spin
            className="absolute top-0 right-0 p-5"
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
          className="border-2 border-gray-300 w-[800px] h-[300px] p-5 overflow-auto"
          spellCheck={false}
        />
      </Slate>
    </div>
  );
};

export default CsvEditor;
