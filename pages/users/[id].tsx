import { ConfirmationModal } from "@/components/ConfirmationModal";
import { ErrorHandler } from "@/components/Error";
import { AddPersonModal } from "@/components/Group/Members/Add";
import { UserProfile } from "@/components/Profile//UserProfile";
import { ProfilePicture } from "@/components/Profile/ProfilePicture";
import { SearchUser } from "@/components/Profile/SearchUser";
import { Puller } from "@/components/Puller";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { handleBack } from "@/lib/client/handleBack";
import { exportAsImage } from "@/lib/client/screenshot";
import { useSession } from "@/lib/client/session";
import { toHSL } from "@/lib/client/toHSL";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Icon,
  IconButton,
  SwipeableDrawer,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import Head from "next/head";
import { useRouter } from "next/router";
import { cloneElement, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useHotkeys } from "react-hotkeys-hook";
import useSWR from "swr";

function ShareProfileModal({ mutate, user, children }) {
  const { session } = useSession();
  const ref = useRef();
  const palette = useColor(user?.color || session.themeColor, user?.darkMode);

  const [open, setOpen] = useState(false);
  const trigger = cloneElement(children, { onClick: () => setOpen(true) });

  const typographyStyles = {
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
                      picture: `https://${window.location.hostname}/api/proxy?url=${user.Profile?.picture}`,
                    },
                  }}
                  mutate={mutate}
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
              <Typography sx={{ ...typographyStyles, mb: 2 }}>
                <b>
                  {user?.username && "@"}
                  {user?.username || user?.email}
                </b>
              </Typography>
              <Grid container>
                <Grid item xs={6}>
                  <Typography variant="h4" className="font-heading">
                    {user?.followers?.length}
                  </Typography>
                  <Typography variant="body2">followers</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h4" className="font-heading">
                    {user?.following?.length}
                  </Typography>
                  <Typography variant="body2">following</Typography>
                </Grid>
              </Grid>
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

  const isFollowing =
    data &&
    data.followers &&
    data.followers.find((e) => e.follower.email === session.user.email);

  const isDark = useDarkMode(session.darkMode);

  const palette = useColor(data?.color || session.themeColor, isDark);

  const handleFollowButtonClick = async () => {
    setLoading(true);
    if (isFollowing) {
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
    border: "1px solid",
    borderColor: palette[3],
    color: palette[11],
    boxShadow: `10px 10px 20px ${palette[2]}`,
    p: 3,
    borderRadius: 5,
    heading: {
      color: palette[10],
      fontWeight: 600,
      textTransform: "uppercase",
      mb: 0.5,
    },
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(data.email);
    toast.success("Copied to clipboard");
  };

  const { data: members } = useSWR([
    "property/members",
    { propertyId: session.property.propertyId },
  ]);

  useHotkeys("esc", () => {
    router.push("/");
  });

  const redPalette = useColor("red", useDarkMode(session.darkMode));
  const grayPalette = useColor("gray", useDarkMode(session.darkMode));
  const orangePalette = useColor("orange", useDarkMode(session.darkMode));
  const greenPalette = useColor("green", useDarkMode(session.darkMode));

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

  return (
    <Box>
      <Head>
        <title>{data ? data.name : `Profile`}</title>
      </Head>
      {isCurrentUser && data?.color && (
        <LoadingButton
          loading={loading}
          variant="contained"
          sx={{
            px: 2,
            position: "fixed",
            bottom: 0,
            right: 0,
            cursor: "default",
            zIndex: 999,
            m: 3,
            flexShrink: 0,
            "&, &:hover": {
              background: palette[4],
            },
          }}
          size="large"
          onClick={() =>
            data.Profile ? router.push("/settings/profile") : createProfile()
          }
        >
          <Icon className="outlined">{!data?.Profile ? "add" : "edit"}</Icon>
          {!data?.Profile ? "Create profile" : "Edit"}
        </LoadingButton>
      )}
      <AppBar
        position="sticky"
        sx={{
          background: toHSL(palette[1], 0.9),
          borderColor: "transparent",
        }}
      >
        <Toolbar>
          <IconButton onClick={() => handleBack(router)}>
            <Icon>arrow_back_ios_new</Icon>
          </IconButton>
          <SearchUser />
          <ShareProfileModal user={data} mutate={mutate}>
            <IconButton>
              <Icon>ios_share</Icon>
            </IconButton>
          </ShareProfileModal>
          {!isCurrentUser && data?.color && (
            <ConfirmationModal
              disabled={!isFollowing}
              title={`Are you sure you want to unfollow ${data?.name}?`}
              question="You can always follow them back later"
              callback={handleFollowButtonClick}
            >
              <LoadingButton
                loading={loading}
                variant="contained"
                sx={{
                  px: 2,
                  flexShrink: 0,
                  ...(!loading && data && isFollowing
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
                  {isFollowing ? "how_to_reg" : "person_add"}
                </Icon>
                Follow
                {isFollowing && "ing"}
              </LoadingButton>
            </ConfirmationModal>
          )}
        </Toolbar>
      </AppBar>
      <Container sx={{ my: 5 }}>
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
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 0, sm: 5 },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    display: "inline-flex",
                    mx: "auto",
                    width: 150,
                    height: 150,
                  }}
                >
                  <ProfilePicture
                    mutate={mutate}
                    data={data}
                    editMode={false}
                  />
                  {data.Status && !isExpired && (
                    <Tooltip title="Status">
                      <Chip
                        label={capitalizeFirstLetter(data.Status.status)}
                        sx={{
                          background: `linear-gradient( ${chipPalette[9]}, ${chipPalette[8]})!important`,
                          position: "absolute",
                          bottom: "-8px",
                          right: "-6px",
                          boxShadow: `0 0 0 3px ${palette[1]}!important`,
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
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  pt: 3,
                  maxWidth: "100vw",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    maxWidth: "100%",
                    alignItems: "center",
                    minWidth: 0,
                    overflow: "hidden",
                    gap: 2,
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: { xs: "center", sm: "flex-start" },
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: "100%",
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        textAlign: { xs: "center", sm: "left" },
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        maxWidth: "100%",
                        minWidth: 0,
                      }}
                    >
                      <span style={{ fontWeight: 900 }}>{data.name}</span>
                      {[
                        "manusvathgurudath@gmail.com",
                        "aryanitinh@gmail.com",
                        "gouravkittur@gmail.com",
                        "achinthyakashyap@gmail.com",
                      ].includes(data?.email) && (
                        <Icon
                          sx={{
                            verticalAlign: "middle",
                            ml: 1,
                          }}
                        >
                          verified
                        </Icon>
                      )}
                    </Typography>
                    <Typography
                      onClick={handleCopyEmail}
                      sx={{
                        "&:hover": {
                          textDecoration: "underline",
                        },
                        mt: 1,
                        opacity: 0.6,
                        color: palette[11],
                        maxWidth: "100%",
                        overflow: "hidden",
                        textAlign: { xs: "center", sm: "left" },
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontSize: { xs: 20, sm: 25 },
                      }}
                    >
                      {data?.username && "@"}
                      {data?.username || data?.email}
                    </Typography>
                  </Box>
                  {!isCurrentUser && (
                    <Box sx={{ ml: { sm: "auto" }, mb: { xs: 1, sm: 0 } }}>
                      <AddPersonModal
                        //  palette={palette}
                        defaultValue={data.email}
                        disabled={
                          session.permission !== "owner" ||
                          isCurrentUser ||
                          (members &&
                            members.find(
                              (member) => member.user.email === data.email
                            ))
                        }
                        members={
                          members
                            ? members.map((member) => member.user.email)
                            : []
                        }
                      />
                    </Box>
                  )}
                </Box>
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
