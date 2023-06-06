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
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Icon,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { mutate } from "swr";

export default function Page() {
  const router = useRouter();
  const session = useSession();
  const email = router?.query?.id;

  const { data, url, error } = useApi("user/profile", { email });

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [photo, setPhoto] = useState(data?.Profile?.photo);
  const [imageUploading, setImageUploading] = useState(false);

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

  const profileCardStyles = data && {
    border: "2px solid",
    borderColor: colors[data.color][50],
    color: colors[data.color][900],
    p: 3,
    borderRadius: 5,
  };

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
        await mutate(url);

        setImageUploading(false);
      } catch (e) {
        toast.error(
          "Yikes! An error occured while trying to upload your image. Please try again later"
        );
        setImageUploading(false);
      }
    },
    [setPhoto, url, session.user.email]
  );

  useEffect(() => {
    console.log(data);
    if (data?.Profile.picture) {
      setPhoto(data?.Profile.picture);
    }
  }, [data]);

  return (
    <Box>
      <Head>
        <title>{data ? data.name : `Profile`}</title>
      </Head>
      <Container
        sx={{
          ...((data || error) && { py: { xs: 5, sm: 10 }, pb: { xs: 15 } }),
        }}
      >
        {(!isCurrentUser || error) && (
          <Link href={`/users/${session.user.email}`}>
            <Button variant="contained" size="small" sx={{ mb: 5, mt: -4 }}>
              <Icon>west</Icon>Back
            </Button>
          </Link>
        )}
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
                gap: { xs: 1, sm: 4 },
                display: "flex",
                maxWidth: "100vw",
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Box sx={{ position: "relative", height: 100 }}>
                <Box
                  sx={{
                    background: "rgba(0,0,0,0.6)",
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
                          transition: "all 0.2s ",
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
                    width: 100,
                    height: 100,
                    fontSize: 35,
                    textTransform: "uppercase",
                    background: `linear-gradient(${
                      colors[data.color][200]
                    } 30%, ${colors[data.color][300]})`,
                    mb: 2,
                  }}
                >
                  {data.name.charAt(0)}
                  {data.name.charAt(1)}
                  <input
                    type="file"
                    id="upload"
                    hidden
                    onChange={handleUpload}
                  />
                </Avatar>
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  pt: { xs: 0, sm: 3 },
                  maxWidth: "100vw",
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    textTransform: "capitalize",
                    color: colors[data.color][900],
                  }}
                >
                  {editMode ? (
                    <TextField
                      variant="standard"
                      InputProps={{
                        sx: {
                          fontWeight: 900,
                          fontSize: "33px",
                        },
                      }}
                      onKeyDown={(e: any) =>
                        e.code === "Enter" && e.target.blur()
                      }
                      onBlur={(e: any) =>
                        updateSettings("name", e.target.value)
                      }
                      sx={{ mr: "auto", width: "auto" }}
                      defaultValue={session.user.name}
                    />
                  ) : (
                    <span style={{ fontWeight: 900 }}>{data.name}</span>
                  )}
                  {isCurrentUser && (
                    <LoadingButton
                      loading={loading}
                      variant={editMode ? "contained" : "outlined"}
                      size="large"
                      sx={{
                        px: 2,
                        ml: "auto",
                      }}
                      onClick={() =>
                        data.Profile ? setEditMode((e) => !e) : createProfile()
                      }
                    >
                      <Icon>
                        {!data.Profile ? "add" : editMode ? "check" : "edit"}
                      </Icon>
                      {!data.Profile
                        ? "Create profile"
                        : editMode
                        ? "Done"
                        : "Edit"}
                    </LoadingButton>
                  )}
                  {!isCurrentUser && (
                    <ConfirmationModal
                      disabled={!isFollowing}
                      title={`Are you sure you want to unfollow ${data.name}?`}
                      question="You can always follow them back later"
                      callback={handleFollowButtonClick}
                    >
                      <LoadingButton
                        loading={loading}
                        variant={isFollowing ? "outlined" : "contained"}
                        size="large"
                        sx={{
                          px: 2,
                          ml: "auto",
                          ...(!loading && isFollowing
                            ? {
                                borderColor:
                                  colors[data.color][200] + "!important",
                                color: colors[data.color][900] + "!important",
                                "&:hover": {
                                  background:
                                    colors[data.color][50] + "!important",
                                  borderColor:
                                    colors[data.color][300] + "!important",
                                },
                              }
                            : {
                                "&,&:hover": {
                                  background:
                                    colors[data.color][900] + "!important",
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
                    ml: -1,
                    mb: 1.5,
                    mt: 0.5,
                    opacity: 0.7,
                    color: colors[data.color]["800"],
                  }}
                >
                  <Followers data={data} />
                  <Following data={data} />
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
