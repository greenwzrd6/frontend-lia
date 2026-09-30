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
        "cursor-pointer bg-[#bad80a] transition duration-200 hover:text-[#009e49] font-semibold py-2 px-4 rounded-xs"
      }
      onClick={onClick}
    >
      {children}
    </button>
  );
}
