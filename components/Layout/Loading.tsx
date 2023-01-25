import { AppBar, Box, Skeleton, Toolbar } from "@mui/material";

/**
 * Loading screen
 * @returns JSX.Element
 */

export function Loading(): JSX.Element {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        WebkitAppRegion: "drag",
        left: 0,
        background:
          global.user && global.user.darkMode ? "hsl(240,11%,10%)" : "#fff",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <AppBar
        sx={{
          position: "fixed",
          top: 0,
          background: "transparent",
          py: {
            sm: 1,
            xs: 0.9,
          },
        }}
        elevation={0}
      >
        <Toolbar>
          <Skeleton
            animation="wave"
            height={30}
            variant="rectangular"
            sx={{
              width: { xs: 100, sm: 150, md: 200 },
              borderRadius: 3,
              maxWidth: "100%",
            }}
          />
          <Skeleton
            animation="wave"
            variant="rectangular"
            sx={{
              height: 45,
              borderRadius: 5,
              mx: "auto",
              width: { xs: 0, md: "450px", sm: "250px" },
              maxWidth: "100%",
            }}
          />
          <Box sx={{ ml: "auto", display: "flex", gap: 1.5 }}>
            {[...new Array(3)].map(() => (
              <Skeleton
                variant="circular"
                animation="wave"
                width={35}
                key={Math.random().toString()}
                height={35}
                sx={{
                  maxWidth: "100%",
                }}
              />
            ))}
            {/* <div style={{ opacity: 0 }}>
              <Icon>add_circle</Icon>
              <Icon className="outlined">add_circle</Icon>
            </div> */}
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: "flex",
        }}
      >
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            flexDirection: "column",
            alignItems: "center",
            height: "100vh",
            gap: 2,
            justifyContent: "center",
            width: "95px",
            pt: "75px",
            px: 2.5,
          }}
        >
          <Box sx={{ mt: "auto" }} />
          {[...new Array(5)].map((_, i) => (
            <Skeleton
              variant="rectangular"
              animation="wave"
              key={Math.random().toString()}
              sx={{
                borderRadius: 5,
                height: 50,
                width: 50,
                ...(i === 4 && {
                  mt: "auto",
                  mb: 2,
                }),
              }}
            />
          ))}
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            width: "100%",
          }}
        >
          {/* Main content */}
          <Box
            sx={{
              mt: "140px",
              pl: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1,
                overflow: "hidden",
                width: "100%",
                mb: 2,
              }}
            >
              {[...new Array(20)].map(() => (
                <Skeleton
                  key={Math.random().toString()}
                  variant="rectangular"
                  animation="wave"
                  height={50}
                  sx={{ width: "150px", flex: "0 0 150px", borderRadius: 5 }}
                />
              ))}
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                overflow: "hidden",
                width: "100%",
              }}
            >
              <Skeleton
                variant="rectangular"
                animation="wave"
                height={694}
                sx={{ width: "330px", flex: "0 0 330px", borderRadius: 5 }}
              />
              <Skeleton
                variant="rectangular"
                animation="wave"
                height={694}
                sx={{ width: "330px", flex: "0 0 330px", borderRadius: 5 }}
              />
              <Skeleton
                variant="rectangular"
                animation="wave"
                height={694}
                sx={{ width: "330px", flex: "0 0 330px", borderRadius: 5 }}
              />
              <Skeleton
                variant="rectangular"
                animation="wave"
                height={694}
                sx={{ width: "330px", flex: "0 0 330px", borderRadius: 5 }}
              />
              <Skeleton
                variant="rectangular"
                animation="wave"
                height={694}
                sx={{ width: "330px", flex: "0 0 330px", borderRadius: 5 }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
