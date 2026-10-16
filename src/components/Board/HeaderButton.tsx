interface Props {
  buttonType: "submit" | "reset" | "button" | undefined;
  styling?: string;
  onClick?: () => void;
  children: string;
}

export default function HeaderButton({
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
        "cursor-pointer transition duration-200 font-semibold py-2 px-4 rounded-xs border"
      }
      onClick={onClick}
    >
      {children}
    </button>
  );
}
