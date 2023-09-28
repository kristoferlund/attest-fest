import { SchemaField } from "../eas/types/schema-field.type";

type SchemaPillProps = {
  field: SchemaField;
};
export function SchemaPill({ field }: SchemaPillProps) {
  return (
    <div className="inline-block px-2 py-1 bg-opacity-50 rounded-full bg-theme2">
      <div className="whitespace-nowrap">
        {field.type.toUpperCase()} {field.name}
      </div>
    </div>
  );
}
