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
        className="p-2 ml-1 bg-transparent border-b-2 border-theme4 w-96 text-ellipsis focus:bg-theme2 focus:border-b-2 focus:outline-none caret-theme4"
      />
    </div>
  );
}
