import { useParams } from "react-router-dom";

import BoardHeader from "../components/Board/BoardHeader";
import BoardDnd from "../components/Board/BoardDnd";

import { useBoard } from "../hooks/useBoard";
import { useColumns } from "../hooks/useColumns";
import { getDescendants } from "../utils/entityTree";
import { useEntities } from "../hooks/useEntities";
import ColumnEdgeCreator from "../components/Column/ColumnEdgeCreator";
import { useState } from "react";

export default function BoardPage() {
  const { id } = useParams<{ id: string }>();

  const { data: columns = [] } = useColumns();
  const { data: entities = [] } = useEntities();

  const boardQuery = useBoard();

  const boardEntities = boardQuery.data
    ? getDescendants(entities, boardQuery.data.roots)
    : [];

  const [showConnections, setShowConnections] = useState(false);

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
    <div className="h-screen flex flex-col overflow-hidden">
      <BoardHeader
        board={boardQuery.data}
        onClick={() => setShowConnections(!showConnections)}
      />

      <main className="relative flex-1 min-h-0">
        <BoardDnd columns={columns} boardId={id} entities={boardEntities} />

        {showConnections && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <ColumnEdgeCreator />
          </div>
        )}
      </main>
    </div>
  );
}
