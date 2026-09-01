import type { DragEvent } from "react";
import type { Entity } from "../../types/entity";
import type { Placement } from "../../types/placement";
import { handleDragStart } from "../../utils/DragAndDrop";

type Props = {
  entity: Entity;
  placement: Placement;
  onDropBefore: (
    draggedEntityId: string,
    targetEntityId: string,
  ) => Promise<void>;
};

function handleDragOver(event: DragEvent<HTMLElement>) {
  event.preventDefault();
}

export default function PlacementCard({
  entity,
  placement,
  onDropBefore,
}: Readonly<Props>) {
  async function handleDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    event.stopPropagation();

    const draggedEntityId = event.dataTransfer.getData("text/plain");

    if (!draggedEntityId || draggedEntityId === entity.id) {
      return;
    }

    await onDropBefore(draggedEntityId, entity.id);
  }

  return (
    <article
      className="outline my-5 py-1 flex flex-row justify-center"
      draggable
      onDragStart={(event) => handleDragStart(event, entity.id)}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h3>{entity.title}</h3>

      <small>Entity: {entity.id}</small>

      <small>Position: {placement.position}</small>
    </article>
  );
}
