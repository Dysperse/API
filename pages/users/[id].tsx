import { ConfirmationModal } from "@/components/ConfirmationModal";
import { ErrorHandler } from "@/components/Error";
import { UserProfile } from "@/components/Profile//UserProfile";
import { ProfilePicture } from "@/components/Profile/ProfilePicture";
import { Puller } from "@/components/Puller";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { handleBack } from "@/lib/client/handleBack";
import { exportAsImage } from "@/lib/client/screenshot";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { useCustomTheme } from "@/lib/client/useTheme";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Icon,
  IconButton,
  SwipeableDrawer,
  ThemeProvider,
  Toolbar,
  Tooltip,
  Typography,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import { amberDark } from "@radix-ui/colors";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import Head from "next/head";
import { useRouter } from "next/router";
import { cloneElement, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useHotkeys } from "react-hotkeys-hook";
import useSWR from "swr";

function Hobbies({ palette, hobbies, profileCardStyles }) {
  return hobbies.length === 0 ? (
    <></>
  ) : (
    <Box sx={{ ...profileCardStyles, background: palette[2] }}>
      <Typography sx={profileCardStyles.heading}>Hobbies</Typography>
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {hobbies.map((badge) => (
          <Chip
            sx={{ textTransform: "capitalize" }}
            label={badge}
            key={badge}
          />
        ))}
      </Box>
    </Box>
  );
}

function ShareProfileModal({ user, children }) {
  const { session } = useSession();
  const ref = useRef();
  const palette = useColor(user?.color || session.themeColor, user?.darkMode);

  const [open, setOpen] = useState(false);
  const trigger = cloneElement(children, { onClick: () => setOpen(true) });

  const typographyStyles = {
    fontWeight: 100,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  return (
    <>
      {trigger}
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
      >
        <Puller />
        <div style={{ overflow: "scroll" }}>
          <Box
            ref={ref}
            sx={{
              background: palette[9],
              color: "#000!important",
              p: 3,
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "400px",
              mx: "auto",
              textAlign: "center",
            }}
          >
            <img
              src="/logo.svg"
              alt="Logo"
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                width: "40px",
                height: "40px",
              }}
            />

            <Box sx={{ mt: 5 }}>
              {user && (
                <ProfilePicture
                  data={{
                    ...user,
                    Profile: {
                      ...user.Profile,
                      picture: user.Profile?.picture
                        ? `https://${window.location.hostname}/api/proxy?url=${user.Profile?.picture}`
                        : "",
                    },
                  }}
                  size={100}
                />
              )}
            </Box>
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                mt: 2,
              }}
            >
              <Typography
                variant="h3"
                className="font-heading"
                sx={typographyStyles}
              >
                <b>{user?.name}</b>
              </Typography>
              <Typography sx={{ ...typographyStyles, opacity: 0.7 }}>
                <b>
                  {user?.username && "@"}
                  {user?.username || user?.email}
                </b>
              </Typography>
            </Box>
          </Box>
        </div>
        <Box sx={{ p: 2, display: "flex", gap: 2 }}>
          <Button
            onClick={() => {
              navigator.share({
                url: `https://${window.location.hostname}/u/${
                  user?.username || user?.email
                }`,
              });
            }}
            variant="outlined"
            size="large"
          >
            <Icon>ios_share</Icon>
          </Button>
          <Button
            onClick={() => {
              exportAsImage(ref.current, "profile");
            }}
            fullWidth
            variant="contained"
            size="large"
          >
            <Icon>Download</Icon>
            Save card
          </Button>
        </Box>
      </SwipeableDrawer>
    </>
  );
}

