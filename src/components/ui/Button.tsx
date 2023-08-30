type ButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};

export function Button({
  children,
  onClick,
  disabled,
  className,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-3 border bg-theme1 rounded-xl border-theme4 hover:bg-theme2 disabled:border-theme3 disabled:cursor-not-allowed disabled:hover:bg-theme1 disabled:text-theme3 ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
