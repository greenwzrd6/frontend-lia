import type { Column as ColumnType } from "../../types/column";
import type { Entity as EntityType } from "../../types/entity";
import type { Placement as PlacementType } from "../../types/placement";
import PlacementList from "../Placement/PlacementList";
import ColumnHeader from "./ColumnHeader";

type Props = {
  column: ColumnType;
  placements: PlacementType[];
  entitites: EntityType[];
};
export default function Column({
  column,
  placements,
  entitites,
}: Readonly<Props>) {
  return (
    <section>
      <ColumnHeader column={column} />

      <PlacementList placements={placements} entities={entitites} />
    </section>
  );
}
