export function getLabelOrder(
  collection,
  key: "kanbanOrder" | "gridOrder" = "kanbanOrder"
) {
  const labelIds = new Set(collection.labels.map((label) => label.id));

  return [
    ...new Set([
      ...(collection as any)[key].filter((id: string) => labelIds.has(id)),
      ...Array.from(labelIds).filter(
        (id) => !(collection as any)[key].includes(id)
      ),
    ]),
  ];
}
