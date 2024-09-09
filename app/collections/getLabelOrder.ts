export function getLabelOrder(collection) {
  const labelIds = new Set(collection.labels.map((label) => label.id));

  return [
    ...new Set([
      ...(collection as any).kanbanOrder.filter((id: string) =>
        labelIds.has(id)
      ),
      ...Array.from(labelIds).filter(
        (id) => !(collection as any).kanbanOrder.includes(id)
      ),
    ]),
  ];
}
