import { CsvText } from "../types/editor-nodes.type";
import { ReactNode } from "react";

type CsvEditorLeafProps = {
  children: ReactNode;
  leaf: CsvText;
  attributes: {
    "data-slate-leaf": true;
  };
};

export const CsvEditorLeaf = ({
  attributes,
  children,
  leaf,
}: CsvEditorLeafProps) => {
  if (leaf.type === "value") {
    const errorClass = leaf.error?.error ? "bg-red-200" : "";
    const errorTitle = leaf.error?.error || "";
    return (
      <span {...attributes} className={errorClass} title={errorTitle}>
        {children}
      </span>
    );
  }
  return <span {...attributes}>{children}</span>;
};
