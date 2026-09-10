import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { EntityType } from "../../types/entity";
import type { PlacementType } from "../../types/placement";

type Props = {
  entity: EntityType;
  placement: PlacementType | null | undefined;
  isOverlay?: boolean;
};

export default function PlacementCard({
  entity,
  placement,
  isOverlay = false,
}: Readonly<Props>) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({
      id: entity.Id,
      data: {
        entityId: entity.Id,
        columnId: placement?.columnId,
      },
      disabled: isOverlay,
    });

  const style = {
    transform: isOverlay ? undefined : CSS.Transform.toString(transform),
  };

  return (
    <article
      ref={isOverlay ? undefined : setNodeRef}
      style={style}
      {...(isOverlay ? {} : attributes)}
      {...(isOverlay ? {} : listeners)}
      className={`
        outline my-3 py-1 px-1
        flex flex-col items-left justify-center
        select-none
        ${
          isOverlay
            ? "shadow-2xl cursor-grabbing bg-white opacity-95"
            : "cursor-grab"
        }
        ${isDragging && !isOverlay ? "opacity-25" : ""}
      `}
    >
      <h3>{entity.Title}</h3>
      <small>Entity: {entity.Id}</small>
      <small>sortKey: {placement?.sortKey}</small>
      <small>Parent: {entity?.ParentId}</small>
    </article>
  );
}
