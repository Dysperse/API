export function getLabelOrder(
  collection,
  key: "kanbanOrder" | "gridOrder" = "kanbanOrder"
) {
  const labelIds = new Set(collection.labels.map((label) => label.id));
  const t = (collection as any)?.[key] || [];

  return [
    ...new Set([
      ...t.filter((id: string) => labelIds.has(id)),
      ...Array.from(labelIds).filter((id) => !t.includes(id)),
    ]),
  ];
}

