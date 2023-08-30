import { useSafe } from "../safe/hooks/useSafe";

export function SafeInformation() {
  const { owners, threshold, safeAddress } = useSafe();

  if (!safeAddress || owners?.length === 0) {
    return null;
  }

  return (
    <div className="text-center">
      Creating attestations requires the signature of{" "}
      <strong>{threshold}</strong> out of{" "}
      <strong>{owners.length} owners</strong>.
    </div>
  );
}
