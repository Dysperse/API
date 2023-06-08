import { ConfirmationModal } from "@/components/ConfirmationModal";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { updateSettings } from "@/lib/client/updateSettings";
import { fetchRawApi } from "@/lib/client/useApi";
import { useSession } from "@/lib/client/useSession";
import { colors } from "@/lib/colors";
import { Masonry } from "@mui/lab";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Icon,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { mutate } from "swr";

import { toastStyles } from "@/lib/client/useTheme";
import { Twemoji } from "react-emoji-render";
import { toast } from "react-hot-toast";
import { WorkingHours } from "./WorkingHours";

export function UserProfile({
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
  const chipStyles = (color = false) => ({
    ...(color && {
      background: colors[data.color][50],
      color: colors[data.color][900],
    }),
    "& .MuiIcon-root": {
      ...(color && { color: colors[data.color][600] + "!important" }),
      fontVariationSettings:
        '"FILL" 0, "wght" 350, "GRAD" 0, "opsz" 40!important',
    },
  });

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
    if (birthdayRef?.current && editMode)
      setTimeout(() => {
        birthdayRef.current.value = dayjs(profile.birthday).format(
          "YYYY-MM-DD"
        );
      }, 100);
  }, [profile.birthday, editMode]);

  const today = dayjs();
  const nextBirthday = dayjs(profile.birthday).year(today.year());
  const daysUntilNextBirthday =
    nextBirthday.diff(today, "day") >= 0
      ? nextBirthday.diff(today, "day")
      : nextBirthday.add(1, "year").diff(today, "day");

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
          justifyContent: { xs: "center", sm: "flex-start" },
          flexWrap: "wrap",
        }}
      >
        <Chip
          sx={chipStyles(true)}
          label={data.trophies}
          icon={<span style={{ marginLeft: "10px" }}>🏆</span>}
        />
        <Chip
          sx={chipStyles(true)}
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
                : chipStyles(true)),
            }}
            label={data.CoachData.streakCount}
            icon={
              <Icon sx={{ color: "inherit!important" }}>
                local_fire_department
              </Icon>
            }
          />
        )}
        {profile &&
          profile.badges.map((badge) => (
            <Chip
              sx={chipStyles(true)}
              label={badge}
              key={badge}
              {...(badge === "Early supporter" && {
                icon: <Icon>favorite</Icon>,
              })}
            />
          ))}
      </Box>
      <Box sx={{ mr: -2 }}>
        <Masonry sx={{ mt: 3 }} columns={{ xs: 1, sm: 2 }} spacing={2}>
          {editMode && (
            <>
              <Box sx={profileCardStyles}>
                <Typography
                  sx={{
                    mb: 1,
                    color: colors[data.color][600],
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
                    color: colors[data.color][600],
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
            <Typography sx={profileCardStyles.heading}>Hobbies</Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {!editMode &&
                profile &&
                profile.hobbies.map((badge) => (
                  <Chip
                    sx={{ ...chipStyles(false), textTransform: "capitalize" }}
                    label={badge}
                    size="small"
                    key={badge}
                  />
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
          {profile && (
            <WorkingHours
              editMode={editMode}
              isCurrentUser={isCurrentUser}
              mutationUrl={mutationUrl}
              profile={profile}
              profileCardStyles={profileCardStyles}
            />
          )}
          <Box sx={profileCardStyles}>
            <Typography sx={profileCardStyles.heading}>Birthday</Typography>
            <Typography
              variant="h5"
              sx={{ my: 0.5, color: `hsl(240,11%,20%)` }}
            >
              {dayjs(profile.birthday).format("MMMM D")}
            </Typography>
            <Typography sx={{ mb: 1, color: `hsl(240,11%,50%)` }}>
              In {daysUntilNextBirthday} days
            </Typography>
          </Box>
          <Box sx={profileCardStyles}>
            <Typography sx={profileCardStyles.heading}>About</Typography>
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
              <Typography sx={{ fontSize: "17px" }}>
                <Twemoji>{profile.bio || ""}</Twemoji>
              </Typography>
            )}
          </Box>
          <Box sx={profileCardStyles}>
            <Typography sx={profileCardStyles.heading}>Share</Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                mt: 2,
              }}
            >
              <TextField
                size="small"
                label="Link"
                value={window.location.href}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          toast.success("Copied to clipboard!", toastStyles);
                        }}
                      >
                        <Icon className="outlined">content_copy</Icon>
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Email"
                size="small"
                value={data.email}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => {
                          navigator.clipboard.writeText(data.email);
                          toast.success("Copied to clipboard!", toastStyles);
                        }}
                      >
                        <Icon className="outlined">content_copy</Icon>
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>
        </Masonry>
      </Box>
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
