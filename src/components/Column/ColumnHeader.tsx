import { useEffect, useRef, useState } from "react";

import type { ColumnType } from "../../types/column";
import { useRenameColumn } from "../../hooks/useRenameColumn";
import { useDeleteColumn } from "../../hooks/useDeleteColumn";
import trashBin from "../../assets/trash-bin.svg"

type Props = {
  column: ColumnType;
  isEditMode?: boolean;
  autoFocus?: boolean;
};

export default function ColumnHeader({
  column,
  isEditMode = false,
  autoFocus = false,
}: Readonly<Props>) {
  const [columnTitle, setColumnTitle] = useState(column.title);
  const { mutate: rename } = useRenameColumn();
  const { mutate: remove } = useDeleteColumn(column.boardId);

  useEffect(() => {
    setColumnTitle(column.title);
  }, [column.title]);

  const save = () => {
    const trimmed = columnTitle.trim();
    if (trimmed && trimmed !== column.title) {
      rename({
        id: column.id,
        newTitle: trimmed,
        boardId: column.boardId,
      });
    } else {
      setColumnTitle(column.title);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
    if (e.key === "Escape") {
      setColumnTitle(column.title);
    }
  };

  if (isEditMode) {
    return (
      <header className="flex flex-col items-center mt-10">
        <AutoFocusInput
          value={columnTitle}
          onChange={setColumnTitle}
          onBlur={save}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
        />
        <button
          type="button"
          onClick={() => remove(column.id)}
          className="text-sm text-white font-bold bg-red-600 hover:bg-red-800 rounded my-1 px-2 py-1 cursor-pointer"
        >
          <img src={trashBin} alt="Trash bin" className="w-6 filter invert"/>
        </button>
      </header>
    );
  }

  return (
    <header>
      <h2 className="text-xl flex flex-row justify-center mt-10">
        {column.title}
      </h2>
    </header>
  );
}

type InputProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
};

function AutoFocusInput({
  value,
  onChange,
  onBlur,
  onKeyDown,
  autoFocus = false,
}: Readonly<InputProps>) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      className="text-xl text-center border-b-2 border-[#0b98d6] outline-none bg-transparent"
    />
  );
}
