import type { DragEvent } from "react";
import type { EntityType } from "../../types/entity";
import type { PlacementType } from "../../types/placement";
import { handleDragStart } from "../../utils/DragAndDrop";

type Props = {
  entity: EntityType;
  placement: PlacementType | null | undefined;
  onDrop: (
    draggedEntityId: string,
    targetEntityId: string,
    dropBefore: boolean,
    sourceColumnId: string,
  ) => Promise<void>;
};

function handleDragOver(event: DragEvent<HTMLElement>) {
  event.preventDefault();
}

export default function PlacementCard({
  entity,
  placement,
  onDrop,
}: Readonly<Props>) {
  async function handleDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    event.stopPropagation();

    const draggedEntityId = event.dataTransfer.getData("text/plain");

    const sourceColumnId = event.dataTransfer.getData("sourceColumnId");

    if (!draggedEntityId || draggedEntityId === entity.id || !sourceColumnId) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();

    const middle = rect.top + rect.height / 2;

    const dropBefore = event.clientY < middle;

    await onDrop(draggedEntityId, entity.id, dropBefore, sourceColumnId);
  }

  return (
    <article
      className="outline my-3 py-1 px-1 flex flex-col items justify-center"
      draggable
      onDragStart={(event) => {
        handleDragStart(event, entity.id);

        if (placement) {
          event.dataTransfer.setData("sourceColumnId", placement.columnId.id);
        }
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h3>{entity.title}</h3>

      <small>Entity: {entity.id}</small>

      <small>sortKey: {placement?.sortKey}</small>
    </article>
  );
}
