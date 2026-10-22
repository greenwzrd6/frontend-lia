import {
  BaseEdge,
  EdgeLabelRenderer,
  type EdgeProps,
  useReactFlow,
  getBezierPath,
} from "@xyflow/react";

/**
 * Custom `@xyflow/react` edge (`columnEdge`): draws a bezier path between
 * two column nodes with `BaseEdge`/`getBezierPath`. When the edge is
 * selected, an absolutely positioned "Delete" button is rendered through
 * `EdgeLabelRenderer` that removes the edge via `useReactFlow().deleteElements`.
 */
export default function ColumnEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  selected,
}: EdgeProps) {
  const { deleteElements } = useReactFlow();

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} />

      {selected && (
        <EdgeLabelRenderer>
          <button
            className="nodrag nopan cursor-pointer px-1 border rounded-sm bg-white z-1 text-xs"
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "all",
            }}
            onClick={() => {
              void deleteElements({ edges: [{ id }] });
            }}
          >
            Delete
          </button>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
