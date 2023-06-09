import { ConfirmationModal } from "@/components/ConfirmationModal";
import { ErrorHandler } from "@/components/Error";
import { AddPersonModal } from "@/components/Group/Members/Add";
import { Following } from "@/components/Profile//Following";
import { UserProfile } from "@/components/Profile//UserProfile";
import { Followers } from "@/components/Profile/Followers";
import { ProfilePicture } from "@/components/Profile/ProfilePicture";
import { SearchUser } from "@/components/Profile/SearchUser";
import { updateSettings } from "@/lib/client/updateSettings";
import { fetchRawApi, useApi } from "@/lib/client/useApi";
import { useSession } from "@/lib/client/useSession";
import { toastStyles } from "@/lib/client/useTheme";
import { colors } from "@/lib/colors";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  AppBar,
  Box,
  CircularProgress,
  Container,
  Icon,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { mutate } from "swr";

function Page() {
  const router = useRouter();
  const session = useSession();
  const email = router.query.id;

  const { data, url, error } = useApi("user/profile", { email });

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const isCurrentUser = email === session.user.email;
  const isFollowing =
    data &&
    data.followers &&
    data.followers.find((e) => e.followerId === session.user.email);

  const handleFollowButtonClick = async () => {
    setLoading(true);
    if (isFollowing) {
      await fetchRawApi("user/followers/unfollow", {
        followerEmail: session.user.email,
        followingEmail: data?.email,
      });
      await mutate(url);
    } else {
      await fetchRawApi("user/followers/follow", {
        followerEmail: session.user.email,
        followingEmail: data?.email,
      });
      await mutate(url);
    }
    setLoading(false);
  };

  const createProfile = async () => {
    try {
      setLoading(true);
      await fetchRawApi("user/profile/update", {
        create: "true",
        email: session.user.email,
      });
      await mutate(url);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const styles =
    (data && data?.color) ||
    ("grey" && {
      color: session.user.darkMode
        ? colors[data?.color || "grey"][50]
        : "inherit",
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
    });

  const profileCardStyles =
    (data && data?.color) ||
    ("grey" && {
      border: "1px solid",
      borderColor: `hsl(240,11%, ${session.user.darkMode ? 20 : 90}%)`,
      color: `hsl(240,11%, ${session.user.darkMode ? 80 : 20}%)`,
      boxShadow: `5px 5px 10px hsla(240,11%, ${
        session.user.darkMode ? 15 : 95
      }%)`,
      p: 3,
      borderRadius: 5,
      heading: {
        color:
          colors[data?.color || "grey"][session.user.darkMode ? "A200" : 600],
        fontWeight: 600,
        textTransform: "uppercase",
        mb: 0.5,
      },
    });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(data.email);
    toast.success("Copied to clipboard", toastStyles);
  };

  const { data: members } = useApi("property/members", {
    propertyId: session.property.propertyId,
  });

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: `hsl(240,11%,${session.user.darkMode ? 10 : 100}%)`,
        zIndex: 999,
        overflow: "auto",
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
            px: 2,
            position: "fixed",
            bottom: 0,
            right: 0,
            cursor: "default",
            zIndex: 999,
            m: 3,
            flexShrink: 0,
            "&, &:hover": {
              background:
                colors[data?.color || "grey"][
                  session.user.darkMode ? 900 : 100
                ] + "!important",
            },
          }}
          size="large"
          onClick={() =>
            data.Profile ? setEditMode((e) => !e) : createProfile()
          }
        >
          <Icon className="outlined">
            {!data?.Profile ? "add" : editMode ? "check" : "edit"}
          </Icon>
          {!data?.Profile ? "Create profile" : editMode ? "Done" : "Edit"}
        </LoadingButton>
      )}
      <AppBar
        position="sticky"
        sx={{
          background: `hsl(240,11%,${session.user.darkMode ? 10 : 100}%,0.5)`,
        }}
      >
        <Toolbar sx={{ gap: { xs: 1, sm: 2 } }}>
          <IconButton onClick={() => router.push("/users")}>
            <Icon>west</Icon>
          </IconButton>
          <Typography
            sx={{
              fontWeight: 700,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {data ? data.name : "Profile"}
          </Typography>
          <SearchUser profileCardStyles={profileCardStyles} data={data} />
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
                        color:
                          colors[data?.color || "grey"][
                            session.user.darkMode ? 100 : 900
                          ] + "!important",
                        "&:hover": {
                          borderColor:
                            colors[data?.color || "grey"][300] + "!important",
                        },
                      }
                    : data && {
                        "&,&:hover": {
                          background:
                            colors[data?.color || "grey"][
                              session.user.darkMode ? 800 : 900
                            ] + "!important",
                          color:
                            colors[data?.color || "grey"][50] + "!important",
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
            callback={() => mutate(url)}
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
              <ProfilePicture
                mutationUrl={url}
                data={data}
                editMode={editMode}
              />
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
                    alignItems: "center",
                    gap: 2,
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: { xs: "center", sm: "flex-start" },
                  }}
                >
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{ textAlign: { xs: "center", sm: "left" } }}
                    >
                      {editMode ? (
                        <TextField
                          variant="standard"
                          InputProps={{
                            sx: {
                              fontWeight: 900,
                              "& input": {
                                textAlign: { xs: "center", sm: "left" },
                              },
                              fontSize: "33px",
                              mt: -0.5,
                            },
                          }}
                          onKeyDown={(e: any) =>
                            e.code === "Enter" && e.target.blur()
                          }
                          onBlur={(e: any) =>
                            updateSettings("name", e.target.value)
                          }
                          sx={{ mr: "auto", width: "auto" }}
                          fullWidth
                          defaultValue={session.user.name}
                        />
                      ) : (
                        <span style={{ fontWeight: 900 }}>{data.name}</span>
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
                        color:
                          colors[data?.color || "grey"][
                            session.user.darkMode ? 50 : 900
                          ],
                        maxWidth: "100%",
                        overflow: "hidden",
                        textAlign: { xs: "center", sm: "left" },
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontSize: { xs: 20, sm: 25 },
                      }}
                    >
                      {data.email}
                    </Typography>
                  </Box>
                  {!isCurrentUser && (
                    <Box sx={{ ml: { sm: "auto" }, mb: { xs: 1, sm: 0 } }}>
                      <AddPersonModal
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
                <Typography
                  variant="body2"
                  sx={{
                    gap: 1,
                    display: "flex",
                    mb: 2,
                    mt: 1,
                    opacity: 0.7,
                    color: colors[data?.color || "grey"]["800"],
                  }}
                >
                  <Followers styles={styles} data={data} />
                  <Following styles={styles} data={data} />
                </Typography>
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
                    setEditMode={setEditMode}
                    mutationUrl={url}
                    editMode={editMode}
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
                height: "100vh",
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

  return email ? <Page /> : <></>;
}
