import { CsvComma, CsvText } from "../types/editor-nodes.type";

import { Descendant } from "slate";
import { SchemaField } from "../types/schema-field.type";
import { parse } from "csv-parse/sync";
import { validateEditorValue } from "./validateEditorValue";

export function parseCsvAndValidate(
  csvData: string,
  schema: SchemaField[]
): Descendant[] {
  const resRoot: Descendant[] = [];

  if (!csvData) return [{ children: resRoot }];

  const rows: string[][] = parse(csvData, {
    relax_column_count: true,
    relax_quotes: true,
    trim: true,
  });

  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex];
    const resRow: (CsvText | CsvComma)[] = [];

    // Skip empty rows
    if (row.length === 1 && (row[0] === "" || row[0] === '""')) {
      continue;
    }

    for (let colIndex = 0; colIndex < row.length; colIndex++) {
      const col = row[colIndex];
      console.log("col", col);
      colIndex > 0 && resRow.push({ type: "comma", text: "," });
      if (colIndex < schema.length) {
        const [parsedValue, error] = validateEditorValue(
          col,
          schema[colIndex].type
        );
        const text = col.includes(",") ? `"${col}"` : col;
        resRow.push({ type: "value", text, error });
      } else {
        resRow.push({
          type: "value",
          text: col,
          error: { error: "Too many columns" },
        });
      }
    }
    resRoot.push({ children: resRow });
  }
  return resRoot;
}
