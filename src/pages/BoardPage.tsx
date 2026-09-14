import { useParams } from "react-router-dom";

import BoardHeader from "../components/Board/BoardHeader";
import ColumnList from "../components/Column/ColumnList";

import { useBoard } from "../hooks/useBoard";
import { useColumns } from "../hooks/useColumns";
import { getDescendants } from "../utils/entityTree";
import { useEntities } from "../hooks/useEntities";
import { usePlacements } from "../hooks/usePlacements";

export default function BoardPage() {
  const { id } = useParams<{ id: string }>();

  const { data: columns = [] } = useColumns();
  const boardQuery = useBoard();
  const { data: entities = [] } = useEntities();

  const boardEntities = boardQuery.data
    ? getDescendants(entities, boardQuery.data.roots)
    : [];

    usePlacements(
      boardEntities,
      id ?? "",
      columns,
    );

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


  return (
    <>
      <BoardHeader board={boardQuery.data} />

      <ColumnList
        columns={columns}
        boardId={id}
        entities={boardEntities}
      />
    </>
  );
}
