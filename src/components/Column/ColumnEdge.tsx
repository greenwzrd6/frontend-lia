import {
  BaseEdge,
  EdgeLabelRenderer,
  getStraightPath,
  type EdgeProps,
  useReactFlow,
} from "@xyflow/react";

export default function ColumnEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
}: EdgeProps) {
  const { deleteElements } = useReactFlow();

  const [edgePath, labelX, labelY] = getStraightPath({
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
          className="nodrag nopan cursor-pointer px-2 border rounded-sm bg-white"
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
          }}
          onClick={() => deleteElements({ edges: [{ id }] })}
        >
          <small>Delete</small>
        </button>
      </EdgeLabelRenderer>
    </>
  );
}
