import type { Entity as EntityType } from "../../types/entity";

type Props = {
  entities: EntityType[];
};

export default function EntityColumnMock({ entities }: Readonly<Props>) {
  return (
    <section>
        <h2>Jajjamän</h2>
      {entities.map((entity) => (
        <span className="entity-mock-card" key={entity.id}>{entity.title}</span>
      ))}
    </section>
  );
}
