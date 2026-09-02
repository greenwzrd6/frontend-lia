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
    dropBefore: boolean
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

    const draggedEntityId =
      event.dataTransfer.getData("text/plain");

    if (
      !draggedEntityId ||
      draggedEntityId === entity.id
    ) {
      return;
    }

    const rect =
      event.currentTarget.getBoundingClientRect();

    const middle =
      rect.top + rect.height / 2;

    const dropBefore =
      event.clientY < middle;

    await onDrop(
      draggedEntityId,
      entity.id,
      dropBefore
    );
  }

  return (
    <article
      className="outline my-5 py-1 flex flex-row justify-center"
      draggable
      onDragStart={(event) =>
        handleDragStart(event, entity.id)
      }
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h3>{entity.title}</h3>

      <small>Entity: {entity.id}</small>

      <small>Position: {placement?.position}</small>
    </article>
  );
}