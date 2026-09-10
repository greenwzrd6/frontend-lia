import type { EntityType } from "../../types/entity";
import type { PlacementType } from "../../types/placement";
import { useSortable } from "@dnd-kit/react/sortable";

type Props = {
  entity: EntityType;
  placement: PlacementType | null | undefined;
  index: number;
};

export default function PlacementCard({
  entity,
  placement,
  index
}: Readonly<Props>) {
  const { ref } =
    useSortable({
      id: entity.Id,
      index,
      data: {
        type: "card",
        entityId: entity.Id,
        columnId: placement?.columnId,
      },
    });

  return (
    <article
      ref={ref}
      className={`
        outline my-3 py-1 px-1
        flex flex-col items-left justify-center
        select-none cursor-grab
      `}
    >
      <h3>{entity.Title}</h3>
      <small>Entity: {entity.Id}</small>
      <small>sortKey: {placement?.sortKey}</small>
      <small>Parent: {entity?.ParentId}</small>
    </article>
  );
}
