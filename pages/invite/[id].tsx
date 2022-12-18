import React from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { useRouter } from "next/router";
import { Loading } from "../../components/Layout/Loading";
import { fetchApiWithoutHook, useApi } from "../../hooks/useApi";
import { colors } from "../../lib/colors";
import Head from "next/head";
import { mutate } from "swr";
const popup = require("window-popup").windowPopup;
import toast from "react-hot-toast";

import { Typography, Box, CircularProgress } from "@mui/material";

export default function Onboarding() {
  const router = useRouter();
  const id = window.location.pathname.split("/invite/")[1];
  const [loading, setLoading] = React.useState(false);
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
      ) : data ? (
        <Box
          sx={{
            position: "fixed",
            top: { sm: "50%" },
            bottom: { xs: 0, sm: "unset" },
            left: { sm: "50%" },
            transform: { sm: "translate(-50%, -50%)" },
            zIndex: 2,
            maxHeight: "80vh",
            overflowY: "auto",
            maxWidth: "calc(100vw - 60px)",
            width: "100vw",
            borderRadius: { xs: "20px 20px 0 0", sm: "10px" },
            background: "#fff",
            padding: 4,
          }}
        >
          <Head>
            <title>
              Join "{data.property.name}" to track your home&apos;s inventory,
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

          <LoadingButton
            loading={loading}
            disabled={
              global.user &&
              global.user.user &&
              global.user.user.properties.find(
                (p) => p.propertyId == data.property.id
              )
            }
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
              setLoading(true);
              if (global.user.user && global.user.user.email) {
                fetchApiWithoutHook(
                  "property/members/acceptInviteByLink",
                  {
                    token: id as string,
                    email: global.user.user.email,
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
                      "Something went wrong while accepting the invite. Please try again later."
                    );
                  });
              } else {
                popup(
                  500,
                  1000,
                  "/signup?close=true",
                  "Please sign in to your Carbon account"
                );
                setLoading(false);
              }
            }}
          >
            {global.user &&
            global.user.user &&
            global.user.user.properties.find(
              (p) => p.propertyId == data.property.id
            )
              ? "You're already in this home"
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
    </Box>
  );
}
