import { SchemaField } from "../../eas/types/schema-field.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type GlobalState = {
  selectedSafeAddress: string;
  schemaUid: string;
  schema?: SchemaField[];
  csv: string;
  csvError?: Error;
  // editorCsv: string;
  showTransaction?: boolean;
};

export const useStateStore = create(
  persist<GlobalState>(
    () => ({
      selectedSafeAddress: "",
      schemaUid: "",
      csv: "",
      // editorCsv: "",
      showTransaction: false,
    }),
    {
      name: "global-state",
    }
  )
);
