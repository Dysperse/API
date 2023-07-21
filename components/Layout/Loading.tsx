import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { AppBar, Box, Icon, Skeleton, Toolbar } from "@mui/material";
import { useEffect, useState } from "react";

/**
 * Loading screen
 * @returns JSX.Element
 */

export function Loading(): JSX.Element {
  const session = useSession();

  const [defaultDarkMode, setDefaultDarkMode] = useState(false);
  const isDark = useDarkMode(session && session.user && session.darkMode);
  const palette = useColor(session?.themeColor || "gray", isDark);

  useEffect(() => {
    setDefaultDarkMode(
      (!session &&
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches) ||
        isDark
    );
  }, [isDark, session]);

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          WebkitAppRegion: "drag",
          left: 0,
          background: palette[1],
          width: "100%",
          height: "100%",
          overflow: "hidden",
          "& .MuiSkeleton-root": {
            background: palette[3],
          },
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
            border: 0,
          }}
          elevation={0}
        >
          <Toolbar sx={{ mt: -0.5 }}>
            <Skeleton
              variant="circular"
              animation={false}
              width={35}
              height={35}
              sx={{
                maxWidth: "100%",
              }}
            />
            <Box sx={{ ml: "auto", display: "flex", gap: 1.5 }}>
              {[...new Array(2)].map((_, i) => (
                <Skeleton
                  variant="circular"
                  animation={false}
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
        <Box sx={{ display: "flex" }}>
          {/* Sidebar 1 */}
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              flexDirection: "column",
              alignItems: "center",
              height: "100vh",
              gap: 2,
              background: palette[3],
              justifyContent: "center",
              width: "95px",
              py: 2,
              px: 2.5,
            }}
          >
            <Skeleton
              variant="rectangular"
              animation={false}
              sx={{
                borderRadius: 5,
                height: 50,
                width: 50,
                background: palette[4] + "!important",
              }}
            />
            <Box sx={{ mt: "auto" }} />
            {[...new Array(5)].map((_, i) => (
              <Skeleton
                variant="rectangular"
                animation={false}
                key={i}
                sx={{
                  borderRadius: 5,
                  height: 50,
                  background: palette[4] + "!important",
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
                background: palette[2],
                width: 300,
                p: 3,
                py: 4,
                height: "100%",
                flex: "0 0 250px",
              }}
            >
              <Skeleton
                variant="rectangular"
                animation={false}
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
                  animation={false}
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
                animation={false}
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
                  animation={false}
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
                      width: { xs: "100vw", sm: "300px" },
                      flex: { xs: "0 0 100vw", sm: "0 0 300px" },
                      borderRight: { sm: "1px solid" },
                      height: "100vh",
                      borderColor: palette[3] + "!important",
                    }}
                  >
                    <Box
                      sx={{
                        p: 3,
                        borderBottom: "1px solid",
                        borderColor: palette[3] + "!important",
                      }}
                    >
                      <Skeleton
                        variant="rectangular"
                        animation={false}
                        height={50}
                        width={100}
                        sx={{ borderRadius: 3, mb: 2 }}
                      />
                      <Skeleton
                        variant="rectangular"
                        animation={false}
                        height={20}
                        width={75}
                        sx={{ borderRadius: 1.5 }}
                      />
                    </Box>
                    <Box sx={{ p: 3 }}>
                      {[...new Array(10)].map((_, i) => (
                        <Skeleton
                          key={i}
                          variant="rectangular"
                          animation={false}
                          height={30}
                          sx={{
                            width: "100%",
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
    </>
  );
}
