import {
  BaseEdge,
  EdgeLabelRenderer,
  type EdgeProps,
  useReactFlow,
  getBezierPath,
} from "@xyflow/react";

export default function ColumnEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
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

      <EdgeLabelRenderer>
        <button
          className="nodrag nopan cursor-pointer px-1 border rounded-sm bg-white z-1 text-xs"
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
          }}
          onClick={() => deleteElements({ edges: [{ id }] })}
        >
          Delete
        </button>
      </EdgeLabelRenderer>
    </>
  );
}
