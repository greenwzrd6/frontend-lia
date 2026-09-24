import { Link } from "react-router-dom";
import type { BoardType } from "../../types/board";
import type { ColumnType } from "../../types/column";

type Props = {
  board: BoardType;
  onClick: () => void;
  columns: ColumnType[];
  hiddenColumnIds: Set<string>;
  onHiddenColumnIdsChange: (hiddenColumnIds: Set<string>) => void;
};

export default function BoardHeader({
  board,
  onClick,
  columns,
  hiddenColumnIds,
  onHiddenColumnIdsChange,
}: Readonly<Props>) {
  return (
    <div className="flex flex-row items-center justify-between bg-[#0b98d6] text-white pl-77 pr-85">
      <img src="/toj.PNG" alt="tojclock" />
      <header className="flex flex-row items-center">
        <nav className="flex flex-row gap-6">
          <Link
            to="/boards/11111111-1111-1111-1111-111111111111"
            className="hover:underline underline-offset-8 decoration-3"
          >
            Development
          </Link>
          <Link
            to="/boards/11111111-1111-1111-1111-111111111112"
            className="hover:underline underline-offset-8 decoration-3"
          >
            Testing
          </Link>
        </nav>

        <h1 className="text-xl font-bold px-6">{board.title}</h1>
        <div className="flex flex-row items-center gap-6">
          <button
            onClick={onClick}
            className="cursor-pointer bg-[#bad80a] hover:text-[#009e49] font-semibold py-2 px-4 rounded-xs"
          >
            Connections
          </button>
          <fieldset className="flex flex-col gap-1 text-sm max-h-16 overflow-y-auto px-3 bg-white text-black">
            {columns.map((column) => (
              <label
                key={column.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={hiddenColumnIds.has(column.id)}
                  onChange={() => {
                    const next = new Set(hiddenColumnIds);
                    if (next.has(column.id)) {
                      next.delete(column.id);
                    } else {
                      next.add(column.id);
                    }
                    onHiddenColumnIdsChange(next);
                  }}
                />
                <span>{column.title}</span>
              </label>
            ))}
          </fieldset>
        </div>
      </header>
    </div>
  );
}
