import type { EntityType } from "../../types/entity";
import type { PlacementType } from "../../types/placement";
import { useSortable } from "@dnd-kit/react/sortable";

type Props = {
  entity: EntityType;
  placement: PlacementType | null | undefined;
  /** The column this card is currently rendered in (its dnd-kit group). */
  columnId: string;
  index: number;
};

export default function PlacementCard({
  entity,
  placement,
  columnId,
  index,
}: Readonly<Props>) {
  const { ref, isDropTarget } = useSortable({
    id: entity.Id,
    index,
    group: columnId,
    type: "card",
    accept: "card",

    data: {
      type: "card",
      entityId: entity.Id,
      columnId,
    },
  });

  return (
    <article
      ref={ref}
      className={`bg-white rounded-2xl p-5 m-1 border border-gray-200 ${isDropTarget ? "dnd-over" : ""}`}
    >
      <h3>{entity.Title}</h3>
      <small>sortKey: {placement?.sortKey}</small>
      <br></br>
      <small>entityId: {placement?.entityId}</small>
    </article>
  );
}
