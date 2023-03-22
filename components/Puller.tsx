import { Box } from "@mui/material";
import { useSession } from "../pages/_app";

/**
 * @name Puller
 * @description A puller is a component that pulls in swipeable drawers from bottom of the screen.
 */
export function Puller({ showOnDesktop = false }: { showOnDesktop?: boolean }) {
  const session = useSession();

  return (
    <>
      <Box
        sx={{
          position: "sticky",
          ...(!showOnDesktop && { display: { sm: "none" } }),
          top: 0,
          zIndex: 1,
          left: 0,
          width: "100%",
          textAlign: "center",
          py: 2,
          mb: 2,
        }}
      >
        <Box
          className="puller"
          sx={{
            width: "50px",
            mx: "auto",
            height: "2px",
            background: session?.user
              ? session.user.darkMode
                ? "hsl(240, 11%, 35%)"
                : "#ddd"
              : "#ddd",
          }}
        />
      </Box>
    </>
  );
}
