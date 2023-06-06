import { ConfirmationModal } from "@/components/ConfirmationModal";
import { ErrorHandler } from "@/components/Error";
import { isEmail } from "@/components/Group/Members";
import { Puller } from "@/components/Puller";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { updateSettings } from "@/lib/client/updateSettings";
import { fetchRawApi, useApi } from "@/lib/client/useApi";
import { useSession } from "@/lib/client/useSession";
import { toastStyles } from "@/lib/client/useTheme";
import { colors } from "@/lib/colors";
import { LoadingButton, Masonry } from "@mui/lab";
import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Icon,
  IconButton,
  InputAdornment,
  ListItemButton,
  ListItemText,
  SwipeableDrawer,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Virtuoso } from "react-virtuoso";
import { mutate } from "swr";

function SearchUser({ profileCardStyles, data }) {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (!isEmail(email)) {
      toast.error("Please enter an email", toastStyles);
      return;
    }
    router.push(`/users/${encodeURIComponent(email)}`);
  };

  return (
    <>
      <Box sx={profileCardStyles}>
        <Typography
          sx={{
            mb: 1.5,
            color: colors[data.color][800],
          }}
          variant="h6"
        >
          Add friend
        </Typography>
        <TextField
          size="small"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key == "Enter" && handleSubmit()}
          placeholder="Type an email..."
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSubmit} disabled={!isEmail(email)}>
                  <Icon>east</Icon>
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </>
  );
}

function Following({ data }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        size="small"
        sx={{ color: "inherit" }}
        disabled={data.following.length == 0}
        onClick={() => setOpen((e) => !e)}
      >
        <b>{data.following.length}</b> following
      </Button>
      <SwipeableDrawer
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        anchor="bottom"
        PaperProps={{
          sx: {
            height: "calc(100vh - 200px)",
          },
        }}
      >
        <Puller showOnDesktop />
        <Box sx={{ p: 2, pt: 0 }}>
          <Typography variant="h6">
            {data.following.length} following
          </Typography>
        </Box>
        <Virtuoso
          style={{
            height: "100%",
          }}
          totalCount={data.following.length}
          itemContent={(i) => {
            const follower = data.following[i];
            return (
              <Link
                href={`/users/${follower.followingId}`}
                style={{ color: "inherit" }}
              >
                <ListItemButton sx={{ borderRadius: 0 }}>
                  <ListItemText primary={follower.followingId} />
                </ListItemButton>
              </Link>
            );
          }}
        />
      </SwipeableDrawer>
    </>
  );
}

function Followers({ data }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        size="small"
        sx={{ color: "inherit" }}
        disabled={data.followers.length == 0}
        onClick={() => setOpen((e) => !e)}
      >
        <b>{data.followers.length}</b> follower
        {data.followers.length !== 1 && "s"}
      </Button>
      <SwipeableDrawer
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        anchor="bottom"
        PaperProps={{
          sx: {
            height: "calc(100vh - 200px)",
          },
        }}
      >
        <Puller showOnDesktop />
        <Box sx={{ p: 2, pt: 0 }}>
          <Typography variant="h6">
            {data.followers.length} followers
          </Typography>
        </Box>
        <Virtuoso
          style={{
            height: "100%",
          }}
          totalCount={data.followers.length}
          itemContent={(i) => {
            const follower = data.followers[i];
            return (
              <Link
                href={`/users/${follower.followerId}`}
                style={{ color: "inherit" }}
              >
                <ListItemButton sx={{ borderRadius: 0 }}>
                  <ListItemText primary={follower.followerId} />
                </ListItemButton>
              </Link>
            );
          }}
        />
      </SwipeableDrawer>
    </>
  );
}

