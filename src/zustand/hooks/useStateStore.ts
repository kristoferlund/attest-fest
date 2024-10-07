import { create } from "zustand";
import { persist } from "zustand/middleware";

type GlobalState = {
  selectedWalletAddress: string | undefined;
  schemaUid: string;
  includeRefUid: boolean;
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
      includeRefUid: false,
      csv: "",
      showTransaction: false,
    }),
    {
      name: "global-state",
    }
  )
);
