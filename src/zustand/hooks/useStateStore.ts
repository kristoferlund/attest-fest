import { SchemaField } from "../../eas/types/schema-field.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type GlobalState = {
  selectedWalletAddress: string;
  schemaUid: string;
  schema?: SchemaField[];
  csv: string;
  csvError?: Error;
  showTransaction?: boolean;
  editorErrorMessage?: string;
};

export const useStateStore = create(
  persist<GlobalState>(
    () => ({
      selectedWalletAddress: "",
      schemaUid: "",
      csv: "",
      showTransaction: false,
    }),
    {
      name: "global-state",
    }
  )
);
