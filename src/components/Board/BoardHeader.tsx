import { useState } from "react";
import { Link } from "react-router-dom";

import type { BoardType } from "../../types/board";
import type { ColumnType } from "../../types/column";
import { useCreateColumn } from "../../hooks/useCreateColumn";
import { useRenameBoard } from "../../hooks/useRenameBoard";
import HeaderButton from "./HeaderButton";
import HeaderButtonRound from "./HeaderButtonRound";

/** Props for the BoardHeader component. */
export type Props = {
  /** The board whose title is displayed and renamed. */
  board: BoardType;
  /** Called when the "Connections" button is clicked. */
  onClick: () => void;
  /** All columns on the board, used for the add-column form and the hide-columns fieldset. */
  columns: ColumnType[];
  /** Ids of the columns currently hidden from the board view. */
  hiddenColumnIds: Set<string>;
  /** Receives the updated set of hidden column ids when a checkbox is toggled. */
  onHiddenColumnIdsChange: (hiddenColumnIds: Set<string>) => void;
  /** Whether the board is in edit mode (enables rename input and add-column form). */
  isEditMode: boolean;
  /** Receives the new edit-mode value when the Edit/Done button is toggled. */
  onEditModeChange: (value: boolean) => void;
};

/**
 * Top navigation/header for a board. Shows the tojsystem logo, React Router
 * `Link`s to the Development and Testing boards, an editable board title
 * (inline input in edit mode, saved via `useRenameBoard` on blur; Enter
 * saves, Escape reverts), and action buttons: an add-column form and "Done"
 * toggle in edit mode, a "Connections" button, and a round "C" button that
 * opens a fieldset of checkboxes controlling which columns are hidden.
 *
 * @param props - `board`, `columns`, `hiddenColumnIds` with its change
 * handler, `isEditMode` with its change handler, and `onClick` for the
 * Connections button.
 */
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
  const [showColumns, setShowColumns] = useState(false);
  const [prevBoardTitle, setPrevBoardTitle] = useState(board.title);
  const { mutate: createColumn } = useCreateColumn(board.id);
  const { mutate: renameBoard } = useRenameBoard(board.id);

  if (prevBoardTitle !== board.title) {
    setPrevBoardTitle(board.title);
    setBoardTitle(board.title);
  }

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
              isEditMode ? "bg-white text-[#0b98d6]" : "border"
            }`}
            onClick={toggleEditMode}
          >
            {isEditMode ? "Done" : "Edit board"}
          </HeaderButton>

          <HeaderButton buttonType="button" onClick={onClick}>
            Connections
          </HeaderButton>

          <HeaderButtonRound
            buttonType="button"
            styling={`cursor-pointer font-semibold py-2 px-4 rounded-full z-50 ${
              showColumns ? "bg-[#0b98d6] border border-white" : "border"
            }`}
            onClick={() => setShowColumns(!showColumns)}
          >
            C
          </HeaderButtonRound>

          {showColumns && (
            <fieldset
              className="absolute top-2 right-83 z-25 flex max-h-46 min-w-55 flex-col gap-1 
            overflow-y-auto rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-black shadow-lg"
            >
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
          )}
        </div>
      </header>
    </div>
  );
}
