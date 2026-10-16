interface Props {
  buttonType: "submit" | "reset" | "button" | undefined;
  onClick?: () => void;
  children: string;
}

export default function HeaderButtonRound({
  buttonType,
  onClick,
  children,
}: Props) {
  return (
    <button
      type={buttonType}
      className={
        "cursor-pointer bg-[#bad80a] transition duration-200 hover:text-[#009e49] font-semibold py-2 px-4 rounded-full z-50"
      }
      onClick={onClick}
    >
      {children}
    </button>
  );
}
