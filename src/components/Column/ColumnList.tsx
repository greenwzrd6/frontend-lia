import { useColumns } from "../../hooks/useColumns";
import { mockEntities } from "../../services/mockEntities";
import Column from "./Column";
import EntityColumnMock from "./EntityColumnMock";

export default function ColumnList() {
  const { data: columns = [], isLoading, isError } = useColumns();

  if (isLoading) {
    return <p>Loading columns...</p>;
  }

  if (isError) {
    return <p>Could not load columns.</p>;
  }

  const sortedColumns = [...columns].sort((a, b) => a.position - b.position);

  return (
    <div className="flex justify-evenly">
      <EntityColumnMock entities={mockEntities} />

      {sortedColumns.map((column) => (
        <Column key={column.id} column={column} />
      ))}
    </div>
  );
}
