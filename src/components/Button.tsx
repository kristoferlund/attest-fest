type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-5 py-3 border rounded-full border-theme4"
    >
      {children}
    </button>
  );
}
