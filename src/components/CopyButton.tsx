import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";

interface CopyButtonProps {
  textToCopy: string;
}

export function CopyButton({ textToCopy }: CopyButtonProps): JSX.Element {
  return (
    <button
      className="inline-block w-3 text-warm-gray-500"
      onClick={(): void => {
        void navigator.clipboard.writeText(textToCopy);
        toast.success("Copied to clipboard");
      }}
    >
      <FontAwesomeIcon icon={faCopy} className="w-4" />
    </button>
  );
}
