import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  Chip,
  Container,
  Grid,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import useSWR from "swr";
import { ErrorHandler } from "../Error";
import { ProfilePicture } from "../Profile/ProfilePicture";

export function ProfileStep({ styles, navigation }) {
  const { session } = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const { data, mutate, error } = useSWR([
    "user/profile",
    {
      email: session.user.email,
    },
  ]);

  const handleChange = async (key, value) => {
    await fetchRawApi(session, "user/profile/update", {
      email: session.user.email,
      [key]: value,
    });
    await mutate();
  };

  return (
    <Box sx={styles.container}>
      <Container>
        <Grid
          container
          columnSpacing={2}
          sx={{
            height: { sm: "100dvh" },
            display: "flex",
            alignItems: "center",
          }}
        >
          <Grid xs={12} sm={7} item>
            <Typography
              variant="h1"
              className="font-heading"
              sx={styles.heading}
            >
              Profile
            </Typography>
            {error && (
              <ErrorHandler error="Something went wrong. Please try again later" />
            )}
            <Typography variant="h1" sx={styles.subheading}>
              Profile picture
            </Typography>
            <ProfilePicture
              size={100}
              data={{
                ...session.user,
                ...data,
              }}
              editMode
              mutate={mutate}
            />
            <Typography variant="h1" sx={styles.subheading}>
              Birthday
            </Typography>

            <DatePicker
              defaultValue={
                data?.Profile?.birthday && dayjs(data.Profile.birthday)
              }
              onChange={(newValue) =>
                newValue.isValid() &&
                handleChange("birthday", newValue.set("hour", 1).toISOString())
              }
            />

            <Typography variant="h1" sx={styles.subheading}>
              Bio
            </Typography>

            <TextField
              multiline
              placeholder="Tell us about yourself"
              rows={4}
              defaultValue={data?.Profile?.bio}
              onBlur={(e) => handleChange("bio", e.target.value)}
            />
          </Grid>
          <Grid
            xs={12}
            sm={5}
            item
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: { sm: "100dvh" },
              py: { xs: 4, sm: 0 },
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              style={{ width: "100%" }}
            >
              <Box
                sx={{
                  background: addHslAlpha(palette[3], 0.9),
                  p: 3,
                  borderRadius: 5,
                  width: "100%",
                }}
              >
                <ProfilePicture
                  data={{
                    ...session.user,
                    ...data,
                  }}
                  size={70}
                  editMode={false}
                  mutate={mutate}
                />
                <Chip
                  label={"Busy"}
                  size="small"
                  sx={{ gap: 1, background: palette[4], mb: 0.5, mt: 2 }}
                  icon={
                    <Box
                      sx={{
                        width: 13,
                        height: 13,
                        ml: "5px!important",
                        borderRadius: 5,
                        background: "orange",
                      }}
                    />
                  }
                />
                <Typography
                  className="font-heading"
                  variant="h3"
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {session.user.name}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {session.user.email}
                </Typography>
                <Typography>{data?.Profile?.bio}</Typography>
                <Grid
                  container
                  sx={{
                    mt: 2,
                    textAlign: "center",
                    "& .MuiSkeleton-root": { mx: "auto", mb: 1 },
                    "& .MuiTypography-root": {
                      color: palette[9],
                    },
                  }}
                >
                  <Grid item xs={6}>
                    <Skeleton
                      variant="rectangular"
                      animation={false}
                      sx={{ borderRadius: 5 }}
                      width={60}
                      height={60}
                    />
                    Followers
                  </Grid>
                  <Grid item xs={6}>
                    <Skeleton
                      variant="rectangular"
                      animation={false}
                      sx={{ borderRadius: 5 }}
                      width={60}
                      height={60}
                    />
                    Following
                  </Grid>
                </Grid>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
