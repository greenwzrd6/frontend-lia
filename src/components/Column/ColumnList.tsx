import type { Column as ColumnType } from "../../types/column";
import Column from "./Column";

type Props = {
  columns: ColumnType[];
};

export default function ColumnList({ columns }: Readonly<Props>) {
  return (
    <div>
      {columns.map((column) => (
        <Column key={column.id} column={column} />
      ))}
    </div>
  );
}
