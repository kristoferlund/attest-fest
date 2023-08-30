import { create } from "zustand";

// Local "global" state allowing editor leafs to set errors
type UseCsvErrorStateStoreProps = {
  editorErrorMessage?: string;
};
export const useCsvErrorStateStore = create<UseCsvErrorStateStoreProps>(
  () => ({})
);
