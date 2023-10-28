import { isEmail } from "@/app/(app)/spaces/Group/Members/isEmail";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  Button,
  Dialog,
  Icon,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

export function IdentityModal({ mutate, userData, setUserData }) {
  const router = useRouter();
  const { session, isLoading } = useSession();
  const palette = useColor(
    session?.themeColor || "violet",
    useDarkMode(session?.darkMode || "system")
  );

  const [showPersonPrompt, setShowPersonPrompt] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!isLoading && !session && !userData?.email) {
      setShowPersonPrompt(true);
    }
  }, [isLoading, session, userData]);

  useEffect(() => {
    if (localStorage.getItem("name")) {
      setName(String(localStorage.getItem("name")));
    }
    if (localStorage.getItem("email")) {
      setEmail(String(localStorage.getItem("email")));
    }
  }, []);

  const disabled = !name.trim() || !email.trim() || !isEmail(email);

  const handleSubmit = () => {
    if (disabled) return;
    setUserData({ name, email });
    setShowPersonPrompt(false);
  };

  useHotkeys("enter", () => !disabled && handleSubmit(), {
    enableOnFormTags: true,
  });

  return (
    <>
      <div
        id="identity"
        style={{ display: "none" }}
        onClick={() => setShowPersonPrompt(true)}
      />
      <Dialog
        open={showPersonPrompt}
        onClose={() => {
          setShowPersonPrompt(disabled);
          setTimeout(handleSubmit, 200);
        }}
        PaperProps={{
          sx: {
            p: 5,
          },
        }}
      >
        <Typography
          variant="h3"
          sx={{ textAlign: "center" }}
          className="font-heading"
        >
          Who are you?
        </Typography>
        <Typography sx={{ mb: 2, textAlign: "center" }}>
          Enter your name and email so that others can see your availability.
          This won&apos;t create an account.
        </Typography>
        <TextField
          autoFocus
          onChange={(e) => {
            setName(e.target.value);
            localStorage.setItem("name", e.target.value);
          }}
          value={name}
          required
          name="name"
          label="Name"
          size="small"
          sx={{ mb: 2 }}
        />
        <TextField
          onChange={(e) => {
            setEmail(e.target.value);
            localStorage.setItem("email", e.target.value);
          }}
          value={email}
          required
          label="Email"
          name="email"
          size="small"
        />
        <Box
          sx={{
            display: "flex",
            mt: 2,
            alignItems: "center",
          }}
        >
          <Button
            size="small"
            onClick={() =>
              router.push(
                "/auth?next=" + encodeURIComponent(window.location.href)
              )
            }
          >
            I have an account
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ ml: "auto" }}
            disabled={disabled}
          >
            Continue <Icon>east</Icon>
          </Button>
        </Box>
      </Dialog>
    </>
  );
}
