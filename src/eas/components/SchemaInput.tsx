type SchemaInputProps = {
  onChange: (schemaUid: string) => void;
  value: string;
};

export function SchemaInput({ onChange, value }: SchemaInputProps) {
  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    input.select();
  };

  return (
    <div>
      Enter the UID of the schema you want to use:
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={handleInputClick}
      />
    </div>
  );
}
