/** Props for the HeaderButton component. */
export interface Props {
  /** The HTML `type` attribute for the underlying `<button>`. */
  buttonType: "submit" | "reset" | "button" | undefined;
  /** Optional className override; falls back to the default bordered style. */
  styling?: string;
  /** Optional click handler. */
  onClick?: () => void;
  /** Plain string label rendered inside the button. */
  children: string;
}

/**
 * Generic rectangular header button. Renders a `<button>` whose `className`
 * is the optional `styling` override, or a default bordered style with a
 * hover transition. `children` must be a plain string.
 */
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
