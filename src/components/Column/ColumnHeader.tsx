import type { Column as ColumnType } from "../../types/column";

type Props = {
  column: ColumnType;
};

export default function ColumnHeader({ column }: Readonly<Props>) {
  return (
    <header>
      <h2 className="text-xl flex flex-row justify-center">{column.title}</h2>
    </header>
  );
}
