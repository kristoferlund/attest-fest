import { CsvText } from "../types/editor-nodes.type";
import { ReactNode } from "react";
import { useCsvErrorState } from "./CsvEditor";

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
  const handleMouseEnter = () => {
    if (leaf.type !== "value") return;
    if (!leaf.error?.error) return;
    useCsvErrorState.setState({ editorErrorMessage: leaf.error.error });
  };

  const handleMouseLeave = () => {
    useCsvErrorState.setState({ editorErrorMessage: undefined });
  };

  if (leaf.type === "value") {
    const errorClass = leaf.error?.error ? "bg-red-500 text-white" : "";

    return (
      <span
        {...attributes}
        className={errorClass}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </span>
    );
  }
  return <span {...attributes}>{children}</span>;
};
