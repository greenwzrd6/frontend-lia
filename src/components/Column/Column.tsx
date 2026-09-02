import { mockEntities } from "../../services/mockEntities";
import type { ColumnType } from "../../types/column";
import type { PlacementType } from "../../types/placement";
import PlacementList from "../Placement/PlacementList";
import ColumnHeader from "./ColumnHeader";

type Props = {
  column: ColumnType;
  placements: PlacementType[];
};

export default function Column({ column, placements }: Readonly<Props>) {
  return (
    <section className="outline flex flex-col">
      <ColumnHeader column={column} />

      <PlacementList
        column={column}
        placements={placements}
        entities={mockEntities}
      />
    </section>
  );
}
