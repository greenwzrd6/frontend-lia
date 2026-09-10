import { useParams } from "react-router-dom";

import BoardHeader from "../components/Board/BoardHeader";
import ColumnList from "../components/Column/ColumnList";
import { useBoard } from "../hooks/useBoard";
import { useColumns } from "../hooks/useColumns";
import { usePlacements } from "../hooks/usePlacements";
import { getDescendants } from "../utils/entityTree";
import { useEntities } from "../hooks/useEntities";

export default function BoardPage() {
  const { id } = useParams<{ id: string }>();
  const { data: columns = [] } = useColumns();
  const boardQuery = useBoard();
  const {
    data: entities = [],
    isLoading: entitiesLoading,
    isError: entitiesError,
  } = useEntities();

  const boardEntities = boardQuery.data
    ? getDescendants(entities, boardQuery.data.roots)
    : [];

  const {
    data: placements = [],
    isLoading: placementsLoading,
    isError: placementsError,
  } = usePlacements(boardEntities, id ?? "", columns);

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
    return <p>Could not load data.</p>;
  }

  return (
    <>
      <BoardHeader board={boardQuery.data} />

      <ColumnList
        columns={columns}
        placements={placements}
        boardId={id}
        entities={boardEntities}
      />
    </>
  );
}
