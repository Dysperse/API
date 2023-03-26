import LoadingButton from "@mui/lab/LoadingButton";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { Loading } from "../../components/Layout/Loading";
import { fetchRawApi, useApi } from "../../lib/client/useApi";
import { colors } from "../../lib/colors";
const popup = require("window-popup").windowPopup;

import { Box, CircularProgress, NoSsr, Typography } from "@mui/material";
import { useSession } from "../../lib/client/useSession";
import { toastStyles } from "../../lib/client/useTheme";

export default function Onboarding() {
  const router = useRouter();
  const id =
    typeof window !== "undefined"
      ? window.location.pathname.split("/invite/")[1]
      : "";
  const [loading, setLoading] = React.useState<boolean>(false);
  const session = useSession();

  const { data } = useApi(
    "property/members/inviteLink/info",
    { token: id as string },
    true
  );

  return (
    <NoSsr>
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
          backdropFilter: "blur(10px)",
        }}
      />
      {data && data.error ? (
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
          }}
        >
          The invite link is invalid or has already been used.
        </Box>
      ) : data && data.property ? (
        <Box
          sx={{
            position: "fixed",
            top: { sm: "50%" },
            bottom: { xs: 0, sm: "unset" },
            left: { sm: "50%" },
            transform: { sm: "translate(-50%, -50%)" },
            zIndex: 2,
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            border: "1px solid #ddd",
            maxHeight: "80vh",
            overflowY: "auto",
            maxWidth: { xs: "100vw", sm: "calc(100vw - 60px)" },
            width: { xs: "100vw", sm: "500px" },
            borderRadius: { xs: "20px 20px 0 0", sm: 5 },
            background: "#fff",
            padding: 4,
          }}
        >
          <Head>
            <title>
              Join &ldquo;{data.property.name}&rdquo;&nbsp;to start collaborate
              on tasks, goals, documents, inventory, and more.
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
            <b>&ldquo;{data.property.name}&rdquo;</b> by another Dysperse user
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
              {data.property.type === "house"
                ? "home"
                : data.type === "apartment"
                ? "apartment"
                : "cottage"}
            </span>
            {data.property.type}
          </Typography>
          <Typography variant="body2">
            Join &ldquo;{data.property.name}&rdquo;&nbsp;to start collaborate on
            tasks, goals, documents, inventory, and more.
          </Typography>
          <LoadingButton
            loading={loading}
            disabled={
              session?.user &&
              session.user.user &&
              session.user.user.properties.find(
                (p) => p.propertyId === data.property.id
              )
            }
            variant="contained"
            size="large"
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
              setLoading(true);
              if (session.user.user && session.user.user.email) {
                fetchRawApi(
                  "property/members/inviteLink/accept",
                  {
                    token: id as string,
                    email: session.user.user.email,
                    property: data.property.id,
                  },
                  true
                )
                  .then(() => {
                    mutate("/api/user");
                    router.push("/");
                    setLoading(false);
                  })
                  .catch(() => {
                    toast.error(
                      "Something went wrong while accepting the invite. Please try again later.",
                      toastStyles
                    );
                  });
              } else {
                popup(
                  500,
                  1000,
                  "/signup?close=true",
                  "Please sign in to your Dysperse account"
                );
                setLoading(false);
              }
            }}
          >
            {session?.user &&
            session.user.user &&
            session.user.user.properties.find(
              (p) => p.propertyId === data.property.id
            )
              ? "You're already in this group"
              : "Join"}
          </LoadingButton>
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
    </NoSsr>
  );
}