function UserProfile({
  setEditMode,
  editMode,
  mutationUrl,
  isCurrentUser,
  data,
  profileCardStyles,
}) {
  const session = useSession();
  const birthdayRef: any = useRef();

  const profile = data.Profile;
  const chipStyles = {
    background: colors[data.color][50],
    color: colors[data.color][900],
    "& .MuiIcon-root": {
      color: colors[data.color][800] + "!important",
      fontVariationSettings:
        '"FILL" 0, "wght" 350, "GRAD" 0, "opsz" 40!important',
    },
  };

  const [hobbies, setHobbies] = useState(data.Profile.hobbies);

  const handleChange = async (key, value) => {
    await fetchRawApi("user/profile/update", {
      email: session.user.email,
      [key]: value,
    });
    await mutate(mutationUrl);
  };

  const handleDelete = async () => {
    await fetchRawApi("user/profile/delete", {
      email: session.user.email,
    });
    await mutate(mutationUrl);
  };

  useEffect(() => {
    if (birthdayRef?.current?.value)
      birthdayRef.current.value = dayjs(profile.birthday).format("YYYY-MM-DD");
  }, [profile.birthday]);
  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 1 }}>
        <Chip
          sx={chipStyles}
          label={data.trophies}
          icon={<span style={{ marginLeft: "10px" }}>🏆</span>}
        />
        <Chip
          sx={chipStyles}
          label={
            <>
              <b>
                {data.timeZone.includes("/")
                  ? data.timeZone.split("/")[1].replace("_", " ")
                  : data.timeZone}
              </b>
              {data.timeZone.includes("/") &&
                ` - ${data.timeZone.split("/")[0]}`}
            </>
          }
          icon={<Icon>location_on</Icon>}
        />
        {data.CoachData && (
          <Chip
            sx={{
              ...(data.CoachData.streakCount > 0
                ? {
                    background: colors.orange[100],
                    "&, & *": {
                      color: colors.orange[900],
                    },
                  }
                : chipStyles),
            }}
            label={data.CoachData.streakCount}
            icon={
              <Icon sx={{ color: "inherit!important" }}>
                local_fire_department
              </Icon>
            }
          />
        )}
        {profile && (
          <Chip
            sx={chipStyles}
            label={dayjs(profile.birthday).format("MMMM D")}
            icon={<Icon>cake</Icon>}
          />
        )}
        {profile &&
          profile.badges.map((badge) => (
            <Chip
              sx={chipStyles}
              label={badge}
              key={badge}
              {...(badge === "Early supporter" && {
                icon: <Icon>favorite</Icon>,
              })}
            />
          ))}
      </Box>
      <Masonry sx={{ mt: 3 }} columns={2}>
        {editMode && (
          <>
            <Box sx={profileCardStyles}>
              <Typography
                sx={{
                  mb: 1,
                  color: colors[data.color][800],
                }}
                variant="h6"
              >
                Theme color
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                  mb: 2,
                }}
              >
                {[
                  "lime",
                  "red",
                  "green",
                  "blue",
                  "pink",
                  "purple",
                  "indigo",
                  "cyan",
                ].map((color) => (
                  <Box
                    key={color}
                    onClick={async () => {
                      await updateSettings("color", color.toLowerCase());
                      await mutate(mutationUrl);
                      await mutate(mutationUrl);
                    }}
                    sx={{
                      background: colors[color]["A700"],
                      border: `2px solid ${colors[color]["A700"]}`,
                      width: "30px",
                      height: "30px",
                      borderRadius: 999,
                      ...(session.themeColor === color && {
                        boxShadow: `0 0 0 2px ${
                          session.user.darkMode ? "hsl(240,11%,20%)" : "#fff"
                        } inset`,
                      }),
                    }}
                  />
                ))}
              </Box>
            </Box>
            <Box sx={profileCardStyles}>
              <Typography
                sx={{
                  mb: 1,
                  color: colors[data.color][800],
                }}
                variant="h6"
              >
                Birthday
              </Typography>
              <TextField
                type="date"
                inputRef={birthdayRef}
                onKeyDown={(e: any) => e.code === "Enter" && e.target.blur()}
                onBlur={(e) =>
                  handleChange(
                    "birthday",
                    dayjs(e.target.value).set("hour", 1).toISOString()
                  )
                }
              />
            </Box>
          </>
        )}
        <Box sx={profileCardStyles}>
          <Typography
            sx={{
              mb: 1,
              color: colors[data.color][800],
            }}
            variant="h6"
          >
            Hobbies
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            {!editMode &&
              profile &&
              profile.hobbies.map((badge) => (
                <Chip sx={chipStyles} label={badge} key={badge} />
              ))}
            {isCurrentUser && data.Profile && editMode && (
              <Autocomplete
                multiple
                getOptionLabel={(option) => option}
                options={[]}
                value={hobbies}
                onChange={(_, newValue) => {
                  setHobbies(
                    newValue
                      .slice(0, 5)
                      .map((c) => capitalizeFirstLetter(c.substring(0, 20)))
                  );
                  handleChange("hobbies", JSON.stringify(newValue));
                }}
                freeSolo
                fullWidth
                filterSelectedOptions
                sx={{ mt: 1 }}
                limitTags={5}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="What are your hobbies?"
                    placeholder="Press enter once you're done..."
                  />
                )}
              />
            )}
          </Box>
        </Box>
        <Box sx={profileCardStyles}>
          <Typography
            sx={{
              mb: 1,
              color: colors[data.color][800],
            }}
            variant="h6"
          >
            About
          </Typography>
          {isCurrentUser && editMode ? (
            <TextField
              multiline
              label="Add a bio..."
              sx={{ mt: 0.5 }}
              onBlur={(e: any) =>
                handleChange("bio", e.target.value.substring(0, 300))
              }
              defaultValue={profile.bio}
              minRows={4}
              placeholder="My name is Jeff Bezos and I'm an entrepreneur and investor"
            />
          ) : (
            <Typography sx={{ mb: 1, color: colors[data.color][700] }}>
              {profile.bio}
            </Typography>
          )}
        </Box>
      </Masonry>
      {editMode && (
        <Box sx={{ gap: 2, mt: 2, display: "flex" }}>
          <ConfirmationModal
            callback={handleDelete}
            title="Delete profile?"
            question="Are you sure you want to permanently delete your profile? You can always create it again."
          >
            <Button
              variant="outlined"
              size="large"
              color="error"
              sx={{ mr: "auto" }}
            >
              <Icon>delete</Icon>
              Delete
            </Button>
          </ConfirmationModal>
          <Button
            variant="contained"
            size="large"
            color="error"
            onClick={() => setEditMode(false)}
          >
            <Icon>check</Icon>
            Done
          </Button>
        </Box>
      )}
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

  const profileCardStyles = data && {
    border: "2px solid",
    borderColor: colors[data.color][50],
    color: colors[data.color][900],
    p: 3,
    borderRadius: 5,
  };
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
              <Avatar
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
              </Avatar>
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
