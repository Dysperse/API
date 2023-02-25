import {
  AppBar,
  Box,
  createTheme,
  Icon,
  Skeleton,
  ThemeProvider,
  Toolbar,
} from "@mui/material";

/**
 * Loading screen
 * @returns JSX.Element
 */

export function Loading(): JSX.Element {
  const defaultDarkMode =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  return (
    <ThemeProvider
      theme={createTheme({
        palette: {
          mode: defaultDarkMode ? "dark" : "light",
          ...(defaultDarkMode && {
            background: {
              default: "hsl(240, 11%, 10%)",
              paper: "hsl(240, 11%, 10%)",
            },
            text: {
              primary: "hsl(240, 11%, 90%)",
            },
          }),
        },
      })}
    >
      <Box
        sx={{
          position: "fixed",
          top: 0,
          WebkitAppRegion: "drag",
          left: 0,
          background:
            (global.user && global.user.darkMode) || defaultDarkMode
              ? "hsl(240,11%,5%)"
              : "#fff",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <AppBar
          sx={{
            position: "fixed",
            top: 0,
            display: { sm: "none" },
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
              {[...new Array(3)].map((_, i) => (
                <Skeleton
                  variant="circular"
                  animation="wave"
                  width={35}
                  key={i}
                  height={35}
                  sx={{
                    maxWidth: "100%",
                  }}
                />
              ))}
            </Box>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            display: "flex",
          }}
        >
          {/* Sidebar 1 */}
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              flexDirection: "column",
              alignItems: "center",
              height: "100vh",
              gap: 2,
              background:
                (global.user && global.user.darkMode) || defaultDarkMode
                  ? "hsl(240,11%,10%)"
                  : "rgba(200,200,200,.3)",
              justifyContent: "center",
              width: "95px",
              py: 2,
              px: 2.5,
            }}
          >
            <Skeleton
              variant="rectangular"
              animation="wave"
              sx={{
                borderRadius: 5,
                height: 50,
                width: 50,
              }}
            />
            <Box sx={{ mt: "auto" }} />
            {[...new Array(5)].map((_, i) => (
              <Skeleton
                variant="rectangular"
                animation="wave"
                key={i}
                sx={{
                  borderRadius: 5,
                  height: 50,
                  width: 50,
                  ...(i === 4 && {
                    mt: "auto",
                  }),
                }}
              />
            ))}
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              width: "100%",
              display: "flex",
              alignItems: "center",
              pt: { xs: "75px", sm: "0px" },
            }}
          >
            {/* Sidebar 2 */}
            <Box
              sx={{
                display: { xs: "none", sm: "block" },
                background:
                  (global.user && global.user.darkMode) || defaultDarkMode
                    ? "hsl(240,11%,13%)"
                    : "rgba(200,200,200,.2)",
                width: 300,
                p: 3,
                py: 4,
                height: "100%",
                flex: "0 0 250px",
              }}
            >
              <Skeleton
                variant="rectangular"
                animation="wave"
                height={15}
                sx={{
                  width: "40%",
                  borderRadius: 1,
                  mb: 2,
                }}
              />
              {[...new Array(3)].map((_, i) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  animation="wave"
                  height={30}
                  sx={{
                    width: "100%",
                    borderRadius: 2,
                    mb: 2,
                  }}
                />
              ))}

              <Skeleton
                variant="rectangular"
                animation="wave"
                height={15}
                sx={{
                  width: "55%",
                  borderRadius: 1,
                  mb: 2,
                  mt: 5,
                }}
              />
              {[...new Array(6)].map((_, i) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  animation="wave"
                  height={30}
                  sx={{
                    width: "100%",
                    borderRadius: 2,
                    mb: 2,
                  }}
                />
              ))}
            </Box>
            <Box
              sx={{
                height: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  overflow: "hidden",
                  height: "100%",
                  width: "100%",
                }}
              >
                {[...new Array(5)].map((_, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: "300px",
                      flex: "0 0 300px",
                      borderRight: "1px solid",
                      borderColor:
                        (global.user && global.user.darkMode) || defaultDarkMode
                          ? "hsl(240,11%,13%)"
                          : "rgba(200,200,200,.3)",
                    }}
                  >
                    <Box
                      sx={{
                        p: 3,
                        borderBottom: "1px solid",
                        borderTop: { xs: "1px solid", sm: "none" },
                        borderColor:
                          (global.user && global.user.darkMode) ||
                          defaultDarkMode
                            ? "hsl(240,11%,13%)!important"
                            : "rgba(200,200,200,.3)!important",
                      }}
                    >
                      <Skeleton
                        variant="rectangular"
                        animation="wave"
                        key={i}
                        height={50}
                        width={50}
                        sx={{ borderRadius: 3, mb: 2 }}
                      />
                      <Skeleton
                        variant="rectangular"
                        animation="wave"
                        key={i}
                        height={20}
                        width={"100%"}
                        sx={{ borderRadius: 1.5 }}
                      />
                    </Box>
                    <Box sx={{ p: 3 }}>
                      {[...new Array(10)].map((_, i) => (
                        <Skeleton
                          key={i}
                          variant="rectangular"
                          animation="wave"
                          height={30}
                          sx={{
                            width: i % 2 ? "70%" : "100%",
                            borderRadius: 2,
                            mb: 2,
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                ))}
                <div style={{ opacity: 0 }}>
                  <Icon>add_circle</Icon>
                  <Icon className="outlined">add_circle</Icon>
                </div>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
