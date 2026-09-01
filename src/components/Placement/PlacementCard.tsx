import type { Entity } from "../../types/entity";
import type { Placement } from "../../types/placement";

type Props = {
  entity: Entity;
  placement: Placement;
};

export default function PlacementCard({ entity, placement }: Readonly<Props>) {
  return (
    <article>
      <h3>{entity.title}</h3>

      <small>Entity: {entity.id}</small>

      <small>Position: {placement.position}</small>
    </article>
  );
}
