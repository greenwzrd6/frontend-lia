/** Props for the HeaderButtonRound component. */
export interface Props {
  /** The HTML `type` attribute for the underlying `<button>`. */
  buttonType: "submit" | "reset" | "button" | undefined;
  /** Optional className override; falls back to the default round bordered style. */
  styling?: string;
  /** Optional click handler. */
  onClick?: () => void;
  /** Plain string label rendered inside the button. */
  children: string;
}

/**
 * Round header button variant (default `rounded-full` style with border).
 * Same contract as {@link HeaderButton}: optional `styling` className
 * override, optional `onClick`, string `children`.
 */
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
