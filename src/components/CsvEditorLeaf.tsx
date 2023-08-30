import { CsvText } from "../eas/types/editor-nodes.type";
import { ReactNode } from "react";
import { useCsvErrorStateStore } from "../zustand/hooks/useCsvErrorStateStore";

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
    useCsvErrorStateStore.setState({ editorErrorMessage: leaf.error.error });
  };

  const handleMouseLeave = () => {
    useCsvErrorStateStore.setState({ editorErrorMessage: undefined });
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
