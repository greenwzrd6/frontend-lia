import type { Column as ColumnType } from "../../types/column";
import type { Entity as EntityType } from "../../types/entity";
import type { Placement as PlacementType } from "../../types/placement";
import PlacementList from "../Placement/PlacementList";
import ColumnHeader from "./ColumnHeader";

type Props = {
  column: ColumnType;
  placements: PlacementType[];
  entities: EntityType[];
  reloadPlacements: () => Promise<void>;
};
export default function Column({
  column,
  placements,
  entities,
  reloadPlacements,
}: Readonly<Props>) {
  return (
    <section className="outline">
      <ColumnHeader column={column} />

      <PlacementList 
              columnId={column.id}
        placements={placements}
        entities={entities}
        reloadPlacements={reloadPlacements}
      />
    </section>
  );
}
