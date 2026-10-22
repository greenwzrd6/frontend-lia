import {
  ReactFlow,
  addEdge,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import type { ColumnType } from "../../../types/column";
import type { ColumnEdgeType } from "../../../types/columnEdge";
import { useCreateColumnEdge } from "../../../hooks/useCreateColumnEdge";
import { useDeleteColumnEdge } from "../../../hooks/useDeleteColumnEdge";
import ColumnEdge from "./ColumnEdge";
import BoardGroup from "./BoardGroup";
import { ColumnNode } from "./ColumnNode";
import type { BoardType } from "../../../types/board";

const edgeTypes = {
  columnEdge: ColumnEdge,
};

const nodeTypes = {
  boardGroup: BoardGroup,
  columnNode: ColumnNode,
};

/** Props for the ColumnEdgeFlowContent component. */
export type Props = {
  /** The first (source) board shown as the top board group node. */
  board1: BoardType;
  /** The second (target) board shown as the bottom board group node. */
  board2: BoardType;
  /** Columns of the first board, rendered as column nodes inside its group. */
  board1Columns: ColumnType[];
  /** Columns of the second board, rendered as column nodes inside its group. */
  board2Columns: ColumnType[];
  /** Existing column-to-column edges between the two boards, used to build the initial edges. */
  board1Edges: ColumnEdgeType[];
  /** Board id used as the mutation scope for creating/deleting edges. */
  boardId: string;
};

/**
 * The `@xyflow/react` canvas for the connections overlay. Builds two
 * `boardGroup` nodes (one per board) each containing `columnNode` children
 * laid out horizontally, and initial `columnEdge` edges from the fetched
 * edge list. `onConnect` persists a new edge via `useCreateColumnEdge`
 * (skipping duplicate/reverse connections) and adds it to local state;
 * `onEdgesDelete` removes each deleted edge via `useDeleteColumnEdge`.
 *
 * @param props - Both boards, their columns, board 1's edges, and the
 * `boardId` used as the mutation scope for creating/deleting edges.
 */
export default function ColumnEdgeFlowContent({
  board1,
  board2,
  board1Columns,
  board2Columns,
  board1Edges,
  boardId,
}: Readonly<Props>) {
  const { mutate: createColumnEdge } = useCreateColumnEdge(boardId);
  const { mutate: deleteColumnEdge } = useDeleteColumnEdge(boardId);

  const defaultEdgeOptions = {
    zIndex: 0,
  };

  const board1Node: Node = {
    id: "board1",
    type: "boardGroup",
    position: {
      x: 0,
      y: 100,
    },
    style: {
      width: "75vw",
      height: 200,
    },
    data: {
      label: board1.title,
    },
  };

  const board2Node: Node = {
    id: "board2",
    type: "boardGroup",
    position: {
      x: 0,
      y: 400,
    },
    style: {
      width: "75vw",
      height: 200,
    },
    data: {
      label: board2.title,
    },
  };

  const board1Nodes: Node[] = board1Columns.map((column, index) => ({
    id: column.id,
    type: "columnNode",
    parentId: "board1",
    position: {
      x: 40 + index * 200,
      y: 80,
    },
    data: {
      label: column.title,
    },
  }));

  const board2Nodes: Node[] = board2Columns.map((column, index) => ({
    id: column.id,
    type: "columnNode",
    parentId: "board2",
    position: {
      x: 40 + index * 200,
      y: 80,
    },
    data: {
      label: column.title,
    },
  }));

  const nodes = [board1Node, ...board1Nodes, board2Node, ...board2Nodes];

  const initialEdges: Edge[] = board1Edges.map((edge) => ({
    id: `${edge.fromColumnId}-${edge.toColumnId}`,
    source: edge.fromColumnId,
    target: edge.toColumnId,
    type: "columnEdge",
  }));

  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = (connection: Connection) => {
    const alreadyConnected = edges.some(
      (edge) =>
        (edge.source === connection.source &&
          edge.target === connection.target) ||
        (edge.source === connection.target &&
          edge.target === connection.source),
    );

    if (!connection.source || !connection.target) {
      return;
    }

    if (alreadyConnected) {
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
      />
    </div>
  );
}
