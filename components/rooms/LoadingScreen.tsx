import Masonry from "@mui/lab/Masonry";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";

/**
 * Loading screen
 * @returns {JSX.Element}
 */
export function LoadingScreen(): JSX.Element {
  return (
    <Container sx={{ mt: 4 }}>
      <Skeleton
        variant="rectangular"
        animation="wave"
        width={"100%"}
        sx={{ height: 160, mb: 2, borderRadius: 5 }}
      />
      <Skeleton
        variant="rectangular"
        animation="wave"
        width={"100%"}
        sx={{ height: 120, mb: 2, borderRadius: 5 }}
      />
      <Box
        sx={{
          mr: {
            sm: -2,
          },
        }}
      >
        <Masonry columns={{ xs: 1, sm: 3 }} spacing={{ xs: 0, sm: 2 }}>
          {[...new Array(25)].map((_, id) => {
            let height = Math.random() * 400;
            if (height < 100) height = 100;
            return (
              <Paper key={id.toString()} sx={{ p: 0 }} elevation={0}>
                <Skeleton
                  variant="rectangular"
                  height={height}
                  width={"100%"}
                  animation="wave"
                  sx={{ mb: 2, borderRadius: "28px" }}
                />
              </Paper>
            );
          })}
        </Masonry>
      </Box>
    </Container>
  );
}
