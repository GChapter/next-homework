interface ButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void | Promise<void>;
  text: string;
  styling?: string;
}

export default function Button({ onClick, text, styling = "" }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg ${styling}`}
    >
      {text}
    </button>
  );
}
