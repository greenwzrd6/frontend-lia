import type { EntityType } from "../../types/entity";
import { handleDragStart } from "../../utils/DragAndDrop";

type Props = {
  entities: EntityType[];
};

export default function EntityColumnMock({ entities }: Readonly<Props>) {
  return (
    <section className="outline flex flex-col">
      <h2 className="text-xl flex flex-row justify-center">
        Mock data
      </h2>

      {entities.map((entity) => (
        <span
          className="outline my-1.5 py-1 flex flex-row justify-center"
          key={entity.id}
          draggable
          onDragStart={(event) =>
            handleDragStart(event, entity.id)
          }
        >
          {entity.title}
        </span>
      ))}
    </section>
  );
}