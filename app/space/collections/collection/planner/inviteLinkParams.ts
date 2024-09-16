export const inviteLinkParams = (id) =>
  ({
    AND: [{ id }, { access: "READ_ONLY" }, { disabled: false }],
  } as any);
