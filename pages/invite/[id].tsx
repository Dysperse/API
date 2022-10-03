import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import { Loading } from "../_app";
import { useApi } from "../../hooks/useApi";
import { colors } from "../../lib/colors";
import Head from "next/head";
import CircularProgress from "@mui/material/CircularProgress";

export default function Onboarding() {
  const router = useRouter();
  const id = window.location.pathname.split("/invite/")[1];
  const { data, error } = useApi(
    "property/members/inviteLinkInfo",
    {
      token: id as string,
    },
    true
  );

  return (
    <Box>
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          position: "absolute",
          zIndex: 1,
          top: 0,
          left: 0,
        }}
      >
        <Loading />
      </Box>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          backdropFilter: "blur(20px)",
        }}
      />
      {data ? (
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
            maxHeight: "80vh",
            overflowY: "auto",
            maxWidth: "calc(100vw - 40px)",
            width: "500px",
            backgroundColor: global.user.darkMode
              ? "hsl(240,11%,10%)"
              : "white",
            color: global.user.darkMode ? "white" : "hsl(240,11%,10%)",
            borderRadius: "10px",
            padding: 4,
          }}
        >
          <Head>
            <title>
              Join "{data.property.name}" to track your home's inventory,
              finances, and more &bull; Carbon
            </title>
          </Head>
          <Typography
            variant="h6"
            sx={{
              mb: 1,
              fontWeight: 400,
            }}
          >
            You&apos;ve been invited to{" "}
            <b>&ldquo;{data.property.name}&rdquo;</b> by another Carbon user
          </Typography>

          <Typography
            variant="body2"
            sx={{
              textTransform: "capitalize",
              display: "flex",
              alignItems: "center",
              mb: 1,
            }}
          >
            <span
              className="material-symbols-rounded"
              style={{ marginRight: "10px" }}
            >
              {data.property.type == "house"
                ? "home"
                : data.type == "apartment"
                ? "apartment"
                : "cottage"}
            </span>
            {data.property.type}
          </Typography>

          <Typography variant="body2">
            Join &ldquo;{data.property.name}&rdquo;&nbsp;to start tracking your
            inventory, lists, tasks, and more with your housemates.
          </Typography>

          <Button
            variant="contained"
            size="large"
            disableElevation
            sx={{
              mt: 2,
              borderRadius: 999,
              textTransform: "none",
              width: "100%",
              backgroundColor: colors[data.property.color]["A400"],
              color: "white",
              "&:hover": {
                backgroundColor: colors[data.property.color]["A700"],
              },
            }}
            onClick={() => {
              router.push(`/property/${data.property.id}`);
            }}
          >
            Join
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
          }}
        >
          <CircularProgress size="small" />
        </Box>
      )}
    </Box>
  );
}
