import { isReleasedColumn } from "../../utils/isReleasedColumn";

describe("isReleasedColumn", () => {
  it("matches the seeded Released column titles regardless of casing", () => {
    expect(isReleasedColumn(column("Released"))).toBe(true);
    expect(isReleasedColumn(column("released"))).toBe(true);
    expect(isReleasedColumn(column("RELEASED"))).toBe(true);
    expect(isReleasedColumn(column(" Release "))).toBe(true);
    expect(isReleasedColumn(column("Release"))).toBe(true);
  });

  it("rejects other stage titles", () => {
    expect(isReleasedColumn(column("Todo"))).toBe(false);
    expect(isReleasedColumn(column("Doing"))).toBe(false);
    expect(isReleasedColumn(column("Testing"))).toBe(false);
    expect(isReleasedColumn(column("Releasing soon"))).toBe(false);
    expect(isReleasedColumn(column(""))).toBe(false);
  });
});

function column(title: string) {
  return { title };
}
