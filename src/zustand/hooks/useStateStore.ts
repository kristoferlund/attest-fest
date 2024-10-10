import { create } from "zustand";

type GlobalState = {
  selectedWalletAddress: string | undefined;
  schemaUid: string;
  includeRefUid: boolean;
  csv: string;
  csvError?: Error;
  showTransaction?: boolean;
  editorErrorMessage?: string;
};

export const useStateStore = create<GlobalState>(
  () => ({
    selectedWalletAddress: undefined,
    schemaUid: "",
    includeRefUid: false,
    csv: "",
    showTransaction: false,
  }),
);
