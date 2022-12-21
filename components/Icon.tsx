export function Icon({
  variant = "rounded",
  style = {},
  children,
}: {
  variant?: "rounded" | "outlined";
  style?: React.CSSProperties;
  children: React.ReactNode | String;
}) {
  return (
    <span
      className={
        variant == "outlined"
          ? "material-symbols-outlined"
          : "material-symbols-rounded"
      }
      style={style}
    >
      {children}
    </span>
  );
}
