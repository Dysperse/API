import { StepIconProps, styled } from "@mui/material";
import { colors } from "../../lib/colors";
import { useSession } from "../../pages/_app";

export function StepIcon(props: StepIconProps) {
  const { active, completed, className } = props;
  const session = useSession();

  const StepIconRoot = styled("div")<{
    ownerState: { active?: boolean };
  }>(({ theme, ownerState }) => ({
    color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
    display: "flex",
    height: 22,
    alignItems: "center",
    ...(ownerState.active && {
      color: colors[session.themeColor || "brown"][500],
    }),
    "& .StepIcon-completedIcon": {
      color: colors[session.themeColor || "brown"][500],
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
          style={{
            color: colors[session?.themeColor ?? "brown"][500],
          }}
        >
          check
        </span>
      ) : (
        <div className="StepIcon-circle" />
      )}
    </StepIconRoot>
  );
}
