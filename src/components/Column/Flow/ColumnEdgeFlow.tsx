import {
  ReactFlow,
  addEdge,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import ColumnEdge from "./ColumnEdge";
import { useColumns } from "../../../hooks/useColumns";
import { useColumnEdges } from "../../../hooks/useColumnEdges";
import { useCreateColumnEdge } from "../../../hooks/useCreateColumnEdge";
import { useDeleteColumnEdge } from "../../../hooks/useDeleteColumnEdge";
import BoardGroup from "./BoardGroup";

const edgeTypes = {
  columnEdge: ColumnEdge,
};

const nodeTypes = {
  boardGroup: BoardGroup,
};

export default function ColumnEdgeFlow() {
  const board1Id = "11111111-1111-1111-1111-111111111111";
  const board2Id = "11111111-1111-1111-1111-111111111112";

  const { data: board1Columns = [] } = useColumns(board1Id);
  const { data: board2Columns = [] } = useColumns(board2Id);
  const { data: board1Edges = [] } = useColumnEdges(board1Id);

  const { mutate: createColumnEdge } = useCreateColumnEdge();
  const { mutate: deleteColumnEdge } = useDeleteColumnEdge();

  const defaultEdgeOptions = {
    zIndex: 0,
  };

  const board1: Node = {
    id: "board1",
    type: "boardGroup",
    position: {
      x: 0,
      y: 100,
    },
    style: {
      width: 1000,
      height: 200,
    },
    data: {
      label: "Board 1",
    },
  };

  const board2: Node = {
    id: "board2",
    type: "boardGroup",
    position: {
      x: 0,
      y: 400,
    },
    style: {
      width: 1000,
      height: 200,
    },
    data: {
      label: "Board 2",
    },
  };

  const board1Nodes: Node[] = board1Columns.map((column, index) => ({
    id: column.id,
    parentId: "board1",
    position: {
      x: 50 + index * 250,
      y: 80,
    },
    data: {
      label: column.title,
    },
  }));

  const board2Nodes: Node[] = board2Columns.map((column, index) => ({
    id: column.id,
    parentId: "board2",
    position: {
      x: 50 + index * 250,
      y: 80,
    },
    data: {
      label: column.title,
    },
  }));

  const nodes = [board1, ...board1Nodes, board2, ...board2Nodes];

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
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onEdgesChange={onEdgesChange}
        onEdgesDelete={onEdgesDelete}
        onConnect={onConnect}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
      ></ReactFlow>
    </div>
  );
}
