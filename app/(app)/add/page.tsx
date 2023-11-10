"use client";
import { ProfilePicture } from "@/app/(app)/users/[id]/ProfilePicture";
import { ErrorHandler } from "@/components/Error";
import { OptionsGroup } from "@/components/OptionsGroup";
import { handleBack } from "@/lib/client/handleBack";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Icon,
  IconButton,
  InputAdornment,
  ListItem,
  ListItemText,
  Skeleton,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

export default function AddFriend() {
  const router = useRouter();
  const { session } = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const [view, setView] = useState<"Add" | "Requests" | "Pending">("Requests");

  const [query, setQuery] = useState("");

  const addFriend = async () => {
    try {
      setLoading("1");
      const data = await fetchRawApi(session, "user/friends", {
        method: "POST",
        params: {
          followerEmail: session.user.email,
          followingEmail: query,
        },
      });
      if (!data?.success) throw new Error();
      toast.success("Friend request sent!");
      setLoading("");
    } catch (e) {
      setLoading("");
      toast.error(
        "Hmm... That didn't work. Make sure you typed the email or username correctly."
      );
    }
  };

  useEffect(() => {
    if (view === "Add") {
      setTimeout(() => {
        document.getElementById("searchFriend")?.focus();
      });
    }
  });

  const { data, error, mutate } = useSWR([
    "user/friends/request/requests",
    { email: session.user.email },
  ]);

  const {
    data: pendingData,
    mutate: pendingMutate,
    error: pendingError,
  } = useSWR(["user/friends/request/pending", { email: session.user.email }]);

  const [loading, setLoading] = useState("");

  const handleRequest = async (email, action) => {
    setLoading(email);
    await fetchRawApi(session, "user/friends/request/handle", {
      params: {
        email,
        userEmail: session.user.email,
        action: String(action),
      },
    });
    await mutate();
    setLoading("");
  };

  const handleCancel = async (email) => {
    setLoading(email);
    await fetchRawApi(session, "user/friends/request/cancel", {
      params: { email, userEmail: session.user.email },
    });
    await pendingMutate();
    await mutate();
    setLoading("");
  };

  return (
    <>
      <AppBar sx={{ border: 0 }}>
        <Toolbar>
          <IconButton
            sx={{ background: palette[3] }}
            onClick={() => handleBack(router)}
          >
            <Icon>close</Icon>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3, maxWidth: "700px", mx: "auto" }}>
        <Typography variant="h2" className="font-heading" sx={{ mb: 1 }}>
          Friends
        </Typography>
        <OptionsGroup
          setOption={setView}
          currentOption={view}
          options={["Requests", "Pending", "Add"]}
          sx={{ mb: 2 }}
        />
        {(!data || !pendingData) &&
          [...new Array(5)].map((_, i) => (
            <Skeleton
              sx={{ mb: 2 }}
              key={i}
              variant="rectangular"
              height={50}
            />
          ))}
        {view === "Add" ? (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            key="1"
          >
            <TextField
              autoFocus
              fullWidth
              value={query}
              onKeyDown={(e) => e.key === "Enter" && addFriend()}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Email or username..."
              id="searchFriend"
              InputProps={{
                autoComplete: "off",
                autoFocus: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon>alternate_email</Icon>
                  </InputAdornment>
                ),
              }}
            />
            <LoadingButton
              loading={loading !== ""}
              sx={{ mt: 2 }}
              variant="contained"
              fullWidth
              disabled={query.trim().length === 0}
              onClick={addFriend}
            >
              Send request <Icon>send</Icon>
            </LoadingButton>
          </motion.div>
        ) : view === "Pending" ? (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            key="3"
          >
            {pendingData?.length === 0 && (
              <Alert icon={<Icon sx={{ color: palette[11] }}>person_add</Icon>}>
                Pending requests will appear here
              </Alert>
            )}
            {pendingData ? (
              pendingData.map((person) => (
                <Box
                  key={person.following.email}
                  onClick={() =>
                    router.push(`/users/${person.following.email}`)
                  }
                >
                  <ListItem disableGutters>
                    <ProfilePicture data={person.following} size={40} />
                    <Button
                      size="small"
                      sx={{
                        color: "#fff",
                        "&:hover": {
                          background: palette[2],
                        },
                        p: 1,
                        borderRadius: 2,
                      }}
                    >
                      {person.following.name}
                    </Button>
                    <Box
                      sx={{
                        flexShrink: 0,
                        display: "flex",
                        gap: 2,
                        ml: "auto",
                      }}
                    >
                      <Button
                        disabled={loading === person.following.email}
                        size="small"
                        variant="contained"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancel(person.following.email);
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </ListItem>
                </Box>
              ))
            ) : pendingError ? (
              <ErrorHandler callback={pendingMutate} />
            ) : undefined}
          </motion.div>
        ) : (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            key="2"
          >
            {data?.length === 0 && (
              <Alert icon={<Icon sx={{ color: palette[11] }}>person_add</Icon>}>
                People who want to add you will appear here.
              </Alert>
            )}
            {data ? (
              data.map((person) => (
                <ListItem key={person.followerId} disableGutters>
                  <ProfilePicture data={person.follower} size={40} />
                  <ListItemText primary={person.follower.name} />
                  <Box sx={{ flexShrink: 0, display: "flex", gap: 2 }}>
                    <Button
                      disabled={loading === person.email}
                      size="small"
                      onClick={() =>
                        handleRequest(person.follower.email, false)
                      }
                    >
                      Decline
                    </Button>
                    <Button
                      disabled={loading === person.email}
                      size="small"
                      variant="contained"
                      onClick={() => handleRequest(person.follower.email, true)}
                    >
                      Accept
                    </Button>
                  </Box>
                </ListItem>
              ))
            ) : error ? (
              <ErrorHandler callback={mutate} />
            ) : undefined}
          </motion.div>
        )}
      </Box>
    </>
  );
}
