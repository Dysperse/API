import { ErrorHandler } from "@/components/Error";
import { GroupModal } from "@/components/Group/GroupModal";
import Integrations from "@/components/Group/Integrations";
import { Storage } from "@/components/Group/Storage";
import { handleBack } from "@/lib/client/handleBack";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { useStatusBar } from "@/lib/client/useStatusBar";
import { useCustomTheme } from "@/lib/client/useTheme";
import {
  AppBar,
  Avatar,
  AvatarGroup,
  Box,
  Chip,
  CircularProgress,
  Icon,
  IconButton,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";

export default function SpacesLayout({ parentRef, children, title }: any) {
  const { session } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const isDark = useDarkMode(session.darkMode);

  const accessToken = session.properties.find(
    (property) => property.propertyId == id
  )?.accessToken;

  const { data, error, isLoading } = useSWR([
    id ? "property" : null,
    {
      id,
      propertyAccessToken: accessToken,
    },
  ]);

  const palette = useColor(data?.profile?.color || session.themeColor, isDark);

  const userTheme = createTheme(
    useCustomTheme({
      darkMode: isDark,
      themeColor: data?.profile?.color || session.themeColor,
    })
  );

  // Navbar

  let ref: any = useRef();
  if (parentRef) ref = parentRef;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!children) {
      const d = ref?.current;
      const handleScroll = () => {
        if (d?.scrollTop >= 200) {
          setScrolled(true);
        } else {
          setScrolled(false);
        }
      };

      d?.addEventListener("scroll", handleScroll);

      // Clean up the event listener when the component unmounts
      return () => {
        d?.removeEventListener("scroll", handleScroll);
      };
    }
  }, [children]);

  useStatusBar(palette[children ? 3 : scrolled ? 2 : 9]);

  const members = useMemo(
    () => [
      ...new Map(
        data?.profile?.members?.map((item) => [item.user.email, item])
      ).values(),
    ],
    [data]
  );

  return (
    <ThemeProvider theme={userTheme}>
      <Box
        ref={ref}
        sx={{
          ...(data && { background: palette[children ? 3 : 9] }),
          overflowX: "hidden",
          "& .container": {
            p: 3,
            py: 4,
            minHeight: "100%",
            background: palette[1],
            color: palette[12],
            borderRadius: "20px 20px 0 0",
          },
        }}
      >
        {error && !isLoading && (
          <ErrorHandler error="Yikes! We couldn't load this group! Please try again later" />
        )}
        {data ? (
          <>
            <AppBar
              sx={{
                position: "sticky",
                background: palette[children ? 3 : scrolled ? 2 : 9],
                border: 0,
                "& *": { color: palette[children ? 9 : scrolled ? 9 : 1] },
                "& .MuiIconButton-root": {
                  "&:hover": {
                    background: { sm: "rgba(0,0,0,0.05)" },
                  },
                  "&:active": {
                    background: "rgba(0,0,0,0.1)",
                  },
                },
              }}
            >
              <Toolbar sx={{ gap: { xs: 0 } }}>
                <IconButton onClick={() => handleBack(router)}>
                  <Icon>arrow_back_ios_new</Icon>
                </IconButton>
                {!children && (
                  <>
                    <GroupModal
                      useRightClick={false}
                      defaultPalette={data?.profile?.color}
                    >
                      <IconButton
                        sx={{
                          ml: "auto",
                          mr: 1,
                          fontSize: "15px",
                          color: "inherit",
                          borderRadius: 99,
                        }}
                      >
                        Switch
                      </IconButton>
                    </GroupModal>
                    <IconButton
                      onClick={() =>
                        router.push(`/spaces/${data?.profile?.id}/edit`)
                      }
                    >
                      <Icon className="outlined">edit</Icon>
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        router.push(`/spaces/${data?.profile?.id}/changelog`)
                      }
                    >
                      <Icon className="outlined">schedule</Icon>
                    </IconButton>
                  </>
                )}
              </Toolbar>
            </AppBar>
            <Box sx={{ p: 3, color: palette[children ? 9 : 1] }}>
              {!children && (
                <Chip
                  size="small"
                  label="Space"
                  icon={
                    <Icon sx={{ color: palette[1] + "!important" }}>tag</Icon>
                  }
                  sx={{
                    background: "rgba(0,0,0,0.1)!important",
                    "&:hover": {
                      background: "rgba(0,0,0,0.1)!important",
                    },
                    color: palette[1],
                  }}
                />
              )}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <Typography
                  variant="h2"
                  className="font-heading"
                  sx={{
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    display: "inline-block",
                    borderRadius: 2,
                    mt: 1,
                    px: 1,
                    mx: -1,
                    "&:hover": {
                      background: { sm: `rgba(0,0,0,0.05)` },
                    },
                    "&:active": {
                      background: `rgba(0,0,0,0.1)`,
                    },
                  }}
                  onClick={() => router.push(`/spaces/${data.propertyId}/edit`)}
                >
                  {title || data?.profile?.name}
                </Typography>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {!children && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AvatarGroup
                      max={1}
                      sx={{
                        justifyContent: "start",
                        "& .MuiAvatar-root": {
                          borderColor: palette[9],
                        },
                      }}
                    >
                      {members?.map((member: any) => (
                        <Avatar
                          key={member.id}
                          src={member.user?.Profile?.picture}
                          sx={{
                            width: 30,
                            height: 30,
                            fontSize: 13,
                            background: palette[8],
                            color: palette[1],
                          }}
                        >
                          {member?.user?.name?.substring(0, 2)?.toUpperCase()}
                        </Avatar>
                      ))}
                    </AvatarGroup>
                    <Chip
                      onClick={() =>
                        router.push(`/spaces/${data?.profile?.id}/members`)
                      }
                      sx={{
                        background: "rgba(0,0,0,0.1)!important",
                        "&:hover": {
                          background: "rgba(0,0,0,0.15)!important",
                        },
                        color: palette[2],
                      }}
                      label={
                        <span style={{ display: "flex", alignItems: "center" }}>
                          <span>
                            {members.length} member{members.length !== 1 && "s"}
                          </span>
                          <Icon>arrow_forward_ios</Icon>
                        </span>
                      }
                    />
                  </Box>
                )}
              </motion.div>
            </Box>
            <motion.div
              className="container"
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              style={{
                ...(data && { background: palette[1], minHeight: "100dvh" }),
              }}
            >
              {children}
              {!children && data && (
                <Storage
                  color={data.profile.color}
                  propertyId={data.propertyId}
                  accessToken={accessToken}
                />
              )}
              {!children &&
                data &&
                data.profile.id === session.property.propertyId && (
                  <Integrations
                    hideNew
                    board={""}
                    handleClose={() => {}}
                    defaultPalette={data?.profile?.color}
                  />
                )}
            </motion.div>
          </>
        ) : (
          <Box
            sx={{
              width: "100vw",
              height: "100dvh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
}
