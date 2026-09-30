import { Link } from "react-router-dom";
import type { BoardType } from "../../types/board";
import type { ColumnType } from "../../types/column";
import { useEffect, useState } from "react";
import { useCreateColumn } from "../../hooks/useCreateColumn";
import { useRenameBoard } from "../../hooks/useRenameBoard";
import HeaderButton from "./HeaderButton";

type Props = {
  board: BoardType;
  onClick: () => void;
  columns: ColumnType[];
  hiddenColumnIds: Set<string>;
  onHiddenColumnIdsChange: (hiddenColumnIds: Set<string>) => void;
  isEditMode: boolean;
  onEditModeChange: (value: boolean) => void;
};

export default function BoardHeader({
  board,
  onClick,
  columns,
  hiddenColumnIds,
  onHiddenColumnIdsChange,
  isEditMode,
  onEditModeChange,
}: Readonly<Props>) {
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [boardTitle, setBoardTitle] = useState(board.title);
  const { mutate: createColumn } = useCreateColumn(board.id);
  const { mutate: renameBoard } = useRenameBoard(board.id);

  useEffect(() => {
    setBoardTitle(board.title);
  }, [board.title]);

  const saveBoardTitle = () => {
    const trimmed = boardTitle.trim();
    if (trimmed && trimmed !== board.title) {
      renameBoard({ id: board.id, newTitle: trimmed });
    } else {
      setBoardTitle(board.title);
    }
  };

  const handleBoardTitleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
    if (e.key === "Escape") {
      setBoardTitle(board.title);
    }
  };

  const handleAddColumn = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedTitle = newColumnTitle.trim();
    if (!trimmedTitle) return;

    createColumn({
      title: trimmedTitle,
      boardId: board.id,
      position: columns.length,
    });

    setNewColumnTitle("");
  };

  const toggleEditMode = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    onEditModeChange(!isEditMode);
  };

  return (
    <div className="flex flex-row items-center justify-between bg-[#0b98d6] text-white pl-77 pr-85">
      <a href="https://www.tojsystem.se/">
        <img src="/toj.PNG" alt="tojclock" />
      </a>
      <header className="flex flex-row items-center">
        <nav className="flex flex-row gap-6">
          <Link
            to="/boards/11111111-1111-1111-1111-111111111111"
            className="relative after:absolute after:left-0 after:top-[calc(100%+8px)] after:h-0 after:w-full after:bg-current after:transition-all after:duration-200 hover:after:h-[3px]"
          >
            Development
          </Link>
          <Link
            to="/boards/11111111-1111-1111-1111-111111111112"
            className="relative after:absolute after:left-0 after:top-[calc(100%+8px)] after:h-0 after:w-full after:bg-current after:transition-all after:duration-200 hover:after:h-[3px]"
          >
            Testing
          </Link>
        </nav>

        {isEditMode ? (
          <input
            value={boardTitle}
            onChange={(e) => setBoardTitle(e.target.value)}
            onBlur={saveBoardTitle}
            onKeyDown={handleBoardTitleKeyDown}
            size={Math.max(boardTitle.length, 1)}
            className="text-xl font-bold bg-transparent border-b-2 mx-5 border-white outline-none text-white text-center"
          />
        ) : (
          <h1 className="text-xl font-bold px-6">{board.title}</h1>
        )}
        <div className="flex flex-row items-center gap-6">
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

          {isEditMode && (
            <form onSubmit={handleAddColumn} className="flex gap-2">
              <input
                type="text"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                placeholder="New column title"
                className="text-black px-2 py-1 rounded-xs bg-white"
              />
              <HeaderButton buttonType="submit">Add</HeaderButton>
            </form>
          )}

          <HeaderButton
            buttonType="button"
            styling={`cursor-pointer font-semibold py-2 px-4 rounded-xs transition duration-200 ${
              isEditMode
                ? "bg-white text-[#0b98d6]"
                : "bg-[#bad80a] hover:text-[#009e49]"
            }`}
            onClick={toggleEditMode}
          >
            {isEditMode ? "Done" : "Edit board"}
          </HeaderButton>

          <HeaderButton buttonType="button" onClick={onClick}>
            Connections
          </HeaderButton>
        </div>
      </header>
    </div>
  );
}
