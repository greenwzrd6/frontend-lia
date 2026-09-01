import type { DragEvent } from "react";

export function handleDragStart(
  event: DragEvent<HTMLElement>,
  entityId: string,
) {
  event.dataTransfer.setData("text/plain", entityId);

  event.dataTransfer.effectAllowed = "move";
}