import { ConfirmationModal } from "@/components/ConfirmationModal";
import { ErrorHandler } from "@/components/Error";
import { Following } from "@/components/Profile//Following";
import { UserProfile } from "@/components/Profile//UserProfile";
import { Followers } from "@/components/Profile/Followers";
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
  Avatar,
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
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { mutate } from "swr";

function ProfilePicture({ mutationUrl, data, editMode }) {
  const session = useSession();
  const [photo, setPhoto] = useState(data?.Profile?.photo);
  const [imageUploading, setImageUploading] = useState(false);

  const handleUpload = useCallback(
    async (e: any) => {
      const key = "9fb5ded732b6b50da7aca563dbe66dec";
      const form = new FormData();
      form.append("image", e.target.files[0]);
      setImageUploading(true);

      try {
        const res = await fetch(
          `https://api.imgbb.com/1/upload?name=image&key=${key}`,
          { method: "POST", body: form }
        ).then((res) => res.json());

        setPhoto(res.data.thumb.url);
        await fetchRawApi("user/profile/update", {
          email: session.user.email,
          picture: res.data.thumb.url,
        });
        await mutate(mutationUrl);

        setImageUploading(false);
      } catch (e) {
        toast.error(
          "Yikes! An error occured while trying to upload your image. Please try again later"
        );
        setImageUploading(false);
      }
    },
    [setPhoto, mutationUrl, session.user.email]
  );

  useEffect(() => {
    console.log(data);
    setPhoto(data?.Profile?.picture);
  }, [data]);

  return (
    <Box
      sx={{
        position: "relative",
        height: 150,
        width: 150,
        boxShadow: "0 0 0 5px #fff",
        borderRadius: 9999,
        alignSelf: { xs: "center", md: "flex-start" },
      }}
    >
      <Box
        sx={{
          background: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(10px)",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 9999,
          display: "flex",
          justifyContent: "center",
          zIndex: 99,
          alignItems: "center",
          ...(editMode
            ? {
                opacity: 1,
                transition: "transform 0.2s ",
                transform: "scale(1)",
              }
            : {
                transform: "scale(.9)",
                transition: "all 0.2s",
                opacity: 0,
                pointerEvents: "none",
              }),
        }}
      >
        {imageUploading ? (
          <CircularProgress
            sx={{
              color: "#fff",
            }}
          />
        ) : (
          <IconButton
            onClick={() => document.getElementById("upload")?.click()}
            sx={{
              transform: "scale(1.5)",
            }}
          >
            <Icon sx={{ color: "#fff" }}>edit</Icon>
          </IconButton>
        )}
        <input
          type="file"
          id="upload"
          hidden
          onChange={handleUpload}
          accept="image/*"
        />
      </Box>
      <Avatar
        src={photo}
        sx={{
          height: 150,
          width: 150,
          fontSize: 35,
          textTransform: "uppercase",
          background: `linear-gradient(${colors[data.color][200]} 30%, ${
            colors[data.color][300]
          })`,
          mb: 2,
        }}
      >
        {data.name.charAt(0)}
        {data.name.charAt(1)}
        <input type="file" id="upload" hidden onChange={handleUpload} />
      </Avatar>
    </Box>
  );
}

export default function Page() {
  const router = useRouter();
  const session = useSession();
  const email = router?.query?.id;

  const { data, url, error } = useApi("user/profile", { email });

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const isCurrentUser = email === session.user.email;
  const isFollowing =
    data && data.followers.find((e) => e.followerId === session.user.email);

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
  const styles = {
    color: "inherit",
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

  const profileCardStyles = data && {
    border: "1px solid",
    borderColor: `hsl(240,11%, 90%)`,
    color: `hsl(240,11%, 20%)`,
    boxShadow: `5px 5px 10px hsla(240,11%, 95%)`,
    p: 3,
    borderRadius: 5,
    heading: {
      color: colors[data.color][600],
      fontWeight: 600,
      textTransform: "uppercase",
      mb: 0.5,
    },
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "#fff",
        zIndex: 999,
        overflow: "auto",
      }}
    >
      <Head>
        <title>{data ? data.name : `Profile`}</title>
      </Head>
      <AppBar position="sticky">
        <Toolbar sx={{ gap: 2 }}>
          <IconButton onClick={() => router.push("/")}>
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
          {isCurrentUser && (
            <LoadingButton
              loading={loading}
              variant={editMode ? "contained" : "outlined"}
              sx={{
                px: 2,
                ml: "auto",
                cursor: "default",
                flexShrink: 0,
              }}
              onClick={() =>
                data.Profile ? setEditMode((e) => !e) : createProfile()
              }
            >
              <Icon>
                {!data?.Profile ? "add" : editMode ? "check" : "edit"}
              </Icon>
              {!data?.Profile ? "Create profile" : editMode ? "Done" : "Edit"}
            </LoadingButton>
          )}
          {!isCurrentUser && (
            <ConfirmationModal
              disabled={!isFollowing}
              title={`Are you sure you want to unfollow ${data?.name}?`}
              question="You can always follow them back later"
              callback={handleFollowButtonClick}
            >
              <LoadingButton
                loading={loading}
                variant={isFollowing ? "outlined" : "contained"}
                sx={{
                  px: 2,
                  ml: "auto",
                  flexShrink: 0,
                  ...(!loading && data && isFollowing
                    ? {
                        borderColor: colors[data.color][200] + "!important",
                        color: colors[data.color][900] + "!important",
                        "&:hover": {
                          background: colors[data.color][50] + "!important",
                          borderColor: colors[data.color][300] + "!important",
                        },
                      }
                    : data && {
                        "&,&:hover": {
                          background: colors[data.color][900] + "!important",
                          color: colors[data.color][50] + "!important",
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
      <Container sx={{ mt: 5 }}>
        {error && (
          <ErrorHandler
            callback={() => mutate(url)}
            error="On no! We couldn't find the user you were looking for."
          />
        )}
        {data && email && router ? (
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
                  onClick={() => {
                    navigator.clipboard.writeText(data.email);
                    toast.success("Copied to clipboard", toastStyles);
                  }}
                  sx={{
                    "&:hover": {
                      textDecoration: "underline",
                    },
                    mt: 1,
                    opacity: 0.6,
                    color: colors[data.color][900],
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
                <Typography
                  variant="body2"
                  sx={{
                    gap: 1,
                    display: "flex",
                    my: 2,
                    opacity: 0.7,
                    color: colors[data.color]["800"],
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
                {isCurrentUser && !editMode && (
                  <SearchUser
                    profileCardStyles={profileCardStyles}
                    data={data}
                  />
                )}
              </Box>
            </Box>
          </>
        ) : (
          !error && (
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
