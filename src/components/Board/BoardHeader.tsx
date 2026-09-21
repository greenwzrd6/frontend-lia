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
    <div className="flex flex-row items-center justify-evenly bg-gray-100">
      <header className="flex flex-row justify-center items-center">
        <nav className="flex flex-row  justify-between p-4 gap-4">
          <Link to="/boards/11111111-1111-1111-1111-111111111111">Board 1</Link>
          <Link to="/boards/11111111-1111-1111-1111-111111111112">Board 2</Link>
        </nav>
        <h1 className="text-xl font-bold">{board.title}</h1>
      </header>
      <div className="flex flex-row items-center gap-4">
        <fieldset className="flex flex-col gap-1 text-sm max-h-32 overflow-y-auto border rounded px-3 py-2 bg-white">
          <legend className="px-1">Hide columns</legend>
          {columns.map((column) => (
            <label key={column.id} className="flex items-center gap-2 cursor-pointer">
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
        <button
          onClick={onClick}
          className="cursor-pointer bg-black opacity-50 hover:opacity-60 text-white font-semibold py-2 px-4 rounded-2xl"
        >
          Connections
        </button>
      </div>
    </div>
  );
}
