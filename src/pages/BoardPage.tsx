import BoardHeader from "../components/Board/BoardHeader";
import ColumnList from "../components/Column/ColumnList";
import { useBoard } from "../hooks/useBoard";
import { useParams } from "react-router-dom";
import { useColumns } from "../hooks/useColumns";
import { usePlacements } from "../hooks/usePlacements";

export default function BoardPage() {
  const { id } = useParams<{ id: string }>();

  const { data: columns = [] } = useColumns();

  const columnIds = columns.map((column) => column.id);

  const {
    data: placements = [],
    isLoading: placementsLoading,
    isError: placementsError,
  } = usePlacements(columnIds);

  const boardQuery = useBoard();

  if (!id) {
    return <p>Board ID is missing.</p>;
  }

  if (boardQuery.isLoading) {
    return <p>Loading...</p>;
  }

  if (boardQuery.isError) {
    return <p>Could not load board.</p>;
  }

  if (!boardQuery.data) {
    return <p>Board not found.</p>;
  }

  if (placementsLoading) {
    return <p>Loading...</p>;
  }

  if (placementsError) {
    return <p>Could not load placements.</p>;
  }

  return (
    <>
      <BoardHeader board={boardQuery.data} />

      <ColumnList columns={columns} placements={placements} />
    </>
  );
}
