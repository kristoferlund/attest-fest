import { CsvComma, CsvText } from "../types/editor-nodes.type";

import { Descendant } from "slate";
import { PublicClient } from "viem";
import { SchemaField } from "../types/schema-field.type";
import { parse } from "csv-parse/sync";
import { validateEditorValue } from "./validateEditorValue";

export async function parseCsvAndValidate(
  csvData: string,
  schema: SchemaField[],
  publicClient: PublicClient
): Promise<Descendant[]> {
  const resRoot: Descendant[] = [];

  if (!csvData) return [{ children: resRoot }];

  const rows: string[][] = parse(csvData, {
    relax_column_count: true,
    relax_quotes: true,
    trim: true,
  });

  const csvHeader = schema.map((field) => field.name).join(",");

  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex];
    const resRow: (CsvText | CsvComma)[] = [];

    // Skip header row if it matches the schema
    if (rowIndex === 0) {
      const headerRow = row.join(",");
      if (headerRow === csvHeader) {
        continue;
      }
    }

    // Skip empty rows
    if (row.length === 1 && (row[0] === "" || row[0] === '""')) {
      continue;
    }

    for (let colIndex = 0; colIndex < row.length; colIndex++) {
      const col = row[colIndex];
      colIndex > 0 && resRow.push({ type: "comma", text: "," });
      if (colIndex < schema.length) {
        const [parsedValue, error] = await validateEditorValue(
          col,
          schema[colIndex].type,
          publicClient
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
