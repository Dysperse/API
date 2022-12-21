import { styled } from "@mui/system";

export function Icon({
  variant = "rounded",
  sx = {},
  children,
}: {
  variant?: "rounded" | "outlined";
  sx?: any;
  children: React.ReactNode | String;
}) {
  const IconComponent = styled("span")(sx);

  return (
    <IconComponent
      className={
        variant == "outlined"
          ? "material-symbols-outlined"
          : "material-symbols-rounded"
      }
    >
      {children}
    </IconComponent>
  );
}
