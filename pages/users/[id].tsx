import { ErrorHandler } from "@/components/Error";
import { useApi } from "@/lib/client/useApi";
import { useSession } from "@/lib/client/useSession";
import { colors } from "@/lib/colors";
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Container,
  Icon,
  Typography,
} from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  const session = useSession();
  const email = router?.query?.id;

  const isCurrentUser = email === session.user.email;

  const { data, error } = useApi("user/profile", { email });

  const isFollowing =
    data && data.following.find((e) => e.followingId === session.user.email);

  return (
    email && (
      <Box>
        <Head>
          <title>{data ? data.name : `Profile`}</title>
        </Head>
        {error && (
          <ErrorHandler error="On no! We couldn't find the user you were looking for." />
        )}
        {data && (
          <>
            <Container sx={{ pt: 5 }}>
              <Button size="small" variant="contained" sx={{ mb: 4 }}>
                <Icon>west</Icon>Friends
              </Button>
              <Card sx={{ borderRadius: 5, display: "flex", gap: 4 }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    fontSize: 35,
                    textTransform: "uppercase",
                    background: `linear-gradient(${
                      colors[data.color][200]
                    } 30%, ${colors[data.color][300]} 90%)`,
                    mb: 2,
                  }}
                >
                  {data.name.charAt(0)}
                  {data.name.charAt(1)}
                </Avatar>
                <Box sx={{ pt: 2 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: colors[data.color][900],
                    }}
                  >
                    <span className="font-heading">{data.name}</span>
                    {isCurrentUser && (
                      <Button
                        variant="outlined"
                        size="large"
                        sx={{ px: 2, ml: "auto" }}
                      >
                        <Icon>edit</Icon>
                        Edit
                      </Button>
                    )}
                    {!isCurrentUser && (
                      <Button
                        variant={isFollowing ? "outlined" : "contained"}
                        size="large"
                        sx={{
                          px: 2,
                          ml: "auto",
                          ...(isFollowing
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
                      </Button>
                    )}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ mt: 1, opacity: 0.6, color: colors[data.color][900] }}
                  >
                    {data.email}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      gap: 1,
                      mt: 1,
                      display: "flex",
                      ml: -1,
                      opacity: 0.7,
                    }}
                  >
                    <Button size="small" sx={{ color: "inherit" }}>
                      <b>{data.followers.length}</b> follower
                      {data.followers.length !== 1 && "s"}
                    </Button>
                    <Button size="small" sx={{ color: "inherit" }}>
                      <b>{data.following.length}</b> following
                    </Button>
                  </Typography>
                  <Box
                    sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 1 }}
                  >
                    <Chip
                      label={data.trophies}
                      icon={<span style={{ marginLeft: "10px" }}>🏆</span>}
                    />
                    <Chip
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
                          ...(data.CoachData.streakCount > 0 && {
                            background: colors.orange[200],
                            "&, & *": {
                              color: colors.orange[900],
                            },
                          }),
                        }}
                        label={data.CoachData.streakCount}
                        icon={
                          <Icon sx={{ color: "inherit!important" }}>
                            local_fire_department
                          </Icon>
                        }
                      />
                    )}
                    {JSON.stringify(data, null, 2)}
                  </Box>
                </Box>
              </Card>
            </Container>
          </>
        )}
      </Box>
    )
  );
}
