import { create } from "zustand";
import { persist } from "zustand/middleware";

type GlobalState = {
  selectedWalletAddress: string | undefined;
  schemaUid: string;
  csv: string;
  csvError?: Error;
  showTransaction?: boolean;
  editorErrorMessage?: string;
};

export const useStateStore = create(
  persist<GlobalState>(
    () => ({
      selectedWalletAddress: undefined,
      schemaUid: "",
      csv: "",
      showTransaction: false,
    }),
    {
      name: "global-state",
    }
  )
);
