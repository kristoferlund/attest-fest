import { useState } from "react";

type SchemaInputProps = {
  onChange: (schemaUid: string) => void;
  value: string;
};

export function SchemaInput({ onChange, value }: SchemaInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    e.target.select();
  };

  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    input.select();
  };

  return (
    <div className="relative">
      <input
        type="text"
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onClick={handleInputClick}
        className="w-full p-2 bg-opacity-50 bg-theme2 cursor-text caret-transparent text-ellipsis focus:bg-opacity-100 hover:bg-opacity-100 focus:outline-none "
      />
      {isFocused && !value && (
        <div className="absolute w-[10px] h-[17px] animate-pulse bg-theme4 top-2 left-2"></div>
      )}
    </div>
  );
}
