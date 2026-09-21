import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  useEdgesState,
  type Connection,
  type Node,
  type Edge,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { useColumns } from "../../hooks/useColumns";
import { useColumnEdges } from "../../hooks/useColumnEdges";

export default function ColumnEdgeCreator() {
  const { data: board1Columns = [] } = useColumns(
    "11111111-1111-1111-1111-111111111111",
  );
  const { data: board2Columns = [] } = useColumns(
    "11111111-1111-1111-1111-111111111112",
  );
  const { data: board1Edges = [] } = useColumnEdges(
    "11111111-1111-1111-1111-111111111111",
  );

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
  }));

  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = (connection: Connection) => {
    setEdges((currentEdges) => addEdge(connection, currentEdges));
  };

  return (
    <div className="w-[80%] h-[80%] border rounded-2xl bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
