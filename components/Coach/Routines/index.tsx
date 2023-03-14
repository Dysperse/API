import { Box, Skeleton, Typography } from "@mui/material";
import { useApi } from "../../../hooks/useApi";
import { useSession } from "../../../pages/_app";
import { ErrorHandler } from "../../Error";

export function Routines() {
  const { data, error } = useApi("user/routines/custom-routines");
  const loading = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        overflowX: "hidden",
        gap: 2,
        px: 2,
        mb: 2,
      }}
    >
      {[...new Array(20)].map((_, index) => (
        <Skeleton
          key={index}
          variant="circular"
          animation="wave"
          height={65}
          width={65}
          sx={{ flexShrink: 0 }}
        />
      ))}
    </Box>
  );
  const session = useSession();

  return (
    <Box>
      {data ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            overflowX: "hidden",
            cursor: "pointer",
            gap: 2,
            px: 2,
            mb: 2,
          }}
        >
          {data.map((goal) => (
            <Box
              key={goal.id}
              sx={{
                flexShrink: 0,
                flex: "0 0 65px",
                gap: 0.4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                overflow: "hidden",
                "&:hover": {
                  background: `hsl(240, 11%, ${
                    session?.user?.darkMode ? 10 : 90
                  }%)`,
                },
                "&:active": {
                  transform: "scale(.95)",
                },
              }}
            >
              <Box
                key={goal.id}
                sx={{
                  borderRadius: 9999,
                  width: 65,
                  height: 65,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(200,200,200,.3)",
                }}
              >
                <picture>
                  <img src={goal.emoji} width="35px" height="35px" />
                </picture>
              </Box>
              <Box sx={{ width: "100%" }}>
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: "nowrap",
                    textAlign: "center",
                    textOverflow: "ellipsis",
                    fontSize: "13px",
                    overflow: "hidden",
                  }}
                >
                  {goal.name}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        loading
      )}
      {error && (
        <ErrorHandler error="Oh no! An error occured while trying to fetch your routines! Please try again later." />
      )}
    </Box>
  );
}
