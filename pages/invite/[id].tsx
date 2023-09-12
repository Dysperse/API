import { Loading } from "@/components/Layout/Loading";
import { useUser } from "@/lib/client/session";
import { useColor } from "@/lib/client/useColor";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  CircularProgress,
  NoSsr,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import useSWR, { mutate } from "swr";
const popup = require("window-popup").windowPopup;

export default function Onboarding() {
  const { data: session, error } = useUser();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  const id =
    typeof window !== "undefined"
      ? window.location.pathname.split("/invite/")[1]
      : "";

  const isDark = useMediaQuery("(prefers-color-scheme: dark)");

  const { data } = useSWR([
    "property/members/inviteLink/info",
    { token: id as string },
  ]);

  const palette = useColor(
    data?.property?.color || "gray",
    session?.user?.darkMode || false
  );

  const handleAccept = () => {
    setLoading(true);
    if (session.user && session.user.email) {
      fetch(
        "/api/property/members/inviteLink/accept?" +
          new URLSearchParams({
            token: id as string,
            email: session.user.email,
            property: data.property.id,
            sessionId: session.token,
          })
      )
        .then(() => {
          mutate("/api/session");
          router.push("/");
          setLoading(false);
        })
        .catch((e) => {
          console.error(e);
          toast.error(
            "Something went wrong while accepting the invite. Please try again later."
          );
          setLoading(false);
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
  };

  return (
    <NoSsr>
      <Box
        sx={{
          width: "100vw",
          height: "100dvh",
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
      {data?.error ? (
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
            color: session?.user?.darkMode || isDark ? "#fff" : "#000",
          }}
        >
          The invite link is invalid or has already been used.
        </Box>
      ) : data?.property ? (
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
              session.properties &&
              session.properties.find((p) => p.propertyId === data.property.id)
            }
            variant="contained"
            disableElevation
            size="large"
            sx={{
              mt: 2,
              borderRadius: 999,
              textTransform: "none",
              width: "100%",
              backgroundColor: palette[2],
              color: "#000",
              "&:hover": {
                backgroundColor: palette[3],
              },
            }}
            onClick={handleAccept}
          >
            {session?.properties &&
            session.properties.find((p) => p.propertyId === data.property.id)
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
