interface Props {
  buttonType: "submit" | "reset" | "button" | undefined;
  styling?: string;
  onClick?: () => void;
  children: string;
}

export default function HeaderButtonRound({
  buttonType,
  styling,
  onClick,
  children,
}: Props) {
  return (
    <button
      type={buttonType}
      className={
        styling ??
        "cursor-pointer transition duration-200 font-semibold py-2 px-4 rounded-full z-50 border"
      }
      onClick={onClick}
    >
      {children}
    </button>
  );
}
