import type { Column as ColumnType } from "../../types/column";

type Props = {
  column: ColumnType;
};

export default function ColumnHeader({ column }: Readonly<Props>) {
  return (
    <header>
      <h2>{column.title}</h2>
    </header>
  );
}