function Page() {
  const router = useRouter();
  const { session } = useSession();
  const email = router.query.id;

  const { data, mutate, error } = useSWR(["user/profile", { email }]);

  const [loading, setLoading] = useState(false);

  const isCurrentUser =
    email === session.user.email || email === session.user.username;

  const isFriend =
    data?.followers?.[0]?.accepted === true ||
    data?.following?.[0]?.accepted === true;

  const isPending =
    data?.followers?.[0]?.accepted === false ||
    data?.following?.[0]?.accepted === false;

  const isDark = useDarkMode(session.darkMode);

  const palette = useColor(data?.color || session.themeColor, isDark);

  const handleFollowButtonClick = async () => {
    setLoading(true);
    if (isFriend) {
      await fetchRawApi(session, "user/followers/unfollow", {
        followerEmail: session.user.email,
        followingEmail: data?.email,
      });
      await mutate();
    } else {
      await fetchRawApi(session, "user/followers/follow", {
        followerEmail: session.user.email,
        followingEmail: data?.email,
      });
      await mutate();
    }
    setLoading(false);
  };

  const createProfile = async () => {
    try {
      setLoading(true);
      await fetchRawApi(session, "user/profile/update", {
        create: "true",
        email: session.user.email,
      });
      await mutate();
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const profileCardStyles = {
    border: "2px solid",
    borderColor: palette[3],
    color: palette[11],
    p: 3,
    borderRadius: 5,
    heading: {
      color: palette[10],
      fontWeight: 600,
      textTransform: "uppercase",
      mb: 0.5,
    },
  };

  const userTheme = createTheme(
    useCustomTheme({
      darkMode: isDark,
      themeColor: data?.color || "gray",
    })
  );

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(data.email);
    toast.success("Copied to clipboard");
  };

  useHotkeys("esc", () => router.push("/"));

  const redPalette = useColor("red", useDarkMode(session.darkMode));
  const grayPalette = useColor("gray", useDarkMode(session.darkMode));
  const orangePalette = useColor("orange", useDarkMode(session.darkMode));
  const greenPalette = useColor("green", useDarkMode(session.darkMode));

  const isMobile = useMediaQuery("(max-width: 600px)");
  const isExpired = data?.Status?.until && dayjs().isAfter(data?.Status?.until);

  const chipPalette = isExpired
    ? grayPalette
    : data?.Status?.status === "available"
    ? greenPalette
    : data?.Status?.status === "busy"
    ? redPalette
    : data?.Status?.status === "away"
    ? orangePalette
    : grayPalette;

  const styles = {
    color: palette[11],
    textAlign: "center",
    width: { sm: "auto" },
    px: 2,
    py: 2,
    borderRadius: "20px",
    "& h6": {
      mt: -1,
      fontSize: 27,
      fontWeight: 900,
    },
  };

  return (
    <ThemeProvider theme={userTheme}>
      <Box
        sx={{
          background: palette[1],
          pb: 5,
          maxWidth: "100dvw",
          overflowX: "hidden",
          mb: -3,
        }}
      >
        <Head>
          <title>{data ? data.name : `Profile`}</title>
        </Head>
        {isCurrentUser && data?.color && (
          <LoadingButton
            loading={loading}
            variant="contained"
            sx={{
              px: 3,
              py: 1.5,
              position: "fixed",
              bottom: 0,
              right: 0,
              cursor: "default",
              zIndex: 999,
              m: 3,
              flexShrink: 0,
              fontSize: "18px",
              "&, &:hover": {
                background: palette[4],
              },
            }}
            size="large"
            onClick={() =>
              data.Profile ? router.push("/settings/profile") : createProfile()
            }
          >
            <Icon className="outlined" sx={{ fontSize: "30px!important" }}>
              {!data?.Profile ? "add" : "edit"}
            </Icon>
            {!data?.Profile ? "Create profile" : "Edit"}
          </LoadingButton>
        )}
        <AppBar
          position="sticky"
          sx={{
            background: addHslAlpha(palette[1], 0.9),
            borderColor: "transparent",
          }}
        >
          <Toolbar>
            <IconButton
              onClick={() => handleBack(router)}
              sx={{
                ...(!isMobile && {
                  background: palette[3] + "!important",
                }),
              }}
            >
              <Icon>{isMobile ? "arrow_back_ios_new" : "close"}</Icon>
            </IconButton>
            <ShareProfileModal user={data}>
              <IconButton sx={{ ml: "auto" }}>
                <Icon>ios_share</Icon>
              </IconButton>
            </ShareProfileModal>
            {!isCurrentUser && data?.color && (
              <ConfirmationModal
                disabled={!isFriend}
                title={`Are you sure you want to remove ${data?.name}?`}
                question="You can always follow them back later"
                callback={handleFollowButtonClick}
              >
                <LoadingButton
                  loading={loading}
                  variant="contained"
                  sx={{
                    px: 2,
                    flexShrink: 0,
                    ...(!loading && data && isFriend
                      ? {
                          color: palette[12] + "!important",
                          background: palette[5] + "!important",
                          "&:hover": {
                            background: palette[6] + "!important",
                            borderColor: palette[4] + "!important",
                          },
                        }
                      : data && {
                          "&,&:hover": {
                            background: palette[4] + "!important",
                            color: palette[12] + "!important",
                          },
                        }),
                  }}
                >
                  <Icon className="outlined">
                    {isFriend
                      ? "how_to_reg"
                      : isPending
                      ? "access_time"
                      : "person_add"}
                  </Icon>
                  {isFriend
                    ? "Remove friend"
                    : isPending
                    ? "Pending"
                    : "Add friend"}
                </LoadingButton>
              </ConfirmationModal>
            )}
          </Toolbar>
        </AppBar>
        <Container sx={{ my: 5, px: { sm: 10 } }}>
          {(error || data?.error) && (
            <ErrorHandler
              callback={() => mutate()}
              error="On no! We couldn't find the user you were looking for."
            />
          )}
          {data && data?.color && email && router ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  maxWidth: "100vw",
                  alignItems: "flex-start",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 0, sm: 4 },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    flex: { xs: "0 0 100%", sm: "0 0 300px" },
                    width: { xs: "100%", sm: "300px" },
                    gap: 2,
                    borderRadius: 5,
                  }}
                >
                  <Box
                    sx={{
                      ...profileCardStyles,
                      color: palette[12],
                      textAlign: "center",
                      background: palette[2],
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        display: "inline-flex",
                        mx: "auto",
                        width: 250,
                        height: 250,
                      }}
                    >
                      <ProfilePicture data={data} size={250} />
                      {data.Status && !isExpired && (
                        <Tooltip
                          title={
                            data.Status.text ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                }}
                              >
                                <img
                                  src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${data.Status.emoji}.png`}
                                  alt="emoji"
                                  width={24}
                                />
                                {data.Status.text}
                              </Box>
                            ) : (
                              "Status"
                            )
                          }
                        >
                          <Chip
                            label={capitalizeFirstLetter(data.Status.status)}
                            sx={{
                              background: `linear-gradient( ${chipPalette[9]}, ${chipPalette[8]})!important`,
                              position: "absolute",
                              bottom: "0px",
                              right: "0px",
                              boxShadow: `0 0 0 3px ${palette[2]}!important`,
                              color: chipPalette[12],
                            }}
                            icon={
                              <Icon sx={{ color: "inherit!important" }}>
                                {data.Status.status === "available"
                                  ? "check_circle"
                                  : data.Status.status === "busy"
                                  ? "remove_circle"
                                  : data.Status.status === "away"
                                  ? "dark_mode"
                                  : "circle"}
                              </Icon>
                            }
                          />
                        </Tooltip>
                      )}
                    </Box>
                    <Typography
                      variant="h4"
                      sx={{
                        mt: 2,
                        fontWeight: 900,
                      }}
                    >
                      {data.name}
                    </Typography>
                    <Typography
                      onClick={handleCopyEmail}
                      variant="h6"
                      sx={{
                        "&:hover": {
                          textDecoration: "underline",
                        },
                        opacity: 0.6,
                        maxWidth: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {data?.username && "@"}
                      {data?.username || data?.email}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      ...profileCardStyles,
                      background: palette[2],
                      textAlign: "left",
                      display: "flex",
                      gap: 1,
                      flexDirection: "column",
                    }}
                  >
                    <Typography sx={profileCardStyles.heading}>
                      About
                    </Typography>
                    <Typography sx={{ fontSize: "17px" }}>
                      {data?.Profile?.bio}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Tooltip title="Local time">
                        <Chip
                          label={`${dayjs()
                            .tz(data.timeZone)
                            .format("h:mm A")}`}
                          icon={
                            <Icon sx={{ color: "inherit!important" }}>
                              access_time
                            </Icon>
                          }
                        />
                      </Tooltip>
                      <Tooltip title="Birthday">
                        <Chip
                          label={`${dayjs(data?.Profile?.birthday).format(
                            "MMMM D"
                          )}`}
                          icon={
                            <Icon sx={{ color: "inherit!important" }}>
                              cake
                            </Icon>
                          }
                        />
                      </Tooltip>
                      {data &&
                        data?.Profile?.badges?.map((badge) => (
                          <Chip
                            sx={{
                              background: `linear-gradient(${amberDark.amber9}, ${amberDark.amber11})!important`,
                              color: `${amberDark.amber2}!important`,
                            }}
                            label={badge}
                            key={badge}
                            {...(badge === "Early supporter" && {
                              icon: (
                                <Icon sx={{ color: "inherit!important" }}>
                                  favorite
                                </Icon>
                              ),
                            })}
                          />
                        ))}
                    </Box>
                  </Box>
                  {data?.Profile?.hobbies && (
                    <Hobbies
                      palette={palette}
                      hobbies={data?.Profile?.hobbies}
                      profileCardStyles={profileCardStyles}
                    />
                  )}
                </Box>
                <Box
                  sx={{
                    flexGrow: 1,
                    maxWidth: "100vw",
                    width: "100%",
                  }}
                >
                  {!data.Profile && (
                    <Alert
                      severity="info"
                      sx={{ mt: 2 }}
                      {...(isCurrentUser && {
                        action: (
                          <LoadingButton
                            loading={loading}
                            variant="contained"
                            onClick={createProfile}
                          >
                            Create
                          </LoadingButton>
                        ),
                      })}
                    >
                      {isCurrentUser ? (
                        <>Complete your profile?</>
                      ) : (
                        <>
                          <b>{data.name}</b> hasn&apos;t completed their profile
                          yet
                        </>
                      )}
                    </Alert>
                  )}
                  {data.Profile && (
                    <UserProfile
                      profileCardStyles={profileCardStyles}
                      mutate={mutate}
                      isCurrentUser={isCurrentUser}
                      data={data}
                    />
                  )}
                </Box>
              </Box>
            </>
          ) : (
            !error &&
            !data?.error && (
              <Box
                sx={{
                  display: "flex",
                  height: "100dvh",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <CircularProgress />
              </Box>
            )
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default function App() {
  const router = useRouter();
  const email = router?.query?.id;

  return (
    <motion.div initial={{ x: 100 }} animate={{ x: 0 }}>
      {email ? <Page /> : <></>}
    </motion.div>
  );
}
