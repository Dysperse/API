import { OptionsGroup } from "@/components/OptionsGroup";
import { ProfilePicture } from "@/components/Profile/ProfilePicture";
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
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

export default function AddFriend() {
  const router = useRouter();
  const { session } = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const [view, setView] = useState<"Add friend" | "Requests">("Requests");

  const [query, setQuery] = useState("");

  const addFriend = async () => {
    try {
      setLoading("1");
      const data = await fetchRawApi(session, "user/followers/follow", {
        followerEmail: session.user.email,
        followingEmail: query,
      });
      console.log(data);
      if (!data?.success) throw new Error();
      toast.success("Added friend!");
      setLoading("");
    } catch (e) {
      setLoading("");
      toast.error(
        "Hmm... That didn't work. Make sure you typed the email or username correctly."
      );
    }
  };

  useEffect(() => {
    if (view === "Add friend") {
      setTimeout(() => {
        document.getElementById("searchFriend")?.focus();
      });
    }
  });

  const { data, mutate, error } = useSWR([
    "user/followers/requests",
    { email: session.user.email },
  ]);

  const [loading, setLoading] = useState("");

  const handleRequest = async (email, action) => {
    setLoading(email);
    await fetchRawApi(session, "user/followers/handle-request", {
      email,
      userEmail: session.user.email,
      action: String(action),
    });
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
        <OptionsGroup
          setOption={setView}
          currentOption={view}
          options={["Requests", "Add friend"]}
        />
        <Typography variant="h2" className="font-heading" sx={{ mt: 4, mb: 1 }}>
          {view}
        </Typography>
        {view === "Add friend" ? (
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
        ) : (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            key="2"
          >
            {data?.length == 0 && (
              <Alert
                icon={<Icon sx={{ color: palette[11] }}>person_add</Icon>}
                sx={{ background: palette[3] }}
              >
                People who want to add you will appear here.
              </Alert>
            )}
            {data?.map((person) => (
              <ListItem key={person.followerId} disableGutters>
                <ProfilePicture data={person.follower} size={40} />
                <ListItemText primary={person.follower.name} />
                <Box sx={{ flexShrink: 0, display: "flex", gap: 2 }}>
                  <Button
                    disabled={loading === person.email}
                    size="small"
                    onClick={() => handleRequest(person.follower.email, false)}
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
            ))}
          </motion.div>
        )}
      </Box>
    </>
  );
}
