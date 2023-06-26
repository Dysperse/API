import { useColor, useDarkMode } from "@/lib/client/useColor";
import { useSession } from "@/lib/client/useSession";
import { StepIconProps, styled } from "@mui/material";

export function StepIcon(props: StepIconProps) {
  const { active, completed, className } = props;
  const session = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const StepIconRoot = styled("div")<{
    ownerState: { active?: boolean };
  }>(({ theme, ownerState }) => ({
    color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
    display: "flex",
    height: 22,
    alignItems: "center",
    ...(ownerState.active && {
      color: palette[9],
    }),
    "& .StepIcon-completedIcon": {
      color: palette[9],
      zIndex: 1,
      fontSize: 18,
    },
    "& .StepIcon-circle": {
      width: 8,
      height: 8,
      borderRadius: "50%",
      marginLeft: "10px",
      backgroundColor: "currentColor",
    },
  }));
  return (
    <StepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <span
          className="material-symbols-rounded"
          style={{ color: palette[9] }}
        >
          check
        </span>
      ) : (
        <div className="StepIcon-circle" />
      )}
    </StepIconRoot>
  );
}
