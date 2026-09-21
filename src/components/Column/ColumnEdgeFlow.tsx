import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import ColumnEdge from "./ColumnEdge";
import { useColumns } from "../../hooks/useColumns";
import { useColumnEdges } from "../../hooks/useColumnEdges";
import { useCreateColumnEdge } from "../../hooks/useCreateColumnEdge";
import { useDeleteColumnEdge } from "../../hooks/useDeleteColumnEdge";

const edgeTypes = {
  columnEdge: ColumnEdge,
};

export default function ColumnEdgeFlow() {
  const board1Id = "11111111-1111-1111-1111-111111111111";
  const board2Id = "11111111-1111-1111-1111-111111111112";

  const { data: board1Columns = [] } = useColumns(board1Id);
  const { data: board2Columns = [] } = useColumns(board2Id);
  const { data: board1Edges = [] } = useColumnEdges(board1Id);

  const { mutate: createColumnEdge } = useCreateColumnEdge();
  const { mutate: deleteColumnEdge } = useDeleteColumnEdge();

  const board1Nodes: Node[] = board1Columns.map((column, index) => ({
    id: column.id,
    position: {
      x: 100 + index * 250,
      y: 100,
    },
    data: {
      label: column.title,
    },
  }));

  const board2Nodes: Node[] = board2Columns.map((column, index) => ({
    id: column.id,
    position: {
      x: 100 + index * 250,
      y: 300,
    },
    data: {
      label: column.title,
    },
  }));

  const nodes = [...board1Nodes, ...board2Nodes];

  const initialEdges: Edge[] = board1Edges.map((edge) => ({
    id: `${edge.fromColumnId}-${edge.toColumnId}`,
    source: edge.fromColumnId,
    target: edge.toColumnId,
    type: "columnEdge",
  }));

  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = (connection: Connection) => {
    if (!connection.source || !connection.target) {
      return;
    }

    createColumnEdge({
      fromColumnId: connection.source,
      toColumnId: connection.target,
    });

    setEdges((currentEdges) =>
      addEdge(
        {
          ...connection,
          type: "columnEdge",
        },
        currentEdges,
      ),
    );
  };

  const onEdgesDelete = (deletedEdges: Edge[]) => {
    deletedEdges.forEach((edge) => {
      deleteColumnEdge({
        fromColumnId: edge.source,
        toColumnId: edge.target,
      });
    });
  };

  return (
    <div className="size-full bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        edgeTypes={edgeTypes}
        onEdgesChange={onEdgesChange}
        onEdgesDelete={onEdgesDelete}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
