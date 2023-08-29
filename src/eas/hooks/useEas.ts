import { EasContext } from "../types/eas-context-value.type";
import { ReactEasContext } from "../components/EasContextProvider";
import { useContext } from "react";

export function useEas(): EasContext {
  const context = useContext(ReactEasContext);
  if (!context) {
    throw new Error("useEas must be used within a EasProvider");
  }
  return context;
}
