import { SchemaPill } from "./SchemaPill";
import { useStateStore } from "../../zustand/hooks/useStateStore";

export function SchemaPills() {
  const schema = useStateStore((state) => state.schema);

  if (!schema) return null;

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {schema.map((field) => (
          <SchemaPill field={field} key={field.name} />
        ))}
      </div>
    </div>
  );
}
