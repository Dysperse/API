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
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  const session = useSession();
  const email = router?.query?.id;

  const isCurrentUser = email === session.user.email;

  const { data, error } = useApi("user/profile", { email });

  return (
    email && (
      <Box>
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
                    sx={{ display: "flex", alignItems: "center" }}
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
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 1 }}>
                    {data.email}
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
