import type { NodeProps } from "@xyflow/react";

/**
 * Custom `@xyflow/react` node type (`boardGroup`): a full-size rounded
 * rectangle with a gray border used to visually group a board's columns,
 * with the board title (`data.label`) rendered just above the box.
 */
export default function BoardGroup({ data }: NodeProps) {
  return (
    <div className="size-full rounded-lg border-2 border-gray-400 cursor-default">
      <div className="absolute -top-7 text-lg">{String(data.label)}</div>
    </div>
  );
}
