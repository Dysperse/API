import { Box, Skeleton } from "@mui/material";
import { useApi } from "../../../hooks/useApi";
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
          variant="circular"
          animation="wave"
          height={65}
          width={65}
          sx={{ flexShrink: 0 }}
        />
      ))}
    </Box>
  );
  return (
    <Box>
      {data ? (
        <>
          {data.map((goal) => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                overflowX: "hidden",
                gap: 2,
                px: 2,
                mb: 2,
              }}
            ></Box>
          ))}
        </>
      ) : (
        loading
      )}
      {error && (
        <ErrorHandler error="Oh no! An error occured while trying to fetch your routines! Please try again later." />
      )}
    </Box>
  );
}
