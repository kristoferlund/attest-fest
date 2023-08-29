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
      Schema UID:
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={handleInputClick}
        className="p-1 ml-1 border-b w-96 text-ellipsis"
      />
    </div>
  );
}
